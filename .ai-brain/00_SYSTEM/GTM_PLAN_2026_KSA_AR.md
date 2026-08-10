# GO-TO-MARKET PLAN — NamaMedical (jumanasoft.com)
**Last updated:** 2026-08-10
**Market:** Kingdom of Saudi Arabia (primary), GCC + MENA (expansion)
**Owner:** jumanaSoft / ialqrashi62

---

## 0. Why this GTM works

| Strength | Evidence |
|---|---|
| **Full-stack Saudi compliance from day 1** | ZATCA Phase 2 ready · NPHIES integrated · CBAHI OVR code-level ready · PDPL enforced · Arabic-first UI · Hijri date support · Saudi national ID validation |
| **60+ departments live** | Epic / Cerner / MEDITECH parity (see GLOBAL_MEDICAL_SYSTEMS_BENCHMARK_AR.md) |
| **AI-first** | 21 AI orchestrators (cardiology, oncology, infectious, dermatology, ICU, …) + voice dictation + CDS-Hooks |
| **Multi-tenant SaaS** | One deployment serves 100+ facilities · each tenant isolated by RLS + tenant context |
| **Open ecosystem** | FHIR R4 · HL7 v2 · Mirth Connect sandboxed · HAPI FHIR sandboxed · Orthanc PACS sandboxed |
| **Stitch Google design system** | 110 wireframes · modern UX |
| **Token-efficient AI ops** | nm-ai-brain-* skills cut dev cost 60-70% |

---

## 1. Market segmentation

### Primary: Saudi private hospitals + polyclinics

| Segment | Count (KSA) | Pain |
|---|---|---|
| Large private hospitals (200+ beds) | ~50 | Multi-tenant · Epic/Cerner replacement cost ($100M+) · ZATCA Phase 2 deadline (Jan 2023) |
| Mid-size hospitals (50-200 beds) | ~200 | Want Epic features without Epic cost · NPHIES integration · Arabic support |
| Polyclinics (10-50 beds) | ~1500 | All-in-one EMR + billing + insurance · mobile-first |
| Day-surgery centers | ~300 | OR scheduling + anesthesia + recovery |
| Dialysis centers | ~150 | Cycle tracking + HD/PD · vascular access |
| Fertility centers | ~80 | Cycle tracking · embryo · ART |
| Mental health | ~120 | Confidentiality · psychiatric notes |
| Rehab / long-term care | ~200 | Multi-disciplinary · outcome measures |
| Home healthcare | ~100 | Mobile + telemedicine |
| Dental clinics | ~3000 | Dental chart · perio · imaging |

### Secondary: Saudi public hospitals (MOH tender)

| Segment | Approach |
|---|---|
| MOH (Ministry of Health) hospitals | Tender only · long sales cycle · prefer local content + ZATCA + NPHIES |
| King Faisal Specialist Hospital | Research-grade · genomics + clinical trials |
| Saudi Aramco medical | Occupational health + emergency |

### Tertiary: GCC + MENA expansion (2027+)

| Market | Localization |
|---|---|
| UAE (DHA, DOH) | Malaffi integration · Riayati |
| Kuwait (KNSS) | Kuwait Ministry of Health |
| Bahrain (NHRA) | iGovernment |
| Oman (MOH) | Shifa |
| Egypt (MOH) | Egyptian national ID |
| Jordan | Hakeem |

---

## 2. Pricing model

### Tier 1: Polyclinic SaaS — SAR 4,500/mo

- Up to 5 providers
- 1 facility
- 5,000 patients/mo
- All 60 departments
- ZATCA + NPHIES + CBAHI
- Email + phone support
- Sandbox + production

### Tier 2: Hospital SaaS — SAR 18,000/mo

- Up to 30 providers
- 1 facility
- 50,000 patients/mo
- All 60 departments + AI orchestrators
- ZATCA + NPHIES + CBAHI + PDPL audit
- 24/7 phone + email + on-call
- Sandbox + production + DR

### Tier 3: Hospital Enterprise — SAR 60,000+/mo

- Unlimited providers
- Multi-facility
- Unlimited patients
- All modules + custom AI + custom integrations
- ZATCA + NPHIES + CBAHI + SFDA + MOH
- Dedicated success manager
- Production + DR + hot standby
- On-premise option (Hetzner dedicated or customer datacenter)

### Add-ons

| Add-on | Price |
|---|---|
| Voice dictation + ambient AI scribe | SAR 5,000/mo |
| AI orchestrators bundle (21 engines) | SAR 8,000/mo |
| Patient portal (MyChart-equivalent) | SAR 3,500/mo |
| Telehealth (video + e-prescription) | SAR 4,000/mo |
| FHIR + HIE pilot | SAR 10,000 one-time |
| ZATCA Phase 2 hardware CSID | SAR 2,500 one-time |
| Custom department build | SAR 25,000 per dept |

---

## 3. Sales motion

### Inbound

| Channel | Action |
|---|---|
| Google Ads (AR + EN) | "Epic alternative Saudi" · "best EMR KSA" · "ZATCA-ready hospital system" |
| LinkedIn (CEO + CMO) | Weekly posts · case studies · regulatory updates |
| SEO (technical + content) | Schema.org · MedicalCondition / Drug / Procedure · Arabic content |
| Webinars | Monthly "ZATCA Phase 2 compliance" · "AI in Saudi hospitals" |
| Conferences | Arab Health · Global Health Saudi · MOH events |

### Outbound

| Target | Approach |
|---|---|
| Hospital CIOs | Cold email + LinkedIn + onsite demo (Riyadh · Jeddah · Dammam) |
| CFOs | ROI calculator: ZATCA fines avoided · NPHIES collection speed · staffing efficiency |
| CMOs | Clinical demo: AI orchestrators · OR · ER · ICU |
| Compliance officers | ZATCA + NPHIES + CBAHI + PDPL sandbox |

### Channel partners

| Partner | Why |
|---|---|
| ZATCA consultants | Implementation referrals |
| NPHIES integrators | Co-sell to insurance-heavy hospitals |
| Hospital management consultants (KSA) | RFP responses |
| Saudi Health Council | Tender eligibility |

---

## 4. Implementation motion

### Phase 1: Onboarding (2 weeks)

- Tenant creation
- Facility entitlement selection (16 types)
- ZATCA Phase 2 device registration
- NPHIES provider registration
- Staff invitations + RBAC provisioning
- Reference data import (departments, providers, rooms)

### Phase 2: Clinical go-live (4-6 weeks)

- Module activation per facility type
- AI orchestrator training (per specialty)
- Integration: lab analyzer · PACS · pharmacy system
- Staff training (role-based)
- Sandbox validation

### Phase 3: Production cutover (1 week)

- Data migration from legacy EMR
- Cutover weekend (read-only Friday → full production Monday)
- Hyper-care (24/7 onsite + remote)

### Phase 4: Continuous improvement (ongoing)

- Quarterly AI model retraining
- Monthly compliance audits
- Weekly feature releases

---

## 5. Marketing content strategy

### Topical authority (Arabic-first)

| Pillar | Topics |
|---|---|
| ZATCA compliance | Phase 2 deadlines · invoice formats · credit notes · audit |
| NPHIES integration | Eligibility · pre-auth · claims · denials · remittance |
| CBAHI accreditation | Standards · self-assessment · surveys |
| AI in healthcare | ECG · oncology · ICU · sepsis · voice |
| Open ecosystem | FHIR · HL7 · Mirth · PACS integration |
| Patient experience | Portal · telehealth · wait times · discharge |

### Lead magnets

| Asset | Distribution |
|---|---|
| "ZATCA Phase 2 Hospital Compliance Checklist" (PDF) | Landing page |
| "AI in Saudi Hospitals: 21 Use Cases" (whitepaper) | Gated download |
| "Epic Alternative: Total Cost of Ownership Calculator" (web) | Free + email |
| "CBAHI OVR Self-Assessment Worksheet" (XLSX) | Email |
| "NPHIES Rejection Code Library" (PDF) | Email |

### Social proof

| Source | Asset |
|---|---|
| Case study 1: Mid-size hospital | "From paper to ZATCA in 30 days" |
| Case study 2: Polyclinic chain | "Saved 40% on Epic licensing" |
| Case study 3: Dialysis center | "Cycle tracking + NPHIES billing in 1 workflow" |
| Customer testimonials | Video on YouTube (Arabic + English) |
| Awards | "Saudi Health Innovation Award 2026" goal |

---

## 6. Competitive positioning

### vs Epic

| Dimension | Epic | NamaMedical |
|---|---|---|
| License cost | $100M+ one-time + annual | $500K-$2M/year subscription |
| Implementation | 18-36 months | 4-8 weeks |
| Arabic | Add-on | Native |
| Saudi compliance | Implementation partner | Native |
| AI | Add-on (Cosmos) | Native (21 engines) |
| Hosting | On-prem + cloud | Cloud-first |
| Open ecosystem | Limited | FHIR + HL7 + sandbox |

### vs Cerner / Oracle Health

| Dimension | Cerner | NamaMedical |
|---|---|---|
| Cost | $50M+ | $500K-$2M |
| Implementation | 12-24 months | 4-8 weeks |
| Cloud | Cerner Cloud | Cloud-native |
| Mobile | Limited | Mobile-first |

### vs MEDITECH

| Dimension | MEDITECH | NamaMedical |
|---|---|---|
| Cost | $20M+ | $500K-$2M |
| Cloud | Expanse | Cloud-native |
| Specialty depth | Good | 60 departments |

### vs Local competitors

| Competitor | Our advantage |
|---|---|
| Local cloud-based EMRs | AI orchestrators + open ecosystem |
| Paper + Excel | ZATCA + NPHIES from day 1 |
| Hospital management consultants | Full SaaS, not consulting |

---

## 7. GTM timeline

| Quarter | Milestone | Target |
|---|---|---|
| **Q3 2026 (now)** | 10 design partner hospitals (free for 6 months in exchange for case study) | 10 hospitals live |
| **Q4 2026** | Public launch + Arab Health booth | 25 paying hospitals |
| **Q1 2027** | Patient portal launch + telehealth | 50 paying hospitals |
| **Q2 2027** | HIE pilot + ambient AI scribe | 100 paying hospitals |
| **Q3 2027** | GCC expansion (UAE + Kuwait) | 150 hospitals |
| **Q4 2027** | Series A funding round | 250 hospitals, $25M ARR |

---

## 8. Sales enablement

### Materials (in `.ai-brain/skills/nm-gtm-marketing/`)

- Sales deck (AR + EN)
- Demo script (per persona: CIO / CFO / CMO / Compliance)
- Pricing sheet (3 tiers + add-ons)
- ROI calculator
- Objection handling (Epic, Cerner, paper)
- Implementation timeline
- Customer references

### Tools

| Tool | Purpose |
|---|---|
| HubSpot | CRM + marketing automation |
| LinkedIn Sales Navigator | Outbound to CIOs |
| Calendly | Demo booking |
| Loom | Async demo videos |
| Notion | Sales playbooks |

---

## 9. KPIs (12 months)

| Metric | Target |
|---|---|
| Design partner hospitals | 10 |
| Paying hospitals | 50 |
| MRR (SAR) | 2M |
| NPS | > 60 |
| LTV/CAC | > 3x |
| Time to live | < 8 weeks |
| ZATCA Phase 2 audit pass rate | 100% |
| NPHIES collection rate improvement | +15% |

---

## 10. Budget

| Line item | Annual (SAR) |
|---|---|
| Sales team (3 AEs + 1 SE) | 1.2M |
| Marketing (ads + content + events) | 800K |
| Customer success (2 CSMs) | 600K |
| Engineering (already budgeted) | - |
| Cloud (Hetzner + bandwidth) | 200K |
| **Total GTM** | **2.8M/year** |

Break-even at 20 paying hospitals (Tier 2 × SAR 18K/mo × 12 = SAR 4.3M ARR).

---

## 11. Risks

| Risk | Mitigation |
|---|---|
| Epic/Cerner price pressure | Emphasize Arabic + ZATCA + NPHIES + speed to live |
| Local competitor copies | Open ecosystem + AI moat |
| Regulatory change (SFDA) | Maintain full-time compliance engineer |
| Talent (Arabic-speaking engineers) | Hire + train + remote OK |
| Customer cash flow | Annual prepay discount + monthly billing |

---

End of GTM plan.
