# NEPH-002 Part 2 — الملفات 16-35 (20 ملف)
$ErrorActionPreference = "Stop"
$root = "c:\Users\ice\Desktop\NMEDCALVSCODE\.ai-brain\02_MODULES_NEW\POC"
$banner = "<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->"
$UTF8 = [System.Text.UTF8Encoding]::new($false)
$count = 0
function WF($p,$c){$d=Split-Path $p -Parent;if(-not(Test-Path $d)){New-Item -ItemType Directory -Force -Path $d|Out-Null};[System.IO.File]::WriteAllText($p,$c,$UTF8);$script:count++}

# 16. training video
WF "$root\NEPH-002\02_training_video_script.md" @"
$banner
# NEPH-002 — Training Video Script (EN + AR)

## Episode 1: Living Donor Transplant (3 min)

### EN
**[0:00]** Welcome to the NamaMedical Renal Transplant Program.
**[0:15]** Today: Living donor kidney transplant journey.
**[0:30]** Step 1: Donor evaluation. ABO compat, age 18+, willing, no coercion. Independent living donor advocate (ILDA) meets separately.
**[1:00]** Step 2: Recipient evaluation. Cardiac, pulmonary, infection, malignancy, psychosocial, financial.
**[1:30]** Step 3: HLA typing (high-res NGS), crossmatch, cPRA.
**[2:00]** Step 4: MDT review (Nephrologist, Surgeon, Coordinator, Social Work, ID, Anesthesia).
**[2:30]** Step 5: Surgery day. Donor OR + Recipient OR simultaneously.
**[2:50]** Discharge Day 7. IS compliance, follow-up.

### AR
**[0:00]** مرحباً بكم في برنامج زراعة الكلى في نما الطبي.
**[0:30]** الخطوة 1: تقييم المتبرع. توافق فصيلة الدم، 18+ سنة، رغبة طوعية.
**[1:00]** الخطوة 2: تقييم المستقبل. قلب، رئة، عدوى، أورام، نفسي، مالي.
**[1:30]** الخطوة 3: فحوصات HLA والتطابق.
**[2:00]** الخطوة 4: لجنة متعددة التخصصات.
**[2:30]** الخطوة 5: يوم العملية. متبرع + مستقبل في نفس الوقت.
**[2:50]** خروج اليوم 7. الالتزام بالأدوية، المتابعة.

---
*Section 16 of NEPH-002. L1 DRAFT.*
"@

# 17. vector store
WF "$root\NEPH-002\02_vector_store_schema.md" @"
$banner
# NEPH-002 — Vector Store (PGVector 768d)

## Index
- Name: `transplant_clinical_corpus`
- Dim: 768
- Distance: cosine

## Tables
```sql
CREATE TABLE transplant_embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id),
  source_type VARCHAR(50),
  source_id VARCHAR(100),
  chunk_index INT,
  chunk_text TEXT,
  embedding vector(768),
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE transplant_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE transplant_embeddings FORCE ROW LEVEL SECURITY;
CREATE POLICY transplant_embeddings_tenant ON transplant_embeddings USING (tenant_id = current_setting('app.tenant_id')::UUID);
```

## Source Corpora
- KDIGO 2009/2020 (CKD + transplantation)
- Banff 2017/2019 (renal allograft pathology, transcriptomics 2022)
- OPTN/SRTR (US allocation, KDPI/EPTS, 1/5-yr survival)
- CST 2023 (Canadian)
- ERA-EDTA consensus (AMR/DSA)
- SCOT annual reports (Saudi-specific)
- SFDA labeling (IS, ATG, rituximab, eculizumab — REMS)
- Internal transplant protocol (de-identified)

## Chunking
- 512 tokens, 64 overlap, by section

## Hybrid
- Vector (0.5) + BM25 (0.3) + KG (0.2), Top-K=20→5

---
*Section 17 of NEPH-002. AIE voice. L1 DRAFT.*
"@

# 18. wireframes
WF "$root\NEPH-002\02_wireframes.md" @"
$banner
# NEPH-002 — Wireframes (8 screens)

## 1. Waitlist Dashboard
```
Active: 124 | Hold: 18 | Transplanted (90d): 8 | Removed: 2
Average wait time: 3.2 years
Priority scores: 24 high, 56 medium, 44 standard
```

## 2. Recipient Evaluation
- Patient header
- Cardiac workup status
- Pulmonary
- Infection (HBV, HCV, HIV, CMV, EBV, TB)
- Malignancy screening
- Psychosocial
- Financial
- MDT decision log

## 3. Donor Match Score
- Donor + recipient summary
- ABO compat ✓
- HLA MM: 2/6
- CDC XM: NEG
- Flow XM: NEG
- Virtual XM: NEG
- cPRA: 5%
- KDPI: 18%
- EPTS: 23%
- **Match score: 87/100 (Proceed)**

## 4. Transplant Procedure Form
- Recipient + donor
- Type (LRD/LURD/DD/PAIRED/ABOi)
- Cold/warm ischemia
- Vascular anastomosis time
- Ureteral stent
- Induction agent + dose
- Surgeon + anesthesia

## 5. IS Trough Monitoring
- Tacrolimus trough trend (line chart)
- Target range
- Alerts (out of range)
- Dose history

## 6. Biopsy Banff
- Light/IF/EM findings
- C4d score
- SV40 (BK)
- DSA
- AI suggestion: Borderline | IA | IB | IIA | IIB | III | CAAMR
- MD sign-off required

## 7. Long-term Follow-up
- Years post-tx: 5.2
- Cr: 1.3, eGFR: 60
- Comorbidities (HTN, DM)
- QoL score (KDQOL)
- Adherence: 95%
- Rehospitalizations YTD: 0
- Last biopsy: 2y ago (normal)
- Last DSA: 6mo ago (negative)

## 8. Paired Exchange Pool
- Incompatible pairs
- Computer match run output
- 2-way or 3-way swap suggestion
- All centers involved
- Schedule simultaneous surgeries

---
*Section 18 of NEPH-002. PM voice. L1 DRAFT.*
"@

# 19. e2e tests
WF "$root\NEPH-002\03_e2e_tests.md" @"
$banner
# NEPH-002 — E2E Tests (Gherkin)

```gherkin
Feature: Recipient evaluation
  Scenario: Add patient to waitlist
    Given a 38M with ESRD on HD for 4 years
    When evaluation complete
    And MDT approves
    Then patient added to waitlist

Feature: Donor match
  Scenario: Living donor match
    Given donor 42F and recipient 38M
    When ABO compat, HLA MM 2/6, crossmatch NEG
    Then match score 87 (proceed)

Feature: Positive CDC XM = absolute decline
  Scenario: Positive T-cell CDC
    Given donor and recipient with positive T-cell CDC
    When crossmatch reported
    Then decision = absolute_decline
    And no further transplant workup

Feature: Trough >20 = HARD BLOCK
  Scenario: Tacrolimus trough 22 ng/mL
    Given patient on tacrolimus 2 mg BID
    When trough measured 22 ng/mL
    Then dose hold + escalate to nephrologist
    And pharmacist blocked

Feature: Biopsy Banff + treatment
  Scenario: ACR IIA
    Given biopsy shows tubulitis (t2), intimal arteritis (v1)
    When pathology report received
    Then Banff grade IIA
    And treatment: rATG 1.5 mg/kg x 3-5 days
    And MD sign-off required

Feature: SCOT reporting
  Scenario: Transplant procedure
    Given transplant completed
    When procedure signed
    Then SCOT report filed within 7 days
    And national registry updated
"@

# 20. engine module
WF "$root\NEPH-002\03_engine_module.md" @"
$banner
# NEPH-002 — Pure JS Engine (transplant_engine.js)

```js
'use strict';

// 1. KDPI
function kdpiScore(age, height, weight, ethnicity, htn, dm, cod, hcv, dcd, scr, cmv) {
  let s = 0;
  if (age >= 50) s += 20; else if (age >= 40) s += 10;
  if (height < 160) s += 5;
  if (weight > 90) s += 5;
  if (htn) s += 15;
  if (dm) s += 20;
  if (cod === 'CVA') s += 10;
  if (hcv) s += 5;
  if (dcd) s += 5;
  if (scr > 1.5) s += 5;
  if (cmv) s += 2;
  return { score: Math.min(s, 100), band: s < 35 ? 'high_quality' : s < 85 ? 'standard' : 'marginal' };
}

// 2. EPTS
function eptsScore(age, dialysisYears, diabetes, priorTransplant) {
  let s = 0;
  if (age >= 60) s += 40; else if (age >= 50) s += 25; else if (age >= 40) s += 10;
  if (dialysisYears >= 3) s += 20; else if (dialysisYears >= 1) s += 10;
  if (diabetes) s += 20;
  if (priorTransplant > 0) s += 10;
  return { score: Math.min(s, 100) };
}

// 3. cPRA
function praCalculation(hlaAntibodies, populationFrequencies) {
  let cpra = 0;
  for (const ab of hlaAntibodies) {
    if (ab.mfi > 8000) cpra += 5;
    else if (ab.mfi > 3000) cpra += 2;
    else if (ab.mfi > 1000) cpra += 1;
  }
  return { cpra_pct: Math.min(cpra, 100) };
}

// 4. Crossmatch
function crossmatchInterpretation(cdcT, cdcB, flowT, flowB, vXM, dsa) {
  if (cdcT === 'POS') return { decision: 'absolute_decline', absolute_block: true, reason: 'Positive CDC T-cell XM' };
  if (cdcB === 'POS' && dsa.length > 0) return { decision: 'absolute_decline', absolute_block: true };
  if (dsa.length > 0 && dsa.some(d => d.mfi > 8000)) return { decision: 'desensitize', absolute_block: false };
  if (flowT > 100) return { decision: 'caution', absolute_block: false };
  return { decision: 'proceed', absolute_block: false };
}

// 5. Trough adjuster
function immunosuppressionTroughAdjuster(drug, dose, trough, targetLow, targetHigh, scr) {
  // HARD BLOCK: trough >20 = toxic
  if (trough > 20) {
    return { block: true, action: 'escalate_to_physician', recommendation: 'HOLD dose + check Scr + refer to transplant nephrologist URGENTLY' };
  }
  let newDose = dose;
  let recommendation = 'Continue current dose';
  if (trough < targetLow) {
    newDose = dose * 1.25;
    recommendation = 'Increase dose by 25%, recheck in 3-5 days';
  } else if (trough > targetHigh) {
    newDose = dose * 0.75;
    recommendation = 'Decrease dose by 25%, recheck in 3-5 days';
  }
  return { block: false, newDose, recommendation, action: 'continue_monitoring' };
}

// 6. Banff grade
function banffGrade(light, immunofluorescence, sv40, c4d) {
  const t = light.ti || 0, i = light.i || 0, v = light.v || 0, g = light.g || 0, ptc = light.ptc || 0;
  const cg = immunofluorescence.cg || 0;
  const isAMR = (c4d > 0 || cg > 0) && ptc > 0;
  if (isAMR && g > 0) return { category: 'CAAMR' };
  if (v === 3) return { category: 'III' };
  if (v === 2) return { category: 'IIB' };
  if (v === 1) return { category: 'IIA' };
  if (i === 3) return { category: 'IB' };
  if (i === 1 || i === 2) return { category: 'IA' };
  if (t === 1 || t === 2 || i === 0) return { category: 'Borderline' };
  return { category: 'IA' };
}

// 7. Rejection risk
function rejectionRiskScore(dsaTrajectory, egfrSlope, bkPcr, cmvPcr, adherence) {
  let risk = 5; // baseline
  if (dsaTrajectory === 'rising') risk += 30;
  if (egfrSlope < -10) risk += 25;
  if (bkPcr > 10000) risk += 20;
  if (cmvPcr > 1000) risk += 10;
  if (adherence < 90) risk += 15;
  return { risk_30d_pct: Math.min(risk, 95) };
}

// 8. Infection prophylaxis
function infectionProphylaxisChecker(timePostTxDays, isRegimen, serostatus) {
  const proph = {};
  // CMV
  if (serostatus.cmv === 'D+/R-') proph.cmv_prophylaxis = 'valganciclovir_3mo';
  else if (serostatus.cmv === 'R+') proph.cmv_prophylaxis = 'valganciclovir_optional';
  // PCP
  proph.pcp_prophylaxis = timePostTxDays <= 180 ? 'tmp_smx_6mo' : 'stop';
  // HSV
  if (serostatus.hsv === 'R+') proph.hsv_prophylaxis = 'acyclovir_3mo';
  // BK
  proph.bk_monitoring = 'monthly_first_year';
  // EBV
  proph.ebv_monitoring = 'q3mo';
  return proph;
}

// 9. Donor-recipient match
function donorRecipientMatchScore(cpra, dsa, epts, bloodType, kdpi, hlaMM, ageDelta) {
  if (dsa.length > 0 && dsa.some(d => d.mfi > 8000)) return { recommendation: 'desensitize' };
  if (cpra > 80) return { recommendation: 'paired_exchange' };
  if (hlaMM > 4) return { recommendation: 'caution' };
  return { recommendation: 'proceed' };
}

// 10. Graft survival projection
function graftSurvivalProjection(donorType, donorAge, recipientAge, hlaMM, induction, dsa) {
  let baseSurvival = donorType === 'LRD' ? 95 : 90;
  if (donorAge > 60) baseSurvival -= 3;
  if (recipientAge > 65) baseSurvival -= 2;
  if (hlaMM > 4) baseSurvival -= 2;
  if (dsa.length > 0) baseSurvival -= 5;
  return { survival_1yr_pct: Math.max(baseSurvival, 70) };
}

module.exports = {
  kdpiScore, eptsScore, praCalculation, crossmatchInterpretation,
  immunosuppressionTroughAdjuster, banffGrade, rejectionRiskScore,
  infectionProphylaxisChecker, donorRecipientMatchScore, graftSurvivalProjection
};
```

---
*Section 20 of NEPH-002. L1 DRAFT.*
"@

# 21. i18n keys
WF "$root\NEPH-002\03_i18n_keys.md" @"
$banner
# NEPH-002 — i18n Keys (AR + EN)

| Key | EN | AR |
|-----|----|----|
| transplant.waitlist | Waitlist | قائمة الانتظار |
| transplant.mmd | HLA Mismatch | عدم التوافق النسيجي |
| transplant.donor_offer | Donor Offer | عرض متبرع |
| transplant.banff.grade | Banff Grade | درجة Banff |
| transplant.trough_target | Trough Target | هدف مستوى الدواء |
| transplant.dialysis_bridge | Dialysis Bridge | غسيل كلوي مؤقت |
| transplant.aboi_desens | ABOi Desensitization | إزالة التحسس |
| transplant.epts | EPTS Score | درجة EPTS |
| transplant.kdpi | KDPI Score | درجة KDPI |
| transplant.pair_exchange | Paired Exchange | تبادل الأزواج |
| transplant.scot_report | SCOT Report | تقرير SCOT |
| transplant.living_donor | Living Donor | متبرع حي |
| transplant.deceased_donor | Deceased Donor | متبرع متوفى |
| transplant.induction | Induction | تحريض |
| transplant.maintenance | Maintenance | صيانة |
| transplant.rejection | Rejection | رفض |
| transplant.biopsy | Biopsy | خزعة |
| transplant.graft_function | Graft Function | وظيفة الطعم |
| transplant.bk_viremia | BK Viremia | فيرميا BK |
| transplant.cmv_viremia | CMV Viremia | فيرميا CMV |
| transplant.dsa | Donor-Specific Antibody | أجسام مضادة خاصة بالمتبرع |
| transplant.tacrolimus | Tacrolimus | تاكروليموس |
| transplant.cyclosporine | Cyclosporine | سيكلوسبورين |
| transplant.mmf | Mycophenolate Mofetil | ميكوفينولات |
| transplant.prednisone | Prednisone | بريدنيزون |
| transplant.sirolimus | Sirolimus | سيروليموس |
| transplant.everolimus | Everolimus | إيفيروليموس |
| transplant.rituximab | Rituximab | ريتوكسيماب |
| transplant.eculizumab | Eculizumab | إيكوليزوماب |
| transplant.atg | Anti-Thymocyte Globulin | غلوبولين مضاد للتيموسين |

---
*Section 21 of NEPH-002. PM voice. L1 DRAFT.*
"@

# 22. ICD-10/SNOMED
WF "$root\NEPH-002\03_icd10_snomed_map.md" @"
$banner
# NEPH-002 — ICD-10 / SNOMED / LOINC Map

## Conditions
| Condition | ICD-10 | SNOMED-CT |
|-----------|--------|-----------|
| ESRD | N18.6 | 46177005 |
| CKD Stage 5 | N18.5 | 433144002 |
| Diabetic nephropathy | E11.22 / E10.22 | 420279001 |
| ADPKD | Q61.2 | 28733004 |
| Chronic GN | N03.9 | 35546006 |
| Alport | Q87.81 | 77088001 |
| IgA nephropathy | N02.B | 236403004 |
| Lupus nephritis | M32.14 / M32.15 | 200936003 |
| FSGS | N04.1 | 236385009 |
| HUS | D59.3 | 111407006 |
| TTP | M31.1 | 32273002 |

## Procedures (CPT + SNOMED)
| Procedure | CPT | SNOMED-CT |
|-----------|-----|-----------|
| LDN open | 50300 | 175905003 |
| LDN lap | 50547 | 175905003 |
| Recipient transplant | 50360 | 64779008 |
| Ureteroneocystostomy | 50780 | 1177810006 |
| PLEX | 36514 | 48691004 |
| IVIG | 90284 / 96365 | 387458008 |
| Biopsy needle | 50200 | 386538002 |
| Pathology | 88307 | 25290000 |

## LOINC
| Test | LOINC |
|------|-------|
| Creatinine | 2160-0 |
| eGFR CKD-EPI | 62292-8 |
| BUN/Urea | 3094-0 |
| Tacrolimus trough | 11253-2 |
| Cyclosporine trough | 53834-1 |
| BK PCR | 32286-7 |
| CMV PCR | 30247-1 |
| DSA (Luminex) | 80617-0 |
| 24h urine protein | 2889-4 |

## RxNorm (High-Alert IS)
| Drug | RxNorm |
|------|--------|
| Tacrolimus | 42316 |
| Cyclosporine | 3008 |
| Mycophenolate mofetil | 68149 |
| Prednisone | 8640 |
| Sirolimus | 35302 |
| Everolimus | 1119401 |
| Rituximab | 10894 |
| Eculizumab | 60672 |
| ATG (Thymoglobulin) | 190948 |
| Belatacept | 1100830 |

---
*Section 22 of NEPH-002. L1 DRAFT.*
"@

# 23. legal consent
WF "$root\NEPH-002\03_legal_consent_forms.md" @"
$banner
# NEPH-002 — Legal Consent Forms (10 types)

## 1. Recipient Transplant Consent
- Procedure: Kidney transplant
- Risks: rejection, infection, malignancy, recurrence, death (~2-3% 1y)
- Alternatives: dialysis (HD/PD), no transplant

## 2. Living Donor Consent
- Procedure: Donor nephrectomy
- Risks: bleeding, infection, DVT/PE, chronic kidney disease (~1% long-term)
- Alternatives: deceased donor waitlist (longer wait)
- **Independent donor advocate (ILDA) sign-off required**

## 3. Deceased Donor Consent (Family)
- Authorization for organ donation
- Per SCOT registry

## 4. Paired Exchange Consent
- Simultaneous swap with other pair(s)
- Confidentiality maintained

## 5. ABOi Desensitization Consent
- PLEX + IVIG + rituximab
- Risks: infection, reaction, bleeding

## 6. Research Consent
- For transplant registry participation
- Withdrawal anytime

## 7. AI-Assisted Care Consent (MANDATORY)
- AI may provide: Banff interpretation, trough advice, rejection risk
- AI is NOT autonomous: MD signs off

## 8. Teaching Consent
- Fellows, residents, students observation
- Patient may decline

## 9. Long-term Follow-up Consent
- Lifetime follow-up
- SCOT registry participation

## 10. Anesthesia + Procedure Consent
- GA, central line, arterial line, blood products

---
*Section 23 of NEPH-002. L1 DRAFT.*
"@

# 24. LLM prompts
WF "$root\NEPH-002\03_llm_prompts.md" @"
$banner
# NEPH-002 — LLM Prompts

## System Prompt (transplant_assistant)
```
You are a Renal Transplant clinical co-pilot for NamaMedical Hospital.
Your role: decision support to transplant nephrologists, surgeons, coordinators.

MANDATORY RULES:
1. Cite: every recommendation references KDIGO/Banff/CST/SCOT/OPTN with year.
2. NEVER autonomously sign: IS, biopsy, transplant, desensitization.
3. PII redacted before LLM call.
4. Hallucination <1%.
5. Fail-soft to rule-based transplant_engine.js.
6. Language: AR or EN per query.
7. HARD RULES:
   - Trough >20 ng/mL = BLOCK + escalate (calcineurin toxicity)
   - Positive CDC XM = absolute decline
   - AMR with DSA+/C4d+ = escalate
   - BK PCR >10⁴ = reduce IS
8. MD-in-the-loop: Banff grade, IS plan, biopsy interpretation require MD sign-off.
```

## Few-Shot 1: Transplant Evaluation Summary
```json
{
  "candidate_suitability": "high",
  "risks": ["DM", "BMI 32", "cardiac risk (stress echo pending)"],
  "mdt_recommendation": "list once cardiac clearance",
  "workup_gaps": ["stress echo", "dental clearance"]
}
```

## Few-Shot 2: MDT Discussion Note
```json
{
  "listing_status": "pending_cardiopulmonary_clearance",
  "immune_risk": "low (cPRA 5%, no DSA, HLA MM 2/6)",
  "is_plan": "Basiliximab induction, Tac + MMF + Pred maintenance",
  "follow_up": "Day 14, 30, 60, 90, then q3mo year 1"
}
```

## Few-Shot 3: Post-op Order Set
```json
{
  "induction": "Basiliximab 20 mg IV day 0 and day 4",
  "maintenance": {
    "tacrolimus": "2 mg PO BID, target trough 8-12",
    "mmf": "1 g PO BID",
    "prednisone": "5 mg PO daily (after taper from 500 mg IV x3)"
  },
  "prophylaxis": {
    "tmp_smx": "1 SS daily x 6mo",
    "valganciclovir": "if D+/R-: 450 mg BID x 3mo",
    "nystatin": "swish and swallow x 3mo"
  },
  "monitoring": "Cr daily inpatient, then q1d outpatient"
}
```

## Few-Shot 4: IS Dose Adjustment
```json
{
  "current_dose": "Tac 2 mg BID",
  "trough": "12.5 ng/mL",
  "recommendation": "Hold 1 dose, recheck tomorrow, then restart at 1.5 mg BID",
  "warning": "Trending up; check Scr + consider biopsy if Cr rising"
}
```

## Few-Shot 5: Banff Report Summary
```json
{
  "category": "ACR IIA",
  "treatment": "rATG 1.5 mg/kg x 3-5 days",
  "monitoring": "Cr daily inpatient, biopsy in 2-4 weeks",
  "prognosis": "Good with prompt treatment; ~80% graft salvage"
}
```

---
*Section 24 of NEPH-002. AIE voice. L1 DRAFT.*
"@

# 25. migration validate
WF "$root\NEPH-002\03_migration_validate.sql" @"
$banner
-- NEPH-002 Migration Validation
SELECT tablename, rowsecurity
FROM pg_tables t
JOIN pg_class c ON c.relname = t.tablename
WHERE schemaname='public' AND tablename LIKE 'transplant%' OR tablename IN ('donor_registry','recipient_evaluation','hla_typing','crossmatch_results','immunosuppression_log','rejection_episodes','protocol_biopsies','graft_surveillance','post_transplant_infections','long_term_followup','paired_exchange_pool')
ORDER BY tablename;
-- Expected: 13 tables with rls=TRUE
"@

# 26. PDPL/NPHIES
WF "$root\NEPH-002\03_pdpl_nphies.md" @"
$banner
# NEPH-002 — PDPL, NPHIES, ZATCA, SFDA, SCOT, CBAHI

## PDPL
- Recipient records: 10 years
- Donor records: 20 years
- Recipient lifetime: lifetime
- Ped (if applicable): until 25 OR 10y
- Lifetime for crossmatch + DSA history

## NPHIES
- Transplant bundle: donor + recipient, bundled
- NPHIES preauth for elective transplant
- FHIR R4: `Claim.transplant`

## ZATCA
- Billing: procedure + IS drugs (some exempt)
- 15% VAT on most items

## SFDA
- IS registry (tacrolimus, MMF, etc.)
- REMS for ATG, rituximab, eculizumab
- Report adverse events within 7d

## SCOT (Saudi Center for Organ Transplantation) — MANDATORY
- Report every transplant within 7 days
- Donor + recipient details
- Outcome data (graft survival, patient survival)
- Annual report

## CBAHI
- Transplant program standards
- Outcomes KPIs (1-yr graft survival, DGF, rejection)
- Quarterly QA review

---
*Section 26 of NEPH-002. L1 DRAFT.*
"@

# 27. red flags
WF "$root\NEPH-002\04_clinical_red_flags.md" @"
$banner
# NEPH-002 — Red Flags (12)

| # | Red flag | Trigger | Response | Time |
|---|----------|---------|----------|------|
| 1 | **Hyperacute rejection** | Cyanotic, black graft, no flow | Graft nephrectomy, re-list | <60 min |
| 2 | **ACR (Banff IA-IIIA)** | ↑Cr >25% / 24-48h, biopsy | MPred 500 mg IV x3 / rATG | <24h |
| 3 | **AMR (DSA+/C4d+)** | ↑Cr, DSA+ | PLEX + IVIG + rituximab | <48h |
| 4 | **CNI toxicity** | Trough >20 ng/mL, biopsy: vacuoles | HOLD + escalate | <24h |
| 5 | **BK polyomavirus** | BK PCR >10⁴, SV40+ | Reduce IS, leflunomide | <2 wk |
| 6 | **Renal artery thrombosis** | Sudden oliguria, ↓Hgb, pain | Surgical exploration | <6h |
| 7 | **Renal vein thrombosis** | Pain, hematuria, graft swelling | Surgical exploration | <6h |
| 8 | **Urinary leak** | ↓UO, ↑drain Cr, ileus | Re-explore / nephrostomy | <24h |
| 9 | **Lymphocele** | Pelvic mass, leg edema, ↓UO | Drainage / marsupialization | <2 wk |
| 10 | **Post-Tx infection** | Fever, site-specific | Reduce IS, targeted Rx | <24h |
| 11 | **PTLD (EBV)** | Nodes/mass, EBV+ | Reduce IS, rituximab ± CHOP | <2 wk |
| 12 | **Recurrent primary disease** | ↑Cr, biopsy shows recurrence | Treat underlying | <4 wk |

---
*Section 27 of NEPH-002. CMO voice. L1 DRAFT.*
"@

# 28. design tokens
WF "$root\NEPH-002\04_design_tokens.md" @"
$banner
# NEPH-002 — Design Tokens

Same as CARD-002 (Stitch Premium RTL) plus:

- BK PCR elevated: #FF6B6B (warning)
- DSA positive: #DC3545 (critical)
- Trough in range: #28A745 (success)
- Trough out of range: #FFC107 (warning)
- Trough toxic (>20): #DC3545 (critical, pulsing)
- Days post-tx: large monospace, color-coded by phase (early: blue, late: green)

---
*Section 28 of NEPH-002. L1 DRAFT.*
"@

# 29. helpdesk
WF "$root\NEPH-002\04_helpdesk_runbook.md" @"
$banner
# NEPH-002 — Helpdesk

## L1
- Cannot find patient → check MPI by national ID
- Trough lab not showing → check lab import
- Crossmatch result delayed → contact HLA lab

## L2
- SCOT report failed → check API key, retry
- Pair exchange match run failed → check pool integrity
- Trough >20 = auto-block, contact MD immediately

## L3
- Migration failed → DBA rollback
- Security incident → InfoSec

## FAQs
**Q: How to add patient to waitlist?**
A: Workup complete → MDT approval → POST /waitlist.

**Q: Donor for specific recipient?**
A: Search donor registry, run match via GET /matching.

**Q: Trough >20 = ?**
A: HARD BLOCK. Hold dose + escalate immediately.

**Q: SCOT report?**
A: Auto-filed 7 days post-transplant. Check status in procedure detail.

---
*Section 29 of NEPH-002. L1 DRAFT.*
"@

# 30. LLM observability
WF "$root\NEPH-002\04_llm_observability.md" @"
$banner
# NEPH-002 — LLM Observability

Same as CARD-002.

Audit events: transplant.llm.assisted, trough.adjusted, biopsy.banff.suggested, donor.matched.

HARD RULES monitored:
- Trough >20 escalation rate
- Positive XM declined rate
- Banff grade agreement (AI vs MD)

---
*Section 30 of NEPH-002. L1 DRAFT.*
"@

# 31. routes
WF "$root\NEPH-002\04_routes_api.md" @"
$banner
# NEPH-002 — Express Routes

`namaweb/routes/transplant.js`:
- POST /waitlist (idempotent)
- GET /waitlist
- POST /evaluation
- POST /hla-typing
- POST /crossmatch
- GET /matching
- POST /procedure (idempotent, SCOT report)
- POST /immunosuppression (idempotent, HIGH-ALERT gate, trough >20 block)
- POST /rejection
- POST /biopsy
- POST /surveillance/visit
- POST /infection
- POST /followup
- GET /pair-exchange/matches

All: authenticate + requireTenantScope + requireRole('nephrology'|'transplant_coordinator'|'transplant_surgeon') + validateBody + idempotencyGuard (for billing/SCOT).

---
*Section 31 of NEPH-002. L1 DRAFT.*
"@

# 32. middleware
WF "$root\NEPH-002\05_middleware_chain.md" @"
$banner
# NEPH-002 — Middleware

Same as CARD-002 + specialty: 'transplant_nephrology', 'transplant_coordinator', 'transplant_surgeon', 'hla_technologist', 'transplant_pharmacist'.

Idempotency: /waitlist, /procedure, /immunosuppression, /biopsy (when billing).

HARD ALERT: 2-pharmacist verify for IS; trough >20 = block.

---
*Section 32 of NEPH-002. L1 DRAFT.*
"@

# 33. data flow
WF "$root\NEPH-002\06_data_flow.md" @"
$banner
# NEPH-002 — Data Flow

## Recipient Listing
```
Referral → Evaluation → MDT → Listing → Waitlist (cPRA, EPTS)
```

## Transplant Day
```
Crossmatch final → Pre-op → Induction IS (OR) → Anesthesia →
Vascular anastomosis → Reperfusion (UO within min) →
Ureteroneocystostomy + stent → Closure → PACU → ICU
```

## Post-Tx Follow-up
```
Discharge Day 7 → Day 14 clinic (Cr, trough) → Day 30 →
Day 60 → Day 90 → Day 180 → Day 365 → Yearly
Labs: Cr, eGFR, trough, BK/CMV PCR, DSA
Biopsy: protocol 3-6-12 mo (optional), for-cause any time
```

## Rejection Workup
```
↑Cr >25% → Biopsy (for-cause) → Pathology + C4d + SV40 + DSA →
Banff grade → Treatment per grade
```

## Key RLS Touchpoints
- Every table: tenant_id, RLS, FORCE RLS

## Key Audit Touchpoints
- transplant.waitlist.added
- transplant.crossmatch.performed
- transplant.procedure.completed
- transplant.immunosuppression.administered
- transplant.rejection.detected
- transplant.graft_loss
- transplant.biopsy.banff.graded

---
*Section 33 of NEPH-002. L1 DRAFT.*
"@

# 34. ERD
WF "$root\NEPH-002\07_erd_diagram.md" @"
$banner
# NEPH-002 — ERD (Mermaid)

```mermaid
erDiagram
    tenants ||--o{ transplant_waitlist : has
    tenants ||--o{ donor_registry : has
    tenants ||--o{ recipient_evaluation : has
    tenants ||--o{ hla_typing : has
    tenants ||--o{ crossmatch_results : has
    tenants ||--o{ transplant_procedure : has
    tenants ||--o{ immunosuppression_log : has
    tenants ||--o{ rejection_episodes : has
    tenants ||--o{ protocol_biopsies : has
    tenants ||--o{ graft_surveillance : has
    tenants ||--o{ post_transplant_infections : has
    tenants ||--o{ long_term_followup : has
    tenants ||--o{ paired_exchange_pool : has
    transplant_procedure ||--o{ rejection_episodes : produces
    transplant_procedure ||--o{ protocol_biopsies : has
    transplant_procedure ||--o{ graft_surveillance : monitored_by
    transplant_procedure ||--o{ post_transplant_infections : has
    transplant_procedure ||--o{ long_term_followup : has
```

---
*Section 34 of NEPH-002. L1 DRAFT.*
"@

# 35. ADR
WF "$root\NEPH-002\08_architecture_decision_record.md" @"
$banner
# NEPH-002 — 5 ADRs

## ADR-001: Stack (Node + Express + pg) — per Option A
## ADR-002: Multi-Tenancy via RLS
## ADR-003: Idempotency on Money/SCOT routes
## ADR-004: LLM Decision Support (NOT authority)
## ADR-005: SCOT Integration (mandatory reporting)

Plus: HIGH-ALERT 2-pharmacist verify for IS drugs (per `SNIPPETS.md#SNIP-09`).

Trough >20 = HARD BLOCK (server-side check in `transplant_engine.js`).

---
*Section 35 of NEPH-002. L1 DRAFT.*
"@

Write-Host "✅ NEPH-002 Part 2 done: 20 more files written (total NEPH-002: 35/35)"
