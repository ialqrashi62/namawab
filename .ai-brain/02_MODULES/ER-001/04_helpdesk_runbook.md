---
module_id: ER-001
section: 08_operations
template_ref: TPL:DEPT
generated: 2026-07-23
---

# ER-001 Helpdesk Runbook (L1 / L2 / L3)

## L1 Support (Helpdesk — first-line)

### Common Issues + Resolution

| Issue | L1 Resolution | Escalate to L2 if |
|-------|---------------|-------------------|
| **Cannot login** | Verify username + password, check caps lock, try password reset | MFA not working, account locked |
| **Forgot password** | Initiate self-service password reset (link via email) | Email not received after 30 min |
| **MFA not working** | Verify time sync on device, try recovery code | Recovery code lost |
| **Page loads slowly** | Check network, try refresh, try different browser | Issue persists >5 min |
| **Cannot find patient** | Verify MRN + name spelling, check search filters | Patient not in system |
| **Triage submission fails** | Check required fields, refresh page | Server error 5xx |
| **Drug allergy alert not showing** | Verify allergy in patient chart | Documented but not appearing |
| **Code activation not paging** | Verify code type, check paging system status | All codes fail to page |
| **Cannot see encounter** | Verify tenant context, check filters | Cross-tenant issue suspected |
| **i18n text in wrong language** | Change language in user settings | Persists after change |

### L1 Tools
- Helpdesk ticketing system (Zendesk / Freshdesk)
- User admin console (password reset, MFA reset)
- Status page (system health)
- Knowledge base (searchable)

### L1 SLA
- First response: <15 min
- Resolution: <2 hours for common issues
- Escalation to L2: if not resolved within 2 hours

---

## L2 Support (Application Support)

### Common Issues + Resolution

| Issue | L2 Resolution | Escalate to L3 if |
|-------|---------------|-------------------|
| **Drug interaction alert not firing** | Check drug_interactions table, check interaction logic | Database corruption suspected |
| **Red flag detection missed** | Check AI model status, check red flag rules, check input data | Model failure, false negative |
| **Audit log missing entries** | Check audit middleware status, check DB write | Audit chain break detected |
| **Performance degradation** | Check DB indexes, check connection pool, check LLM latency | Sustained latency >2x baseline |
| **Code activation failure** | Check paging integration, check team list | Integration failure |
| **Cross-tenant data visibility** | RLS check, tenant context check, session check | Suspected RLS bypass |
| **Migration failure** | Check migration log, restore from backup if needed | Data corruption |
| **OAuth/JWT errors** | Check auth service, check token expiry, check tenant binding | Auth service down |
| **Drug database outdated** | Update drug_interactions table, re-index | API sync failure |
| **PHI exposed in logs** | PII redaction failure, escalate to security | Suspected data breach |
| **Backup/restore failure** | Check backup integrity, check restore path | Multiple backup failures |
| **CDN/cache issue** | Purge cache, check CDN config | Persistent CDN issue |

### L2 Tools
- Application logs (Loki / CloudWatch)
- Database tools (psql, pgAdmin, migration tools)
- Monitoring (Grafana, Datadog, New Relic)
- Code repository (Git)
- Admin tools (user management, tenant management)
- Security tools (audit log viewer)

### L2 SLA
- First response: <1 hour
- Resolution: <24 hours
- Escalation to L3: if not resolved within 24 hours

---

## L3 Support (Engineering / DevOps)

### Common Issues + Resolution

| Issue | L3 Action | Notes |
|-------|-----------|-------|
| **Database failure** | Failover to replica, restore from backup, debug root cause | Coordinate with DBA |
| **Application crash** | Check logs, redeploy, debug, fix, redeploy | Use canary / staged rollout |
| **Security incident** | Page security team, isolate affected systems, root cause, postmortem | Critical, immediate |
| **Performance issue (DB)** | EXPLAIN ANALYZE, check indexes, optimize queries, scale up | Coordinate with DBA |
| **Performance issue (app)** | Profile code, optimize hot paths, add caching, scale out | Use APM tools |
| **LLM provider issue** | Switch to fallback provider, queue requests, restore primary | Inform clinical users |
| **Integration failure (NPHIES)** | Check gateway, check credentials, retry, escalate to NPHIES | Coordinate with insurance team |
| **Integration failure (ZATCA)** | Check CSID validity, regenerate if needed | Owner action required |
| **Multi-region failure** | DNS failover, manual cutover, validate, postmortem | Owner action required |
| **RLS policy violation** | Immediate rollback, audit affected rows, fix policy, redeploy | Critical, security incident |
| **PHI breach (confirmed)** | Page DPO + CQO + security, notify patients, file with SDAIA, postmortem | Critical, regulatory |
| **Audit log chain break** | Identify break point, restore from backup, verify chain, document | Critical, compliance |
| **Data loss (DB)** | Restore from latest backup, PITR to last good state, validate | Critical, RPO applies |
| **Deployment rollback** | Revert to previous version, validate, postmortem | Use staging first |

### L3 Tools
- Kubernetes / Docker (deployment)
- Terraform / IaC (infrastructure)
- CI/CD pipeline (GitHub Actions / GitLab CI)
- Code debugger (node, browser)
- Database tools (psql, pgBackRest)
- Security tools (vulnerability scan, penetration test)
- PagerDuty / Opsgenie (on-call)
- Slack / MS Teams (war room)

### L3 SLA
- First response: <30 min
- Critical issues (down, breach): immediate
- Resolution: variable (depends on issue)
- Postmortem: required for all critical issues, within 5 business days

---

## On-Call Rotation

### Schedule
- **ED Module On-Call:** 1 engineer, 24/7 rotation
- **Database On-Call:** 1 DBA, 24/7 rotation
- **Security On-Call:** 1 security engineer, business hours + on-call for breach
- **Clinical Lead On-Call:** 1 MD, 24/7 rotation (for clinical issues only)

### Escalation Path
```
L1 (Helpdesk) → L2 (Application) → L3 (Engineering/DBA/Security)
                                       ↓
                          L4 (Owner + Executive Team) — for critical
```

### Page-out Criteria

| Severity | Definition | Page immediately | Examples |
|----------|-----------|------------------|----------|
| **SEV-1** | Production down, patient safety risk, PHI breach | YES (24/7) | DB down, RLS violation, breach |
| **SEV-2** | Significant degradation, workaround exists | YES (business hours) | Slow performance, missing features |
| **SEV-3** | Minor issue, no impact on operations | Next business day | UI bug, typo in label |
| **SEV-4** | Cosmetic, low priority | Weekly review | Color adjustment, formatting |

---

## Runbook Templates

### Incident: Triage Service Down
```
SEV-1 — Triage service unavailable

Impact:
- All ED encounters cannot be triaged
- Triage queue not loading
- Code activations failing

Steps:
1. Check service status: `kubectl get pods -n production -l app=triage`
2. Check recent deploys: `kubectl rollout history deployment/triage -n production`
3. Rollback if recent deploy: `kubectl rollout undo deployment/triage -n production`
4. Check DB connection: `psql -U nama_medical_app -d nama_medical -c "SELECT 1"`
5. Check LLM provider status (if AI features affected)
6. Notify ED charge nurse
7. Implement paper triage backup
8. Update status page
9. Postmortem within 5 business days
```

### Incident: Cross-Tenant Data Visibility
```
SEV-1 — RLS violation suspected

Impact:
- Potential PHI exposure
- Compliance violation
- Trust loss

Steps:
1. STOP: Immediately restrict user access
2. Verify: Run cross-tenant test cases
3. Identify: How many users + how many records?
4. Contain: Disable affected feature
5. Notify: DPO + CQO + Security + Owner
6. Document: All findings (screenshot, query, user IDs)
7. Fix: Patch RLS policy or middleware
8. Validate: Run all RLS tests
9. Restore: Enable feature after validation
10. Notify patients: if confirmed breach (per PDPL Art. 17)
11. File with SDAIA: within 72h (per PDPL)
12. Postmortem: within 5 business days
```

### Incident: Drug Safety Bypass
```
SEV-1 — Medication administered despite allergy

Impact:
- Patient safety (anaphylaxis risk)
- Compliance violation
- Audit failure

Steps:
1. STOP: Patient care priority
2. Treat: Manage allergic reaction per protocol
3. Document: Full timeline of events
4. Audit: Review all similar cases in last 24h
5. Identify: Root cause (algorithm? override? data?)
6. Fix: Patch safety check
7. Communicate: With patient + family
8. Report: Sentinel event per hospital policy
9. Update: System to prevent recurrence
10. Postmortem: within 5 business days
```

---

## Knowledge Base

### Common User Questions

**Q: How do I add a new allergy?**
A: Patient chart → Allergies tab → Add New → Enter drug + reaction → Save. The system will auto-check on next medication order.

**Q: Why is my code activation not paging?**
A: Verify the paging system is up. Check the team list (some team members may be off-shift). For high-priority codes, use backup communication (phone).

**Q: How do I view audit log?**
A: User menu → Audit (or contact admin for access if not visible).

**Q: Can I export patient data?**
A: Only authorized roles (CQO, admin) can export. All exports are logged.

**Q: Why is the AI suggesting a different ESI than my judgment?**
A: The AI is advisory. Trust your clinical judgment. You can override with reason. If you disagree often, contact CMIO for review.

---
*Section 08.d of ER-001. Owner: Ops + L1/L2/L3 teams. L4 validated.*
