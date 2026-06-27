# NamaMedical — Terraform root
# Provisions: Hetzner servers, networks, k3s cluster, DNS, object storage.

terraform {
  required_version = ">= 1.7"
  required_providers {
    hcloud     = { source = "hetznercloud/hcloud",  version = "~> 1.45" }
    cloudflare = { source = "cloudflare/cloudflare", version = "~> 4.30" }
    helm       = { source = "hashicorp/helm",        version = "~> 2.13" }
    kubernetes = { source = "hashicorp/kubernetes",  version = "~> 2.30" }
  }
  backend "s3" {
    bucket         = "nama-tfstate"
    key            = "infra/terraform.tfstate"
    region         = "eu-central-1"
    dynamodb_table = "nama-tfstate-lock"
    encrypt        = true
  }
}

provider "hcloud"     { token = var.hcloud_token }
provider "cloudflare" { api_token = var.cloudflare_token }

module "network" {
  source = "./modules/network"
  name   = var.env
}

module "k3s" {
  source         = "./modules/k3s-cluster"
  env            = var.env
  network_id     = module.network.id
  control_count  = var.env == "prod" ? 3 : 1
  worker_count   = var.env == "prod" ? 5 : 2
  worker_type    = var.env == "prod" ? "ax42-nvme" : "cx31"
  ssh_keys       = var.ssh_keys
}

module "dns" {
  source        = "./modules/dns"
  zone          = var.dns_zone
  ingress_ipv4  = module.k3s.ingress_ipv4
  ingress_ipv6  = module.k3s.ingress_ipv6
  records = {
    "api"     = "ingress"
    "portal"  = "ingress"
    "ed-board"= "ingress"
    "grafana" = "ingress"
  }
}

module "storage" {
  source     = "./modules/object-storage"
  endpoint   = var.minio_endpoint
  buckets    = ["nama-blobs","nama-backups","nama-tfstate"]
  immutability_days = { "nama-backups" = 30 }
}
