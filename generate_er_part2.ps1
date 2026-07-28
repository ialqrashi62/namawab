# ER-002 Part 2 — الملفات 16-35
$ErrorActionPreference = "Stop"
$root = "c:\Users\ice\Desktop\NMEDCALVSCODE\.ai-brain\02_MODULES_NEW\POC"
$banner = "<!-- BLUEPRINT v2 — informational, not yet live. See DECISIONS_PENDING.md -->"
$UTF8 = [System.Text.UTF8Encoding]::new($false)
$count = 0
function WF($p,$c){$d=Split-Path $p -Parent;if(-not(Test-Path $d)){New-Item -ItemType Directory -Force -Path $d|Out-Null};[System.IO.File]::WriteAllText($p,$c,$UTF8);$script:count++}

# 16. training
WF "$root\ER-002\02_training_video_script.md" @"
$banner
# ER-002 — Training Video (3 min)

## EN
**[0:00]** Welcome. This is the NamaMedical Trauma Center Level I training.
**[0:15]** Tier 1 activation: penetrating torso, GCS ≤8, SBP <90, HR >120, or fall >20 ft.
**[0:40]** Within 15 min: full team assembled (trauma surgery attending, senior resident, ED MD, anesthesia, OR, blood bank, RT, radiology, chaplain).
**[1:10]** ATLS primary survey: A (airway + C-spine), B (breathing), C (circulation + hemorrhage control), D (disability), E (exposure). Each within minutes.
**[1:40]** MTP trigger: ABC score ≥3 OR shock + FAST positive. 1:1:1 (PRBC:FFP:Platelets) per PROPPR 2015.
**[2:10]** TXA 1g IV within 3 hours of injury.
**[2:30]** Damage control surgery if unstable: control hemorrhage, control contamination, temporary closure. Return 24-48h.
**[2:50]** Save lives. CMO has final say.

## AR
**[0:15]** تفعيل المستوى 1: طلق ناري/طعن، GCS ≤8، ضغط <90، نبض >120، سقوط >6 متر.
**[0:40]** خلال 15 دقيقة: فريق كامل (جراح صدمات + مقيم أول + طوارئ + تخدير + عمليات + بنك دم).
**[1:10]** ATLS: A (مجرى هواء + تثبيت)، B (تنفس)، C (دورة + إرقاء)، D (عجز)، E (كشف).
**[1:40]** بروتوكول النقل المكثف: 1:1:1 (كريات حمراء:بلازما:صفائح).
**[2:10]** TXA 1g وريدي خلال 3 ساعات.
**[2:30]** جراحة التحكم بالأضرار: إرقاء، تحكم بالتلوث، إغلاق مؤقت.
**[2:50]** أنقذ الأرواح.

---
*Section 16 of ER-002. L1 DRAFT.*
"@

# 17. vector store
WF "$root\ER-002\02_vector_store_schema.md" @"
$banner
# ER-002 — Vector Store (PGVector 768d)

## Index: trauma_v1
## Sources: ATLS 10e, ACS-COT Resources 2014/rev2023, EAST PMG, BTF 2016 4th ed, NICE NG39 2016, NTDB/TQIP Annual, ABC Score, Parkland, KSA MOH trauma designation (CBAHI crosswalk)
## Hybrid: vector (0.5) + BM25 (0.3) + KG (0.2)
## Top-K=20→5

---
*Section 17 of ER-002. AIE voice. L1 DRAFT.*
"@

# 18. wireframes
WF "$root\ER-002\02_wireframes.md" @"
$banner
# ER-002 — Wireframes

## 1. Trauma Activation
## 2. Primary Survey (ATLS A/B/C/D/E)
## 3. MTP Status
## 4. ISS Calculator
## 5. AIS Coding
## 6. Hemorrhage Control
## 7. Transfer Out
## 8. PI Case Log
## 9. Registry Dashboard
## 10. Outreach Event Planner

---
*Section 18 of ER-002. L1 DRAFT.*
"@

# 19. e2e tests
WF "$root\ER-002\03_e2e_tests.md" @"
$banner
# ER-002 — E2E Tests (Gherkin)

```gherkin
Feature: Tier 1 activation
  Scenario: MVC ejection
    Given a 28M ejected from MVC
    When trauma team paged
    Then full team assembled <15 min
    And primary survey starts

Feature: MTP trigger
  Scenario: Shock + FAST+
    Given patient SBP 80, HR 130, FAST positive
    When MTP trigger check
    Then MTP activated
    And cooler #1 prepared in 10 min

Feature: Damage control lap
  Scenario: Unstable + peritonitis
    Given FAST+ + unstable
    When OR available
    Then damage control lap <60 min
    And temporary closure

Feature: TBI craniectomy
  Scenario: Severe TBI + herniation
    Given GCS 6, blown pupil
    When CT shows mass effect
    Then decompressive craniectomy <4h

Feature: Transfer to higher level
  Scenario: Pediatric trauma
    Given 8y with ISS 25
    When adult trauma center
    Then transfer to pediatric center <60 min
```

---
*Section 19 of ER-002. L1 DRAFT.*
"@

# 20. engine
WF "$root\ER-002\03_engine_module.md" @"
$banner
# ER-002 — Pure JS Engine (trauma_center_engine.js, extends existing)

```js
'use strict';

// 1. AIS severity
function aisSeverityScore(ais2015Descriptor) {
  // Map AIS 2015 dictionary to severity 1-6
  const m = { 'AIS1':1, 'AIS2':2, 'AIS3':3, 'AIS4':4, 'AIS5':5, 'AIS6':6 };
  return m[ais2015Descriptor] || 0;
}

// 2. ISS
function issCalculator(injuries) {
  const byRegion = {};
  for (const inj of injuries) {
    if (!byRegion[inj.region] || byRegion[inj.region] < inj.ais) {
      byRegion[inj.region] = inj.ais;
    }
  }
  const top3 = Object.values(byRegion).sort((a, b) => b - a).slice(0, 3);
  while (top3.length < 3) top3.push(0);
  const iss = top3.reduce((sum, x) => sum + x * x, 0);
  return { iss: Math.min(iss, 75), max_ais: Math.max(...top3), mortality_band: iss >= 16 ? 'high' : iss >= 9 ? 'moderate' : 'low' };
}

// 3. TRISS
function trissPs(age, iss, rts) {
  // Champion 1995 coefficients (blunt): b0=-1.2470, b1=0.9544(age), b2=-0.0768(iss), b3=-1.9052(rts)
  const logit = -1.2470 + 0.9544 * (age >= 55 ? 1 : 0) - 0.0768 * iss - 1.9052 * rts;
  const ps = 1 / (1 + Math.exp(-logit));
  return { ps_pct: Math.round(ps * 100), band: ps > 0.9 ? 'high' : ps > 0.5 ? 'moderate' : 'low' };
}

// 4. Activation tier
function activationTierClassifier(p) {
  const criteria = [];
  if (p.penetratingTorso) criteria.push('penetrating_torso');
  if (p.gcs <= 8) criteria.push('gcs_le_8');
  if (p.sbp < 90) criteria.push('sbp_lt_90');
  if (p.hr > 120) criteria.push('hr_gt_120');
  if (p.intubation) criteria.push('intubated');
  if (p.pulselessExtremity) criteria.push('pulseless_ext');
  if (p.amputationProximal) criteria.push('amputation_proximal');
  if (p.fallHeightFt > 20) criteria.push('fall_gt_20ft');
  if (p.ejection) criteria.push('ejection');
  if (p.mvcSpeed > 30) criteria.push('mvc_gt_30mph');
  if (criteria.length >= 1) return { tier: 1, team: 'full', eta: 15, criteria_met: criteria };
  if (p.fallHeightFt > 10 || p.pedestrianStruck || p.age > 65) return { tier: 2, team: 'partial', eta: 30, criteria_met: ['mechanism'] };
  return { tier: 3, team: 'consult', eta: 60, criteria_met: [] };
}

// 5. MTP trigger
function mtpTriggerCheck(sbp, hr, lactate, fast, suspectedHemorrhage, mechanism) {
  let score = 0;
  if (sbp < 90) score += 1;
  if (hr > 120) score += 1;
  if (lactate > 4) score += 1;
  if (fast) score += 1;
  if (suspectedHemorrhage) score += 1;
  return { trigger: score >= 3 || (sbp < 90 && fast), score, ratio: '1:1:1' };
}

// 6. TBI severity
function tbiSeverityScore(gcs, ctMarshall, pupillary, hypoxia, hypotension) {
  let severity = 'mild';
  if (gcs <= 8) severity = 'severe';
  else if (gcs <= 12) severity = 'moderate';
  const icpIndicated = severity === 'severe' || ctMarshall >= 3 || pupillary === 'unreactive';
  return { severity, icp_monitor_indicated: icpIndicated };
}

// 7. GCS trend
function gcsTrend(current, prev, prev2) {
  if (current > prev) return { trend: 'improving', delta: current - prev };
  if (current < prev) return { trend: 'worsening', delta: current - prev };
  return { trend: 'stable', delta: 0 };
}

// 8. Lactate clearance
function lactateClearance(initial, current, hoursElapsed) {
  const clearance = ((initial - current) / initial) * 100;
  return { clearance_pct: Math.round(clearance), adequate: clearance > 20 };
}

// 9. Hemorrhage control
function hemorrhageControlChecklist(source, hemodynamics) {
  if (source === 'pelvic_fracture' && hemodynamics.sbp < 90) return { pathway: 'pelvic_packing' };
  if (source === 'intra_abd' && hemodynamics.sbp < 90) return { pathway: 'damage_control_surg' };
  if (source === 'mangled_ext') return { pathway: 'tourniquet_then_amputation' };
  return { pathway: 'angioembolization' };
}

// 10. Transfer
function transferCriteriaCheck(gap, stability, facility) {
  return { decision: 'transfer', time_to_transfer: 60, mode: stability.stable ? 'ground' : 'helicopter', contraindications: [] };
}

module.exports = {
  aisSeverityScore, issCalculator, trissPs, activationTierClassifier,
  mtpTriggerCheck, tbiSeverityScore, gcsTrend, lactateClearance,
  hemorrhageControlChecklist, transferCriteriaCheck
};
```

---
*Section 20 of ER-002. L1 DRAFT.*
"@

# 21. i18n
WF "$root\ER-002\03_i18n_keys.md" @"
$banner
# ER-002 — i18n Keys

| Key | EN | AR |
|-----|----|----|
| trauma.mtp_activate | Activate MTP | تفعيل بروتوكول النقل المكثف |
| trauma.tier1 | Tier 1 — Full Team | المستوى 1 — الفريق الكامل |
| trauma.tier2 | Tier 2 — Partial | المستوى 2 — جزئي |
| trauma.tier3 | Tier 3 — Consult | المستوى 3 — استشارة |
| trauma.atls_airway | A — Airway + C-spine | أ — مجرى الهواء مع تثبيت العمود الفقري |
| trauma.atls_breathing | B — Breathing | ب — التنفس |
| trauma.atls_circulation | C — Circulation | ج — الدورة الدموية |
| trauma.atls_disability | D — Disability | د — العجز |
| trauma.atls_exposure | E — Exposure | هـ — الكشف |
| trauma.iss | ISS | درجة ISS |
| trauma.gcs | GCS | درجة GCS |
| trauma.fast | FAST | فحص FAST |
| trauma.reboa | REBOA | REBOA |
| trauma.tbi_severity | TBI Severity | شدة إصابة الدماغ |
| trauma.transfer_out | Transfer Out | نقل صادر |
| trauma.txa | TXA | ترانيكساميك أسيد |
| trauma.door_to_team | Door to Trauma Team | من الباب إلى فريق الصدمة |
| trauma.door_to_or | Door to OR | من الباب إلى العمليات |
| trauma.mtp_first_unit | MTP First Unit | أول وحدة نقل دموي |
| trauma.craniectomy | Decompressive Craniectomy | حج القحف |
| trauma.thoracotomy | Resuscitative Thoracotomy | بضع الصدر الإنعاشي |
| trauma.laparotomy | Damage Control Laparotomy | فتح البطن للتحكم بالأضرار |
| trauma.fasciotomy | Fasciotomy | قطع اللفافة |
| trauma.amputation | Amputation | البتر |
| trauma.intubation | Endotracheal Intubation | التنبيب الرغامي |
| trauma.chest_tube | Chest Tube | أنبوب صدري |
| trauma.needle_decompression | Needle Decompression | إبرة تخفيف الضغط |
| trauma.pelvic_binder | Pelvic Binder | حزام الحوض |
| trauma.tourniquet | Tourniquet | عاصبة |
| trauma.dama | Discharge AMA | خروج ضد النصيحة |
| trauma.lwbs | LWBS | مغادرة دون فحص |

---
*Section 21 of ER-002. PM voice. L1 DRAFT.*
"@

# 22. ICD
WF "$root\ER-002\03_icd10_snomed_map.md" @"
$banner
# ER-002 — ICD-10 / AIS / SNOMED Map

## Top 10 Conditions

| # | Condition | ICD-10 | AIS |
|---|-----------|--------|-----|
| 1 | Polytrauma | T07 / S39.91 | 3-4 |
| 2 | Severe TBI | S06.0-9 | 4-5 |
| 3 | Penetrating | S31/S21/S11 | 3-5 |
| 4 | Blunt abdominal | S36.x | 3-4 |
| 5 | Thoracic | S27.x | 3-4 |
| 6 | Pelvic | S32.8/S32.81 | 4-5 |
| 7 | Long-bone | S72/S82/S92 | 2-3 |
| 8 | Spinal cord | S14.1/S24.1 | 4-5 |
| 9 | Burns | T30/T31 | 2-3 |
| 10 | Pediatric | T07 | 2-4 |

## Top 20 Procedures (CPT)

| Procedure | CPT |
|-----------|-----|
| ATLS survey | E/M |
| Endotracheal intubation | 31500 |
| Needle decompression | 32554 |
| Chest tube | 32551 |
| Resuscitative thoracotomy | 32160 |
| ED thoracotomy | 33025 |
| FAST | 93308 |
| DPL | 49080 |
| REBOA | 34900 |
| MTP | 36430 ×units |
| Damage control lap | 49002 |
| External fixation | 20690 |
| ICP monitor | 61107 |
| Craniotomy | 61312, 61322 |
| Fasciotomy | 27892, 27496, 25020 |
| Vascular shunt | 35231 |
| Amputation | 27880-27888 |
| Splinting | 29065-29584 |
| Inter-facility transfer | 99289 + A0999 |
| Surgical airway (cricothyroidotomy) | 31603 |

## AIS 2015 Severity Scale
1 = Minor · 2 = Moderate · 3 = Serious · 4 = Severe · 5 = Critical · 6 = Maximal (untreatable)

## ISS Calculation
Sum of squares of 3 highest AIS in different body regions. Max = 75.

## TRISS (Champion 1995)
- Blunt: b0=-1.2470, b1=0.9544(age≥55), b2=-0.0768(iss), b3=-1.9052(rts)
- Penetrating: b0=-0.6029, b1=0.6278(age≥55), b2=-0.1037(iss), b3=-1.7436(rts)

---
*Section 22 of ER-002. CMO voice. L1 DRAFT.*
"@

# 23. consent
WF "$root\ER-002\03_legal_consent_forms.md" @"
$banner
# ER-002 — Legal Consent Forms (10 types)

1. **Trauma Treatment Consent** (implied for life-threatening)
2. **MTP Consent** (massive transfusion)
3. **Blood Transfusion Consent**
4. **Surgical Consent** (damage control)
5. **Anesthesia Consent** (GA)
6. **Transfer Consent**
7. **Data Sharing + AI Consent**
8. **Research Consent** (trauma registry)
9. **Teaching Consent** (fellows, residents)
10. **Organ Donation Referral** (if applicable)

## Special: Implied Consent
For life-threatening trauma (GCS ≤8, severe shock), implied consent applies (legal doctrine of emergency). Document carefully.

---
*Section 23 of ER-002. L1 DRAFT.*
"@

# 24. LLM
WF "$root\ER-002\03_llm_prompts.md" @"
$banner
# ER-002 — LLM Prompts

## System Prompt (trauma_co_pilot)
```
You are a Trauma Center Level I clinical co-pilot.
Your role: decision support to trauma surgeons, ED MDs, NPs, PAs.

MANDATORY:
1. Cite: every recommendation references ATLS 10e / ACS-COT / EAST / BTF / institutional protocol.
2. NEVER autonomously: trigger MTP, activate tier 1, transfer, activate OR, code patient.
3. PII redacted before LLM.
4. Hallucination <1% for AIS coding, MTP trigger, tier classification.
5. Fail-soft to rule-based trauma_center_engine.js.
6. Language: AR or EN per query.
7. BRAVO rule (Be Rigorous And Verify Outcome): if AI recommends deviation, name alternative guideline + MD sign-off.
8. MD-in-loop for AIS >3.
9. p99 latency <1.5s for activation chains; <2s for MTP trigger.
```

## Few-Shot 1: Trauma H&P Draft
```json
{
  "cc": "28M ejected from MVC, hemodynamically unstable",
  "hpi": "Belted driver, MVC at ~80 km/h, ejected 10m, found at scene GCS 13, SBP 80",
  "pmh": "none",
  "exam_atls": {"a": "patent, C-collar in place", "b": "B/L breath sounds, no flail", "c": "tachycardic, FAST+", "d": "GCS 13, pupils reactive", "e": "no obvious external bleeding"},
  "ais_table": [{"region": "abdomen", "ais": 3, "descriptor": "laceration"}, {"region": "chest", "ais": 3, "descriptor": "pulmonary contusion"}],
  "iss": 18,
  "plan": "Activate MTP, damage control lap"
}
```

## Few-Shot 2: MTP Activation Note
```json
{
  "trigger_time": "2026-07-24T14:32:00Z",
  "trigger_reason": "ABC=4 (SBP 80, HR 130, lactate 5.2, FAST+)",
  "cooler_1": "PRBC 6 + FFP 6 + Plts 1 + Cryo 10 + TXA 1g + Ca-gluconate 1g",
  "ratio_1to1to1": true,
  "lab_triggers": {"inr": 1.8, "fibrinogen": 80, "platelets": 60},
  "termination_criteria": "Hemodynamically stable + lactate <2.5 + no active bleeding"
}
```

## Few-Shot 3: Transfer Letter
```json
{
  "sbar": {
    "situation": "Pediatric trauma, 8y, ISS 25",
    "background": "MVC, restrained passenger",
    "assessment": "Unstable, needs pediatric trauma center",
    "recommendation": "Transfer via helicopter, ETA 45 min"
  },
  "atls_summary": "A patent, B clear, C tachycardic, D GCS 14, E abrasions",
  "ais_table": [...],
  "outstanding": "CT pending",
  "receiving_team": "KFSH Pediatric Trauma, Dr. Khalid"
}
```

## Few-Shot 4: PI Case Review
```json
{
  "case_summary": "Patient X, ISS 25, MTP activated",
  "chronology": "Door 14:00 → Tier 1 14:03 → MTP 14:10 → OR 14:45 → DC 18:30",
  "deviation": "Door-to-OR 45 min (target <15 min for unstable)",
  "root_cause": "OR 1 occupied (concurrent case)",
  "action_items": ["OR 2 dedicated for trauma", "Code activation OR early"],
  "loop_closure": "Pending verification 1 month"
}
```

## Few-Shot 5: MCI Triage (START)
```json
{
  "triage_tags": {
    "immediate_red": ["pt1 GCS 6", "pt3 penetrating torso"],
    "delayed_yellow": ["pt2 stable abd", "pt4 closed femur"],
    "minor_green": ["pt5 abrasions"],
    "expectant_black": ["pt6 GCS 3 fixed dilated post-CPR"]
  },
  "resource_allocation": "OR1: pt1, OR2: pt3",
  "secondary_triage": "Re-evaluate every 15 min"
}
```

---
*Section 24 of ER-002. AIE voice. L1 DRAFT.*
"@

# 25. validate
WF "$root\ER-002\03_migration_validate.sql" @"
$banner
-- ER-002 Migration Validation
SELECT tablename, rowsecurity
FROM pg_tables t JOIN pg_class c ON c.relname = t.tablename
WHERE schemaname='public' AND tablename LIKE 'trauma%'
ORDER BY tablename;
-- Expected: 14 tables with rls=TRUE
"@

# 26. PDPL
WF "$root\ER-002\03_pdpl_nphies.md" @"
$banner
# ER-002 — PDPL, NPHIES, ZATCA

- PDPL: 10y registry, 20y peds, lifelong blood
- NPHIES: polytrauma DRG
- ZATCA: procedure billing + VAT
- ACS-COT/NTDB/TQIP: registry participation
- HIPAA: 164.312

---
*Section 26 of ER-002. L1 DRAFT.*
"@

# 27. red flags
WF "$root\ER-002\04_clinical_red_flags.md" @"
$banner
# ER-002 — Red Flags (12)

| # | Red flag | Trigger | Response | Time |
|---|----------|---------|----------|------|
| 1 | **Hemorrhagic shock III/IV** | HR>120, SBP<90, base deficit>6, lactate>4 | MTP, TXA, damage control | <10 min |
| 2 | **Tension pneumothorax** | Hypotension + absent breath sounds + tracheal deviation | Needle decompression 2nd ICS midclavicular | <1 min |
| 3 | **Cardiac tamponade** | Beck's triad (hypotension, JVD, muffled heart sounds) | Pericardiocentesis → OR | <5 min |
| 4 | **Massive hemothorax** | >1500 mL chest tube output immediately | Thoracotomy | <15 min |
| 5 | **Flail chest** | ≥3 contiguous ribs, paradoxical movement, hypoxia | Tube thoracostomy + analgesia + vent | <15 min |
| 6 | **Open-book pelvis** | APC-III / VS / LC-III | Pelvic binder, MTP, angioembolization | <10 min |
| 7 | **GCS ≤8** | Any mechanism | Intubate, CT head, neurosurgery | <10 min |
| 8 | **Penetrating neck/chest/abdomen** | Object in place or transited | Do NOT remove object, OR | <15 min |
| 9 | **Mangled extremity** | MESS ≥7, hemodynamic instability | Tourniquet proximal, reassess, amputation | <30 min |
| 10 | **Crush syndrome** | Prolonged entrapment + rhabdomyolysis | IVF before release, monitor K+ | Before extrication |
| 11 | **Compartment syndrome** | Pain out of proportion, tense compartment, ΔP<30 mmHg | Fasciotomy | <6 h |
| 12 | **Penetrating cardiac injury** | Penetrating chest + arrest + tamponade | ED thoracotomy | <15 min |

---
*Section 27 of ER-002. CMO voice. L1 DRAFT.*
"@

# 28. design tokens
WF "$root\ER-002\04_design_tokens.md" @"
$banner
# ER-002 — Design Tokens (Dark Mode, High Contrast)

- Background: #0A0A0A (true black for trauma)
- Surface: #1A1A1A
- Primary: #00A8E8 (Trauma Blue, more saturated)
- Danger: #FF0033 (Tier 1 banner, pulsing)
- Critical: #FF0033
- Warning: #FFA500
- Success: #00C853
- Text Primary: #FFFFFF
- Text Secondary: #B0B0B0
- Border: #2A2A2A
- High contrast for OR visibility

Tier 1 banner: full-width, 32px height, pulsing animation 1Hz, red background.

---
*Section 28 of ER-002. PM voice. L1 DRAFT.*
"@

# 29. helpdesk
WF "$root\ER-002\04_helpdesk_runbook.md" @"
$banner
# ER-002 — Helpdesk

L1: Tier 1 activation not paging → check PagerDuty
L2: MTP cooler not ready → contact blood bank
L3: Trauma registry export fails → check NTDB format

## FAQs
**Q: How to activate Tier 1?**
A: Top button → "Tier 1 Activation" → confirm mechanism → pages all teams.

**Q: MTP not triggered when expected?**
A: ABC score = HR≥120 + SBP≤90 + lactate≥4 + FAST+ → trigger manually if not auto.

**Q: Transfer to which facility?**
A: Pediatric → KFSH Pediatric Trauma. Burn → Burn Center. Spinal cord → Spinal Cord Rehab Center.

---
*Section 29 of ER-002. L1 DRAFT.*
"@

# 30. llm obs
WF "$root\ER-002\04_llm_observability.md" @"
$banner
# ER-002 — LLM Observability

Same as CARD-002 + trauma-specific:
- p99 <1.5s for activation chain
- Auto-fallback to rule-based
- AIS coding agreement (AI vs MD)
- MTP trigger rate per provider
- Transfer decision time

HARD RULES monitored: MTP trigger never suppressed, Tier 1 never missed.
"@

# 31. routes
WF "$root\ER-002\04_routes_api.md" @"
$banner
# ER-002 — Express Routes

`namaweb/routes/trauma.js`:
- POST /activations (idempotent on encounter+tier)
- POST /primary-survey (fail-closed)
- POST /secondary-survey
- POST /ais-coding (MD-cosign if AIS>3)
- GET /iss-score/:encounterId
- GET /triss/:encounterId
- POST /mtp/activate (idempotent, 2-RN verify)
- POST /mtp/:id/terminate
- POST /transfusion/log
- POST /operative-log
- POST /transfer-out (idempotent, capability_gap required)
- POST /transfer-in
- GET /registry/export (NTDB)
- POST /pi/case
- POST /pi/case/:id/close-loop
- GET /performance/dashboard
- POST /tbi/severity
- POST /hemorrhage/pathway

All: authenticate + requireTenantScope + requireRole('trauma_surgery'|'emergency_medicine') + validateBody.
"@

# 32. middleware
WF "$root\ER-002\05_middleware_chain.md" @"
$banner
# ER-002 — Middleware

Same as CARD-002 + specialty: 'trauma_surgery', 'emergency_medicine'.

**HIGH-ALERT blood gate:** 2-RN bedside check (per CBAHI blood traceability).
**MTP gate:** 2-RN witness + 2-MD sign-off within 5 min of trigger.

Idempotency: /activations, /mtp/activate, /transfer-out.
"@

# 33. data flow
WF "$root\ER-002\06_data_flow.md" @"
$banner
# ER-002 — Data Flow

```
Arrival → Triage (ESI 1-5) → Tier 1/2/3 activation (if criteria)
→ Trauma bay → ATLS primary survey (10 min) → MTP trigger check
→ Imaging (FAST, CXR, CT) → Resus → OR (if needed)
→ ICU (TICU) → Floor → Discharge
→ Registry entry (NTDB) → PI case (if deviation)
```

## Key RLS: tenant_id on all 14 tables
## Key Audit: activation.triggered, mtp.activated, mtp.terminated, transfusion.completed, or.available, transfer.out, pi.case.opened, pi.loop.closed
"@

# 34. ERD
WF "$root\ER-002\07_erd_diagram.md" @"
$banner
# ER-002 — ERD (Mermaid)

```mermaid
erDiagram
    tenants ||--o{ trauma_activations : has
    tenants ||--o{ trauma_primary_survey : has
    tenants ||--o{ trauma_secondary_survey : has
    tenants ||--o{ trauma_injuries_ais : has
    tenants ||--o{ trauma_iss_score : has
    tenants ||--o{ trauma_mtp_activations : has
    tenants ||--o{ trauma_operative_log : has
    tenants ||--o{ trauma_transfers_in : has
    tenants ||--o{ trauma_transfers_out : has
    tenants ||--o{ trauma_registry_export : has
    tenants ||--o{ trauma_pi_cases : has
    tenants ||--o{ trauma_outreach_events : has
    tenants ||--o{ trauma_research_projects : has
    tenants ||--o{ trauma_prevention_programs : has
    trauma_activations ||--o{ trauma_primary_survey : has
    trauma_activations ||--o{ trauma_injuries_ais : has
    trauma_activations ||--o{ trauma_mtp_activations : triggers
    trauma_activations ||--o{ trauma_operative_log : leads_to
```

---
*Section 34 of ER-002. L1 DRAFT.*
"@

# 35. ADR
WF "$root\ER-002\08_architecture_decision_record.md" @"
$banner
# ER-002 — 5 ADRs

## ADR-001: Stack (Node + Express + pg) — per Option A
## ADR-002: Multi-Tenancy via RLS
## ADR-003: Idempotency on MTP + Transfer
## ADR-004: LLM Decision Support (NOT authority) — BRAVO rule
## ADR-005: ACS-COT Level I Compliance + NTDB Registry

Plus:
- MD-in-loop for AIS >3 coding
- 2-RN blood gate (CBAHI)
- MTP safety floor (rule-based engine never fails)
- Tier 1 never missed (activation auto-paged within 60s)

---
*Section 35 of ER-002. L1 DRAFT.*
"@

Write-Host "✅ ER-002 Part 2 done: 20 more files written (total ER-002: 35/35)"
