import json

import pulumi
import pulumi_thoth as thoth

config = pulumi.Config()

tenant_id = config.require("tenantId")
webhook_url = config.require("webhookUrl")
webhook_secret = config.require_secret("webhookSecret")

# Auth is resolved from THOTH_API_KEY (org-scoped).
provider = thoth.Provider(
    "thoth",
    tenant_id=tenant_id,
)

governance_settings = thoth.governance.GovernanceSettings(
    "baseline-governance",
    compliance_profile="soc2",
    shadow_low="allow",
    shadow_medium="step_up",
    shadow_high="block",
    shadow_critical="block",
    opts=pulumi.ResourceOptions(provider=provider),
)

thoth.governance.WebhookSettings(
    "baseline-webhook",
    webhook_enabled=True,
    webhook_url=webhook_url,
    webhook_secret=webhook_secret,
    opts=pulumi.ResourceOptions(provider=provider),
)

mdm_provider = thoth.mdm.Provider(
    "jamf",
    provider_name="jamf",
    name="Jamf Pro",
    enabled=True,
    config_json=json.dumps(
        {
            "base_url": config.require("jamfBaseUrl"),
            "client_id": config.require("jamfClientId"),
            "client_secret": config.require_secret("jamfClientSecret"),
        }
    ),
    opts=pulumi.ResourceOptions(provider=provider),
)

mdm_sync = thoth.mdm.Sync(
    "jamf-sync",
    provider_name=mdm_provider.provider_name,
    wait_for_completion=True,
    timeout_seconds=180,
    opts=pulumi.ResourceOptions(provider=provider),
)

pulumi.export("tenant", governance_settings.tenant_id)
pulumi.export("mdmSyncJobId", mdm_sync.id)
