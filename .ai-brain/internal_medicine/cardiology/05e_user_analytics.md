# User Analytics — Cardiology

> **Owner:** PM + Architect
> **Date:** 2026-07-22

---

## Event Taxonomy

| Event | Trigger | Properties |
|---|---|---|
| `cardio.station_opened` | User opens cardiology station | user_id, tenant_id, timestamp, device |
| `cardio.tab_switched` | Switches tab (echo/ecg/procedures/etc) | user_id, from_tab, to_tab, timestamp |
| `cardio.patient_viewed` | Opens patient detail | user_id, patient_id, role, timestamp |
| `cardio.echo_uploaded` | Echo DICOM uploaded | user_id, patient_id, study_type, file_size_mb, timestamp |
| `cardio.echo_signed` | Echo report signed | user_id, patient_id, signed_at, lvef |
| `cardio.procedure_scheduled` | Cath/PCI/etc scheduled | user_id, patient_id, procedure_type, scheduled_at |
| `cardio.procedure_completed` | Procedure completed | user_id, patient_id, duration_min, complications |
| `cardio.cds_query` | User runs CDS | user_id, query_type, score, acceptance, latency_ms |
| `cardio.cds_accepted` | User accepts CDS suggestion | user_id, suggestion_id, cds_type |
| `cardio.cds_overridden` | User overrides CDS | user_id, suggestion_id, override_reason |
| `cardio.cds_refused` | CDS refuses (out of scope) | user_id, query, refusal_reason |
| `cardio.inr_documented` | INR visit documented | user_id, patient_id, inr_value, dose_adjustment |
| `cardio.gdmt_started` | GDMT pillar initiated | user_id, patient_id, pillar (arni/bb/mra/sglt2i) |

## Funnels

### Funnel 1: STEMI Activation

```
[ER patient] → [ECG ordered] → [ECG interpreted] → [STEMI confirmed] → [Cath lab activated] → [Cardiologist paged] → [Patient in lab]
```

- Drop-off detection: where do STEMI cases fail?
- Target: <90 min door-to-balloon

### Funnel 2: Echo Workflow

```
[Order placed] → [Patient scheduled] → [Echo performed] → [Report uploaded] → [Cardiologist signs] → [Available in chart]
```

- Target: <24h from order to signed report

### Funnel 3: Anticoagulation Clinic

```
[INR due today] → [Patient arrives] → [INR drawn] → [Result entered] → [Dose adjusted] → [Next visit scheduled]
```

- Target: 90% of due INRs completed same-day

### Funnel 4: HF GDMT Optimization

```
[HFrEF patient identified] → [ARNI/ACE-i] → [Beta-blocker] → [MRA] → [SGLT2i] → [All 4 pillars on]
```

- Target: ≥70% of HFrEF patients on all 4 GDMT pillars

## Reports (weekly)

1. **STEMI Performance:** door-to-balloon time, % <90 min
2. **Echo Turnaround:** % within 24h
3. **Anticoag Compliance:** % INRs on schedule, % in therapeutic range
4. **GDMT Optimization:** % of HFrEF on all 4 pillars
5. **CDS Acceptance Rate:** by suggestion type
6. **Procedure Volume:** by type, by operator
7. **Cohort Insights:** new-onset AF, de novo HF, post-MI

## Data Storage

- Events: `analytics_events` table (append-only, RLS by tenant)
- Funnels: computed in Looker or similar
- Reports: nightly cron, emailed to clinical lead

## Privacy

- No PHI in events (only patient_id)
- Aggregated reports ≥11 patients (k-anonymity)
- Patient consent for analytics tracking (PDPL opt-in)

---

End of analytics spec.
