// filepath: tier209_bd3_988_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function bd3_match_assessment(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.type, 'ty', ['type1','type2','type3','other','NA']);
  ensureNum(req.score_1, 's1'); ensureNum(req.score_2, 's2');
  ensureBool(req.flag_1, 'f1'); ensureBool(req.flag_2, 'f2');
  ensureEnum(req.treatment, 'tr', ['none','med1','med2','procedure','other','NA']);
  ensureNum(req.followup_days, 'fd'); ensureStr(req.provider, 'pr');
  return { assessment_id: `assessment_${Date.now()}`, patient_id: req.patient_id, type: req.type, score: req.score_1 };
}

function bd3_match_screening(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.type, 'ty', ['type1','type2','type3','other','NA']);
  ensureNum(req.score_1, 's1'); ensureNum(req.score_2, 's2');
  ensureBool(req.flag_1, 'f1'); ensureBool(req.flag_2, 'f2');
  ensureEnum(req.treatment, 'tr', ['none','med1','med2','procedure','other','NA']);
  ensureNum(req.followup_days, 'fd'); ensureStr(req.provider, 'pr');
  return { screening_id: `screening_${Date.now()}`, patient_id: req.patient_id, type: req.type, score: req.score_1 };
}

function bd3_match_followup(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.type, 'ty', ['type1','type2','type3','other','NA']);
  ensureNum(req.score_1, 's1'); ensureNum(req.score_2, 's2');
  ensureBool(req.flag_1, 'f1'); ensureBool(req.flag_2, 'f2');
  ensureEnum(req.treatment, 'tr', ['none','med1','med2','procedure','other','NA']);
  ensureNum(req.followup_days, 'fd'); ensureStr(req.provider, 'pr');
  return { followup_id: `followup_${Date.now()}`, patient_id: req.patient_id, type: req.type, score: req.score_1 };
}

function bd3_match_procedure(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.type, 'ty', ['type1','type2','type3','other','NA']);
  ensureNum(req.score_1, 's1'); ensureNum(req.score_2, 's2');
  ensureBool(req.flag_1, 'f1'); ensureBool(req.flag_2, 'f2');
  ensureEnum(req.treatment, 'tr', ['none','med1','med2','procedure','other','NA']);
  ensureNum(req.followup_days, 'fd'); ensureStr(req.provider, 'pr');
  return { procedure_id: `procedure_${Date.now()}`, patient_id: req.patient_id, type: req.type, score: req.score_1 };
}

function bd3_match_outcome(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.type, 'ty', ['type1','type2','type3','other','NA']);
  ensureNum(req.score_1, 's1'); ensureNum(req.score_2, 's2');
  ensureBool(req.flag_1, 'f1'); ensureBool(req.flag_2, 'f2');
  ensureEnum(req.treatment, 'tr', ['none','med1','med2','procedure','other','NA']);
  ensureNum(req.followup_days, 'fd'); ensureStr(req.provider, 'pr');
  return { outcome_id: `outcome_${Date.now()}`, patient_id: req.patient_id, type: req.type, score: req.score_1 };
}

function funcs() { return { bd3_match_assessment, bd3_match_screening, bd3_match_followup, bd3_match_procedure, bd3_match_outcome }; }
module.exports = { funcs, ValidationError };