# Security Policy

This is a private, proprietary internal tooling repository. Report security
problems privately.

## Reporting a vulnerability

Use GitHub's private vulnerability reporting (Security tab, then Report a
vulnerability) or email team@movermarketing.ai. Do not open a public issue.

Include:

- A summary of the issue.
- The affected command, workflow, dependency, or configuration.
- Safe reproduction steps using placeholders instead of real values.
- The impact you believe it has, and a suggested fix if you have one.

## Never commit

- API keys, access tokens, or service credentials of any kind.
- OAuth client secrets, refresh tokens, or app passwords.
- Webhook URLs, deploy hooks, or shared secrets.
- Real `.env` values, credential bundles, or client-private data.

Credentials belong in GitHub Actions secrets, an approved secret manager, or an
owner-only file under `~/.config/mmai/` on the machine that needs them.

## Tooling expectations

Tools in this repository may hold powerful access. Bound retries, fail closed on
unexpected responses, and never log or print a secret value. If a tool can mutate
production, it must require an explicit approval flag.
