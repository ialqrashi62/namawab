#!/usr/bin/env bash
# deploy-blue-green.sh — Promote a new image tag using blue/green strategy.
# Usage: ./deploy-blue-green.sh v1.2.3

set -euo pipefail

TAG="${1:?image tag required}"
NS="${NS:-nama-prod}"
SERVICE_LABELS="${SERVICE_LABELS:-app.kubernetes.io/part-of=nama-platform}"

echo "[$(date -u +%FT%TZ)] Blue/Green deploy → tag=$TAG namespace=$NS"

# 1. Determine current color via service selector
CURRENT_COLOR=$(kubectl -n "$NS" get svc nama-portal-web -o jsonpath='{.spec.selector.color}')
NEW_COLOR=$([ "$CURRENT_COLOR" = "blue" ] && echo "green" || echo "blue")
echo "current=$CURRENT_COLOR  → new=$NEW_COLOR"

# 2. Apply Helm chart with new color + new image tag
helm upgrade --install nama-$NEW_COLOR ./charts/nama-platform \
  --namespace "$NS" \
  --set image.tag="$TAG" \
  --set color="$NEW_COLOR" \
  --atomic --wait --timeout 5m

# 3. Smoke test new color
NEW_HOST="$NEW_COLOR.api.nama.local"
if ! bash scripts/smoke.sh "https://$NEW_HOST"; then
  echo "Smoke FAILED on $NEW_COLOR. Rolling back."
  helm uninstall nama-$NEW_COLOR -n "$NS"
  exit 1
fi

# 4. Canary 10% traffic to new color via ingress weight
kubectl -n "$NS" annotate ingress nama-ingress \
  nginx.ingress.kubernetes.io/canary=true \
  nginx.ingress.kubernetes.io/canary-weight="10" \
  --overwrite

sleep 60

# 5. Monitor error rate during canary
ERR=$(curl -fsS "http://prometheus.nama.svc:9090/api/v1/query?query=sum(rate(http_requests_total{status=~\"5..\",color=\"$NEW_COLOR\"}[5m]))/sum(rate(http_requests_total{color=\"$NEW_COLOR\"}[5m]))" | jq -r '.data.result[0].value[1] // "0"')
echo "Error rate on canary: $ERR"
if (( $(echo "$ERR > 0.02" | bc -l) )); then
  echo "Error rate too high. Aborting + rollback."
  kubectl -n "$NS" annotate ingress nama-ingress nginx.ingress.kubernetes.io/canary-weight="0" --overwrite
  helm uninstall nama-$NEW_COLOR -n "$NS"
  exit 1
fi

# 6. Switch full traffic
kubectl -n "$NS" patch svc nama-portal-web -p "{\"spec\":{\"selector\":{\"color\":\"$NEW_COLOR\"}}}"
kubectl -n "$NS" patch svc nama-cardio-api -p "{\"spec\":{\"selector\":{\"color\":\"$NEW_COLOR\"}}}"
# ... patch each service

# 7. Decommission old color after 30 min stable
echo "Switched to $NEW_COLOR. Old color $CURRENT_COLOR will be removed in 30 min if stable."
nohup bash -c "sleep 1800 && helm uninstall nama-$CURRENT_COLOR -n $NS" >/dev/null 2>&1 &

echo "[$(date -u +%FT%TZ)] Deploy complete."
