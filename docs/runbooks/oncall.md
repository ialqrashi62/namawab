# On-Call Runbook
v1.0 — Owner: Platform Engineering — All teams must follow

## Schedule
- Two rotations: **Primary** and **Secondary** weekly hand-off Monday 09:00 KSA.
- Tools: PagerDuty (paging), Slack #oncall (chat), Status page (public).

## When you go on-call
- [ ] Verify pager test: `pd test`.
- [ ] Confirm laptop charged + tethering plan.
- [ ] Review last week's incidents and open follow-ups.
- [ ] Check this runbook + service runbooks links below.

## Handover ritual (15 min Monday)
1. Outgoing summarizes open incidents, flapping alerts, ongoing changes.
2. Incoming repeats back; both confirm rotation switch in PagerDuty.
3. Post handover note in Slack #oncall.

## Pager response SLA
| Severity | Acknowledge | Engage | Public update |
|----------|-------------|--------|---------------|
| Sev1 | 5 min | 15 min | 15 min |
| Sev2 | 10 min | 30 min | 30 min |
| Sev3 | 30 min | 2 h | 2 h |

## First response checklist
1. Acknowledge the page.
2. Open #incident channel (`/incident new <title>`).
3. Triage: confirm signal, check related metrics/logs.
4. Decide severity; if Sev1/2, page IC + Comms + Tech Lead.
5. Apply mitigations from relevant playbook.
6. Update status page if user-impacting.
7. Communicate every 15 min until resolved.
8. After resolve, schedule PIR.

## Diagnostic shortcuts
```bash
# Cluster overview
kubectl get pods -A --sort-by=.status.startTime | tail
kubectl top nodes
kubectl get events -A --sort-by=.lastTimestamp | tail -50

# DB
sqlcmd -S mssql.nama -U app -P $DB_PW -Q "EXEC sp_who2"
sqlcmd -S mssql.nama -U app -P $DB_PW -Q "DBCC OPENTRAN"

# AI worker queue
redis-cli -h redis.nama LLEN ai:queue:cardio
redis-cli -h redis.nama LLEN ai:queue:rad

# Logs
logcli query '{namespace="nama",app="ed-api"} |= "ERROR"' --since=15m
```

## Common issues quick-fix
| Symptom | Likely cause | Quick fix |
|---------|--------------|----------|
| API 5xx spike | DB connection pool full | scale API ×2; increase pool; check long queries |
| AI p95 > 8s | LLM provider latency | failover to secondary endpoint via flag |
| ED board frozen | SSE pod OOM | restart pod; raise mem limit |
| ZATCA submit fail | cert expiry | rotate cert via vault; resubmit queue |
| Pager storm | flapping check | silence + investigate root |

## Escalation tree
1. Primary on-call → Secondary on-call (after 15 min no progress).
2. Secondary → Service Owner (Tech Lead).
3. Service Owner → Engineering Manager.
4. Manager → CTO (Sev1 only or > 60 min).
5. CTO → CEO (Sev1, public/regulatory exposure).

## Wellness
- Hand-off any active incident at end of shift.
- Sleep > 7 h before shift; alternate weekends fairly.
- Take TOIL after a Sev1 night; comp-time logged.
- Mental health support: EAP (G32).

## Post-shift
- Note any chronic alerts that need permanent fix; create issues.
- Update this runbook with anything you wished you'd known.
