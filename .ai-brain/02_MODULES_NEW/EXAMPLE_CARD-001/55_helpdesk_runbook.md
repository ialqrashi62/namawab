# 55 — Helpdesk Runbook (CARD-001)

> Owner: DSL + PM · Tier 2

## L1 — Helpdesk (front-line)

### Common questions

| Q | Answer | Escalate? |
|---|--------|-----------|
| "I forgot my password" | Reset via https://jumanasoft.com/reset | L2 if MFA broken |
| "MFA code not working" | Check device time sync; re-add MFA via admin | L2 if account locked |
| "I can't see my patient" | Check tenant + role; verify with admin | L2 if RLS issue |
| "ECG upload failed" | Check file size (<10MB) + format (PDF/PNG/DICOM) | L2 if server-side issue |
| "Co-pilot not responding" | Check status.jumanasoft.com; try again in 1 min | L2 if LLM service down |
| "Red flag page not received" | Check phone; verify on-call rotation; manual page if SEV-1 | L1 → SEV-1 if cardiac emergency |
| "NPHIES claim denied" | View reason; advise on appeal workflow | L2 if technical issue |
| "Audit log missing entry" | Check tenant + date; verify audit_middleware enabled | L2 if chain broken |

### L1 actions

- Password reset
- MFA re-sync
- User lookup
- Tenant verification
- Account unlock (after 24h)
- Status check
- Knowledge base navigation
- Ticket creation (L2)

### L1 escalation to L2

When:
- Technical issue (route 500, DB error)
- LLM/AI service down
- Cross-tenant data leak suspected
- Audit log integrity issue
- NPHIES service down
- Security incident
- Patient safety risk

## L2 — Tier 2 support (developer on-call)

### Tasks

- Restart PM2 process
- Check logs
- Verify health endpoints
- Check DB connection
- Check Redis
- Check LLM API
- Check NPHIES
- Re-run failed migrations
- Investigate cross-tenant reports
- Run smoke tests

### Common commands

```bash
# Check app status
pm2 list
pm2 logs nama-medical-erp --lines 100

# Check health
curl -k https://jumanasoft.com/healthz
curl -k https://jumanasoft.com/healthz/ready

# Check DB
PGPASSWORD=$PGPASSWORD psql -U nama_medical_app -d nama_medical_web -c "SELECT 1"

# Check Redis
redis-cli -u $REDIS_URL ping

# Check disk
df -h /opt/nama-medical
du -sh /opt/nama-medical/backups/*

# Check audit
PGPASSWORD=$PGPASSWORD psql -U nama_medical_app -d nama_medical_web -c "SELECT COUNT(*) FROM audit_log WHERE occurred_at > NOW() - INTERVAL '1 hour'"

# Check LLM
curl -X GET "https://api.openai.com/v1/models" -H "Authorization: Bearer $OPENAI_API_KEY"

# Restart app
pm2 reload nama-medical-erp

# Rollback (if needed)
cd /opt/nama-medical
./ops/live_deploy/restore_db.sh
git checkout <previous-tag>
pm2 reload nama-medical-erp
```

## L3 — Engineering escalation (DSL + SA + AIE)

When:
- Repeated L2 issue
- Security incident
- Performance degradation
- Data corruption
- LLM hallucination with patient impact
- Compliance violation

### L3 actions

- Code change (in branch + PR + review)
- Migration
- Rollback
- Security patch
- LLM prompt adjustment
- Vector index re-embed
- Backup restore
- Incident response (see 41_incident_response)

## L4 — Owner / Compliance

When:
- Cross-tenant data leak
- Regulatory breach (PDPL, SFDA, NPHIES)
- Patient harm
- Sentinel event
- Major security incident
- Legal action
- Press / public issue

### L4 actions

- Notify DPO + legal
- PDPL notification (within 72h)
- NPHIES notification
- SFDA notification (if drug/device)
- MOH/CBAHI notification
- Insurance claim
- Public statement (via PR)

## SLA targets

| Tier | Response | Resolution |
|------|----------|------------|
| L1 | 15 min | 4 hours |
| L2 | 30 min | 8 hours |
| L3 | 1 hour | 24 hours |
| L4 | 15 min | per incident |

## Ticketing

- Use Jira / Linear / equivalent
- Tag: cardiology, severity, tenant
- Link to commit / PR
- Audit linked

## Knowledge base

- Internal wiki: wiki.nama-medical
- FAQ: updated weekly
- Runbooks: this + 41_incident_response
- Training: see 53_user_manual + 54_training_video_script
