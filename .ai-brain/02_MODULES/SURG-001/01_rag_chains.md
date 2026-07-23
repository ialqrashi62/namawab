# SURG-001 — RAG Chains

## Chain 1: Acute Abdomen
- **Trigger:** Severe abdominal pain + peritoneal signs
- **Steps:**
  1. Vitals, exam
  2. Labs (CBC, chem, lipase, lactate, coags)
  3. Imaging (AXR, CT, US)
  4. Resuscitation (NPO, IV, NGT)
  5. Surgical consult
  6. Decision: OR vs observation
- **Output:** Disposition + plan

## Chain 2: Bowel Obstruction
- **Trigger:** Obstipation + distension + vomiting
- **Steps:**
  1. Vitals, exam
  2. Labs
  3. AXR (look for SBO pattern)
  4. CT if unclear
  5. NGT decompression
  6. Resuscitation
  7. OR if: peritonitis, ischemia, failed conservative
- **Output:** Treatment plan

## Chain 3: GI Bleed
- **Trigger:** Hematemesis, melena, hematochezia
- **Steps:**
  1. Resuscitation
  2. Type & cross
  3. Reversal if anticoag
  4. Endoscopy (urgent EGD)
  5. Surgery if: failed endoscopy, perforation
- **Output:** Treatment plan

## Chain 4: Trauma
- **Trigger:** Mechanism + injury
- **Steps:**
  1. ATLS primary survey (ABCDE)
  2. FAST exam
  3. CT if stable
  4. OR if unstable + positive FAST
  5. Damage control if severe
- **Output:** OR or observation

## Chain 5: Anesthesia Planning
- **Trigger:** Pre-op clinic
- **Steps:**
  1. ASA class
  2. Airway assessment
  3. Cardiac risk
  4. Pulmonary risk
  5. NPO status
  6. Anesthesia plan
- **Output:** Anesthesia type + risk
