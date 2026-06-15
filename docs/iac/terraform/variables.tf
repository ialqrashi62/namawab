variable "env" {
  type        = string
  description = "Environment name: staging | prod"
  validation {
    condition     = contains(["staging", "prod"], var.env)
    error_message = "env must be staging or prod."
  }
}

variable "hcloud_token"     { type = string, sensitive = true }
variable "cloudflare_token" { type = string, sensitive = true }
variable "minio_endpoint"   { type = string }
variable "dns_zone"         { type = string }
variable "ssh_keys"         { type = list(string) }

variable "tags" {
  type    = map(string)
  default = {
    "owner"        = "platform"
    "data-class"   = "phi"
    "compliance"   = "pdpl,cbahi"
  }
}
