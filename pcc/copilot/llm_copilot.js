/**
 * pcc/copilot/llm_copilot.js
 *
 * MOCK LLM co-pilot for PCC sandbox. NOT for production use.
 *
 * SAFETY PRINCIPLES (per AGENTS.md §2.2 + BLUEPRINT v2):
 * 1. AI never makes clinical decisions — it summarizes + cites
 * 2. Every output must include citation (PMID, guideline, dept protocol)
 * 3. No PHI ever sent to "LLM" (mock returns deterministic responses)
 * 4. System prompt explicitly disclaims: "AI is decision SUPPORT, not authority"
 * 5. Hallucination guard: if not in knowledge base, returns "uncertain"
 *
 * In production:
 * - Replace `mockQuery` with real LLM call (OpenAI, Bedrock, etc.)
 * - Add PII redaction layer
 * - Add LangSmith / Helicone observability
 * - Add content safety filter
 */
'use strict';

/* ============================================================
 * Knowledge base (cite-only, never autonomous)
 * Each entry: { topic, source, pmid?, snippet }
 * ============================================================ */
const KB = {
  'stemi_emergent': {
    source: 'ACC/AHA 2023 STEMI Guidelines',
    pmid: '37289960',
    snippet: 'STEMI is a medical emergency. Door-to-balloon time goal: <90 minutes. Immediate cath lab activation; aspirin 325 mg chewed; anticoagulation per protocol.',
  },
  'rds_surfactant': {
    source: 'NRP 2022 + TPL_SURFACTANT',
    snippet: 'Poractant alfa (Curosurf) 200 mg/kg intratracheal for RDS in preterm infants. Repeat dose 100 mg/kg if needed.',
  },
  'cardiogenic_shock': {
    source: 'SCAI 2023 Cardiogenic Shock Consensus',
    pmid: '36977395',
    snippet: 'SCAI shock staging A-E guides escalation. Stage C-E requires urgent mechanical circulatory support (IABP, Impella, VA-ECMO).',
  },
  'sepsis_1hour': {
    source: 'Surviving Sepsis Campaign 2021',
    pmid: '34599691',
    snippet: 'Sepsis 1-hour bundle: lactate, blood culture before antibiotics, broad-spectrum antibiotic, 30 mL/kg crystalloid for hypotension, vasopressor if MAP <65.',
  },
  'cva_tpa': {
    source: 'AHA/ASA 2019 Acute Ischemic Stroke',
    pmid: '31662002',
    snippet: 'IV tPA eligibility within 4.5h of symptom onset. Exclusion: BP >185/110, INR >1.7, recent surgery, GI bleed, platelets <100k.',
  },
  'burn_parkland': {
    source: 'ABA Burn Center Referral Criteria + TPL_PARKLAND',
    snippet: 'Parkland formula: 4 mL × kg × %TBSA, half in first 8h, half in next 16h. Lactated Ringers preferred crystalloid.',
  },
  'dka_protocol': {
    source: 'ADA 2024 + TPL_DKA',
    snippet: 'DKA: IVF resuscitation, insulin infusion 0.1 U/kg/h, potassium replacement when K+ <5.2, monitor anion gap closure.',
  },
  'neonatal_sepsis': {
    source: 'Kaiser Sepsis Calculator + CDC GBS 2020',
    pmid: '32004155',
    snippet: 'Neonatal sepsis risk: GBS+ maternal status, ROM duration, maternal fever, clinical signs. Empirical antibiotics for high risk.',
  },
  'pe_wells': {
    source: 'Wells Score 2001',
    pmid: '11453701',
    snippet: 'Wells PE score: DVT signs, PE likely, HR>100, immobilization, prior DVT/PE, hemoptysis, malignancy. >6 = high, 2-6 = moderate, <2 = low.',
  },
  'afib_cha2ds2vasc': {
    source: 'ACC/AHA 2023 AFib + ESC 2020 AFib',
    snippet: 'CHA2DS2-VASc: CHF, HTN, Age>=75 (2), DM, Stroke/TIA (2), Vascular disease, Age 65-74, Sex female. Score >=2 (men) or >=3 (women) = anticoagulation indicated.',
  },
};

/* ============================================================
 * Disclaimer (mandatory prefix on every output)
 * ============================================================ */
const DISCLAIMER = 'AI CO-PILOT (NOT CLINICAL AUTHORITY): ';

/* ============================================================
 * detectTopic — keyword matching (deterministic)
 * Returns: matched topic key or null
 * ============================================================ */
function detectTopic(prompt) {
  const p = prompt.toLowerCase();
  const rules = [
    { kw: ['stemi', 'st elevation', 'door-to-balloon', 'primary pci'], topic: 'stemi_emergent' },
    { kw: ['rds', 'respiratory distress syndrome', 'surfactant', 'curosurf', 'poractant'], topic: 'rds_surfactant' },
    { kw: ['neonatal sepsis', 'gbs', 'early onset sepsis', 'newborn sepsis'], topic: 'neonatal_sepsis' },
    { kw: ['cardiogenic shock', 'impella', 'iabp', 'va-ecmo', 'va ecmo'], topic: 'cardiogenic_shock' },
    { kw: ['sepsis', 'septic shock', 'qsofa', 'lactate', 'vasopressor'], topic: 'sepsis_1hour' },
    { kw: ['stroke', 'tpa', 'alteplase', 'ischemic stroke', 'door to needle'], topic: 'cva_tpa' },
    { kw: ['burn', 'parkland', 'tbsa', 'escharotomy', 'inhalation injury'], topic: 'burn_parkland' },
    { kw: ['dka', 'diabetic ketoacidosis', 'anion gap'], topic: 'dka_protocol' },
    { kw: ['pulmonary embolism', 'pe', 'wells score', 'hemoptysis'], topic: 'pe_wells' },
    { kw: ['afib', 'atrial fibrillation', 'cha2ds2', 'anticoagulation afib'], topic: 'afib_cha2ds2vasc' },
  ];
  for (const r of rules) {
    if (r.kw.some(k => p.includes(k))) return r.topic;
  }
  return null;
}

/* ============================================================
 * mockQuery — pretend to call LLM
 * Returns: { text, citation, confidence, red_flags, follow_up_questions }
 * ============================================================ */
function mockQuery(prompt) {
  const topic = detectTopic(prompt);
  if (!topic) {
    return {
      disclaimer: DISCLAIMER,
      text: 'I could not identify a specific clinical topic in your question. Please rephrase with a specific condition, drug, or protocol name.',
      citation: null,
      confidence: 0.0,
      red_flags: [],
      follow_up_questions: [
        'What is the specific clinical question?',
        'Which guideline are you referencing?',
        'Which patient population (adult, pediatric, neonatal)?',
      ],
    };
  }
  const entry = KB[topic];
  return {
    disclaimer: DISCLAIMER,
    text: entry.snippet,
    citation: {
      source: entry.source,
      pmid: entry.pmid || null,
      topic_key: topic,
    },
    confidence: 0.95,
    red_flags: ['AI never makes clinical decisions — verify with attending physician.'],
    follow_up_questions: [
      'What is the patient context (age, comorbidities, severity)?',
      'What is the time-criticality of the situation?',
    ],
  };
}

/* ============================================================
 * Public API: ask(prompt)
 * ============================================================ */
function ask(prompt) {
  if (typeof prompt !== 'string' || !prompt.trim()) {
    return {
      disclaimer: DISCLAIMER,
      text: 'Empty or invalid prompt.',
      citation: null,
      confidence: 0.0,
      red_flags: ['Empty prompt provided.'],
      follow_up_questions: [],
    };
  }
  // Mandatory audit log (in production, this would be hash-chained to DB)
  if (process.env.PCC_COPILOT_AUDIT) {
    process.env.PCC_COPILOT_AUDIT.split('|').forEach(s => {
      // eslint-disable-next-line no-console
      if (s.trim()) console.log(`[COPILOT-AUDIT] ${new Date().toISOString()} prompt="${prompt.slice(0, 80)}"`);
    });
  }
  return mockQuery(prompt);
}

/* ============================================================
 * Test helper
 * ============================================================ */
function getAllTopics() {
  return Object.keys(KB);
}

module.exports = {
  ask,
  detectTopic,
  getAllTopics,
  KB,
  DISCLAIMER,
};
