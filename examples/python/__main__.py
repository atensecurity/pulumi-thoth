import pulumi
import pulumi_command as command

config = pulumi.Config()

tenant_id = config.require("tenantId")
govapi_url = config.require("govapiUrl")

admin_bearer_token = config.get_secret("adminBearerToken")
admin_bearer_token_file = config.get("adminBearerTokenFile") or ""

bootstrap_script_path = config.get("bootstrapScriptPath") or "../../scripts/thothctl_bootstrap.sh"
thothctl_bin = config.get("thothctlBin") or "thothctl"
timeout_seconds = config.get("timeoutSeconds") or "20"
compliance_profile = config.get("complianceProfile") or "soc2"
shadow_low = config.get("shadowLow") or "allow"
shadow_medium = config.get("shadowMedium") or "step_up"
shadow_high = config.get("shadowHigh") or "block"
shadow_critical = config.get("shadowCritical") or "block"

webhook_url = config.get("webhookUrl") or ""
webhook_secret = config.get_secret("webhookSecret")
webhook_enabled = config.get("webhookEnabled") or ""
test_webhook = config.get_bool("testWebhook")
if test_webhook is None:
    test_webhook = False

mdm_provider = config.get("mdmProvider") or ""
mdm_name = config.get("mdmName") or ""
mdm_enabled = config.get("mdmEnabled") or ""
mdm_config_file = config.get("mdmConfigFile") or ""
start_mdm_sync = config.get_bool("startMdmSync")
if start_mdm_sync is None:
    start_mdm_sync = False

json_output = config.get_bool("jsonOutput")
if json_output is None:
    json_output = True

tool_risk_overrides = config.get_object("toolRiskOverrides")
if tool_risk_overrides is None:
    tool_risk_overrides = []
trigger_version = config.get("triggerVersion") or "v1"

env_vars = {
    "THOTHCTL_BIN": thothctl_bin,
    "THOTH_GOVAPI_URL": govapi_url,
    "THOTH_TENANT_ID": tenant_id,
    "THOTH_ADMIN_BEARER_TOKEN_FILE": admin_bearer_token_file,
    "THOTH_TIMEOUT_SECONDS": timeout_seconds,
    "THOTH_COMPLIANCE_PROFILE": compliance_profile,
    "THOTH_SHADOW_LOW": shadow_low,
    "THOTH_SHADOW_MEDIUM": shadow_medium,
    "THOTH_SHADOW_HIGH": shadow_high,
    "THOTH_SHADOW_CRITICAL": shadow_critical,
    "THOTH_WEBHOOK_URL": webhook_url,
    "THOTH_WEBHOOK_ENABLED": webhook_enabled,
    "THOTH_TEST_WEBHOOK": str(test_webhook).lower(),
    "THOTH_MDM_PROVIDER": mdm_provider,
    "THOTH_MDM_NAME": mdm_name,
    "THOTH_MDM_ENABLED": mdm_enabled,
    "THOTH_MDM_CONFIG_FILE": mdm_config_file,
    "THOTH_MDM_START_SYNC": str(start_mdm_sync).lower(),
    "THOTH_JSON_OUTPUT": str(json_output).lower(),
    "THOTH_TOOL_RISK_OVERRIDES_CSV": ",".join(tool_risk_overrides),
}

if admin_bearer_token is not None:
    env_vars["THOTH_ADMIN_BEARER_TOKEN"] = admin_bearer_token
if webhook_secret is not None:
    env_vars["THOTH_WEBHOOK_SECRET"] = webhook_secret

bootstrap = command.local.Command(
    "thothctl-bootstrap",
    create=f'bash "{bootstrap_script_path}"',
    update=f'bash "{bootstrap_script_path}"',
    environment=env_vars,
    triggers=[
        tenant_id,
        govapi_url,
        compliance_profile,
        shadow_low,
        shadow_medium,
        shadow_high,
        shadow_critical,
        webhook_url,
        webhook_enabled,
        str(test_webhook).lower(),
        mdm_provider,
        mdm_name,
        mdm_enabled,
        mdm_config_file,
        str(start_mdm_sync).lower(),
        ",".join(tool_risk_overrides),
        trigger_version,
    ],
)

pulumi.export("bootstrapStdout", bootstrap.stdout)
