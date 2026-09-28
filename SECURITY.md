# Security Policy

## Supported Versions

| Version                  | Security support    |
| ------------------------ | ------------------- |
| Latest published release | Supported           |
| Older releases           | Upgrade recommended |

Security fixes are delivered through the latest published release. Consumers should keep Laravel, Inertia, their frontend framework, browsers, and this package current.

## Reporting a Vulnerability

Do not disclose suspected vulnerabilities in public issues, discussions, or pull requests.

Submit a private report from the repository's [Security tab](https://github.com/erag-labs/laravel-Inertia-forms/security): choose **Report a vulnerability**. Include:

- The affected package version and environment.
- The vulnerability type and potential impact.
- Reproduction steps or a minimal proof of concept.
- Any known mitigations or suggested remediation.

Remove unrelated credentials, tokens, and personal information. Reports should receive an initial acknowledgement within 48 hours. Validation, remediation, and release timing depend on severity and complexity. Please allow time for a coordinated fix before public disclosure.

## Form Security

- Browser-side visibility and disabled or read-only states are for the user interface only. Always validate on the server with `#[Validate]` or `$form->validate()`.
- `visibleWhen()` and `hiddenWhen()` are not permission checks. Use `authorizedWhen()` or `authorize()` for fields a user must never see or submit.
- Only use `$form->validated()` when saving data, never `$request->all()`, so unknown and hidden fields are ignored.
- `Select::searchUsing()` options are served by a package endpoint that anyone who can load the page can call. It only accepts your own form classes (the class name is encrypted) and runs the form and field authorization checks, but add `auth` to `inertia-forms.search.middleware` when the options are private, and only return the columns you want to show.
- Treat uploaded files as untrusted: keep type and size rules, and store files outside the public web root unless they are meant to be public.
