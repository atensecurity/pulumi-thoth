# Changelog

All notable changes to `pulumi-thoth` are documented in this file.

## 0.1.6 - 2026-05-10

### Changed

- Updated Terraform provider bridge dependency pin to
  `github.com/atensecurity/terraform-provider-thoth v0.1.6`.
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
