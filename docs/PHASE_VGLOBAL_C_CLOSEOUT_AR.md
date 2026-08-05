# WAVE GGLOBAL-C Closeout — vGlobal.0

## Deliverables
| Mode | File | Status |
|---|---|---|
| G-12 K8s + ArgoCD | `deploy/k8s/deployment.yaml`, `deploy/argocd/app.yaml` | ✅ |
| G-13 CI/CD | `.github/workflows/deploy-prod.yml` | ✅ |
| G-14 Testing | `qa/ContractTest.js`, `qa/LoadTester.js` | ✅ |

## Smoke
```
PASS: 78 / 78
```
Added 3 tests for infra + CI + testing.

## Safety rails
- RAIL-3: K8s deployment is clean, no force-rollout.
- RAIL-4: Migration scripts have down-symmetry.
- RAIL-12: HPA scales only on CPU utilization.
