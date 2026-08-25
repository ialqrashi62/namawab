// lib/benchmark/Competitors.js — honest 0-5 scores from 2026-08-25 verified audit
// Scores: NamaMedical column reflects VERIFIED app state (not aspiration).
'use strict';

const SYSTEMS = {
  Epic:      { clinical:5, interoperability:4, revenue_cycle:5, patient_engagement:5, ai_maturity:3, ksa_compliance:1 },
  OracleHealth: { clinical:5, interoperability:4, revenue_cycle:5, patient_engagement:4, ai_maturity:3, ksa_compliance:2 },
  MEDITECH:  { clinical:4, interoperability:3, revenue_cycle:4, patient_engagement:3, ai_maturity:2, ksa_compliance:1 },
  athena:    { clinical:3, interoperability:4, revenue_cycle:5, patient_engagement:4, ai_maturity:3, ksa_compliance:1 },
  TrakCare:  { clinical:4, interoperability:4, revenue_cycle:4, patient_engagement:3, ai_maturity:2, ksa_compliance:2 },
  NamaMedical: { clinical:4, interoperability:3, revenue_cycle:3, patient_engagement:2, ai_maturity:3, ksa_compliance:5 },
};

const DIMENSIONS = ['clinical', 'interoperability', 'revenue_cycle', 'patient_engagement', 'ai_maturity', 'ksa_compliance'];

const NOTES = {
  clinical: '300+ specialty groups incl. NICU-III/IV, IVF/PGD, BMT, transplant, burn ICU, IR, nuclear med (verified tier corpus).',
  interoperability: 'HL7v2 + FHIR R4 + NPHIES routers exist; device-interface depth below Epic/Cerner fleets.',
  revenue_cycle: 'ZATCA phase2 live; claims scrubbing/ERA/denial workflows thinner than athena/Epic Resolute.',
  patient_engagement: 'Portal basics present; self-service scheduling/telehealth depth is the gap.',
  ai_maturity: 'LangChain RAG shim + pgvector ready; ingestion pipeline pending (GAP-4); CDSS logic scattered.',
  ksa_compliance: 'NATIVE strength: NPHIES client, ZATCA phase2, PDPL consent fields, bilingual AR-first UI — leads all five references.',
};

module.exports = { SYSTEMS, DIMENSIONS, NOTES };
