# Changelog

All notable changes to `pulumi-thoth` are documented in this file.

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
