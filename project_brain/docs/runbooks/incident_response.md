# Runbook — Incident Response (IR) — General
v1.0 — Owner: CISO + IR Team — Reviewed quarterly

## Severity matrix
| Sev | Definition | Examples | Pager | Public comm |
|-----|-----------|----------|-------|-------------|
| Sev1 | Patient safety / data breach / ransomware | wrong-patient action; PHI exfil | < 1 min | per playbook |
| Sev2 | Major service down for tier-1 | ED board offline; LIS unreachable | < 5 min | status page |
| Sev3 | Degraded service | slow API; AI worker queue lag | < 15 min | internal |
| Sev4 | Minor, no user impact | cosmetic, single-user | next business | none |

## IR roles (RACI)
- **Incident Commander (IC)**: owns the response; on-call CISO/Platform manager.
- **Tech Lead**: drives investigation/remediation.
- **Comms Lead**: status page + stakeholder updates.
- **Scribe**: records timeline, decisions, evidence.
- **Liaison**: clinical (CMO), legal, regulator, insurance.

## Lifecycle
1. **Detect** — alert, user report, threat intel.
2. **Triage** — assign severity, declare incident, page roles.
3. **Contain** — isolate, block, snapshot, revoke credentials.
4. **Eradicate** — remove root cause, patch, rotate keys/secrets.
5. **Recover** — restore service, monitor, validate.
6. **Lessons** — post-incident review (PIR) ≤ 14 d, CAPA, update runbooks.

## Common playbooks (in this directory)
- `ransomware_playbook.md`
- `phi_breach_playbook.md`
- `account_compromise.md` (template — to be added)
- `ddos.md` (template — to be added)
- `ai_misuse.md` (template — to be added)

## Comms templates
### Internal (Slack #incident)
```
[INC-2026-0042] [SEV1] [DECLARED]
Service: Lab API
Symptoms: 5xx 100% since 21:14
IC: @alice  TechLead: @bob  Scribe: @carol
Status page: posted (degraded)
Next update: 21:30
```

### Patient-facing status (status page)
```
2026-05-13 21:20 — Investigating: Lab results may be delayed.
2026-05-13 21:35 — Identified: temporary database failover in progress.
2026-05-13 21:55 — Resolved: services restored. Backlog clearing.
```

## Evidence handling
- Snapshots/memdumps stored in chain-of-custody bucket.
- Hash on capture; access logged; retained 1 y (longer if litigation).
- No editing of original artifacts; analysis on copies only.

## Regulatory clocks
- **PDPL breach affecting subjects**: notify SDAIA within **72 h**.
- **Notifiable communicable disease**: per IHR-2005 timelines.
- **SFDA medical-device adverse event**: per device class.
- **Civil Defense major incident**: per Sev1 declaration.

## After-action report (AAR) — template
- Incident ID, severity, dates/times.
- Detection source.
- Timeline (chronological actions).
- Root cause (5-Whys).
- Impact (users, patients, data).
- What went well / what didn't.
- Corrective actions (owner + due date).
- Preventive actions (process / tooling / training).
- Distribution (CISO, CMO, CTO, Quality, Board if Sev1).
