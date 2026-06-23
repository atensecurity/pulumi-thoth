# Installation & Configuration

## Published SDKs

- Node.js: `@atensec/pulumi-thoth`
  https://www.npmjs.com/package/@atensec/pulumi-thoth
- Python: `pulumi-thoth`
  https://pypi.org/project/pulumi-thoth/
- .NET: `AtenSecurity.Pulumi.Thoth.Thoth`
  https://www.nuget.org/packages/AtenSecurity.Pulumi.Thoth.Thoth

This package currently supports Node.js, Python, and .NET SDKs.
Go SDK generation/publication is currently not enabled for this provider line.

## Install

### Node.js

```bash
npm install @pulumi/pulumi @atensec/pulumi-thoth
```

### Python

```bash
pip install pulumi pulumi-thoth
```

### .NET

```bash
dotnet add package AtenSecurity.Pulumi.Thoth.Thoth
```

## Install provider plugin

Pulumi installs plugins automatically during `pulumi up`, but you can install
the provider plugin manually:

```bash
pulumi plugin install resource thoth 0.1.12 --server github://api.github.com/atensecurity/pulumi-thoth
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
