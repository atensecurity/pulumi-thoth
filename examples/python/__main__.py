import json
from pathlib import Path

import pulumi
import pulumi_thoth as thoth

config = pulumi.Config()

tenant_id = config.require("tenantId")
webhook_url = config.require("webhookUrl")
webhook_secret = config.require_secret("webhookSecret")
regulatory_regimes = config.get_object("regulatoryRegimes") or ["soc2"]
violation_id = config.get("violationId") or "vio-example-001"
requested_by = config.get("requestedBy") or "udev-example"
security_reviewer = config.get("securityReviewer") or "usec-example"

# Auth is resolved from THOTH_API_KEY (org-scoped).
provider = thoth.Provider(
    "thoth",
    tenant_id=tenant_id,
)

governance_settings = thoth.governance.GovernanceSettings(
    "baseline-governance",
    compliance_profile="soc2",
    regulatory_regimes=regulatory_regimes,
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

mcp_vendor_openai = thoth.mcp.Vendor(
    "mcp-openai",
    vendor_id="openai",
    display_name="OpenAI",
    approved=True,
    host_patterns=["api.openai.com", "*.openai.com"],
    source="manual",
    notes="Managed by pulumi-thoth example stack.",
    opts=pulumi.ResourceOptions(provider=provider),
)

policy_dir = Path(__file__).resolve().parent / "policies"

standard_dlp_opa = thoth.governance.PolicyBundle(
    "standard-dlp-opa",
    name="standard-dlp",
    description="Customer-agnostic purpose/sensitivity DLP baseline",
    framework="OPA",
    raw_policy=(policy_dir / "opa-standard-dlp.rego").read_text(encoding="utf-8"),
    enforcement_mode="enforce",
    opts=pulumi.ResourceOptions(provider=provider),
)

least_privilege_cedar = thoth.governance.PolicyBundle(
    "least-privilege-cedar",
    name="least-privilege-analyst",
    description="Least-privilege baseline for selected agents",
    framework="CEDAR",
    raw_policy=(policy_dir / "cedar-least-privilege-analyst.cedar").read_text(
        encoding="utf-8"
    ),
    assignments=["agent:security-analyst-agent", "agent:coding-agent"],
    enforcement_mode="enforce",
    opts=pulumi.ResourceOptions(provider=provider),
)

policy_exception = thoth.governance.PolicyException(
    "crm-export-exception",
    violation_id=violation_id,
    agent_id="crm-agent",
    tool_name="export_records",
    requested_by=requested_by,
    business_justification="Month-end reconciliation export workflow",
    frequency_estimate="weekly",
    data_sensitivity="financial",
    alternatives_considered="Manual export path is too slow",
    opts=pulumi.ResourceOptions(provider=provider),
)

policy_exception_review = thoth.governance.PolicyExceptionReview(
    "crm-export-exception-review",
    request_id=policy_exception.request_id,
    review_decision="approve",
    reviewed_by=security_reviewer,
    review_notes="Approved for controlled rollout using govapi apply channel.",
    owner="security-platform",
    target_environment="prod",
    opts=pulumi.ResourceOptions(provider=provider),
)

policy_change_apply = thoth.governance.PolicyChangeArtifactApply(
    "crm-export-exception-apply",
    request_id=policy_exception.request_id,
    applied_by=security_reviewer,
    apply_channel="govapi",
    policy_format="rego",
    bundle_name="exception-crm-export",
    bundle_description="Policy exception artifact promotion",
    assignments=["all"],
    enforcement_mode="enforce",
    status="active",
    opts=pulumi.ResourceOptions(
        provider=provider, depends_on=[policy_exception_review]
    ),
)

pulumi.export("tenant", governance_settings.tenant_id)
pulumi.export("mdmSyncJobId", mdm_sync.id)
pulumi.export("mcpVendorId", mcp_vendor_openai.vendor_id)
pulumi.export("policyExceptionRequestId", policy_exception.request_id)
pulumi.export("policyPatchApplyId", policy_change_apply.id)
pulumi.export(
    "policyBundleIds",
    {
        "standardDlpOpa": standard_dlp_opa.id,
        "leastPrivilegeCedar": least_privilege_cedar.id,
    },
)
