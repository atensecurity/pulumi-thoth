package main

import (
	"github.com/pulumi/pulumi-terraform-bridge/v3/pkg/tfgen"

	providerpkg "github.com/atensecurity/pulumi-thoth/provider/pkg/provider"
	"github.com/atensecurity/pulumi-thoth/provider/pkg/version"
)

func main() {
	tfgen.Main("thoth", version.Version, providerpkg.Provider())
}
