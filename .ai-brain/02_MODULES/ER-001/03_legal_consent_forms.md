---
module_id: ER-001
section: 08_operations
template_ref: TPL:DEPT
generated: 2026-07-23
---

# ER-001 Legal & Consent Forms (PDPL-aligned)

## Consent Forms (10 types — PDPL + JCI)

### 1. General Treatment Consent
**Purpose:** Consent for all routine treatment within the facility
**Capture:** At registration or first encounter
**Required for:** All patients
**Revocable:** Yes (patient can withdraw at any time)
**AR/EN:** Both languages

**EN Text:**
"I, [Patient Name], hereby consent to receive medical treatment, including but not limited to: history taking, physical examination, vital signs monitoring, routine diagnostic tests, routine medications, and nursing care, as deemed necessary by the treating healthcare team.

I understand that:
1. Medicine is not an exact science, and outcomes cannot be guaranteed
2. I have the right to refuse any specific treatment
3. My medical information will be kept confidential per PDPL regulations
4. I can withdraw this consent at any time

Signature: _________________ Date: _________ Witness: _________________"

**AR Text:**
"أنا، [اسم المريض]، أوافق على تلقي العلاج الطبي، بما في ذلك على سبيل المثال لا الحصر: أخذ التاريخ المرضي، الفحص البدني، مراقبة العلامات الحيوية، الفحوصات التشخيصية الروتينية، الأدوية الروتينية، والرعاية التمريضية، حسب ما يراه فريق الرعاية الصحية المعالج ضرورياً.

أفهم أن:
1. الطب ليس علماً دقيقاً، ولا يمكن ضمان النتائج
2. يحق لي رفض أي علاج محدد
3. ستظل معلوماتي الطبية سرية وفقاً لأنظمة PDPL
4. يمكنني سحب هذه الموافقة في أي وقت

التوقيع: _________________ التاريخ: _________ الشاهد: _________________"

### 2. Specific Procedure Consent
**Purpose:** Consent for specific invasive procedures
**Capture:** Before procedure
**Required for:** Surgery, endoscopy, biopsy, LP, central line, transfusion
**Revocable:** Yes (until procedure starts)
**AR/EN:** Both languages

**EN Text:**
"I consent to undergo the procedure: [Procedure Name]
Indication: [Clinical Reason]
Risks: [List specific risks, e.g., bleeding, infection, organ injury]
Benefits: [Expected benefits]
Alternatives: [List alternatives including no treatment]

I have had the opportunity to ask questions, and my questions have been answered to my satisfaction.

Performing MD: _________________ Date: _________
Patient Signature: _________________ Witness: _________________"

### 3. Data Sharing Consent (Internal)
**Purpose:** Consent for sharing patient data with internal care team
**Capture:** At registration
**Required for:** All patients
**Revocable:** Yes
**Scope:** Treating team (MD, RN, specialists, pharmacists, etc.)

### 4. Data Sharing Consent (External)
**Purpose:** Consent for sharing data with other providers/payers/researchers
**Capture:** At registration, opt-in
**Required for:** Insurance (NPHIES), external referrals
**Revocable:** Yes
**Scope:** Specific recipient or category

### 5. AI-Assisted Care Consent
**Purpose:** Consent for AI-driven clinical decision support
**Capture:** At registration, opt-in (can opt out)
**Required for:** AI features (triage, ECG interpretation, etc.)
**Revocable:** Yes (falls back to rule-based algorithms)
**Disclosed:**
- Model card (accuracy, limitations, training data)
- Right to opt out
- Human-in-loop for critical decisions

**EN Text:**
"I consent to the use of artificial intelligence (AI) in my care. AI may be used for:
- Triage (suggesting acuity level)
- ECG interpretation
- Lab interpretation
- Drug interaction checking
- Clinical decision support

I understand that:
1. AI is advisory, not a replacement for human judgment
2. A qualified healthcare professional will review all AI recommendations
3. I can opt out at any time, in which case rule-based systems will be used instead
4. AI models have been validated for accuracy but may not be perfect
5. My data will be processed per PDPL and the AI Ethics Policy

Opt-in: ☐ Yes  ☐ No
Signature: _________________ Date: _________"

### 6. Research Use Consent
**Purpose:** Consent for de-identified data use in research
**Capture:** At registration, opt-in
**Required for:** Clinical research, AI training, quality improvement
**Revocable:** Yes (withdraw, data already in study may continue)
**Scope:** Specific study or general

**EN Text:**
"I consent to the use of my de-identified medical data for research purposes, including but not limited to:
- Clinical research studies
- Quality improvement projects
- AI model training and validation
- Publications and presentations

I understand that:
1. All identifying information will be removed before use
2. No personally identifiable information will be published
3. I will not receive direct benefit from research use
4. I can withdraw at any time

Opt-in: ☐ Yes  ☐ No
Signature: _________________ Date: _________"

### 7. Teaching Consent
**Purpose:** Consent for use in medical education
**Capture:** At registration, opt-in
**Required for:** Use in teaching rounds, case presentations
**Revocable:** Yes
**Scope:** Internal teaching only (NOT external publications without separate consent)

### 8. Marketing Consent
**Purpose:** Consent for use in marketing materials
**Capture:** At registration, opt-in
**Required for:** Testimonials, photos in brochures, social media
**Revocable:** Yes
**Scope:** Specific use or general

### 9. Telemedicine Consent
**Purpose:** Consent for remote consultation
**Capture:** Before telemedicine encounter
**Required for:** Tele-ED, tele-consult
**Revocable:** Yes
**Disclosed:**
- Recording (if any)
- Encryption
- Right to in-person alternative

### 10. Blood / Blood Products Transfusion Consent
**Purpose:** Consent for blood transfusion
**Capture:** Before transfusion
**Required for:** Any blood product administration
**Revocable:** Yes (until transfusion starts)
**Disclosed:**
- Risks (transfusion reactions, infection)
- Alternatives (autologous, directed)
- Right to refuse

**EN Text:**
"I consent to receive blood / blood products transfusion:
Product: [e.g., PRBC, FFP, Platelets, Cryoprecipitate]
Type: [Autologous / Directed / Allogeneic]
Volume: [mL or units]
Risks: Allergic reaction, febrile reaction, TRALI, hemolytic reaction, infection (HIV, HBV, HCV - very low risk with modern screening)
Alternatives: Autologous transfusion, directed donation, no transfusion

I have had the opportunity to ask questions, and I understand the risks and benefits.

Patient Signature: _________________ Date: _________ Witness: _________________"

## Capacity Assessment (for AMA + Refusal)

### Clinical Capacity Criteria (4-part)
1. **Understanding:** Patient understands the information
2. **Appreciation:** Patient appreciates how it applies to them
3. **Reasoning:** Patient can reason about treatment options
4. **Communication:** Patient can communicate a choice

### AMA Form (EN)
```
PATIENT REFUSAL OF MEDICAL ADVICE (AMA)
----------------------------------------

Patient: _________________ MRN: _________ Date: _________
Capacity Assessment:
  ☐ Understanding (patient understands the information)
  ☐ Appreciation (patient appreciates the consequences)
  ☐ Reasoning (patient can reason about options)
  ☐ Communication (patient can communicate a choice)
  ☐ No impairment (no drugs, no altered mental status, no coercion)

Risks Explained:
  ☐ Risk of death
  ☐ Risk of permanent disability
  ☐ Risk of worsening condition
  ☐ Other: _________

Alternatives Offered:
  ☐ Admission for observation
  ☐ Treatment with follow-up
  ☐ Return if symptoms worsen
  ☐ Other: _________

I have explained the risks of refusing care to the patient.
The patient understands the risks and still chooses to leave.

Patient Signature: _________________ Date: _________
Witness Signature: _________________ Date: _________
MD Signature: _________________ Date: _________
```

## Patient Bill of Rights (PDPL + JCI)

### ER-001 Specific Rights

1. **Right to emergency care regardless of ability to pay**
2. **Right to be informed of diagnosis, treatment, prognosis**
3. **Right to consent or refuse treatment**
4. **Right to privacy and confidentiality of medical information**
5. **Right to access own medical record (within 30 days)**
6. **Right to request correction of inaccurate information**
7. **Right to know names and roles of care team**
8. **Right to pain management**
9. **Right to interpreter services if needed**
10. **Right to file complaint without retaliation**
11. **Right to be free from abuse, neglect, exploitation**
12. **Right to have advance directive honored (if not in conflict with emergency care)**

## Privacy Policy (PDPL-aligned)

### Key Sections

1. **Data Controller:** NamaMedical Hospital
2. **Data Protection Officer:** dpo@namamedical.com
3. **Purpose of Processing:** Treatment, payment, healthcare operations, research (with consent)
4. **Categories of Data:** PHI, demographics, billing, clinical images
5. **Data Retention:** 10 years (clinical), 7 years (admin)
6. **Patient Rights:** Access, rectification, erasure (with medical exception), restriction, portability, objection
7. **Cross-border:** Data stays in KSA per SDAIA regulations
8. **Contact for Complaints:** SDAIA, MOH, hospital DPO
9. **Updates:** Policy reviewed annually, changes communicated via portal

## Records of Processing Activities (ROPA)

| Activity | Purpose | Legal Basis | Categories | Recipients | Retention |
|----------|---------|-------------|------------|------------|-----------|
| ED triage | Treatment | Vital interests | PHI | Care team | 10y |
| Lab orders | Diagnosis | Treatment | Lab data | Lab, MD | 10y |
| Imaging | Diagnosis | Treatment | Images | Radiologist, MD | 10y |
| Medication admin | Treatment | Treatment | PHI + drug | Pharmacy, MD | 10y |
| Insurance claim | Payment | Contract | Diagnosis, procedure, cost | NPHIES, payer | 10y |
| Quality improvement | Healthcare ops | Legitimate interest | De-identified | QA team | 10y |
| Research (with consent) | Research | Explicit consent | De-identified | Research team | Per protocol |

---
*Section 08.c of ER-001. Owner: CQO + Legal. L4 validated.*
