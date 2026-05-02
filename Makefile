PROVIDER          := thoth
PROVIDER_BIN      := pulumi-resource-$(PROVIDER)
TFGEN_BIN         := pulumi-tfgen-$(PROVIDER)
VERSION           ?= 0.1.0
PROVIDER_DIR      := provider
RESOURCE_CMD_DIR  := $(PROVIDER_DIR)/cmd/pulumi-resource-$(PROVIDER)
SCHEMA_OUT_DIR    := $(RESOURCE_CMD_DIR)

.PHONY: build tfgen schema sdk clean test

build:
	cd $(PROVIDER_DIR) && \
		go build -ldflags "-X github.com/atensecurity/pulumi-thoth/provider/pkg/version.Version=$(VERSION)" \
		-o ../bin/$(PROVIDER_BIN) ./cmd/$(PROVIDER_BIN)

tfgen:
	cd $(PROVIDER_DIR) && \
		go build -ldflags "-X github.com/atensecurity/pulumi-thoth/provider/pkg/version.Version=$(VERSION)" \
		-o ../bin/$(TFGEN_BIN) ./cmd/$(TFGEN_BIN)

schema: tfgen
	./bin/$(TFGEN_BIN) schema --out $(SCHEMA_OUT_DIR)

sdk: tfgen
	./bin/$(TFGEN_BIN) dotnet --out sdk/dotnet
	./bin/$(TFGEN_BIN) go --out sdk/go
	./bin/$(TFGEN_BIN) nodejs --out sdk/nodejs
	./bin/$(TFGEN_BIN) python --out sdk/python

test:
	cd $(PROVIDER_DIR) && go test ./...

clean:
	rm -rf bin sdk provider/cmd/pulumi-resource-$(PROVIDER)/schema.json provider/cmd/pulumi-resource-$(PROVIDER)/bridge-metadata.json
