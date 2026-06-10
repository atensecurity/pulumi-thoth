# Changelog

All notable changes to `pulumi-thoth` are documented in this file.

## 0.1.12 - 2026-06-10

### Changed

- Updated Terraform provider bridge dependency pin to
  `github.com/atensecurity/terraform-provider-thoth v0.1.12`.
- Bumped Pulumi release defaults/examples to `0.1.12`:
  - `Makefile` default `VERSION`
  - Node.js example package dependency (`@atensec/pulumi-thoth`)

### Added

- Pulumi bridge now exposes Terraform `0.1.12` MCP vendor registry and catalog
  verification surfaces:
  - `McpVendor` resource
  - `getMcpVendors` data source
  - `McpCatalogVerify` resource
  - `getMcpInventoryReport` data source

### Fixed

- Inherited Terraform `0.1.12` stabilization for MCP vendor `hostPatterns`
  ordering so Pulumi up/refresh operations converge deterministically when API
  response ordering differs.

## 0.1.11 - 2026-05-11

### Changed

- Updated Terraform provider bridge dependency pin to
  `github.com/atensecurity/terraform-provider-thoth v0.1.11`.
- Bumped Pulumi release defaults/examples to `0.1.11`:
  - `Makefile` default `VERSION`
  - Node.js example package dependency (`@atensec/pulumi-thoth`)

### Added

- Pulumi provider requests now inherit Terraform `0.1.11` provisioning
  attribution metadata headers to classify IaC-managed policy bundles in
  governance inventory and stats surfaces.

## 0.1.10 - 2026-05-11

### Changed

- Updated Terraform provider bridge dependency pin to
  `github.com/atensecurity/terraform-provider-thoth v0.1.10`.
- Bumped Pulumi release defaults/examples to `0.1.10`:
  - `Makefile` default `VERSION`
  - Node.js example package dependency (`@atensec/pulumi-thoth`)

### Fixed

- Pulumi bridge now inherits Terraform `0.1.10` evidence backfill endpoint
  compatibility handling for mixed GovAPI deployments.

## 0.1.9 - 2026-05-11

### Changed

- Updated Terraform provider bridge dependency pin to
  `github.com/atensecurity/terraform-provider-thoth v0.1.9`.
- Bumped Pulumi release defaults/examples to `0.1.9`:
  - `Makefile` default `VERSION`
  - Node.js example package dependency (`@atensec/pulumi-thoth`)

## 0.1.8 - 2026-05-10

### Changed

- Updated Terraform provider bridge dependency pin to
  `github.com/atensecurity/terraform-provider-thoth v0.1.8`.
- Bumped Pulumi release defaults/examples to `0.1.8`:
  - `Makefile` default `VERSION`
  - Node.js example package dependency (`@atensec/pulumi-thoth`)

## 0.1.7 - 2026-05-10

### Added

- Terraform parity note for endpoint inventory management:
  - upstream Terraform provider now exposes `thoth_endpoint` for endpoint
    registration/update flows used by scoped key tests.

### Fixed

- Pulumi bridge inherits Terraform provider `0.1.7` drift/stability fixes for:
  - `BrowserPolicy` server-managed audit/version fields (`version`,
    `createdBy`, `updatedBy`) no longer causing post-apply state drift when
    unset in config.
  - `MdmProvider.configJson` sensitive-state round-trip consistency when backend
    responses redact or normalize provider config payloads.
- Trantor bootstrap example surfaces now reflect stable default behavior for
  environment-dependent probes and corrected OPA policy examples.

### Changed

- Documented GovAPI Cedar runtime validation compatibility behavior for bridged
  policy bundle workflows (Cedar syntax is validated at GovAPI write-time; CLI
  runtime validation remains best-effort by deployment environment).
- Bumped Pulumi release defaults/examples to `0.1.7`:
  - `Makefile` default `VERSION`
  - Node.js example package dependency (`@atensec/pulumi-thoth`)
- Added Pulumi resource mapping for Terraform `thoth_endpoint` so tfgen/schema
  generation succeeds against Terraform provider `v0.1.7`.

## 0.1.6 - 2026-05-10

### Added

- AIRS billing report artifact data source bridge mappings for Terraform parity:
  - `thoth_billing_artifacts` -> `billing/getArtifacts`
  - `thoth_billing_artifact` -> `billing/getArtifact`

### Changed

- Updated Terraform provider bridge dependency pin to
  `github.com/atensecurity/terraform-provider-thoth v0.1.6`.
- Updated Pulumi provider bridge metadata to expose monthly billing artifact
  lookup/listing surfaces in the billing module.
- Regenerated Pulumi schema/SDK surfaces to reflect governance updates in this branch:
  - explicit regulatory regimes on governance settings
  - policy bundle surfaces aligned to mode-based behavior
- Refreshed Pulumi release defaults/examples to `0.1.6`:
  - `Makefile` default `VERSION`
  - Node.js example package dependency (`@atensec/pulumi-thoth`)
  - Runbook install commands for Node.js/Python quickstarts

### Breaking Changes

- Removed environment-scoped policy bundle inputs from bridged policy bundle APIs.

## 0.1.5 - 2026-05-09

### Changed

- Updated Terraform provider dependency pin to `github.com/atensecurity/terraform-provider-thoth v0.1.5`.
- Refreshed Pulumi provider release defaults/examples to `0.1.5` for aligned publish automation:
  - `Makefile` default `VERSION`
  - Node.js example package dependency (`@atensec/pulumi-thoth`)
  - Public docs stable release marker

## 0.1.4 - 2026-05-06

### Added

- Bridged coverage for the latest Terraform provider parity surface, including:
  - API key inventory (`getApiKeys`)
  - Scope-specific API key resources (`FleetApiKey`, `EndpointApiKey`, `AgentApiKey`)
  - Focused tenant settings resources (`GovernanceSettings`, `WebhookSettings`,
    `SiemSettings`, `PamSettings`)
  - Fleet lifecycle helpers (`getFleet`, `getFleets`, `getEndpoints`, `getEndpointStats`)
  - Governance evidence reads (`getEvidenceBundle`, `getEvidenceChain`, `getEvidenceVerify`)
  - MDM and browser inventory helpers (`getProviders`, `getPolicies`, `getEnrollments`)

### Removed

- Deprecated legacy `TenantSettings` resource from the Pulumi bridge.
  Use `GovernanceSettings`, `WebhookSettings`, `SiemSettings`, and `PamSettings`.
- Deprecated legacy `ApiKey` resource from the Pulumi bridge.
  Use `FleetApiKey`, `EndpointApiKey`, and `AgentApiKey`.

### Changed

- Updated Terraform provider dependency pin to `github.com/atensecurity/terraform-provider-thoth v0.1.4`.
- Updated Pulumi provider module resolution to use the monorepo-local
  `terraform-provider-thoth` module during CI/schema generation
  (provider `go.mod` replace override), preventing tfgen/bridge drift against
  published provider lag.
- Regenerated Pulumi package schema against the current in-repo Terraform provider
  implementation.
- Regenerated Pulumi schema after removing deprecated resource mappings.
- Pack assignment resource split remains unchanged (`PackAssignment` and
  `PackAssignmentBulk` stay separate).
- MDM/browser resources remain unified multi-provider resources until provider-
  specific typed contracts are exposed upstream.

### Compatibility

- This release intentionally removes deprecated resources because the provider
  is not yet in production customer use.

## 0.1.3 - 2026-05-05

### Changed

- Updated module resolution to consume published `terraform-provider-thoth v0.1.3`
  (removed local replace override in provider `go.mod`).
- Refreshed provider dependency locks in `go.sum` against the released Terraform provider.

### Compatibility

- Maintains dual-auth support inherited from Terraform provider (`THOTH_API_KEY` and bearer token flows).
- No breaking provider token or schema renames.

## 0.1.2 - 2026-05-05

### Changed

- Updated the bridged Terraform dependency to `terraform-provider-thoth v0.1.3`.
- Regenerated Pulumi schema and SDK outputs against the latest Terraform provider surface.
- Clarified release guidance and examples for both supported auth patterns.

### Compatibility

- Pulumi provider continues to support both auth methods through bridged provider config:
  admin bearer token and org-level API key (`THOTH_API_KEY` env workflow supported).
- No breaking resource token renames in this release.

## 0.1.1 - 2026-05-03

### Changed

- Hardened packaging and release automation for public provider publication.
- Refreshed generated SDK assets and release metadata for deterministic builds.

## 0.1.0 - 2026-05-02

### Added

- Official `thoth` Pulumi provider bridged from `terraform-provider-thoth`.
- Provider binaries (`pulumi-resource-thoth`) and tfgen entrypoint (`pulumi-tfgen-thoth`).
- Node.js and Python provider-native examples.

### Changed

- Added monorepo publish workflow for signed tag release automation.
- Added public release workflow and GoReleaser packaging for Pulumi plugin artifacts.
