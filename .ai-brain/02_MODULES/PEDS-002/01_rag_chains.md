# PEDS-002 — RAG Chains

## Chain 1: Premature Care
- **Trigger:** Admission of <32 weeks preterm
- **Steps:**
  1. Thermoregulation (incubator, double-walled)
  2. Respiratory support (CPAP if RDS)
  3. Surfactant (early rescue if needed)
  4. Nutrition (TPN + trophic feeds)
  5. Neuroprotection (minimal handling)
  6. Sepsis surveillance
- **Output:** Care plan with weight-based dosing

## Chain 2: Neonatal Sepsis
- **Trigger:** Clinical signs + risk factors
- **Steps:**
  1. Blood culture + CBC + CRP
  2. Empiric ABX (ampicillin + gentamicin)
  3. LP if stable
  4. Supportive (fluids, pressors)
  5. Targeted ABX based on culture
- **Output:** Treatment plan

## Chain 3: Hyperbilirubinemia
- **Trigger:** Visible jaundice
- **Steps:**
  1. Total + direct bilirubin
  2. Plot on nomogram
  3. Phototherapy if above threshold
  4. Exchange transfusion if severe
  5. Continue feeding
- **Output:** Phototherapy prescription

## Chain 4: NEC
- **Trigger:** Abdominal distension + bloody stools + systemic signs
- **Steps:**
  1. Hold feeds
  2. NG decompression
  3. ABX (amp + gent + metro)
  4. Serial AXRs
  5. Surgical consult if perforation
- **Output:** NEC staging + treatment

## Chain 5: HIE
- **Trigger:** Low Apgar + cord pH <7.0
- **Steps:**
  1. Therapeutic hypothermia (cooling blanket 33.5°C × 72h)
  2. Neuroprotective care
  3. EEG monitoring
  4. MRI at day 7-10
  5. Multidisciplinary follow-up
- **Output:** HIE care plan
