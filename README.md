# pulumi-thoth

Official Pulumi provider for Aten Security Thoth headless AI Governance Control Plane.

- Pulumi Registry package: `thoth`
- Terraform upstream: `atensecurity/terraform-provider-thoth`
- Source repository: `github.com/atensecurity/pulumi-thoth`
- Aten Security docs: https://docs.atensecurity.com/docs/pulumi-provider/

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
make tfgen
make schema
make build
make test
```

## Examples

- Node.js: `examples/nodejs`
- Python: `examples/python`

## Release

Releases are published from signed tags via `.github/workflows/release.yml`
and `.goreleaser.yml`.
