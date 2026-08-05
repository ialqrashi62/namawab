# 04 — Clinical Red Flags (PULM-001)

> **Owner:** CMO
> **Critical safety layer**

---

## A. Hard red flags (BLOCK outcome / escalate STAT)

| ID | Red Flag | Detection Rule | Escalation | Latency |
|----|----------|----------------|------------|---------|
| PULM-RF-001 | Tension pneumothorax | hypotension + decreased breath sounds + tracheal deviation | STAT needle decompression + page thoracic surgery + ICU | <1m |
| PULM-RF-002 | Massive PE | SBP<90 + HR>120 + SpO2<88 | STAT CTA + thrombolysis + ICU | <5m |
| PULM-RF-003 | Status asthmaticus | silent chest + exhausted + rising CO2 | STAT ICU + mag sulfate + vent prep | <5m |
| PULM-RF-004 | Massive hemoptysis | >100mL/24h or massive | STAT bronchoscopy + interventional radiology + ICU | <30m |
| PULM-RF-005 | Acute respiratory failure | PaO2<60 or PCO2>50 + acidosis | STAT ICU + NIV or intubation | <2m |
| PULM-RF-006 | Tracheal foreign body | acute stridor + aphonia | STAT ENT + rigid bronchoscopy | <10m |
| PULM-RF-007 | Anaphylaxis + bronchospasm | multi-system + SBP<90 + bronchospasm | STAT Epi + admit | <1m |
| PULM-RF-008 | Carbon monoxide poisoning | suspected + SpCO measured | STAT 100% O2 + HBOT consult | <10m |
| PULM-RF-009 | Acute inhalational lung injury | exposure + acute dyspnea | STAT tox + ICU | <10m |
| PULM-RF-010 | Severe OP toxicity (sedative + COPD) | RR<10 + CO2 high + obtundation | STAT reversal + NIV | <5m |

## B. Soft red flags (escalate high priority)

| ID | Red Flag | Detection | Action |
|----|----------|-----------|--------|
| PULM-RF-S01 | Severe uncontrolled asthma on home vent | ACT <15 + recent ED | Pulm consult + AR clinic |
| PULM-RF-S02 | Persistent hemoptysis >1wk | duration + volume | CTA + bronchoscopy |
| PULM-RF-S03 | HAP/VAP in ICU | new fever + infiltrate | ID consult + cultures |
| PULM-RF-S04 | Lung mass on imaging | size + risk | Multidisciplinary tumor board |
| PULM-RF-S05 | Suspected PE in pregnancy | tachycardia + dyspnea | D-dimer + duplex + CTA shielded |
| PULM-RF-S06 | OSA + driving (commercial) | AHI>30 | Counsel + report per traffic law |
| PULM-RF-S07 | ILD-FVC decline >10% in 6mo | recent PFTs | Antifibrotic + transplant eval |
| PULM-RF-S08 | OSA + resistant HTN | uncontrolled BP | CPAP trial |
| PULM-RF-S09 | Bronchiectasis + chronic Pseudomonas | culture+ | Inhaled antibiotic + airway clearance |
| PULM-RF-S10 | PH + syncope | WHO class IV | PH center referral |
| PULM-RF-S11 | Tracheostomy emergency | displaced + distress | Trach exchange + airway |
| PULM-RF-S12 | LTOT home + smoke alarm | home check | Education + home visit |

## C. Drug-related alerts (BLOCK if no override)

| ID | Drug + Context | Action |
|----|----------------|--------|
| PULM-DRUG-001 | Beta-blocker + severe asthma | BLOCK; if needed, use cardioselective + max 2.4mg bisoprolol |
| PULM-DRUG-002 | Sedative + severe COPD (CO2 retainer) | BLOCK; choose non-sedating |
| PULM-DRUG-003 | Opiate + OSA + obesity | BLOCK unless pain (use lowest, monitor capnography) |
| PULM-DRUG-004 | Aspirin + nasal polyps/asthma (Samter) | BLOCK; NSAID alternative or LTRA + desensitization |
| PULM-DRUG-005 | ACEi + angioedema history | BLOCK; ARB with caution |
| PULM-DRUG-006 | Nitrofurantoin + chronic use | monitor for ILD; stop if dyspnea |
| PULM-DRUG-007 | Amiodarone + ILD/risk | monitor PFTs + CXR; stop if decline |
| PULM-DRUG-008 | Bleomycin + high FiO2 | lower FiO2 limit; consult |
| PULM-DRUG-009 | MTX + ILD | baseline + monitoring PFTs |
| PULM-DRUG-010 | Statin + drug interaction with macrolides (CYP3A4) | hold statin during macrolide |

## D. Allergy & contraindication chains

| Allergen | Cross-reactivity check |
|----------|------------------------|
| Penicillin | All beta-lactams (check cephalosporin cross-reactivity) |
| Iodine (contrast) | shellfish + povidone-iodine; premedicate if needed |
| Latex | many devices; use latex-free kit |
| ASA | NSAIDs; LTRA alternative |
| Blue dye (methylene) | serotonin syndrome risk w/ SSRI |
| Talc | pleural sclerosing agent — note prior exposure |

## E. Rule outputs

Every clinical recommendation gets:

```json
{
  "red_flags": [
    {
      "id": "PULM-RF-002",
      "severity": "HARD",
      "description_ar": "جلطة رئوية ضخمة",
      "action_ar": "تصوير طبقي + إذابة فورية + عناية مركزة",
      "escalation": "ICU + cardiology",
      "sla_min": 5
    }
  ],
  "drug_alerts": [...],
  "override_allowed": false
}
```

## F. Override policy

HARD red flags = NO override. STAT escalation mandatory.

Soft red flags = provider can override with reason (audit-logged).

Drug alerts = provider can override with reason + alternative documented.

---

*Owner: CMO — version 1.0 — 2026-08-01*
