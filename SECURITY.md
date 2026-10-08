# Security Policy

Security is important to Laravel Inertia Forms. If you find a security issue, please report it privately so it can be reviewed and fixed.

## Supported Versions

| Version | Supported |
|---|---|
| Latest 0.x release | ✅ Yes |
| Older releases | ❌ No |

Security fixes are provided for the latest release.

This policy covers `erag/inertia-forms` and its Vue, React, and Svelte packages.

## Reporting a Vulnerability

**Please don't report security issues in public GitHub issues or discussions.**

To report a vulnerability:

1. Visit the [GitHub Security page](https://github.com/eramitgupta/laravel-Inertia-forms/security).
2. Click **Report a vulnerability**.
3. Describe the issue and include steps to reproduce it.

If possible, mention the affected package, version, and potential impact.

## Response Time

We aim to:

- Acknowledge reports within **48 hours**.
- Review reported issues within **7 days**.
- Provide updates when there is meaningful progress.
- Release fixes as soon as reasonably possible.

These are target timeframes, not guarantees.

Please allow time for a fix before sharing the issue publicly.

## Security Best Practices

When using Laravel Inertia Forms:

- Always validate submitted data on the server.
- Use `authorize()` or `authorizedWhen()` to protect restricted fields.
- Use validated data instead of trusting raw request input.
- Never pass untrusted user input to `Html::make()`.
- Validate file uploads and store sensitive files securely.
- Protect private forms and endpoints with appropriate middleware.
- Keep Laravel, Inertia, and package dependencies updated.

## Thank You

Thanks for helping keep Laravel Inertia Forms secure for everyone.

**[Report a Security Issue](https://github.com/eramitgupta/laravel-Inertia-forms/security)**
