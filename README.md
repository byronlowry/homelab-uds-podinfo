# UDS Package Podinfo

This package deploys [Podinfo](oci://ghcr.io/stefanprodan/charts/podinfo) on [UDS Core](https://github.com/defenseunicorns/uds-core) through a UDS/Zarf package and a UDS Next bundle.

This repository is a personal training package that mirrors the UDS package
workflow used by application teams: pull-request validation, clean installation
and upgrade testing, immutable publication, and signed release verification.

## Prerequisites

This package requires a dedicated UDS cluster with Zarf init and UDS Core. It
must not be deployed to the existing Argo-managed `homelab` cluster. CI uses a
disposable UDS development cluster, and the persistent staging target uses the
separate `homelab-uds` kubeconfig context.

## Flavors

This package ships an `upstream` flavor by default. Add `registry1` or `unicorn` flavors as needed — see [`zarf.yaml`](./zarf.yaml).

## Configuration

See [configuration](./docs/configuration.md) for Zarf package values, defaults, and deploy-time overrides.

## Releases

Released packages are available in [GHCR](https://github.com/byronlowry/homelab-uds-podinfo/pkgs/container/podinfo).

### Verify a Package

Packages are signed using [Zarf's Keyless Signing](https://docs.zarf.dev/ref/package-signing/#using-keyless-signing).

To verify a package, follow the below example:

```bash
uds zarf package verify "oci://ghcr.io/byronlowry/podinfo:6.9.2-uds.0-upstream" \
  --certificate-identity "https://github.com/byronlowry/homelab-uds-podinfo/.github/workflows/release.yaml@refs/heads/main" \
  --certificate-oidc-issuer "https://token.actions.githubusercontent.com"
```

## Local development

Requires [UDS CLI](https://github.com/defenseunicorns/uds-cli?tab=readme-ov-file#install) v0.40.0 or newer.
See the [UDS CLI Next documentation](https://docs.defenseunicorns.com/cli/v0-40/reference/next-mode/) for usage and configuration.

```bash
uds run default     # spin up a local k3d cluster, build, and deploy
uds run dev         # iterate on an existing cluster
uds run --list      # show all available tasks
```

## Tests

Run `uds run test:all` to check health, ingress, and browser behavior. Browser tests
default to Docker with Chromium and Firefox. See [Playwright testing](./docs/playwright-testing.md) for
runner, browser, and Playwright version configuration.

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).
