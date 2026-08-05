# OPHTH-001 — CI/CD Pipeline

```yaml
ci: [lint, typecheck, unit, integration, e2e, security, prompt-eval]
cd:
  staging:  auto-merge from integration/*
  production:  canary + SLO monitor
  rollback:    automatic on SLO breach
  feature_flag: required for new behavior
```

---

*Owner: DSL — 2026-08-01*
