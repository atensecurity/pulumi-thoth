import pulumi

config = pulumi.Config()
tenant_id = config.require("tenantId")
govapi_url = config.require("govapiUrl")

pulumi.export("tenantId", tenant_id)
pulumi.export("govapiUrl", govapi_url)
pulumi.export("note", "Provider scaffolding placeholder. Resources will be added in the provider repo.")
