#!/usr/bin/env bash
# dr-dns-flip.sh — Flip CNAMEs to point to DR ingress.
# Used as part of DR runbook (docs/runbooks/disaster_recovery.md).

set -euo pipefail

CF_ZONE_ID="${CF_ZONE_ID:?required}"
CF_API="${CF_API:?required}"
DR_INGRESS_IPV4="${DR_INGRESS_IPV4:?required}"
DR_INGRESS_IPV6="${DR_INGRESS_IPV6:?required}"

RECORDS=("api.nama.local" "portal.nama.local" "ed-board.nama.local" "grafana.nama.local")

for HOST in "${RECORDS[@]}"; do
  REC_ID=$(curl -s -H "Authorization: Bearer $CF_API" \
    "https://api.cloudflare.com/client/v4/zones/$CF_ZONE_ID/dns_records?name=$HOST&type=A" \
    | jq -r '.result[0].id')

  echo "Flipping $HOST → $DR_INGRESS_IPV4"
  curl -s -X PUT -H "Authorization: Bearer $CF_API" -H "Content-Type: application/json" \
    "https://api.cloudflare.com/client/v4/zones/$CF_ZONE_ID/dns_records/$REC_ID" \
    -d "{\"type\":\"A\",\"name\":\"$HOST\",\"content\":\"$DR_INGRESS_IPV4\",\"ttl\":60,\"proxied\":true}" \
    >/dev/null
done

echo "DNS flipped. Note: TTL was pre-set to 60s; expect propagation < 2 min."
