# HashiCorp Vault — STAGING/SANDBOX hardened config (NOT production).
# Loopback-only, version-pinned image, raft storage, TLS listener, audit enabled at runtime.
# Contains NO secrets/keys/tokens. Runtime sensitive material (TLS key, unseal keys, root
# token, raft data, audit log) lives OUTSIDE the repo in ~/vault_staging and is never committed.

ui = false
disable_mlock = false   # IPC_LOCK cap added at run; mlock protects secret memory (hardened)

storage "raft" {
  path    = "/vault/data"
  node_id = "nama-vault-staging-1"
}

listener "tcp" {
  address         = "0.0.0.0:8200"   # inside container only; published solely to 127.0.0.1 on host
  cluster_address = "0.0.0.0:8201"
  tls_cert_file   = "/vault/certs/vault.crt"
  tls_key_file    = "/vault/certs/vault.key"
  tls_min_version = "tls12"
}

api_addr     = "https://127.0.0.1:8200"
cluster_addr = "https://127.0.0.1:8201"
