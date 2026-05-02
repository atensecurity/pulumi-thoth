package provider

import (
	"fmt"
	"path/filepath"
	"regexp"
	"strings"

	pftfbridge "github.com/pulumi/pulumi-terraform-bridge/v3/pkg/pf/tfbridge"
	"github.com/pulumi/pulumi-terraform-bridge/v3/pkg/tfbridge"
	"github.com/pulumi/pulumi/sdk/v3/go/common/tokens"

	"github.com/atensecurity/pulumi-thoth/provider/pkg/version"
	"github.com/atensecurity/terraform-provider-thoth/pkg/providerfactory"
)

const (
	mainPkg = "thoth"
)

var semverPattern = regexp.MustCompile(`^[0-9]+\.[0-9]+\.[0-9]+(?:[-+].*)?$`)

func makeMember(mod, mem string) tokens.ModuleMember {
	return tfbridge.MakeMember(mainPkg, mod, mem)
}

func makeType(mod, typ string) tokens.Type {
	return tfbridge.MakeType(mainPkg, mod, typ)
}

func makeResource(mod, res string) tokens.Type {
	return tfbridge.MakeResource(mainPkg, mod, res)
}

func makeDataSource(mod, name string) tokens.ModuleMember {
	return tfbridge.MakeDataSource(mainPkg, mod, name)
}

// Provider returns the Pulumi bridge definition for terraform-provider-thoth.
func Provider() tfbridge.ProviderInfo {
	tfProvider := providerfactory.New(version.Version)()

	return tfbridge.ProviderInfo{
		Name:        "thoth",
		DisplayName: "Thoth",
		P:           pftfbridge.ShimProvider(tfProvider),
		Description: "Pulumi provider for Aten Security Thoth AI governance control plane.",
		Keywords: []string{
			"pulumi",
			"thoth",
			"atensecurity",
			"governance",
			"ai",
		},
		License:    "Apache-2.0",
		Homepage:   "https://atensecurity.com",
		Repository: "https://github.com/atensecurity/pulumi-thoth",
		Publisher:  "Aten Security",
		Version:    version.Version,
		GitHubOrg:  "atensecurity",
		Resources: map[string]*tfbridge.ResourceInfo{
			"thoth_tenant_settings":   {Tok: makeResource("governance", "TenantSettings")},
			"thoth_policy_sync":       {Tok: makeResource("governance", "PolicySync")},
			"thoth_approval_decision": {Tok: makeResource("governance", "ApprovalDecision")},
			"thoth_pack_assignment":   {Tok: makeResource("governance", "PackAssignment")},
			"thoth_webhook_test":      {Tok: makeResource("governance", "WebhookTest")},
			"thoth_api_key":           {Tok: makeResource("access", "ApiKey")},
			"thoth_mdm_provider":      {Tok: makeResource("mdm", "Provider")},
			"thoth_mdm_sync":          {Tok: makeResource("mdm", "Sync")},
			"thoth_browser_provider":  {Tok: makeResource("browser", "Provider")},
			"thoth_browser_policy":    {Tok: makeResource("browser", "Policy")},
			"thoth_browser_enrollment": {
				Tok: makeResource("browser", "Enrollment"),
			},
		},
		DataSources: map[string]*tfbridge.DataSourceInfo{
			"thoth_tenant_settings": {Tok: makeDataSource("governance", "getTenantSettings")},
			"thoth_governance_feed": {Tok: makeDataSource("governance", "getFeed")},
			"thoth_governance_tools": {
				Tok: makeDataSource("governance", "getTools"),
			},
			"thoth_api_key_metrics": {Tok: makeDataSource("access", "getApiKeyMetrics")},
			"thoth_mdm_sync_job":    {Tok: makeDataSource("mdm", "getSyncJob")},
		},
		JavaScript: &tfbridge.JavaScriptInfo{
			PackageName: "@atensecurity/thoth",
			Dependencies: map[string]string{
				"@pulumi/pulumi": "^3.0.0",
			},
		},
		Python: &tfbridge.PythonInfo{
			PackageName: "atensecurity_thoth",
			Requires: map[string]string{
				"pulumi": ">=3.0.0,<4.0.0",
			},
		},
		Golang: &tfbridge.GolangInfo{
			ImportBasePath: filepath.Join(
				"github.com/atensecurity/pulumi-thoth/sdk",
				moduleMajorVersion(version.Version),
				"go",
				"thoth",
			),
			GenerateResourceContainerTypes: true,
		},
		CSharp: &tfbridge.CSharpInfo{
			RootNamespace: "AtenSecurity.Thoth",
			PackageReferences: map[string]string{
				"Pulumi": "3.*",
			},
		},
	}
}

func moduleMajorVersion(rawVersion string) string {
	v := strings.TrimSpace(rawVersion)
	if v == "" || v == "dev" {
		return ""
	}
	v = strings.TrimPrefix(v, "v")
	if !semverPattern.MatchString(v) {
		return ""
	}
	return tfbridge.GetModuleMajorVersion(v)
}

// PluginDownloadURL returns the default GitHub release URL for plugin downloads.
func PluginDownloadURL() string {
	return fmt.Sprintf("github://api.github.com/atensecurity/pulumi-%s", mainPkg)
}

func PackageName() tokens.Package {
	return tokens.Package(mainPkg)
}

func ModuleName() tokens.ModuleName {
	return tokens.ModuleName(mainPkg)
}

func Member(mod string, mem string) tokens.ModuleMember {
	return makeMember(mod, mem)
}

func Type(mod string, typ string) tokens.Type {
	return makeType(mod, typ)
}
