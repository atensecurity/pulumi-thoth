# Pulumi Thoth Examples

Complete example stacks for all currently published SDK platforms:

- Node.js (`examples/nodejs`)
- Python (`examples/python`)
- .NET (`examples/dotnet`)

All three examples manage the same baseline set of resources:

- tenant governance settings
- webhook settings
- MDM provider + sync trigger
- MCP vendor allowlist entry
- OPA + Cedar policy bundles
- policy exception + review + apply workflow

## Shared prerequisites

1. Export API auth:
   - `export THOTH_API_KEY=<org-scoped-api-key>`
2. Configure example stack values from each sample file:
   - `Pulumi.dev.example.yaml`

## Node.js

```bash
cd examples/nodejs
cp Pulumi.dev.example.yaml Pulumi.dev.yaml
npm install
npm run build
pulumi stack init dev
pulumi preview
```

`npm install` runs a `postinstall` fixup for `@atensec/pulumi-thoth@0.1.13`
so Node 24+ can load the package runtime correctly.

## Python

```bash
cd examples/python
cp Pulumi.dev.example.yaml Pulumi.dev.yaml
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python -m py_compile __main__.py
pulumi stack init dev
pulumi preview
```

## .NET

```bash
cd examples/dotnet
cp Pulumi.dev.example.yaml Pulumi.dev.yaml
dotnet restore
dotnet build
pulumi stack init dev
pulumi preview
```

## Notes

- The examples use `v0.1.13` package versions to match the current published
  release line.
- `pulumi preview` requires valid tenant/config/API credentials.
