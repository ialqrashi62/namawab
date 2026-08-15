# User Manual — Stroke Center (TIER3_CARD-301_STROKE)

> **Audience**: Neurologists, ER physicians, stroke nurses
> **Version**: 1.0.0
> **Last updated**: 2026-08-15

---

## 1. Introduction

The NamaMedical Stroke Center provides comprehensive stroke care from arrival through 30-day follow-up. Supports all pathways per AHA/ASA 2019, CBAHI, and Saudi MoH 2024 standards.

## 2. Authorized Roles

| Role | Permissions |
|---|---|
| **Stroke Neurologist** | NIHSS assessment, thrombolysis decision, full recording |
| **ER Physician** | Code Stroke activation, initial NIHSS |
| **Stroke Nurse** | Vitals recording, drug preparation |
| **Interventional Neuroradiologist** | Thrombectomy + TICI recording |
| **Quality Coordinator** | Stats, GWTG-S data |
| **Admin** | Full access |

## 3. Daily Workflow

### 3.1 Code Stroke Activation

1. Navigate to **Sidebar → Stroke Center**
2. Click **🚨 Activate Code Stroke**
3. Enter "Last Known Well" datetime
4. Enter all 13 NIHSS sub-scores
5. Check contraindications
6. Enter weight, INR, platelets
7. Click **🚨 Activate Code Stroke**

### 3.2 Eligibility Check

System automatically calculates:
- NIHSS total (0-42)
- Thrombolysis eligibility
- Tenecteplase dose (0.25 mg/kg, max 25 mg)
- ⏱️ SLA alert (Door-to-Needle ≤ 60 min)

### 3.3 Treatment Recording

1. After drug administration, navigate to **Patient case → Treatment**
2. Enter:
   - Administration time
   - Final dose
   - Notes (if any)
   - Consent info (PDPL)
3. Click **Save**

### 3.4 30-Day Follow-up

1. At patient visit (30 days), navigate to **Follow-up**
2. Enter mRS score (0-6)
3. Check medication adherence
4. Click **Save**

## 4. SLA Targets

| Metric | Target |
|---|---|
| Door-to-CT | ≤ 25 min |
| Door-to-Needle | ≤ 60 min |
| Door-to-Groin | ≤ 90 min |
| Stroke Unit | Within 3 hours |
| 30-day Follow-up | ≥ 80% of patients |

## 5. FAQ

### Q: Tenecteplase vs Alteplase?
**A**: Tenecteplase (0.25 mg/kg single IV bolus) is the newer Saudi MoH 2024-approved alternative, with non-inferior efficacy and easier administration.

### Q: Patient arrives > 4.5h after TLKW?
**A**: May still be eligible for mechanical thrombectomy if LVO (within 6h) or with favorable perfusion imaging (6-24h).

### Q: Patient on anticoagulation?
**A**: Use reversal agents (Vitamin K, PCC, Idarucizumab, Andexanet). Per AHA/ASA 2019.

## 6. Common Mistakes

- ❌ Partial NIHSS (missing subscore)
- ❌ Not checking INR/platelets before thrombolysis
- ❌ Not recording TLKW accurately
- ❌ Forgetting post-thrombolysis monitoring

## 7. Support

- **Tech support**: support@namamedical.com
- **API docs**: https://jumanasoft.com/api/stroke/health
- **Emergency (KSA)**: 997
