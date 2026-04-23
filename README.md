# pulumi-thoth

Official Pulumi artifacts for Thoth headless control-plane operations.

## What works today

Use the examples in this repository to run `thothctl bootstrap` from Pulumi for:

- tenant governance settings
- SIEM/SOAR webhook routing
- MDM provider upsert + optional sync start

The examples are dashboard-free and GitOps-friendly.

## Prerequisites

- `thothctl` available in `PATH` (or configure `thothctlBin`)
- `bash` available on runner
- GovAPI URL
- tenant admin bearer token (inline secret or file path)

## Install and run

### Node.js

```bash
cd examples/nodejs
npm install
pulumi stack init dev
pulumi config set tenantId rightway
pulumi config set govapiUrl https://govapi.atensecurity.com
pulumi config set adminBearerTokenFile /run/secrets/thoth_admin_jwt
pulumi config set webhookUrl https://siem.example.com/hooks/thoth
pulumi config set --secret webhookSecret "<secret>"
pulumi up
```

### Python

```bash
cd examples/python
python -m venv .venv
source .venv/bin/activate
pip install pulumi pulumi-command
pulumi stack init dev
pulumi config set tenantId rightway
pulumi config set govapiUrl https://govapi.atensecurity.com
pulumi config set adminBearerTokenFile /run/secrets/thoth_admin_jwt
pulumi up
```

## Provider-native resources (in progress)

Planned resource set:

- `TenantSettings`
- `MdmProvider`
- `MdmSync`
- `WebhookTest`

Until provider-native resources are released, use the bootstrap examples in this repo
for strict production verification and reproducible control-plane rollout.
