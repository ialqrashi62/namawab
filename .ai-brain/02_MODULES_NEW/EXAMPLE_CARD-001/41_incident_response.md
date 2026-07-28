# 41 — Incident Response (CARD-001)

> Owner: DSL · Tier 2

## Severity levels

| Level | Definition | Examples | Response time | Channel |
|-------|-----------|----------|---------------|---------|
| SEV-1 | Patient safety risk, data loss, security breach | Cross-tenant data leak, unauthorized PHI access, ransomware, LLM hallucination causing patient harm | < 15 min | PagerDuty + Owner + CMIO |
| SEV-2 | Service degradation, partial outage | API down for 1 specialty, payment fail, NPHIES down, LLM cost overrun | < 1 hour | PagerDuty + Slack |
| SEV-3 | Minor bug, no patient impact | UI bug, wrong calculation in non-critical view, single-route 500 | < 4 hours | Slack |
| SEV-4 | Cosmetic / nice-to-have | typo, slow query, design polish | Next sprint | Backlog |

## On-call

- Primary: DSL rotation
- Secondary: SA rotation
- Tertiary: AIE rotation (LLM-related)
- Owner: available for SEV-1/2

## Response procedure (5 phases)

### 1. Detect (T+0)

- Automated alert (monitoring)
- User report (helpdesk)
- Internal observation

### 2. Contain (T+0 to T+15)

Actions depend on incident type:

**Cross-tenant data leak:**
- [ ] Revoke affected sessions
- [ ] Block affected routes (feature flag)
- [ ] Snapshot DB state
- [ ] Notify owner + CMIO

**Server breach:**
- [ ] Isolate host (firewall block)
- [ ] Snapshot disk image
- [ ] Rotate all secrets
- [ ] Force logout all users

**Ransomware:**
- [ ] Isolate host immediately
- [ ] DO NOT power off (preserves memory)
- [ ] Notify cybersecurity insurance
- [ ] Activate DR

**LLM hallucination with patient harm:**
- [ ] Stop LLM endpoint
- [ ] Switch to manual review
- [ ] Identify affected encounters
- [ ] Notify CMIO + legal
- [ ] Trace all related queries

**Money/billing:**
- [ ] Pause all money routes (feature flag)
- [ ] Identify affected claims
- [ ] Reverse via NPHIES if possible

### 3. Eradicate (T+15 to T+2h)

- [ ] Remove malicious code (if breach)
- [ ] Patch CVE (if any)
- [ ] Rotate all secrets
- [ ] Apply config fix
- [ ] Verify no persistence

### 4. Recover (T+2h to T+24h)

- [ ] Restore from backup (if data loss)
- [ ] Redeploy from git (if code change)
- [ ] Verify with smoke tests
- [ ] Re-enable affected routes
- [ ] Communicate status to users

### 5. Post-mortem (T+48h)

- [ ] Root cause analysis (5 Whys)
- [ ] Timeline
- [ ] Impact assessment
- [ ] Remediation tasks (with owners)
- [ ] Lessons learned
- [ ] Update runbook
- [ ] Update monitoring
- [ ] Owner sign-off

## Communication

### Internal

- SEV-1: immediate Slack + PagerDuty + Owner phone
- SEV-2: Slack + PagerDuty
- SEV-3: Slack thread
- SEV-4: backlog comment

### External (users)

- SEV-1: status page + email within 1h
- SEV-2: status page within 4h
- SEV-3: status page weekly summary
- SEV-4: not communicated

### Regulatory (PDPL, SFDA, NPHIES)

- PDPL breach notification: within 72h if PHI leak
- NPHIES outage: within 24h via NPHIES portal
- SFDA: drug-related incidents per SFDA protocol
- CBAHI: hospital-level incidents per CBAHI protocol

## Tools

- **PagerDuty:** on-call paging
- **Slack:** #incidents channel
- **Status page:** status.jumanasoft.com (planned)
- **Confluence / GitHub:** post-mortem storage
- **Audit log:** root cause + impact
- **LLM traces:** hallucination investigation

## Pre-incident prep

- [ ] Runbooks reviewed quarterly
- [ ] On-call rotation published
- [ ] DR drill quarterly
- [ ] Tabletop exercise annually
- [ ] Insurance reviewed annually
- [ ] Contacts (legal, insurance, regulators) updated annually

## Example timeline (SEV-1 cross-tenant leak)

```
T+0:    Monitoring alert (cross-tenant access attempt)
T+5:    DSL acknowledges, starts investigation
T+10:   Confirmed: 1 patient record exposed to wrong tenant doctor
T+15:   Owner + CMIO notified
T+20:   Affected sessions revoked
T+30:   Affected route disabled (feature flag)
T+45:   Snapshot DB + audit log captured
T+2h:   Root cause identified (RLS policy missing on new table)
T+4h:   Fix deployed (RLS policy added + migration)
T+6h:   Audit verification: no other exposure
T+24h:  Affected patient + tenant notified (PDPL 72h deadline met)
T+48h:  Post-mortem published
T+72h:  PDPL notification submitted to authority
```

## Lessons learned (continuous)

Every SEV-1/2 must produce:
1. Concrete fix in code/config
2. Monitoring improvement
3. Runbook update
4. Training update (if relevant)
5. Compliance check (if PHI/NPHIES/SFDA)
