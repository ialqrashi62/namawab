// filepath: tier137_nlp_668_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function ner_extract(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.document_id, 'did');
  ensureStr(req.text, 'tx');
  ensureEnum(req.entity_type, 'et', ['disease','drug','procedure','lab','anatomy','finding','severity','dosage','frequency','date','provider','patient']);
  ensureNum(req.confidence, 'cf');
  return { ner_id: `ner_${Date.now()}`, document_id: req.document_id, entity_type: req.entity_type, confidence: req.confidence };
}
function sentiment(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.text, 'tx');
  ensureEnum(req.sentiment, 'sn', ['positive','neutral','negative','urgent','concerned']);
  ensureNum(req.score, 'sc');
  ensureStr(req.context, 'cx');
  return { sent_id: `sen_${Date.now()}`, sentiment: req.sentiment, score: req.score, context: req.context };
}
function summarization(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.document_id, 'did');
  ensureStr(req.summary, 'sm');
  ensureEnum(req.format, 'fm', ['SOAP','discharge','radiology','pathology','operative','consult','progress','handoff']);
  ensureNum(req.original_length, 'ol');
  ensureNum(req.summary_length, 'sl');
  ensureStr(req.model, 'md');
  return { sum_id: `sum_${Date.now()}`, document_id: req.document_id, format: req.format, summary: req.summary };
}
function icd_coding(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.document_id, 'did');
  ensureStr(req.icd_code, 'ic');
  ensureStr(req.description, 'ds');
  ensureNum(req.confidence, 'cf');
  ensureEnum(req.coding_system, 'cs', ['ICD10','ICD11','SNOMED','LOINC','RxNorm','CPT','HCPCS']);
  ensureBool(req.primary, 'pr');
  return { code_id: `icd_${Date.now()}`, document_id: req.document_id, code: req.icd_code, system: req.coding_system };
}
function transcription(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.audio_id, 'aid');
  ensureStr(req.transcript, 'tr');
  ensureNum(req.duration_sec, 'ds');
  ensureNum(req.word_count, 'wc');
  ensureEnum(req.speaker, 'sp', ['provider','patient','family','witness','interpreter','unknown']);
  ensureStr(req.language, 'ln');
  return { tr_id: `tra_${Date.now()}`, audio_id: req.audio_id, transcript: req.transcript, speaker: req.speaker };
}

function funcs() { return { ner_extract, sentiment, summarization, icd_coding, transcription }; }
module.exports = { funcs, ValidationError };
