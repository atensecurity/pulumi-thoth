package version

import (
	"os"
	"strings"
	"testing"
)

func TestVersionNotDevInStrictReleaseMode(t *testing.T) {
	if os.Getenv("THOTH_PULUMI_RELEASE_STRICT_VERSION") != "1" {
		t.Skip("set THOTH_PULUMI_RELEASE_STRICT_VERSION=1 to enforce non-dev release version")
	}

	v := strings.TrimSpace(Version)
	if v == "" || v == "dev" {
		t.Fatalf("invalid release version %q: expected non-dev version injected via -ldflags", v)
	}
}
