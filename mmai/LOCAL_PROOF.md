# Mover Marketing Video local proof

This public source note describes how to validate a self-hosted Mover Marketing Video build without including private deployment URLs, storage endpoints, credentials, or recording/share-link paths.

## Scope

- Product name: Mover Marketing Video
- Upstream project: Cap
- Intended use: self-hosted, branded screen recording and video sharing
- Public source posture: AGPL source availability without environment secrets or private deployment details

## Recording length

The upstream five-minute sharing limit is a Cap Cloud free-plan gate. In this self-hosted fork, the app should treat authenticated self-hosted users as upgraded when `NEXT_PUBLIC_IS_CAP` is unset or empty. Validate this end-to-end in your own environment because web API, desktop app, upload, and processing paths can each affect the final recording/share flow.

## Local proof checklist

1. Copy `.env.mmai.local.example` to `.env` and replace every placeholder with local-only values.
2. Keep `NEXT_PUBLIC_IS_CAP` empty for self-host mode.
3. Point desktop dev builds at `VITE_SERVER_URL=http://localhost:3000` unless you are building for your own deployment.
4. Start the existing local stack only in the intended dev environment.
5. Sign in to the local web app from the desktop app.
6. Record and share a test video longer than five minutes.
7. Confirm the desktop plan check returns upgraded, upload/share succeeds, and the share page uses Mover Marketing Video branding.

## Production deployment notes

A production self-hosted deployment typically needs:

- A web/API host
- External MySQL-compatible database
- S3-compatible object storage
- Separate always-on media server for FFmpeg/video processing
- Email provider for auth/login links
- Generated production secrets for auth, database encryption, and media webhooks
- Code signing/notarization for branded macOS builds
- A custom desktop updater channel or updater disabled until one exists

Do not commit production `.env` files, storage endpoints, database URLs, webhook URLs, API keys, OAuth credentials, signing material, private app URLs, or recording/share-link paths.

## AGPL source availability

Cap is primarily AGPLv3. If you distribute this modified app or let outside users access a modified network deployment, be prepared to provide the corresponding source code for the version they receive or use. Keep private secrets and deployment data out of the source release.
