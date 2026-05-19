# pulumi-thoth

Official Pulumi provider for Aten Security Thoth headless AI Governance Control Plane.

- Pulumi Registry package: `thoth`
- Terraform upstream: `atensecurity/terraform-provider-thoth`
- Source repository: `github.com/atensecurity/pulumi-thoth`
- Aten Security docs: https://docs.atensecurity.com/docs/pulumi-provider/

## Capabilities

The provider exposes Thoth control-plane resources for:

- Tenant governance settings
  - Includes both `complianceProfile` (preset) and `regulatoryRegimes` (explicit obligations)
- Browser providers, policies, and enrollments
- MDM providers and sync operations
- API key management
- Fleet lifecycle management and fleet inventory reads
- Billing pricing, invoice, monthly-cost, and historical report reads
- Endpoint inventory and fleet summary stats
- Governance pack catalog, runtime/reporting, and evidence chain reads
- Investigation forensics reads (session, incident, and agent-latest)
- Versioned OPA/Cedar policy bundle management with explicit assignment scopes
- Policy sync, approvals, pack assignment, webhook tests, evidence backfill triggers,
  decision-field backfills, and decision-evidence SLO reads

Runtime evidence-chain export is surfaced by GovAPI/CLI endpoints:

- `GET /:tenant-id/thoth/evidence/chain`
- `GET /:tenant-id/thoth/sessions/:sessionId/evidence-bundle`
- `thothctl evidence chain --tenant-id <tenant> --json`

## Configuration

Provider inputs mirror Terraform provider behavior:

- `tenantId` (optional when `THOTH_TENANT_ID` is exported)
- `orgApiKey` or `orgApiKeyFile` (recommended for CI/CD)
- `adminBearerToken` or `adminBearerTokenFile` (legacy/session auth)
- `apexDomain` (defaults to `atensecurity.com`)
- `apiBaseUrl` (optional override; derived from tenant when omitted)

If provider auth fields are omitted, exporting `THOTH_API_KEY` is supported.
Use an org-scoped key.
`THOTH_TENANT_ID` is supported as the tenant fallback.

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

- Python: `examples/python`
- Node.js: `examples/nodejs` (local/dev usage with generated SDK; npm package is not published)

## Published SDKs

Current public package releases are:

- Python: `pulumi-thoth` (PyPI)
- .NET: `AtenSecurity.Pulumi.Thoth` (NuGet)

Go and Node.js schema language declarations are intentionally omitted until
public package publishing is enabled for those ecosystems.

## Release

Releases are published from signed tags via `.github/workflows/release.yml`
and `.goreleaser.yml`.
