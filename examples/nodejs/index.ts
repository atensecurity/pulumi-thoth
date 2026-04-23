import * as pulumi from "@pulumi/pulumi";

const cfg = new pulumi.Config();
const tenantId = cfg.require("tenantId");
const govapiUrl = cfg.require("govapiUrl");

export const info = {
  tenantId,
  govapiUrl,
  note: "Provider scaffolding placeholder. Resources will be added in the provider repo.",
};
