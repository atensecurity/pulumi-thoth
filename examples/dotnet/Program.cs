using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using AtenSecurity.Pulumi.Thoth;
using AtenSecurity.Pulumi.Thoth.Governance;
using AtenSecurity.Pulumi.Thoth.Mcp;
using Pulumi;
using ThothMdmProvider = AtenSecurity.Pulumi.Thoth.Mdm.Provider;
using ThothProvider = AtenSecurity.Pulumi.Thoth.Provider;

return await Deployment.RunAsync(() =>
{
    var config = new Config();

    var tenantId = config.Require("tenantId");
    var apexDomain = config.Get("apexDomain");
    var webhookUrl = config.Require("webhookUrl");
    var webhookSecret = config.RequireSecret("webhookSecret");
    var regulatoryRegimes = config.GetObject<List<string>>("regulatoryRegimes") ?? ["soc2"];

    var provider = new ThothProvider("thoth", new ProviderArgs
    {
        TenantId = tenantId,
        ApexDomain = apexDomain,
    });

    var governanceSettings = new GovernanceSettings("baseline-governance", new GovernanceSettingsArgs
    {
        ComplianceProfile = "soc2",
        RegulatoryRegimes = regulatoryRegimes,
        ShadowLow = "allow",
        ShadowMedium = "step_up",
        ShadowHigh = "block",
        ShadowCritical = "block",
    }, new CustomResourceOptions
    {
        Provider = provider,
    });

    _ = new WebhookSettings("baseline-webhook", new WebhookSettingsArgs
    {
        WebhookEnabled = true,
        WebhookUrl = webhookUrl,
        WebhookSecret = webhookSecret,
    }, new CustomResourceOptions
    {
        Provider = provider,
    });

    var jamfConfigJson = Output.Tuple(
        config.Require("jamfBaseUrl"),
        config.Require("jamfClientId"),
        config.RequireSecret("jamfClientSecret")).Apply(tuple => JsonSerializer.Serialize(new Dictionary<string, string>
        {
            ["base_url"] = tuple.Item1,
            ["client_id"] = tuple.Item2,
            ["client_secret"] = tuple.Item3,
        }));

    var mdmProvider = new ThothMdmProvider("jamf", new AtenSecurity.Pulumi.Thoth.Mdm.ProviderArgs
    {
        ProviderName = "jamf",
        Name = "Jamf Pro",
        Enabled = true,
        ConfigJson = jamfConfigJson,
    }, new CustomResourceOptions
    {
        Provider = provider,
    });

    var mdmSync = new AtenSecurity.Pulumi.Thoth.Mdm.Sync("jamf-sync", new AtenSecurity.Pulumi.Thoth.Mdm.SyncArgs
    {
        ProviderName = mdmProvider.ProviderName,
        WaitForCompletion = true,
        TimeoutSeconds = 180,
    }, new CustomResourceOptions
    {
        Provider = provider,
    });

    var mcpVendorOpenAi = new Vendor("mcp-openai", new VendorArgs
    {
        VendorId = "openai",
        DisplayName = "OpenAI",
        Approved = true,
        HostPatterns = ["api.openai.com", "*.openai.com"],
        Source = "manual",
        Notes = "Managed by pulumi-thoth example stack.",
    }, new CustomResourceOptions
    {
        Provider = provider,
    });

    var policyDir = Path.Combine(Directory.GetCurrentDirectory(), "policies");

    var standardDlpOpa = new PolicyBundle("standard-dlp-opa", new PolicyBundleArgs
    {
        Name = "standard-dlp",
        Description = "Customer-agnostic purpose/sensitivity DLP baseline",
        Framework = "OPA",
        RawPolicy = File.ReadAllText(Path.Combine(policyDir, "opa-standard-dlp.rego")),
        EnforcementMode = "enforce",
    }, new CustomResourceOptions
    {
        Provider = provider,
    });

    var leastPrivilegeCedar = new PolicyBundle("least-privilege-cedar", new PolicyBundleArgs
    {
        Name = "least-privilege-analyst",
        Description = "Least-privilege baseline for selected agents",
        Framework = "CEDAR",
        RawPolicy = File.ReadAllText(Path.Combine(policyDir, "cedar-least-privilege-analyst.cedar")),
        Assignments = ["agent:security-analyst-agent", "agent:coding-agent"],
        EnforcementMode = "enforce",
    }, new CustomResourceOptions
    {
        Provider = provider,
    });

    return new Dictionary<string, object?>
    {
        ["tenant"] = governanceSettings.TenantId,
        ["mdmSyncJobId"] = mdmSync.Id,
        ["mcpVendorId"] = mcpVendorOpenAi.VendorId,
        ["policyBundleIds"] = new Dictionary<string, object?>
        {
            ["standardDlpOpa"] = standardDlpOpa.Id,
            ["leastPrivilegeCedar"] = leastPrivilegeCedar.Id,
        },
    };
});
