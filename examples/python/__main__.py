import json

import pulumi
import atensecurity_thoth as thoth

config = pulumi.Config()

tenant_id = config.require("tenantId")
admin_bearer_token = config.require_secret("adminBearerToken")
webhook_url = config.require("webhookUrl")
webhook_secret = config.require_secret("webhookSecret")

provider = thoth.Provider(
    "thoth",
    tenant_id=tenant_id,
    admin_bearer_token=admin_bearer_token,
)

tenant_settings = thoth.governance.TenantSettings(
    "baseline",
    compliance_profile="soc2",
    shadow_low="allow",
    shadow_medium="step_up",
    shadow_high="block",
    shadow_critical="block",
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

pulumi.export("tenant", tenant_settings.tenant_id)
pulumi.export("mdmSyncJobId", mdm_sync.id)
