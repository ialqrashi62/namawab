---
id: GO-TO-MARKET
version: 1.0
date: 2026-08-01
owner: PM
status: ACTIVE
---

# Go-to-Market Strategy

> **Purpose:** Multi-tenant SaaS product launch strategy in KSA + GCC.

---

## 1. Market positioning

**vs Epic / Cerner / MEDITECH**:
- ✅ Native compliance (PDPL, NPHIES, ZATCA, SFDA, CBAHI)
- ✅ Cheaper (50-70% less)
- ✅ Cloud-native multi-tenant SaaS
- ✅ AI-first (specialty-tuned)
- ✅ Faster time-to-value (weeks, not years)
- ✅ Arabic-first

**vs Allscripts / athena**:
- ✅ Full hospital scope (not just ambulatory)
- ✅ Better support for Arabic workflows

**vs Dedalus / TrakCare**:
- ✅ Modern UX
- ✅ Faster deployment
- ✅ Built-in AI

---

## 2. Buyer personas

| Persona | Title | Pain |
|---------|-------|------|
| **CMO** | Chief Medical Officer | clinician burnout, inaccurate AI |
| **CIO** | Chief Information Officer | integration nightmare, cost |
| **CFO** | Chief Financial Officer | ROI unclear, billing errors |
| **Compliance Officer** | Risk Manager | PDPL/NPHIES/CBAHI complexity |
| **Department head** | Cardio/ER head | specialty decision support |
| **Patient** | Saudi patient | digital experience |

---

## 3. Sales motion

1. **Inbound**: SEO + LinkedIn + Saudi health conferences
2. **Outbound**: targeted private hospitals (Tier-1 in KSA)
3. **Pilot**: 3-month with 1 dept, success criteria signed
4. **Rollout**: phased across 44 depts over 12 months
5. **Retention**: QBR + ongoing success

---

## 4. Pricing model

```yaml
pricing:
  model: per-bed per-month subscription
  tiers:
    starter:
      beds: 0-50
      usd_per_bed_per_month: 120
      features: [essential modules, support 8x5]
    professional:
      beds: 51-200
      usd_per_bed_per_month: 95
      features: [all modules, AI, support 24x7]
    enterprise:
      beds: 200+
      usd_per_bed_per_month: 75
      features: [all + premium AI + custom + on-prem option]
  add_ons:
    ai_orchestrator_premium: 0.05 usd per prompt
    patient_portal_white_label: 5000 one-time
    telehealth_module: 2000/mo
    rag_plus_premium: 0.10 usd per query
  contract_min: 12 months
```

---

## 5. Channels

- Direct enterprise sales
- Channel partners (HIS integration consultants)
- Government partnerships (MOH tendering)
- Healthcare accelerators + incubators

---

## 6. Marketing materials

```
.marketing/
├── one_pager.pdf
├── pitch_deck.pdf
├── case_studies/
├── product_demo.mp4
├── integration_guides/
└── analyst_briefings/
```

---

## 7. Sales playbook

Sections:
1. Discovery (CNA — Current Needs Assessment)
2. Demo (specialty-tailored)
3. Pilot design
4. Pricing negotiation
5. Procurement
6. Implementation hand-off

---

## 8. KPIs

| Metric | Year 1 target |
|--------|---------------|
| Pilots signed | 10 |
| Hospitals converted | 4 |
| Beds under contract | 1500 |
| ARR | $2M |
| Patient portal MAU | 50K |
| AI prompts/day | 100K |

---

## 9. Compliance narrative (for buyers)

- **PDPL compliant by design**: consent mgmt, DPO support, breach notification
- **NPHIES native**: 15 bundles ready, claim engine
- **CBAHI/JCI evidence**: prebuilt dashboards for surveyors
- **ZATCA Phase 2**: ready (blocked on real CSID — see GATE 9)

---

## 10. File location

`.ai-brain/99-upgrade/22-gtm/`

```
├── one_pager.md
├── pitch_deck.md
├── pricing.yaml
├── sales_playbook.md
├── personas.md
├── competitors_comparison.md
└── case_studies/
    ├── hospital_1/
    └── hospital_2/
```

---

*Owner: PM — version 1.0 — 2026-08-01*
