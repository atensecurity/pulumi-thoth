import * as pulumi from "@pulumi/pulumi";
import * as thoth from "@atensec/pulumi-thoth";

const cfg = new pulumi.Config();

const tenantId = cfg.require("tenantId");
const adminBearerToken = cfg.requireSecret("adminBearerToken");
const webhookUrl = cfg.require("webhookUrl");
const webhookSecret = cfg.requireSecret("webhookSecret");

const provider = new thoth.Provider("thoth", {
  tenantId,
  adminBearerToken,
});

const tenantSettings = new thoth.governance.TenantSettings(
  "baseline",
  {
    complianceProfile: "soc2",
    shadowLow: "allow",
    shadowMedium: "step_up",
    shadowHigh: "block",
    shadowCritical: "block",
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

export const tenant = tenantSettings.tenantId;
export const mdmSyncJobId = mdmSync.id;
