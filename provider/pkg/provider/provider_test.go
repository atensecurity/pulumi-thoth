package provider

import (
	"sort"
	"testing"

	shim "github.com/pulumi/pulumi-terraform-bridge/v3/pkg/tfshim"
)

// Every resource and data source the Terraform provider ships must be mapped
// to a Pulumi token. A Terraform resource with no mapping is silently missing
// from every Pulumi SDK, which is how thoth_recipient_policy was missed.
func TestEveryTerraformResourceAndDataSourceIsMapped(t *testing.T) {
	info := Provider()

	var unmappedResources []string
	info.P.ResourcesMap().Range(func(name string, _ shim.Resource) bool {
		if _, ok := info.Resources[name]; !ok {
			unmappedResources = append(unmappedResources, name)
		}
		return true
	})
	var unmappedDataSources []string
	info.P.DataSourcesMap().Range(func(name string, _ shim.Resource) bool {
		if _, ok := info.DataSources[name]; !ok {
			unmappedDataSources = append(unmappedDataSources, name)
		}
		return true
	})
	sort.Strings(unmappedResources)
	sort.Strings(unmappedDataSources)

	if len(unmappedResources) > 0 {
		t.Errorf("Terraform resources with no Pulumi token in provider.go: %v", unmappedResources)
	}
	if len(unmappedDataSources) > 0 {
		t.Errorf("Terraform data sources with no Pulumi token in provider.go: %v", unmappedDataSources)
	}
}

// A mapping for something the Terraform provider no longer has would fail the
// schema generation; catch it here with a readable message.
func TestEveryMappingNamesARealTerraformType(t *testing.T) {
	info := Provider()

	for name := range info.Resources {
		if _, ok := info.P.ResourcesMap().GetOk(name); !ok {
			t.Errorf("provider.go maps %q, which is not a Terraform resource", name)
		}
	}
	for name := range info.DataSources {
		if _, ok := info.P.DataSourcesMap().GetOk(name); !ok {
			t.Errorf("provider.go maps %q, which is not a Terraform data source", name)
		}
	}
}
