# Installation & Configuration

## Install

### Python

```bash
pip install pulumi pulumi-thoth
```

### .NET

```bash
dotnet add package AtenSecurity.Pulumi.Thoth
```

## Configure provider credentials

Set provider configuration with `pulumi config`:

```bash
pulumi config set thoth:tenantId <tenant-id>
pulumi config set --secret thoth:orgApiKey <org-api-key>
```

Alternative auth inputs are also supported:

- `thoth:orgApiKeyFile`
- `thoth:adminBearerToken`
- `thoth:adminBearerTokenFile`

Optional endpoint controls:

- `thoth:apexDomain` (defaults to `atensecurity.com`)
- `thoth:apiBaseUrl` (explicit GovAPI URL override)

Environment variable fallbacks:

- `THOTH_TENANT_ID`
- `THOTH_API_KEY`
