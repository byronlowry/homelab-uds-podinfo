# Copyright 2026 Defense Unicorns
# SPDX-License-Identifier: AGPL-3.0-or-later OR LicenseRef-Defense-Unicorns-Commercial

uds {
  bundle_api_version = "uds.dev/v1alpha1"
}

metadata {
  name        = "podinfo-test"
  description = "A UDS bundle for deploying Podinfo and its dependencies on a development cluster"
  version     = "dev"
}

package "podinfo" {
  source       = "../zarf-package-podinfo-${sys.arch}-dev.tar.zst"
  values_files = ["values/application.yaml"]

  # The test bundle consumes an unsigned package built from this checkout.
  signature_verification {
    verify = false
  }
}
