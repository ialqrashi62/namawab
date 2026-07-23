# Interventional Cardiology — Department Blueprint

> **Department:** Interventional Cardiology (طب القلب التداخلي)
> **Group:** Internal Medicine
> **Owner:** CMO + Interventional Cardiology Lead
> **Status:** 🟡 In Progress
> **Created:** 2026-07-23

---

## 📋 Department Overview

Interventional Cardiology provides catheter-based treatment of structural heart disease, coronary artery disease, and peripheral vascular disease. Includes diagnostic cath, PCI, TAVR, MitraClip, Watchman, PFO/ASD closure, and complex bifurcation PCI.

### Sub-Units (4)

1. **Diagnostic Cath Lab** — left + right heart cath, hemodynamics
2. **PCI Lab** — balloon angioplasty, stenting (DES/BVS), IVUS/OCT, FFR
3. **Structural Heart Lab** — TAVR, MitraClip, Watchman, PFO/ASD closure
4. **Peripheral Vascular Lab** — carotid, renal, iliac, lower extremity interventions

### Key Metrics (target)

| Metric | Target |
|---|---|
| Door-to-balloon (STEMI) | < 90 min |
| Contrast-induced AKI rate | < 5% |
| Vascular access complication | < 2% |
| 30-day MACE after PCI | < 5% |
| Stent thrombosis (1y) | < 1% |
| Radiation dose (mSv) | < 7 (diagnostic), < 15 (intervention) |

---

## 🎯 Clinical Workflows (CMO)

### STEMI activation pathway

```
Patient arrives ED with chest pain
        ↓
ECG within 10 min
        ↓
STEMI criteria (ST↑ ≥ 1mm in 2 contiguous leads, new LBBB)
        ↓
Activate cath lab (single page)
        ↓
Door-to-balloon target 90 min
        ↓
PCI (aspiration, balloon, DES)
        ↓
Post-PCI: dual antiplatelet (ASA + ticagrelor/prasugrel)
        ↓
Cardiac rehab referral
        ↓
30-day follow-up
```

### PCI decision tree

| Lesion complexity | Strategy |
|---|---|
| Type A (simple) | DES single stent |
| Type B1 (moderate) | DES single, may need IVUS |
| Type B2 (moderate-complex) | DES, possible 2-stent |
| Type C (complex) | IVUS/OCT guided, may need rotablation, atherectomy |
| LM (left main) | Heart team discussion; CABG vs PCI |
| CTO (chronic total occlusion) | Antegrade/retrograde approach |

### Pre-PCI checklist (mandatory)

- [ ] Indication documented (stable/unstable angina, NSTEMI, STEMI)
- [ ] Informed consent signed (PDPL + procedure)
- [ ] Dual antiplatelet: ASA 325 mg loading + P2Y12 (clopidogrel 600mg / ticagrelor 180mg / prasugrel 60mg)
- [ ] Anticoagulation: heparin 70-100 U/kg IV (target ACT 250-300s) or bivalirudin
- [ ] Renal function: eGFR > 60 → standard; 30-60 → hydration + minimize contrast; < 30 → nephrology consult
- [ ] Pregnancy test (for women of childbearing age)
- [ ] Allergies: contrast, aspirin, latex
- [ ] Vitals: BP, HR, SpO2, weight

### Post-PCI management

| Time | Action |
|---|---|
| 0-24h | Dual antiplatelet, monitor access site, ECG q8h, troponin q8h |
| 24-48h | Discharge criteria: stable hemodynamics, no access complications, CK normal or trending down |
| 1 week | Wound check, medication review |
| 1 month | Stress test (if not done pre-PCI), LVEF echo, statin optimization |
| 6 month | Consider DAPT de-escalation if stable |
| 12 month | Annual cardiologist visit |

---

## 🗂 Sub-Department Catalog

| Sub-dept | Sub-units | Procedures |
|---|---|---|
| Diagnostic Cath | 1 | LHC, RHC, hemodynamics |
| Coronary Intervention | 1 | PCI, DES, IVUS, OCT, FFR, rotablation |
| Structural Heart | 1 | TAVR, MitraClip, Watchman, PFO/ASD |
| Peripheral Vascular | 1 | Carotid stenting, renal denervation, atherectomy |

---

## 🤖 AI Engine (AI Engineer)

### Pre-PCI risk score (SYNTAX + SYNTAX II)

```javascript
function calculateSyntaxScore({ lesions }) {
    // SYNTAX score: anatomy-based, 0-60+
    // Based on lesion complexity, location, bifurcation, etc.
    let total = 0;
    for (const l of lesions) {
        let lesionScore = 0;
        if (l.location === 'LM') lesionScore += 5;  // left main
        else if (l.location === 'LAD_proximal') lesionScore += 3.5;
        // ... (full SYNTAX algorithm: 12 factors)
        total += lesionScore;
    }
    return {
        score: total,
        risk: total >= 33 ? 'high' : total >= 23 ? 'intermediate' : 'low',
        recommendation: total >= 33 ? 'CABG_recommended' : 'PCI_recommended'
    };
}

function syntaxScoreII({ syntaxAnatomy, age, sex, lvef, creatinine, lvef, copd, pvd }) {
    // SYNTAX II: anatomy + clinical variables, predicts 4y mortality for PCI vs CABG
    // Returns comparison
    return { pci_mortality: 'X%', cabg_mortality: 'Y%', recommended: pci < cabg ? 'PCI' : 'CABG' };
}
```

### FFR/iFR decision (functional assessment)

```javascript
function assessFFR({ ffrValue, ierValue, restPd, paPressure }) {
    // FFR: ratio of distal coronary pressure to aortic pressure during hyperemia
    // iFR: instantaneous wave-free ratio (no hyperemia needed)
    const ffrDecision = ffrValue < 0.75 ? 'ischemia_significant_PCI_recommended'
                      : ffrValue < 0.80 ? 'borderline_consider_ivus'
                      : 'defer_pci';
    const ifrDecision = ierValue < 0.89 ? 'ischemia_significant_PCI_recommended'
                      : ierValue < 0.94 ? 'borderline_repeat_or_ivus'
                      : 'defer_pci';
    return { ffrDecision, ifrDecision, recommendation: ffrValue ? ffrDecision : ifrDecision };
}
```

### RAG chain (TAVR evaluation)

```python
chain_tavr = (
    Retriever(vectorstore, k=5)  # ACC/AHA TAVR guidelines + EuroScore II calc
    | PromptTemplate.from_template("""Patient: {age}{sex}, {comorbidities}.
        STS score: {sts}, EuroScore II: {euro}.
        TAVR vs SAVR: {decision}""")
    | llm_gpt4
    | StrOutputParser()
)
```

---

## 💾 Database (Architect)

### New Tables (e70 PCI series)

```sql
-- migrations/e70_pci_procedures_up.sql
CREATE TABLE pci_procedures (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL,
    patient_id INTEGER NOT NULL,
    operator_id INTEGER,
    cath_lab_id INTEGER,
    indication VARCHAR(100),  -- 'STEMI', 'NSTEMI', 'UA', 'stable_angina'
    approach VARCHAR(50),     -- 'radial', 'femoral', 'brachial'
    lesion_count INTEGER,
    syntax_score INTEGER,
    ffr_used BOOLEAN,
    ivus_used BOOLEAN,
    oct_used BOOLEAN,
    contrast_ml INTEGER,
    fluoroscopy_min DECIMAL(5,1),
    radiation_dose_msv DECIMAL(6,2),
    heparin_units INTEGER,
    act_target_seconds INTEGER,
    act_achieved_seconds INTEGER,
    stents_used JSONB,  -- [{brand, size, location}]
    success BOOLEAN,
    complications TEXT,
    procedure_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    FORCE ROW LEVEL SECURITY
);
ALTER TABLE pci_procedures ENABLE ROW LEVEL SECURITY;
CREATE POLICY rls_pci_procedures ON pci_procedures
    USING (tenant_id = current_setting('app.tenant_id')::int)
    WITH CHECK (tenant_id = current_setting('app.tenant_id')::int);

CREATE TABLE structural_heart_procedures (
    id SERIAL PRIMARY KEY,
    tenant_id INTEGER NOT NULL,
    patient_id INTEGER NOT NULL,
    operator_id INTEGER,
    procedure_type VARCHAR(100),  -- 'TAVR', 'MitraClip', 'Watchman', 'PFO_closure'
    device_brand VARCHAR(50),
    device_size VARCHAR(20),
    valve_anatomy TEXT,
    preop_sts_score DECIMAL(4,1),
    preop_euroscore DECIMAL(4,1),
    approach VARCHAR(50),
    success BOOLEAN,
    complications TEXT,
    procedure_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    FORCE ROW LEVEL SECURITY
);
ALTER TABLE structural_heart_procedures ENABLE ROW LEVEL SECURITY;
CREATE POLICY rls_structural_heart ON structural_heart_procedures
    USING (tenant_id = current_setting('app.tenant_id')::int)
    WITH CHECK (tenant_id = current_setting('app.tenant_id')::int);
```

### Engines (5)

```javascript
// interventional_cardiology_engine.js
function calculateSyntaxScore(lesions) { /* see above */ }
function syntaxScoreII(syntaxAnatomy, age, sex, lvef, creatinine, copd, pvd) { /* see above */ }
function assessFFR({ ffrValue, ierValue }) { /* see above */ }
function calculateSTS({ age, sex, lvef, recentMI, chf, ... }) { /* STS short-term mortality */ }
function tavrRiskBenefit({ age, sts, euroscore, frailty, porcelainAorta }) { /* see above */ }

module.exports = { calculateSyntaxScore, syntaxScoreII, assessFFR, calculateSTS, tavrRiskBenefit };
```

### Routes (10)

```
GET    /api/interventional-card/procedures/patient/:patient_id
POST   /api/interventional-card/pci
POST   /api/interventional-card/structural-heart
POST   /api/interventional-card/calculate/syntax
POST   /api/interventional-card/calculate/syntax-ii
POST   /api/interventional-card/calculate/ffr
POST   /api/interventional-card/calculate/sts
POST   /api/interventional-card/ai/tavr-decision
POST   /api/interventional-card/ai/pci-risk
POST   /api/interventional-card/ai/cabg-vs-pci
```

---

## 🎨 UX/UI

### Layout pick: **Layout A (3-col clinical workspace)** with cath lab emphasis

| Color | Primary | Use |
|---|---|---|
| Critical (red-rose) | #be123c | Active STEMI banner |
| Caution (amber) | #d97706 | Borderline FFR |
| Safe (emerald) | #059669 | Successful procedure |
| Neutral (slate) | #475569 | Default |

### Wireframes (4)

1. **PCI Pre-Procedure** — checklist, consent, labs, medication review
2. **PCI Procedure** — vitals, ACT, contrast, fluoroscopy timer, stent inventory
3. **TAVR Evaluation** — STS calc, EuroScore, frailty assessment, Heart Team
4. **Post-PCI Follow-up** — DAPT reminder, access site check, 1m/6m/12m follow-up

### i18n (top 15)

| Key | EN | AR |
|---|---|---|
| ic.tab.pci | PCI | قسطرة قلبية |
| ic.tab.structural | Structural Heart | قلب بنيوي |
| ic.tab.peripheral | Peripheral | وعائي محيطي |
| ic.lbl.syntax | SYNTAX Score | درجة SYNTAX |
| ic.lbl.sts | STS Score | درجة STS |
| ic.lbl.ffr | FFR/iFR | FFR/iFR |
| ic.lbl.contrast | Contrast (mL) | الصبغة (مل) |
| ic.lbl.dapt | Dual Antiplatelet | مضاد ثنائي للصفائح |
| ic.btn.activate_stemi | ⚠️ Activate STEMI | ⚠️ تفعيل STEMI |
| ic.btn.calculate_syntax | Calculate SYNTAX | حساب SYNTAX |
| ic.msg.activate_stemi | CRITICAL: STEMI protocol activated, cath lab paged | حرج: تم تفعيل بروتوكول STEMI |
| ic.msg.aki_warning | Monitor renal function: contrast + risk factors | مراقبة وظائف الكلى |
| ic.err.renal_contraindication | eGFR too low for contrast without preparation | وظائف الكلى منخفضة |

---

## ✅ Compliance

| Standard | Item | Status |
|---|---|---|
| JCI PCI.4 | Qualified interventional cardiology team | ✅ |
| JCI MMU.4 | Crash cart + thrombolytics available | ✅ |
| JCI FMS.4 | Backup power for cath lab | ✅ |
| JCI FMS.6 | STEMI activation protocol | ✅ |
| ISO 9001 §7.5 | Documented cath lab procedure manual | ✅ |
| ISO 13485 | Device tracking (TAVR, stents) | ✅ |
| PDPL | Patient consent for procedure + imaging | ✅ |
| NPHIES | PCI bundle (PCI-DRG-001) | ✅ |

---

## 🧪 Tests

- Unit: SYNTAX, SYNTAX II, FFR, STS, TAVR
- Integration: PCI procedure POST, structural heart POST, all calc routes
- E2E: STEMI activation → cath lab → PCI → post-op → 30-day follow-up
- Compliance: JCI QPS 7.1 (door-to-balloon KPI), MMU.4 (crash cart check)

---

## 🚦 Status

- ✅ README + synthesis
- 🟡 Migration drafted
- 🟡 Engine drafted
- 🟡 Routes drafted
- ⏸ Tests pending
- ⏸ Commit pending

**Last commit:** pending
**Loop:** 1 of 4
