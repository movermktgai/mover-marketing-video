import { MmaiMark } from "./Logo";

export const LogoBadge = ({ className }: { className: string }) => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			className={className}
			fill="none"
			viewBox="0 0 512 512"
			preserveAspectRatio="xMidYMid meet"
			style={{
				aspectRatio: "1 / 1",
			}}
			aria-label="Mover Marketing AI"
			role="img"
		>
			<MmaiMark />
		</svg>
	);
};
