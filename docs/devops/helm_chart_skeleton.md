# NamaMedical — Helm Chart Skeleton (per service)

> Copy this to `charts/{service-name}/` and customize. Uniform across all 40 dept services.

## Directory layout
```
charts/{service-name}/
├── Chart.yaml
├── values.yaml
├── values-staging.yaml
├── values-prod.yaml
└── templates/
    ├── deployment.yaml
    ├── service.yaml
    ├── ingress.yaml
    ├── hpa.yaml
    ├── pdb.yaml
    ├── networkpolicy.yaml
    ├── servicemonitor.yaml      # prometheus-operator
    ├── configmap.yaml
    ├── secret-external.yaml     # external-secrets operator
    └── _helpers.tpl
```

## Chart.yaml
```yaml
apiVersion: v2
name: nama-cardio-api
description: NamaMedical Cardiology API
type: application
version: 1.0.0
appVersion: "1.0.0"
keywords: [namamedical, healthcare, cardiology]
maintainers:
  - name: NamaMedical Platform
    email: platform@nama.local
```

## values.yaml (defaults)
```yaml
image:
  repository: ghcr.io/nama/cardio-api
  tag: latest
  pullPolicy: IfNotPresent
imagePullSecrets:
  - name: ghcr-secret

replicaCount: 2

resources:
  requests: { cpu: 250m, memory: 512Mi }
  limits:   { cpu: 1000m, memory: 1Gi }

service:
  type: ClusterIP
  port: 8000

ingress:
  enabled: true
  className: nginx
  annotations:
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/configuration-snippet: |
      more_set_headers "Strict-Transport-Security: max-age=63072000";
  hosts:
    - host: cardio-api.nama.local
      paths: [{ path: /, pathType: Prefix }]
  tls:
    - secretName: cardio-api-tls
      hosts: [cardio-api.nama.local]

autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 10
  targetCPUUtilizationPercentage: 70
  targetMemoryUtilizationPercentage: 80

pdb:
  enabled: true
  minAvailable: 1

networkPolicy:
  enabled: true
  ingressFrom:
    - namespaceSelector: { matchLabels: { name: ingress-nginx } }
    - podSelector: { matchLabels: { app: ai-orchestrator } }
  egressTo:
    - dnsNames: [mssql.nama.svc.cluster.local, qdrant.nama.svc.cluster.local, redis.nama.svc.cluster.local]

probes:
  liveness:  { path: /health,  initialDelaySeconds: 20, periodSeconds: 15 }
  readiness: { path: /ready,   initialDelaySeconds: 5,  periodSeconds: 10 }
  startup:   { path: /health,  failureThreshold: 30, periodSeconds: 5 }

env:
  LOG_LEVEL: "INFO"
  PHI_REDACTION: "strict"
  AI_LANG_DEFAULT: "ar"
  CONFIDENCE_THRESHOLD: "0.7"

secretsExternal:
  enabled: true
  secretStoreRef: vault-backend
  data:
    - key: cardio/db_url
      target: DATABASE_URL
    - key: cardio/qdrant_api_key
      target: QDRANT_API_KEY
    - key: cardio/llm_key
      target: ANTHROPIC_API_KEY

serviceMonitor:
  enabled: true
  interval: 30s
  path: /metrics

podSecurityContext:
  runAsNonRoot: true
  runAsUser: 10001
  fsGroup: 10001
  seccompProfile: { type: RuntimeDefault }

securityContext:
  allowPrivilegeEscalation: false
  capabilities: { drop: ["ALL"] }
  readOnlyRootFilesystem: true

nodeSelector: {}
tolerations: []
affinity:
  podAntiAffinity:
    preferredDuringSchedulingIgnoredDuringExecution:
      - weight: 100
        podAffinityTerm:
          topologyKey: kubernetes.io/hostname
          labelSelector:
            matchLabels: { app: cardio-api }
```

## values-prod.yaml (overrides)
```yaml
replicaCount: 3
resources:
  requests: { cpu: 500m, memory: 1Gi }
  limits:   { cpu: 2000m, memory: 2Gi }
autoscaling:
  minReplicas: 3
  maxReplicas: 20
ingress:
  hosts:
    - host: cardio-api.prod.nama.local
      paths: [{ path: /, pathType: Prefix }]
  tls:
    - secretName: cardio-api-prod-tls
      hosts: [cardio-api.prod.nama.local]
env:
  LOG_LEVEL: "WARN"
```

## templates/deployment.yaml
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: {{ include "nama.fullname" . }}
  labels: {{- include "nama.labels" . | nindent 4 }}
spec:
  replicas: {{ .Values.replicaCount }}
  selector:
    matchLabels: {{- include "nama.selectorLabels" . | nindent 6 }}
  template:
    metadata:
      labels: {{- include "nama.selectorLabels" . | nindent 8 }}
      annotations:
        prometheus.io/scrape: "true"
        prometheus.io/port: "{{ .Values.service.port }}"
    spec:
      serviceAccountName: {{ include "nama.fullname" . }}
      securityContext: {{- toYaml .Values.podSecurityContext | nindent 8 }}
      containers:
        - name: app
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
          imagePullPolicy: {{ .Values.image.pullPolicy }}
          ports: [{ name: http, containerPort: {{ .Values.service.port }} }]
          envFrom:
            - configMapRef: { name: {{ include "nama.fullname" . }}-cfg }
            - secretRef:    { name: {{ include "nama.fullname" . }}-sec }
          resources: {{- toYaml .Values.resources | nindent 12 }}
          securityContext: {{- toYaml .Values.securityContext | nindent 12 }}
          livenessProbe:
            httpGet: { path: {{ .Values.probes.liveness.path }}, port: http }
            initialDelaySeconds: {{ .Values.probes.liveness.initialDelaySeconds }}
            periodSeconds: {{ .Values.probes.liveness.periodSeconds }}
          readinessProbe:
            httpGet: { path: {{ .Values.probes.readiness.path }}, port: http }
            initialDelaySeconds: {{ .Values.probes.readiness.initialDelaySeconds }}
            periodSeconds: {{ .Values.probes.readiness.periodSeconds }}
          volumeMounts:
            - name: tmp
              mountPath: /tmp
      volumes:
        - name: tmp
          emptyDir: {}
      nodeSelector: {{- toYaml .Values.nodeSelector | nindent 8 }}
      tolerations:  {{- toYaml .Values.tolerations  | nindent 8 }}
      affinity:     {{- toYaml .Values.affinity     | nindent 8 }}
```

## templates/networkpolicy.yaml (zero-trust default-deny + allowlist)
```yaml
{{- if .Values.networkPolicy.enabled }}
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: {{ include "nama.fullname" . }}
spec:
  podSelector:
    matchLabels: {{- include "nama.selectorLabels" . | nindent 6 }}
  policyTypes: [Ingress, Egress]
  ingress:
    - from: {{- toYaml .Values.networkPolicy.ingressFrom | nindent 8 }}
      ports: [{ protocol: TCP, port: {{ .Values.service.port }} }]
  egress:
    - to:
        - podSelector: { matchLabels: { component: dns } }
      ports: [{ protocol: UDP, port: 53 }]
    - to: {{- toYaml .Values.networkPolicy.egressTo | nindent 8 }}
{{- end }}
```

## Per-service variants (40 services)
- `nama-cardio-api`, `nama-pulm-api`, `nama-gi-api`, `nama-nephro-api`, `nama-onc-api`,
  `nama-endo-api`, `nama-rheum-api`, `nama-id-api`, `nama-derm-api`, `nama-surg-api`,
  `nama-cts-api`, `nama-neuro-api`, `nama-ortho-api`, `nama-ophth-api`, `nama-ent-api`,
  `nama-urol-api`, `nama-plastic-api`, `nama-obgyn-api`, `nama-neonate-api`, `nama-pedsub-api`,
  `nama-rad-api`, `nama-lab-api`, `nama-funcdx-api`, `nama-ed-api`, `nama-icu-api`,
  `nama-anes-api`, `nama-rehab-api`, `nama-radonc-pharm-api`, `nama-integrative-api`,
  `nama-nursing-api`, `nama-nutr-api`, `nama-social-api`, `nama-it-api`, `nama-safety-api`,
  `nama-exec-api`, `nama-qa-api`, `nama-edu-api`, `nama-hr-api`, `nama-coe-api`, `nama-rare-api`,
  `nama-ai-orchestrator`, `nama-portal-web`, `nama-board-sse`.

## Umbrella chart `charts/nama-platform/Chart.yaml`
```yaml
apiVersion: v2
name: nama-platform
type: application
version: 1.0.0
dependencies:
  - { name: nama-cardio-api, version: 1.0.0, repository: file://../nama-cardio-api }
  - { name: nama-ed-api,     version: 1.0.0, repository: file://../nama-ed-api }
  - ... # all services
```

## Smoke test script `scripts/smoke.sh`
```bash
#!/usr/bin/env bash
set -euo pipefail
BASE="${1:-http://localhost:8000}"
for svc in cardio ed icu rad lab obgyn ai; do
  curl -fsS "$BASE/api/v1/$svc/health" >/dev/null && echo "OK $svc" || { echo "FAIL $svc"; exit 1; }
done
```
