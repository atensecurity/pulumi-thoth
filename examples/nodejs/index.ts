import * as pulumi from "@pulumi/pulumi";
import * as fs from "fs";
import * as thoth from "@atensec/pulumi-thoth/bin";

const cfg = new pulumi.Config();

const tenantId = cfg.require("tenantId");
const apexDomain = cfg.get("apexDomain");
const webhookUrl = cfg.require("webhookUrl");
const webhookSecret = cfg.requireSecret("webhookSecret");
const regulatoryRegimes = cfg.getObject<string[]>("regulatoryRegimes") ?? ["soc2"];

// Auth is resolved from THOTH_API_KEY (org-scoped).
const provider = new thoth.Provider("thoth", {
  tenantId,
  apexDomain,
});

const governanceSettings = new thoth.governance.GovernanceSettings(
  "baseline-governance",
  {
    complianceProfile: "soc2",
    regulatoryRegimes,
    shadowLow: "allow",
    shadowMedium: "step_up",
    shadowHigh: "block",
    shadowCritical: "block",
  },
  { provider }
);

new thoth.governance.WebhookSettings(
  "baseline-webhook",
  {
    webhookEnabled: true,
    webhookUrl,
    webhookSecret,
  },
  { provider }
);

const mdmProvider = new thoth.mdm.Provider(
  "jamf",
  {
    providerName: "jamf",
    name: "Jamf Pro",
    enabled: true,
    configJson: pulumi
      .all([cfg.require("jamfBaseUrl"), cfg.require("jamfClientId"), cfg.requireSecret("jamfClientSecret")])
      .apply(([baseUrl, clientId, clientSecret]) =>
        JSON.stringify({
          base_url: baseUrl,
          client_id: clientId,
          client_secret: clientSecret,
        })
      ),
  },
  { provider }
);

const mdmSync = new thoth.mdm.Sync(
  "jamf-sync",
  {
    providerName: mdmProvider.providerName,
    waitForCompletion: true,
    timeoutSeconds: 180,
  },
  { provider }
);

const mcpVendorOpenAi = new thoth.mcp.Vendor(
  "mcp-openai",
  {
    vendorId: "openai",
    displayName: "OpenAI",
    approved: true,
    hostPatterns: ["api.openai.com", "*.openai.com"],
    source: "manual",
    notes: "Managed by pulumi-thoth example stack.",
  },
  { provider }
);

const standardDlpOpa = new thoth.governance.PolicyBundle(
  "standard-dlp-opa",
  {
    name: "standard-dlp",
    description: "Customer-agnostic purpose/sensitivity DLP baseline",
    framework: "OPA",
    rawPolicy: fs.readFileSync("./policies/opa-standard-dlp.rego", "utf8"),
    enforcementMode: "enforce",
  },
  { provider }
);

const leastPrivilegeCedar = new thoth.governance.PolicyBundle(
  "least-privilege-cedar",
  {
    name: "least-privilege-analyst",
    description: "Least-privilege baseline for selected agents",
    framework: "CEDAR",
    rawPolicy: fs.readFileSync("./policies/cedar-least-privilege-analyst.cedar", "utf8"),
    assignments: ["agent:security-analyst-agent", "agent:coding-agent"],
    enforcementMode: "enforce",
  },
  { provider }
);

export const tenant = governanceSettings.tenantId;
export const mdmSyncJobId = mdmSync.id;
export const mcpVendorId = mcpVendorOpenAi.vendorId;
export const policyBundleIds = {
  standardDlpOpa: standardDlpOpa.id,
  leastPrivilegeCedar: leastPrivilegeCedar.id,
};
