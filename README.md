# pulumi-thoth

Official Pulumi provider for Aten Security Thoth headless AI Governance Control Plane.

- Pulumi Registry package: `thoth`
- Terraform upstream: `atensecurity/terraform-provider-thoth`
- Source repository: `github.com/atensecurity/pulumi-thoth`

## Capabilities

The provider exposes Thoth control-plane resources for:

- Tenant governance settings
- Browser providers, policies, and enrollments
- MDM providers and sync operations
- API key management
- Policy sync, approvals, pack assignment, and webhook tests

## Configuration

Provider inputs mirror Terraform provider behavior:

- `tenantId` (required)
- `adminBearerToken` or `adminBearerTokenFile`
- `apexDomain` (defaults to `atensecurity.com`)
- `apiBaseUrl` (optional override; derived from tenant when omitted)

When `apiBaseUrl` is omitted, endpoint is derived as:

`https://grid.<tenant_id>.<apex_domain>`

## Local development

```bash
cd platform/public/pulumi-thoth
git clone --depth 1 https://github.com/atensecurity/terraform-provider-thoth.git ../terraform-provider-thoth
make tfgen
make schema
make build
make test
```

## Examples

- Node.js: `examples/nodejs`
- Python: `examples/python`

## Release

Public release automation is driven by:

- `.github/workflows/release.yml`
- `.goreleaser.yml`

Monorepo-to-public mirroring and signed tag publication are handled by:

- `.github/workflows/publish-pulumi-provider-thoth.yml`

Required secrets for public release publishing:

- `THOTH_PULUMI_PROVIDER_GPG_PRIVATE_KEY`
- `THOTH_PULUMI_PROVIDER_GPG_PASSPHRASE`
- `PULUMI_ACCESS_TOKEN`
- `NPM_TOKEN`
- `PYPI_API_TOKEN`
- `NUGET_PUBLISH_KEY`
