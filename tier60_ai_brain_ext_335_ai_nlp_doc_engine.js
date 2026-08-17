// filepath: tier60_ai_brain_ext_335_ai_nlp_doc_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function nlp_clinical_note(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.note_type, 'nt', ['progress','admission','discharge','consultation','procedure','nursing','ed']);
  ensureStr(req.source, 'src');
  ensureStr(req.entity_extract, 'ee');
  ensureNum(req.accuracy_estimate, 'acc');
  ensureBool(req.clinician_reviewed, 'cr');
  ensureBool(req.finalized, 'fin');
  return { note_type: req.note_type };
}
function nlp_voice_to_text(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.language, 'lang', ['english','arabic','french','urdu','hindi','spanish','other']);
  ensureNum(req.duration_min, 'dur');
  ensureNum(req.accuracy, 'acc');
  ensureNum(req.punctuation_accuracy, 'pa');
  ensureBool(req.speaker_labeled, 'sl');
  ensureStr(req.sections_identified, 'si');
  return { language: req.language };
}
function nlp_code_suggestion(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.note_text_snippet, 'nts');
  ensureStr(req.icd10_suggested, 'icd');
  ensureStr(req.cpt_suggested, 'cpt');
  ensureNum(req.confidence, 'conf');
  ensureBool(req.clinician_accepted, 'ca');
  return { icd: req.icd10_suggested };
}
function nlp_soap_auto(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.subjective, 'subj');
  ensureStr(req.objective, 'obj');
  ensureStr(req.assessment, 'assess');
  ensureStr(req.plan, 'plan');
  ensureBool(req.sections_complete, 'sc');
  ensureBool(req.provider_reviewed, 'pr');
  return { assessment: req.assessment };
}
function nlp_drug_extract(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.meds_extracted, 'me');
  ensureStr(req.dose_extracted, 'de');
  ensureStr(req.frequency_extracted, 'fe');
  ensureStr(req.duration, 'dur');
  ensureBool(req.clinician_verified, 'cv');
  return { meds: req.meds_extracted };
}

function funcs() { return { nlp_clinical_note, nlp_voice_to_text, nlp_code_suggestion, nlp_soap_auto, nlp_drug_extract }; }
module.exports = { funcs, ValidationError };