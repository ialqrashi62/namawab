# Runbook — Disaster Recovery (DR)
v1.0 — Owner: CTO + Platform Team — Tested quarterly

## RTO / RPO targets
| Tier | Service | RTO | RPO |
|------|---------|-----|-----|
| 1 (life-critical) | ED, ICU, Pharmacy, Lab, Blood Bank, AI ECG | 30 min | 15 min |
| 2 (clinical) | OPD, Surgery, Radiology, Nursing | 2 h | 30 min |
| 3 (admin) | HR, Finance (non-billing), Reports | 24 h | 4 h |

## DR site
- Primary: Hetzner DC1 (Falkenstein-equivalent KSA region)
- Secondary: Hetzner DC2 (KSA region)
- Backup vault: Immutable object store, 3rd KSA region

## Triggers
- Primary site network down > 15 min, OR
- Primary database unreachable > 10 min, OR
- Ransomware/intrusion confirmed at primary, OR
- Natural disaster declared by Civil Defense.

## Roles
- **DR Lead**: CTO (or delegate)
- **Comms Lead**: COO (status page + facility leadership)
- **Tech Lead**: Platform on-call
- **Clinical Liaison**: CMO designate (paper-fallback coordination)

## Phase 1 — Detection & Decision (0–10 min)
1. Pager fires (Sev1 alert from monitoring).
2. On-call assesses: scope, blast radius, ETA to recover in place.
3. If thresholds breached → declare DR; notify Comms Lead, CMO, CISO.
4. Switch facility to **paper-fallback workflow** for tier-1 services if needed
   (pre-printed kits per ward).

## Phase 2 — Failover (10–30 min for Tier 1)
1. **DNS**: switch CNAMEs to DR ingress (TTL 60s pre-set).
2. **Database**: promote DR replica (`scripts/dr-promote-mssql.sh`).
3. **Object storage**: rehydrate hot bucket from immutable copy if needed.
4. **K8s**: scale DR namespace to production replica counts.
5. **Vault**: ensure secrets reachable.
6. **Smoke tests**: `scripts/smoke.sh https://dr.nama.local`.
7. **Sign-off**: DR Lead announces "DR operational" via status page.

## Phase 3 — Stabilization (30 min – 4 h)
1. Bring up Tier 2 services per priority.
2. Reconcile any in-flight transactions (Saga rollback / replay).
3. Validate integrations (NPHIES, Wasfaty, PACS).
4. Bring up Tier 3 services.
5. Re-enable user access in waves.

## Phase 4 — Recovery to Primary
1. Repair primary site.
2. **Reverse replication** primary ← DR.
3. Verify lag = 0 over a sustained window.
4. Schedule maintenance window for cutback.
5. Failback DNS to primary.
6. Decommission emergency capacity.

## Communications
- Status page: status.nama.local
- Internal: Slack #incident + email distribution list
- External: per Comms Lead approval; never disclose PHI

## Documentation
- Incident timeline (every action timestamped)
- Decisions log
- Post-incident review within 14 days; CAPA created in QA system

## Practice & validation
- **Quarterly drill**: tabletop or partial failover for 1 service.
- **Annual drill**: full failover/failback.
- Metrics tracked: actual RTO/RPO vs target; gaps fed to risk register.
