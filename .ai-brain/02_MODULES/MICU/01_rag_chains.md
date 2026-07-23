# MICU — RAG Chains (LangGraph)

## Chain 1: Sepsis Triage & Bundle
- **Trigger:** qSOFA ≥2 or suspected infection + organ dysfunction
- **Steps:**
  1. Check SIRS + qSOFA
  2. Recommend lactate + blood culture
  3. Suggest broad-spectrum ABX (1h target)
  4. Fluid 30 mL/kg (if hypotensive or lactate ≥4)
  5. Norepinephrine if MAP <65 after fluid
  6. Reassess at 3h, 6h
- **Output:** Bundle checklist + hourly goals

## Chain 2: ARDS Management
- **Trigger:** P/F ratio <300 on 2 ABG
- **Steps:**
  1. Confirm ARDS (Berlin criteria)
  2. Calculate PBW
  3. Set Vt = 6 mL/kg PBW
  4. Plateau pressure goal ≤30
  5. PEEP/FiO2 table (ARDSNet)
  6. Consider prone if P/F <150
  7. Daily sedation vacation + SBT
- **Output:** Vent settings + monitoring plan

## Chain 3: Ventilator Liberation
- **Trigger:** Daily screening
- **Steps:**
  1. Cause of respiratory failure resolved
  2. Spontaneous breathing (no pressors, no paralysis)
  3. Oxygenation: P/F >200, PEEP ≤8, FiO2 ≤0.5
  4. RSBI calculation (f/Vt <105)
  5. SBT (T-piece or PS 5-8, 30-120 min)
  6. Extubation if SBT passed
- **Output:** Liberation readiness score

## Chain 4: GI Bleed Resuscitation
- **Trigger:** Hematemesis, melena, hematochezia + instability
- **Steps:**
  1. 2 large-bore IVs, type & cross
  2. Resuscitation (crystalloid, then blood)
  3. CBC, coags, LFTs
  4. Reversal (FFP, platelets, vit K, PCC)
  5. Octreotide drip (variceal)
  6. IV PPI
  7. Urgent EGD (within 12h)
- **Output:** Resuscitation + endoscopy plan

## Chain 5: Shock Differentiation
- **Trigger:** Hypotension + clinical uncertainty
- **Steps:**
  1. Assess pump (echo, cold vs warm)
  2. Assess volume (IVC, fluid responsiveness)
  3. Assess resistance (warm shock = vasodilatory)
  4. Check lactate, SvO2 (if PAC/CVC)
  5. Pick vasopressor by type
  6. Reassess
- **Output:** Shock type + drug selection

## Vector Index
- **Top conditions** (50 ICU scenarios) with severity, management
- **Critical values** (lactate, K, glucose) → action mapping
- **Drug dosing** (vasoactive drips, sedation, paralytic, insulin)
- **Ventilator protocols** (ARDSNet, weaning)
- **Renal replacement** (CRRT indications, dosing)
