# Infrastructure as Code

| Folder | Purpose |
|--------|---------|
| `terraform/` | Provisions Hetzner servers, networks, k3s, DNS, object storage |
| `kustomize/base/` | Shared K8s objects (namespace, default-deny netpol, quota, limits) |
| `kustomize/overlays/staging/` | Staging-specific patches (1 replica, DEBUG) |
| `kustomize/overlays/prod/` | Prod patches (3 replicas, WARN, autoscale 20) |

## Terraform usage
```bash
cd terraform
terraform init -backend-config="bucket=nama-tfstate"
terraform plan -var-file=envs/staging.tfvars
terraform apply -var-file=envs/staging.tfvars
```

## Kustomize usage
```bash
kubectl apply -k kustomize/overlays/staging
kubectl apply -k kustomize/overlays/prod   # behind manual approval
```

## State & secrets
- Terraform state in S3 with DynamoDB lock; encrypted.
- K8s secrets managed via External Secrets Operator + Vault.
- Cert-manager handles TLS with Let's Encrypt for non-mTLS endpoints.

## Compliance
- All resources tagged with `data-class=phi` and `compliance=pdpl,cbahi`.
- Backup buckets have **immutability 30d** to resist ransomware.
- KSA region pinning enforced via Terraform validations + provider config.

## DR
Run `terraform apply -var-file=envs/dr.tfvars` against the secondary region; promotes
the warm standby cluster.
