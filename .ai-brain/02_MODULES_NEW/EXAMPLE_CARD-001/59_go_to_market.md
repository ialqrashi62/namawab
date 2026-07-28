# 59 — Go-to-Market (CARD-001)

> Owner: PM/UX + CQO · Tier 1

## Target segments

### Primary: Hospital cardiology departments

- **Type:** General hospitals, specialty hospitals, medical cities
- **Size:** 50+ beds, ≥ 1 cardiologist
- **Geography:** KSA primary, GCC secondary
- **Need:** EMR for cardiology, NPHIES integration, cath lab, device, co-pilot
- **Buyer:** Chief Medical Officer, Chief of Cardiology, Hospital IT Director
- **Decision:** Hospital procurement + IT + clinical leadership

### Secondary: Cardiology clinics

- **Type:** Specialty clinics, day-surgery centers
- **Size:** 1-5 cardiologists
- **Geography:** KSA cities
- **Need:** Outpatient EMR, ECG, echo, NPHIES
- **Buyer:** Clinic owner

### Tertiary: Telemedicine platforms

- **Type:** Tele-cardiology
- **Size:** 1-10 cardiologists
- **Need:** Tele-consult, AI co-pilot, ECG remote
- **Buyer:** Platform owner

## Value proposition

### For hospitals

- **Reduction in door-to-balloon time** (STEMI): currently 110-150 min, target < 90 min → lives saved
- **GDMT optimization rate** for HF: currently 40-60%, target > 80% → reduced readmission
- **NPHIES auto-submission** → reduced claim denial, faster cash
- **AI co-pilot** → junior doctor productivity +3x, senior doctor saved time
- **Compliance** (JCI, CBAHI, NPHIES, SFDA, PDPL) → audit + accreditation

### For clinics

- **Outpatient workflow** → faster patient throughput
- **NPHIES e-prescription** → no paper Rx
- **Tele-cardiology** → remote patients

### For telemedicine

- **AI co-pilot** → reduce senior doctor time per consult
- **ECG remote** → no need for on-site cardiologist

## Pricing model

| Tier | Monthly (SAR) | Includes | Limits |
|------|---------------|----------|--------|
| **Starter** | 2,000 | 1 clinic, 5 doctors, 100 patients/month, 1K LLM calls/month | 1 facility |
| **Pro** | 8,000 | 1 hospital, 20 doctors, 1K patients/month, 10K LLM calls/month | 1 facility, 1 cath lab |
| **Enterprise** | Custom | multi-facility, unlimited doctors, unlimited patients, custom LLM | unlimited |
| **Telemedicine** | 5,000 | 5 doctors, 500 tele-consults/month, 5K LLM calls/month | 1 platform |

## Sales cycle

| Stage | Duration | Owner |
|-------|----------|-------|
| Awareness | 1-2 months | Marketing |
| Consideration | 1-3 months | Sales + Product demo |
| Pilot | 1-3 months | Sales + Implementation |
| Decision | 1-2 months | Buyer + Committee |
| Onboarding | 1-3 months | Implementation + Training |
| **Total** | **6-12 months** | |

## Channels

- **Direct sales:** field reps
- **Partners:** medical equipment vendors (Philips, GE, Siemens, Medtronic, Abbott, Boston Sci)
- **Conferences:** Saudi Heart Association, MOH events, SCFHS
- **Digital:** LinkedIn, hospital networks
- **Referrals:** existing customers
- **Academic:** KFSH, KSU, KAU medical schools

## Enablement

- **Demo environment:** staging
- **Training:** 2-day on-site + virtual
- **Documentation:** 53_user_manual + 54_training_video_script
- **Support:** 24/7 (55_helpdesk_runbook)
- **Success manager:** for Enterprise tier

## KPIs

| KPI | Target (year 1) | Target (year 2) |
|-----|------------------|------------------|
| Pilots | 5 | 20 |
| Conversions | 2 | 10 |
| ARR (SAR) | 200,000 | 1,500,000 |
| Hospitals onboarded | 2 | 8 |
| Doctors on platform | 50 | 300 |
| Patients on platform | 5,000 | 50,000 |
| NPS | > 40 | > 50 |
| Churn | < 10% | < 5% |

## Competitive landscape

| Competitor | Strengths | Weaknesses | NamaMedical advantage |
|------------|-----------|------------|----------------------|
| Epic | mature, integrated | expensive, complex, English-only | AR + EN, NPHIES, cheaper |
| Cerner (Oracle Health) | mature | expensive, English | NPHIES, RLS, cheaper |
| local EMRs (e.g. CPHI) | local | limited cardiology | cardiology-specific, AI |
| niche cardiology (e.g. Sirona) | cardiology-specific | no NPHIES, no RLS | NPHIES + RLS + AI |
| in-house | custom | expensive long-term | off-the-shelf + customization |

## Risks

| Risk | Mitigation |
|------|------------|
| Hospital slow adoption | ROI calculator, MOH endorsement, JCI alignment |
| NPHIES API changes | dedicated integration team, test sandbox |
| LLM cost overrun | per-tenant cap, smaller models for non-critical |
| LLM hallucination | citation requirement, RAG grounding, reviewer, refusal |
| Competition (Epic, Cerner) | price advantage, AR + EN, faster implementation |
| Regulatory (PDPL, SFDA) | full compliance from day 1 |

## Roadmap

- **Q3 2026:** Tier-1 dept (Cardiology) + ER + OBG complete (in production)
- **Q4 2026:** All 100+ depts complete
- **Q1 2027:** First pilot hospital
- **Q2 2027:** 3 pilots, 1 conversion
- **Q3 2027:** 10 customers, ARR 1M SAR
- **Q4 2027:** 25 customers, ARR 3M SAR
- **2028:** GCC expansion (UAE, Bahrain, Kuwait)
