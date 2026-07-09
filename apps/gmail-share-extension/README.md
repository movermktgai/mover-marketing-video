# Mover Marketing Video for Gmail

Chrome extension that turns Mover Marketing Video share links pasted into Gmail into rich email cards.

## What it does

- Runs only on `https://mail.google.com/*`.
- Detects pasted share links with the `/s/{videoId}` path shape.
- Fetches public share-card metadata from the pasted link's own origin at `/api/video/share-card?videoId=...`.
- Replaces the plain URL in the Gmail compose box with an email-safe table card containing:
  - animated preview/fallback image,
  - video title,
  - duration,
  - watch CTA.

The generated card is normal HTML in the Gmail compose body, so recipients do not need the extension installed.

## Build

```bash
pnpm --filter @cap/gmail-share-extension build
```

Load `apps/gmail-share-extension/dist` as an unpacked Chrome extension while testing.

## Optional app-origin allowlist

Open the extension options page and add one allowed app origin per line. Leave blank to let the extension try any pasted `/s/{videoId}` URL and only format it if that origin exposes the expected Mover Marketing Video metadata response.
