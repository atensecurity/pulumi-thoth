import * as pulumi from "@pulumi/pulumi";
import * as fs from "fs";
import * as thoth from "@atensec/pulumi-thoth";

const cfg = new pulumi.Config();

const tenantId = cfg.require("tenantId");
const webhookUrl = cfg.require("webhookUrl");
const webhookSecret = cfg.requireSecret("webhookSecret");
const regulatoryRegimes = cfg.getObject<string[]>("regulatoryRegimes") ?? ["soc2"];
const violationId = cfg.get("violationId") ?? "vio-example-001";
const requestedBy = cfg.get("requestedBy") ?? "udev-example";
const securityReviewer = cfg.get("securityReviewer") ?? "usec-example";

// Auth is resolved from THOTH_API_KEY (org-scoped).
const provider = new thoth.Provider("thoth", {
  tenantId,
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
    configJson: JSON.stringify({
      base_url: cfg.require("jamfBaseUrl"),
      client_id: cfg.require("jamfClientId"),
      client_secret: cfg.requireSecret("jamfClientSecret"),
    }),
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

const policyException = new thoth.governance.PolicyException(
  "crm-export-exception",
  {
    violationId,
    agentId: "crm-agent",
    toolName: "export_records",
    requestedBy,
    businessJustification: "Month-end reconciliation export workflow",
    frequencyEstimate: "weekly",
    dataSensitivity: "financial",
    alternativesConsidered: "Manual export path is too slow",
  },
  { provider }
);

const policyExceptionReview = new thoth.governance.PolicyExceptionReview(
  "crm-export-exception-review",
  {
    requestId: policyException.requestId,
    reviewDecision: "approve",
    reviewedBy: securityReviewer,
    reviewNotes: "Approved for controlled rollout using govapi apply channel.",
    owner: "security-platform",
    targetEnvironment: "prod",
  },
  { provider }
);

const policyChangeApply = new thoth.governance.PolicyChangeArtifactApply(
  "crm-export-exception-apply",
  {
    requestId: policyException.requestId,
    appliedBy: securityReviewer,
    applyChannel: "govapi",
    policyFormat: "rego",
    bundleName: "exception-crm-export",
    bundleDescription: "Policy exception artifact promotion",
    assignments: ["all"],
    enforcementMode: "enforce",
    status: "active",
  },
  {
    provider,
    dependsOn: [policyExceptionReview],
  }
);

export const tenant = governanceSettings.tenantId;
export const mdmSyncJobId = mdmSync.id;
export const mcpVendorId = mcpVendorOpenAi.vendorId;
export const policyExceptionRequestId = policyException.requestId;
export const policyPatchApplyId = policyChangeApply.id;
export const policyBundleIds = {
  standardDlpOpa: standardDlpOpa.id,
  leastPrivilegeCedar: leastPrivilegeCedar.id,
};
