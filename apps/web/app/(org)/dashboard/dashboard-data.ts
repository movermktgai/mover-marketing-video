import { db } from "@cap/database";
import type { userSelectProps } from "@cap/database/auth/session";
import {
	notifications,
	organizationInvites,
	organizationMembers,
	organizations,
	sharedVideos,
	spaces,
	users,
	videos,
} from "@cap/database/schema";
import { userIsPro } from "@cap/utils";
import { ImageUploads } from "@cap/web-backend";
import type { ImageUpload } from "@cap/web-domain";
import { and, count, eq, inArray, isNull, or, sql } from "drizzle-orm";
import { Effect } from "effect";
import {
	canManageOrganizationMembers,
	canManageOrganizationProSeats,
	canManageSpace,
	getEffectiveOrganizationRole,
	getEffectiveSpaceRole,
	type OrganizationRole,
	type SpaceRole,
} from "@/lib/permissions/roles";
import { runPromise } from "@/lib/server";
import { selectProSeatProvider } from "@/utils/organization";

export type Organization = {
	organization: Omit<
		typeof organizations.$inferSelect,
		"iconUrl" | "shareableLinkIconUrl"
	> & {
		iconUrl: ImageUpload.ImageUrl | null;
		shareableLinkIconUrl: ImageUpload.ImageUrl | null;
	};
	members: (typeof organizationMembers.$inferSelect & {
		user: Pick<
			typeof users.$inferSelect,
			"id" | "name" | "email" | "lastName"
		> & { image?: ImageUpload.ImageUrl | null };
	})[];
	invites: (typeof organizationInvites.$inferSelect)[];
	inviteQuota: number;
	totalInvites: number;
	/** Whether the organization OWNER is on Pro — gates org-wide Pro features. */
	ownerIsPro: boolean;
	hasActiveProSeatProvider: boolean;
};

export type OrganizationSettings = NonNullable<
	(typeof organizations.$inferSelect)["settings"]
>;

export type Spaces = Omit<
	typeof spaces.$inferSelect,
	"createdAt" | "updatedAt" | "iconUrl" | "password"
> & {
	memberCount: number;
	videoCount: number;
	iconUrl: ImageUpload.ImageUrl | null;
	hasPassword: boolean;
	currentUserRole: OrganizationRole | SpaceRole | null;
	currentUserCanManage: boolean;
};

export type UserPreferences = (typeof users.$inferSelect)["preferences"];

type OrganizationSummary = Omit<Organization, "invites">;

type ActiveOrganizationData = {
	organizationSettings: OrganizationSettings | null;
	spacesData: Spaces[];
	anyNewNotifications: boolean;
	userCapsCount: number;
};

function mergeUserOrganizations(
	ownedOrganizations: (typeof organizations.$inferSelect)[],
	memberOrganizations: { organization: typeof organizations.$inferSelect }[],
) {
	const organizationsById = new Map<
		string,
		typeof organizations.$inferSelect
	>();

	for (const organization of ownedOrganizations) {
		organizationsById.set(organization.id, organization);
	}

	for (const { organization } of memberOrganizations) {
		organizationsById.set(organization.id, organization);
	}

	return Array.from(organizationsById.values());
}

function emptyActiveOrganizationData(): ActiveOrganizationData {
	return {
		organizationSettings: null,
		spacesData: [],
		anyNewNotifications: false,
		userCapsCount: 0,
	};
}

function groupBy<T, K>(values: T[], getKey: (value: T) => K) {
	const grouped = new Map<K, T[]>();
	for (const value of values) {
		const key = getKey(value);
		const group = grouped.get(key);
		if (group) group.push(value);
		else grouped.set(key, [value]);
	}
	return grouped;
}

async function loadActiveOrganizationData({
	activeOrganization,
	memberRole,
	user,
}: {
	activeOrganization: typeof organizations.$inferSelect;
	memberRole:
		| (typeof organizationMembers.$inferSelect)["role"]
		| null
		| undefined;
	user: typeof userSelectProps;
}): Promise<ActiveOrganizationData> {
	const currentOrganizationRole = getEffectiveOrganizationRole({
		userId: user.id,
		ownerId: activeOrganization.ownerId,
		memberRole,
	});

	const [activeStatsRows, rawSpaces] = await Promise.all([
		db()
			.select({
				anyNewNotifications: sql<boolean>`EXISTS (
					SELECT 1 FROM ${notifications}
					WHERE ${notifications.recipientId} = ${user.id}
					AND ${notifications.orgId} = ${activeOrganization.id}
					AND ${notifications.readAt} IS NULL
					LIMIT 1
				)`.mapWith(Boolean),
				memberCount: sql<number>`(
					SELECT COUNT(*) FROM ${organizationMembers}
					WHERE ${organizationMembers.organizationId} = ${activeOrganization.id}
				)`.mapWith(Number),
				videoCount: sql<number>`(
					SELECT COUNT(DISTINCT ${sharedVideos.videoId}) FROM ${sharedVideos}
					WHERE ${sharedVideos.organizationId} = ${activeOrganization.id}
				)`.mapWith(Number),
				userCapsCount: sql<number>`(
					SELECT COUNT(DISTINCT ${videos.id}) FROM ${videos}
					WHERE ${videos.orgId} = ${activeOrganization.id}
					AND ${videos.ownerId} = ${user.id}
				)`.mapWith(Number),
			})
			.from(organizations)
			.where(eq(organizations.id, activeOrganization.id))
			.limit(1),
		db()
			.select({
				id: spaces.id,
				primary: spaces.primary,
				privacy: spaces.privacy,
				public: spaces.public,
				name: spaces.name,
				description: spaces.description,
				organizationId: spaces.organizationId,
				createdById: spaces.createdById,
				iconUrl: spaces.iconUrl,
				settings: spaces.settings,
				currentUserSpaceRole: sql<string | null>`(
					SELECT space_members.role FROM space_members
					WHERE space_members.spaceId = spaces.id
					AND space_members.userId = ${user.id}
					LIMIT 1
				)`,
				hasPassword: sql`${spaces.password} IS NOT NULL`.mapWith(Boolean),
				memberCount: sql<number>`(
					SELECT COUNT(*) FROM space_members WHERE space_members.spaceId = spaces.id
				)`,
				videoCount: sql<number>`(
					SELECT COUNT(*) FROM space_videos WHERE space_videos.spaceId = spaces.id
				)`,
			})
			.from(spaces)
			.where(
				and(
					eq(spaces.organizationId, activeOrganization.id),
					or(
						eq(spaces.createdById, user.id),
						eq(spaces.privacy, "Public"),
						sql`EXISTS (
							SELECT 1 FROM space_members
							WHERE space_members.spaceId = spaces.id
							AND space_members.userId = ${user.id}
						)`,
					),
				),
			),
	]);

	const activeStats = activeStatsRows[0];
	const resolvedSpaces = await Effect.gen(function* () {
		const imageUploads = yield* ImageUploads;

		return yield* Effect.all(
			rawSpaces.map(
				Effect.fn(function* (row) {
					const { currentUserSpaceRole, ...spaceRow } = row;
					const currentUserRole = getEffectiveSpaceRole({
						userId: user.id,
						createdById: row.createdById,
						memberRole: currentUserSpaceRole,
					});

					return {
						...spaceRow,
						iconUrl: row.iconUrl
							? yield* imageUploads.resolveImageUrl(row.iconUrl)
							: null,
						currentUserRole,
						currentUserCanManage: canManageSpace({
							organizationRole: currentOrganizationRole,
							spaceRole: currentUserRole,
						}),
					};
				}),
			),
			{ concurrency: 4 },
		);
	}).pipe(runPromise);

	const allSpacesEntry = await Effect.gen(function* () {
		const imageUploads = yield* ImageUploads;

		return {
			id: activeOrganization.id,
			primary: true,
			privacy: "Public",
			name: `All ${activeOrganization.name}`,
			description: `View all content in ${activeOrganization.name}`,
			organizationId: activeOrganization.id,
			iconUrl: activeOrganization.iconUrl
				? yield* imageUploads.resolveImageUrl(activeOrganization.iconUrl)
				: null,
			memberCount: activeStats?.memberCount || 0,
			createdById: activeOrganization.ownerId,
			videoCount: activeStats?.videoCount || 0,
			settings: null,
			hasPassword: false,
			public: false,
			currentUserRole: currentOrganizationRole,
			currentUserCanManage: canManageOrganizationMembers(
				currentOrganizationRole,
			),
		} as const;
	}).pipe(runPromise);

	return {
		organizationSettings: activeOrganization.settings || null,
		spacesData: [allSpacesEntry, ...resolvedSpaces],
		anyNewNotifications: activeStats?.anyNewNotifications || false,
		userCapsCount: activeStats?.userCapsCount || 0,
	};
}

async function loadOrganizationSummaries(
	userOrganizations: (typeof organizations.$inferSelect)[],
	user: typeof userSelectProps,
): Promise<OrganizationSummary[]> {
	if (userOrganizations.length === 0) return [];

	const organizationIds = userOrganizations.map(
		(organization) => organization.id,
	);
	const ownerIds = Array.from(
		new Set(userOrganizations.map((organization) => organization.ownerId)),
	);
	const managerIds = Array.from(new Set([...ownerIds, user.id]));

	const [allMembers, managers, ownedOrganizationRows] = await Promise.all([
		db()
			.select({
				member: organizationMembers,
				user: {
					id: users.id,
					name: users.name,
					lastName: users.lastName,
					email: users.email,
					image: users.image,
				},
			})
			.from(organizationMembers)
			.leftJoin(users, eq(organizationMembers.userId, users.id))
			.where(inArray(organizationMembers.organizationId, organizationIds)),
		db()
			.select({
				id: users.id,
				inviteQuota: users.inviteQuota,
				stripeSubscriptionId: users.stripeSubscriptionId,
				stripeSubscriptionStatus: users.stripeSubscriptionStatus,
				thirdPartyStripeSubscriptionId: users.thirdPartyStripeSubscriptionId,
			})
			.from(users)
			.where(inArray(users.id, managerIds)),
		db()
			.select({ id: organizations.id, ownerId: organizations.ownerId })
			.from(organizations)
			.where(
				and(
					inArray(organizations.ownerId, ownerIds),
					isNull(organizations.tombstoneAt),
				),
			),
	]);

	const allOwnedOrganizationIds = ownedOrganizationRows.map(({ id }) => id);
	const [memberCountRows, inviteCountRows] = await Promise.all([
		db()
			.select({
				organizationId: organizationMembers.organizationId,
				value: count(),
			})
			.from(organizationMembers)
			.where(
				inArray(organizationMembers.organizationId, allOwnedOrganizationIds),
			)
			.groupBy(organizationMembers.organizationId),
		db()
			.select({
				organizationId: organizationInvites.organizationId,
				value: count(),
			})
			.from(organizationInvites)
			.where(
				inArray(organizationInvites.organizationId, allOwnedOrganizationIds),
			)
			.groupBy(organizationInvites.organizationId),
	]);

	const managersById = new Map(
		managers.map((manager) => [manager.id, manager]),
	);
	const membersByOrganizationId = groupBy(
		allMembers,
		({ member }) => member.organizationId,
	);
	const ownedOrganizationIdsByOwnerId = groupBy(
		ownedOrganizationRows,
		({ ownerId }) => ownerId,
	);
	const memberCountsByOrganizationId = new Map(
		memberCountRows.map(({ organizationId, value }) => [organizationId, value]),
	);
	const inviteCountsByOrganizationId = new Map(
		inviteCountRows.map(({ organizationId, value }) => [organizationId, value]),
	);

	return Effect.all(
		userOrganizations.map(
			Effect.fn(function* (organization) {
				const imageUploads = yield* ImageUploads;
				const members = membersByOrganizationId.get(organization.id) || [];
				const owner = managersById.get(organization.ownerId);
				const currentManager = managersById.get(user.id);
				const currentMember = members.find(
					({ member }) => member.userId === user.id,
				);
				const currentRole = getEffectiveOrganizationRole({
					userId: user.id,
					ownerId: organization.ownerId,
					memberRole: currentMember?.member.role,
				});
				const proSeatProvider = selectProSeatProvider({
					actor: currentManager,
					owner,
					actorCanManageProSeats: canManageOrganizationProSeats(currentRole),
				});
				const totalInvites = (
					ownedOrganizationIdsByOwnerId.get(organization.ownerId) || []
				).reduce(
					(total, { id }) =>
						total +
						(memberCountsByOrganizationId.get(id) || 0) +
						(inviteCountsByOrganizationId.get(id) || 0),
					0,
				);

				return {
					organization: {
						...organization,
						iconUrl: organization.iconUrl
							? yield* imageUploads.resolveImageUrl(organization.iconUrl)
							: null,
						shareableLinkIconUrl: organization.shareableLinkIconUrl
							? yield* imageUploads.resolveImageUrl(
									organization.shareableLinkIconUrl,
								)
							: null,
					},
					members: yield* Effect.all(
						members.map(
							Effect.fn(function* ({ member, user: memberUser }) {
								if (!memberUser) {
									throw new Error("Organization member user not found");
								}

								return {
									...member,
									user: {
										...memberUser,
										image: memberUser.image
											? yield* imageUploads.resolveImageUrl(memberUser.image)
											: null,
									},
								};
							}),
						),
						{ concurrency: 4 },
					),
					inviteQuota: proSeatProvider?.inviteQuota ?? 0,
					totalInvites,
					ownerIsPro: userIsPro(owner ?? null),
					hasActiveProSeatProvider: proSeatProvider !== null,
				};
			}),
		),
		{ concurrency: 3 },
	).pipe(runPromise);
}

export async function getDashboardData(user: typeof userSelectProps) {
	try {
		const [ownedOrganizations, memberOrganizations] = await Promise.all([
			db()
				.select()
				.from(organizations)
				.where(
					and(
						isNull(organizations.tombstoneAt),
						eq(organizations.ownerId, user.id),
					),
				),
			db()
				.select({
					organization: organizations,
					role: organizationMembers.role,
				})
				.from(organizationMembers)
				.innerJoin(
					organizations,
					eq(organizations.id, organizationMembers.organizationId),
				)
				.where(
					and(
						eq(organizationMembers.userId, user.id),
						isNull(organizations.tombstoneAt),
					),
				),
		]);

		const userOrganizations = mergeUserOrganizations(
			ownedOrganizations,
			memberOrganizations,
		);
		const organizationIds = userOrganizations.map(
			(organization) => organization.id,
		);
		const memberRolesByOrganizationId = new Map(
			memberOrganizations.map(({ organization, role }) => [
				organization.id,
				role,
			]),
		);

		const activeOrganization =
			userOrganizations.find(
				(organization) => organization.id === user.activeOrganizationId,
			) || userOrganizations[0];

		const organizationInvitesPromise =
			organizationIds.length > 0
				? db()
						.select()
						.from(organizationInvites)
						.where(inArray(organizationInvites.organizationId, organizationIds))
				: Promise.resolve([] as (typeof organizationInvites.$inferSelect)[]);
		const userPreferencesPromise = db()
			.select({ preferences: users.preferences })
			.from(users)
			.where(eq(users.id, user.id))
			.limit(1);
		const activeOrganizationDataPromise = activeOrganization
			? loadActiveOrganizationData({
					activeOrganization,
					memberRole: memberRolesByOrganizationId.get(activeOrganization.id),
					user,
				})
			: Promise.resolve(emptyActiveOrganizationData());
		const organizationSummariesPromise = loadOrganizationSummaries(
			userOrganizations,
			user,
		);

		const [
			organizationInvitesData,
			userPreferencesRows,
			activeOrganizationData,
			organizationSummaries,
		] = await Promise.all([
			organizationInvitesPromise,
			userPreferencesPromise,
			activeOrganizationDataPromise,
			organizationSummariesPromise,
		]);

		const organizationInvitesByOrganizationId = groupBy(
			organizationInvitesData,
			(invite) => invite.organizationId,
		);

		const organizationSelect: Organization[] = organizationSummaries.map(
			(summary) => ({
				...summary,
				invites:
					organizationInvitesByOrganizationId.get(summary.organization.id) ||
					[],
			}),
		);

		return {
			organizationSelect,
			organizationSettings: activeOrganizationData.organizationSettings,
			spacesData: activeOrganizationData.spacesData,
			anyNewNotifications: activeOrganizationData.anyNewNotifications,
			userPreferences: userPreferencesRows[0] || null,
			userCapsCount: activeOrganizationData.userCapsCount,
		};
	} catch (error) {
		console.error("Failed to fetch dashboard data", error);
		return {
			organizationSelect: [],
			spacesData: [],
			userCapsCount: null,
			anyNewNotifications: false,
			userPreferences: null,
			organizationSettings: null,
		};
	}
}
