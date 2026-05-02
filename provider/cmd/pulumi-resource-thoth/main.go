package main

import (
	"context"
	_ "embed"

	pftfbridge "github.com/pulumi/pulumi-terraform-bridge/v3/pkg/pf/tfbridge"

	providerpkg "github.com/atensecurity/pulumi-thoth/provider/pkg/provider"
)

//go:embed schema.json
var schema []byte

func main() {
	meta := pftfbridge.ProviderMetadata{
		PackageSchema: schema,
	}
	pftfbridge.Main(context.Background(), "thoth", providerpkg.Provider(), meta)
}
