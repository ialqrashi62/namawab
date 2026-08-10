# PROMPT ENGINEERING + LEGAL COMPLIANCE PLAN
**Last updated:** 2026-08-10

---

## 1. Prompt engineering

### 1.1 System prompts (per orchestrator)

#### Clinical Q&A orchestrator

```
You are a clinical decision support AI for NamaMedical Hospital OS in Saudi Arabia.
Your role is to answer clinical questions with evidence-based medicine, citing Saudi MOH protocols, WHO guidelines, and hospital SOPs when available.

## Critical rules:
1. NEVER diagnose a patient without physician confirmation
2. NEVER prescribe without pharmacist verification
3. NEVER override a doctor's clinical decision
4. ALWAYS cite your sources (chunk_id, doc_title, version)
5. ALWAYS state confidence level (high/medium/low)
6. ALWAYS escalate to physician if confidence < medium
7. NEVER share PHI outside the tenant context
8. ALWAYS respect Saudi cultural and religious norms

## Output format:
{
  "answer": "<clinical answer in Arabic + English>",
  "sources": [
    { "chunk_id": "...", "doc_title": "...", "version": "...", "url": "..." }
  ],
  "confidence": "high | medium | low",
  "escalation_required": true | false,
  "reasoning": "<brief reasoning>"
}

## Language:
- Primary: Arabic (Saudi dialect)
- Secondary: English (medical terminology)
- Mixed when appropriate
```

#### Voice dictation orchestrator

```
You are a medical voice transcription AI.
Your role is to transcribe Arabic or English doctor dictation into structured clinical notes.

## Rules:
1. Transcribe EXACTLY what is said (no inference)
2. Use Saudi medical terminology
3. Preserve numbers + units exactly
4. Mark uncertain words as [inaudible]
5. Do NOT add clinical content not spoken
6. Output: SOAP format if requested
```

#### Drug-interaction AI

```
You are a drug-interaction AI for Saudi hospitals.
Your role is to check drug interactions using Saudi FDA database + WHO + hospital formulary.

## Rules:
1. ALWAYS cite the source database (Saudi FDA / WHO / Hospital formulary)
2. ALWAYS provide severity (contraindicated / major / moderate / minor)
3. ALWAYS provide mechanism (CYP450, pharmacodynamic, etc.)
4. ALWAYS provide clinical recommendation
5. ALWAYS cite studies (if available)
6. NEVER override pharmacist's clinical decision
```

#### Coding AI

```
You are a medical coding AI.
Your role is to suggest ICD-10 / SNOMED CT / CPT codes for clinical encounters.

## Rules:
1. Use Saudi coding guidelines + WHO ICD-10 2024
2. ALWAYS cite the source
3. ALWAYS provide code description
4. ALWAYS provide confidence (high/medium/low)
5. NEVER replace human coder — suggest only
```

### 1.2 Context (per request)

```json
{
  "user": {
    "id": "usr_123",
    "role": "doctor",
    "specialty": "cardiology",
    "tenant_id": "tnt_456",
    "language_preference": "ar-SA"
  },
  "patient": {
    "id_hash": "sha256:abc...",
    "age_bucket": "60-70",
    "gender": "M",
    "encounter_type": "OPD",
    "active_problems_hash": ["sha256:xyz..."]
  },
  "session": {
    "request_id": "req_789",
    "trace_id": "trace_abc",
    "previous_messages_hash": ["sha256:..."]
  },
  "tenant_context": {
    "facility_type": "general_hospital",
    "country": "SA",
    "compliance_profile": ["ZATCA", "NPHIES", "CBAHI", "PDPL"]
  }
}
```

### 1.3 Few-shot examples (per orchestrator)

Each orchestrator has 5-10 curated examples for in-context learning.

```json
{
  "examples": [
    {
      "input": "What's the first-line treatment for stage 2 hypertension in a 55yo male with diabetes?",
      "output": {
        "answer": "...",
        "sources": [...],
        "confidence": "high"
      }
    },
    ...
  ]
}
```

### 1.4 Prompt versioning

- All prompts in `namaweb/prompts/{orchestrator}_v{N}.md`
- Versioned in git
- A/B tested before deployment
- Rollback capability

### 1.5 Token budget management

- Per-request budget: 4000 tokens (input + output)
- Per-tenant monthly budget
- Per-user daily budget
- Caching of common queries
- Fallback to smaller model if budget exceeded

---

## 2. Legal & compliance docs

### 2.1 Saudi PDPL (Personal Data Protection Law)

#### Compliance overview

- Data controller registration with SDAIA
- Privacy notice on every screen with PHI
- Consent management
- Right to access (patient can request their data)
- Right to correct (patient can correct their data)
- Right to delete (right to be forgotten, with healthcare exception)
- Data breach notification to SDAIA within 72h
- Data Protection Officer (DPO) appointed

#### Implementation in code

```js
// data_subject_rights.js

// Right to access
app.get('/api/patients/me/data-export',
  requireAuth,
  requireRole('patient'),
  async (req, res) => {
    const data = await exportPatientData(req.user.patient_id);
    res.json(data);
  }
);

// Right to delete
app.delete('/api/patients/me',
  requireAuth,
  requireRole('patient'),
  async (req, res) => {
    // Soft-delete (medical records retained per Saudi law)
    await softDeletePatient(req.user.patient_id);
    res.json({ status: 'soft-deleted' });
  }
);

// Privacy notice
app.use((req, res, next) => {
  res.setHeader('X-Privacy-Policy-URL', 'https://jumanasoft.com/privacy');
  next();
});
```

### 2.2 ZATCA Phase 2

#### Compliance overview

- e-Invoice generation with cryptographic stamp
- XML/JSON format with UBL 2.1
- Cryptographic stamp (XAdES-BES)
- QR code with TLV format
- Hash chaining for audit
- Reporting to ZATCA portal
- Clearance vs Reporting (B2B vs B2C)
- Invoice numbering (sequential, gap-free)

#### Implementation

- `zatca_phase2.js` — invoice generation, CSID, compliance check
- `zatca_submit_fail_closed_guard_test.js` — fail-closed when no CSID

### 2.3 NPHIES

#### Compliance overview

- Eligibility check (270/271)
- Pre-authorization (278)
- Claim submission (837)
- Remittance advice (835)
- Rejection codes
- Real-time vs batch
- Prior authorization number tracking

#### Implementation

- `nphies_client.js` — eligibility, claim, pre-auth, remittance
- `e11_insurance_engine.js` — claim state machine

### 2.4 CBAHI OVR

#### Compliance overview

- 27 standards across 7 chapters
- Patient safety
- Quality improvement
- Infection control
- Medication safety
- Surgery safety
- Falls prevention
- Pressure ulcers
- Blood transfusion safety

#### Implementation

- Quality module: incidents, CAPA, KPIs
- Patient safety: WHO checklist, falls risk, pressure ulcer risk
- Medication safety: BCMA, double-check, allergy check
- Infection control: surveillance, isolation, AMS

### 2.5 SFDA (Saudi FDA)

#### Compliance overview

- Drug formulary compliance
- Controlled substance tracking
- Adverse drug reaction (ADR) reporting
- Recall management
- Lot/batch tracking
- Cold chain monitoring

#### Implementation

- Pharmacy module: formulary, controlled substance log
- ADR report: `pharmacy_dispense.notes` (with side effect tracking)
- Recall: search by batch_number

### 2.6 HIPAA (US — for international expansion)

#### Compliance overview

- Privacy Rule
- Security Rule
- Breach Notification Rule
- Enforcement Rule
- Business Associate Agreements (BAA)

#### Implementation

- Privacy: PDPL covers it
- Security: encryption, access control, audit (HIPAA-aligned)
- Breach: 72h notification (HIPAA: 60 days; PDPL: 72h)
- BAA: customer contracts

### 2.7 GDPR (EU — for international expansion)

#### Compliance overview

- Right to access
- Right to erasure
- Right to portability
- Right to object
- Data Protection Officer
- DPIA

#### Implementation

- Similar to PDPL
- Data portability: JSON export
- DPIA: documented in `.ai-brain/00_SYSTEM/SECURITY_PENTEST_PLAN_AR.md`

---

## 3. Legal documents (in `docs/legal/`)

| Document | Language | Purpose |
|---|---|---|
| Privacy notice | AR + EN | Patient-facing |
| Terms of service | AR + EN | Hospital-facing |
| Data processing agreement | AR + EN | Hospital ↔ jumanaSoft |
| Business associate agreement | EN | US expansion |
| Sub-processor list | EN | Transparency |
| Cookie policy | AR + EN | Web |
| Breach notification template | AR + EN | SDAIA + patients |
| Patient consent forms | AR + EN | Per procedure type |
| BAA template | EN | US expansion |

---

## 4. Compliance roadmap

| Quarter | Initiative |
|---|---|
| Q3 2026 | SDAIA registration + DPO appointment + privacy notice |
| Q4 2026 | CBAHI OVR audit |
| Q1 2027 | SOC 2 Type II |
| Q2 2027 | ISO 27001 |
| Q3 2027 | HIPAA attestation |
| Q4 2027 | GDPR + EU expansion |

---

End of prompt engineering + legal compliance plan.
