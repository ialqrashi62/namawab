---
module_id: ER-001
section: 04_devops
template_ref: TPL:DEPT
generated: 2026-07-23
---

# ER-001 CI/CD Runbook + PM2

## File: `ops/live_deploy/er_module_runbook.md`

## 1. CI/CD Pipeline

### Stage 1: Static Analysis
```bash
# Run all static checks
cd namaweb
node --check er_engine.js                    # syntax
node --check er_routes.js
node --check er_engine_test.js
npx eslint er_engine.js er_routes.js        # lint
npx prettier --check er_engine.js
```

### Stage 2: Unit Tests
```bash
# Run unit tests
node er_engine_test.js
# Expected: 50+ tests, all PASS
```

### Stage 3: Integration Tests
```bash
# Run integration tests (requires staging DB)
node er_integration_test.js --env=staging
# Covers: cross-tenant, RLS, audit log, drug safety
```

### Stage 4: Security Scan
```bash
# SAST
snyk test --file=namaweb/er_engine.js
snyk test --file=namaweb/er_routes.js
# Secret scan
trufflehog filesystem namaweb/er_*.js
# Container scan
trivy image namamedical/er-service:latest
```

### Stage 5: Build
```bash
# Build Docker image
docker build -t namamedical/er-service:$BUILD_TAG \
  -f namaweb/Dockerfile.er \
  namaweb/
```

### Stage 6: Push
```bash
docker push namamedical/er-service:$BUILD_TAG
```

### Stage 7: Deploy Staging
```bash
# Update k8s manifest
kubectl set image deployment/er-service \
  er-service=namamedical/er-service:$BUILD_TAG \
  -n staging
kubectl rollout status deployment/er-service -n staging
```

### Stage 8: Smoke Test
```bash
# Run smoke test
node er_smoke_test.js --env=staging
# Tests: triage, code activation, medication, disposition
```

### Stage 9: Deploy Production (manual approval)
```bash
# After staging passes + owner approval
kubectl set image deployment/er-service \
  er-service=namamedical/er-service:$BUILD_TAG \
  -n production
kubectl rollout status deployment/er-service -n production
```

## 2. PM2 Configuration (if not using k8s)

```javascript
// namaweb/ecosystem.config.js (er-service)
module.exports = {
  apps: [
    {
      name: 'nama-medical-erp-er',
      script: 'er_routes.js',
      instances: 3,
      exec_mode: 'cluster',
      max_memory_restart: '2G',
      env: {
        NODE_ENV: 'production',
        PORT: 3001,
        SERVICE_NAME: 'er-service',
        DATABASE_URL: process.env.DATABASE_URL,
        REDIS_URL: process.env.REDIS_URL,
        LLM_API_KEY: process.env.LLM_API_KEY,
      },
      error_file: '/var/log/namaweb/er-error.log',
      out_file: '/var/log/namaweb/er-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
    },
  ],
};
```

## 3. Kubernetes Manifest

```yaml
# k8s/er-service.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: er-service
  namespace: production
  labels:
    app: er-service
    module: ER-001
spec:
  replicas: 3
  selector:
    matchLabels:
      app: er-service
  template:
    metadata:
      labels:
        app: er-service
        module: ER-001
    spec:
      containers:
        - name: er-service
          image: namamedical/er-service:latest
          ports:
            - containerPort: 3001
          env:
            - name: NODE_ENV
              value: production
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: er-secrets
                  key: database-url
            - name: REDIS_URL
              valueFrom:
                secretKeyRef:
                  name: er-secrets
                  key: redis-url
            - name: LLM_API_KEY
              valueFrom:
                secretKeyRef:
                  name: er-secrets
                  key: llm-api-key
          resources:
            requests:
              cpu: 500m
              memory: 1Gi
            limits:
              cpu: 2000m
              memory: 4Gi
          livenessProbe:
            httpGet:
              path: /health
              port: 3001
            initialDelaySeconds: 30
            periodSeconds: 10
            failureThreshold: 3
          readinessProbe:
            httpGet:
              path: /ready
              port: 3001
            initialDelaySeconds: 5
            periodSeconds: 5
            failureThreshold: 3
          securityContext:
            runAsNonRoot: true
            readOnlyRootFilesystem: true
            allowPrivilegeEscalation: false
            capabilities:
              drop: [ALL]
            seccompProfile:
              type: RuntimeDefault
      securityContext:
        runAsNonRoot: true
        fsGroup: 1000
---
apiVersion: v1
kind: Service
metadata:
  name: er-service
  namespace: production
spec:
  selector:
    app: er-service
  ports:
    - port: 80
      targetPort: 3001
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: er-service
  namespace: production
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: er-service
  minReplicas: 3
  maxReplicas: 20
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
    - type: Resource
      resource:
        name: memory
        target:
          type: Utilization
          averageUtilization: 80
```

## 4. Migration Runbook

### Pre-Migration Checklist
- [ ] Database backup completed (`pg_dump` to S3)
- [ ] DR snapshot confirmed
- [ ] Downtime window scheduled (off-hours preferred)
- [ ] Owner approval received (AGENTS.md §2.4)
- [ ] Migration file reviewed by SA + DSL
- [ ] Validation script tested in staging

### Migration Steps
```bash
# 1. Backup database
cd /var/www/namaweb
./backup_nama_medical.sh

# 2. Apply migration
psql -U nama_medical_app -d nama_medical -f namaweb/migrations/e100_er_module_up.sql

# 3. Validate
psql -U nama_medical_app -d nama_medical -f namaweb/migrations/e100_er_module_validate.sql

# 4. Check FORCE_RLS count
psql -U nama_medical_app -d nama_medical -c "SELECT COUNT(*) FROM pg_class WHERE relrowsecurity = true AND relforcerowsecurity = true;"

# 5. Restart service
pm2 reload nama-medical-erp
# OR
kubectl rollout restart deployment/er-service -n production

# 6. Smoke test
node er_smoke_test.js --env=production

# 7. Monitor
tail -f /var/log/namaweb/er-error.log
```

### Rollback (if validation fails)
```bash
# Only for dev/staging — production uses PITR
psql -U nama_medical_app -d nama_medical -f namaweb/migrations/e100_er_module_down.sql
```

## 5. Monitoring & Alerts

### Key Metrics
- Request rate (per minute)
- Error rate (%)
- p99 latency (ms)
- Triage accuracy (RN vs AI)
- Red flag miss rate
- Drug safety block rate
- Code activation rate
- Patient throughput

### Alerts
- Triage agent p99 > 5s for 5m → page
- Drug safety bypass attempt → page (security)
- Cross-tenant RLS violation attempt → page (security)
- Audit log chain break → page (CQO + DSL)
- DB connection pool > 80% → alert

## 6. Disaster Recovery

### RPO: <1 hour
- Continuous WAL archiving to S3
- Hourly base backups

### RTO: <4 hours
- Cross-region replication
- DNS failover (Route53 + health check)
- DB promotion (read replica → primary)
- App redeploy from container registry

### DR Drill (Quarterly)
1. Spin up DR environment in different region
2. Restore from latest backup
3. Apply WAL archive up to T-1h
4. Verify data integrity
5. Run smoke tests
6. Failover DNS
7. Monitor for 1 hour
8. Failback to primary
9. Document lessons learned

---
*Section 04.c of ER-001. Owner: DSL. L4 validated.*
