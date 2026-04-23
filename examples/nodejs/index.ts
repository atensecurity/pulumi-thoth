import * as command from "@pulumi/command";
import * as pulumi from "@pulumi/pulumi";

const cfg = new pulumi.Config();

const tenantId = cfg.require("tenantId");
const govapiUrl = cfg.require("govapiUrl");

const adminBearerToken = cfg.getSecret("adminBearerToken");
const adminBearerTokenFile = cfg.get("adminBearerTokenFile") ?? "";

const bootstrapScriptPath =
  cfg.get("bootstrapScriptPath") ?? "../../scripts/thothctl_bootstrap.sh";
const thothctlBin = cfg.get("thothctlBin") ?? "thothctl";
const timeoutSeconds = cfg.get("timeoutSeconds") ?? "20";
const complianceProfile = cfg.get("complianceProfile") ?? "soc2";
const shadowLow = cfg.get("shadowLow") ?? "allow";
const shadowMedium = cfg.get("shadowMedium") ?? "step_up";
const shadowHigh = cfg.get("shadowHigh") ?? "block";
const shadowCritical = cfg.get("shadowCritical") ?? "block";

const webhookUrl = cfg.get("webhookUrl") ?? "";
const webhookSecret = cfg.getSecret("webhookSecret") ?? "";
const webhookEnabled = cfg.get("webhookEnabled") ?? "";
const testWebhook = cfg.getBoolean("testWebhook") ?? false;

const mdmProvider = cfg.get("mdmProvider") ?? "";
const mdmName = cfg.get("mdmName") ?? "";
const mdmEnabled = cfg.get("mdmEnabled") ?? "";
const mdmConfigFile = cfg.get("mdmConfigFile") ?? "";
const startMdmSync = cfg.getBoolean("startMdmSync") ?? false;

const toolRiskOverrides = cfg.getObject<string[]>("toolRiskOverrides") ?? [];
const triggerVersion = cfg.get("triggerVersion") ?? "v1";
const jsonOutput = cfg.getBoolean("jsonOutput") ?? true;

const envVars: Record<string, pulumi.Input<string>> = {
  THOTHCTL_BIN: thothctlBin,
  THOTH_GOVAPI_URL: govapiUrl,
  THOTH_TENANT_ID: tenantId,
  THOTH_ADMIN_BEARER_TOKEN_FILE: adminBearerTokenFile,
  THOTH_TIMEOUT_SECONDS: timeoutSeconds,
  THOTH_COMPLIANCE_PROFILE: complianceProfile,
  THOTH_SHADOW_LOW: shadowLow,
  THOTH_SHADOW_MEDIUM: shadowMedium,
  THOTH_SHADOW_HIGH: shadowHigh,
  THOTH_SHADOW_CRITICAL: shadowCritical,
  THOTH_WEBHOOK_URL: webhookUrl,
  THOTH_WEBHOOK_ENABLED: webhookEnabled,
  THOTH_TEST_WEBHOOK: String(testWebhook),
  THOTH_MDM_PROVIDER: mdmProvider,
  THOTH_MDM_NAME: mdmName,
  THOTH_MDM_ENABLED: mdmEnabled,
  THOTH_MDM_CONFIG_FILE: mdmConfigFile,
  THOTH_MDM_START_SYNC: String(startMdmSync),
  THOTH_JSON_OUTPUT: String(jsonOutput),
  THOTH_TOOL_RISK_OVERRIDES_CSV: toolRiskOverrides.join(","),
};

if (adminBearerToken) {
  envVars.THOTH_ADMIN_BEARER_TOKEN = adminBearerToken;
}
if (webhookSecret) {
  envVars.THOTH_WEBHOOK_SECRET = webhookSecret;
}

const bootstrap = new command.local.Command("thothctl-bootstrap", {
  create: `bash "${bootstrapScriptPath}"`,
  update: `bash "${bootstrapScriptPath}"`,
  environment: envVars,
  triggers: [
    tenantId,
    govapiUrl,
    complianceProfile,
    shadowLow,
    shadowMedium,
    shadowHigh,
    shadowCritical,
    webhookUrl,
    webhookEnabled,
    String(testWebhook),
    mdmProvider,
    mdmName,
    mdmEnabled,
    mdmConfigFile,
    String(startMdmSync),
    toolRiskOverrides.join(","),
    triggerVersion,
  ],
});

export const bootstrapStdout = bootstrap.stdout;
