// filepath: tier92_immunology_lab_485_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function allergy_testing(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.test_id, 'tid');
  ensureEnum(req.test_type, 'tt', ['skin_prick','intradermal','patch','specific_ige','total_ige','component','challenge','other','unknown']);
  ensureNum(req.allergens_tested, 'at');
  ensureNum(req.positive_results, 'pr');
  ensureEnum(req.histamine_control, 'hc', ['positive','negative','invalid','other','unknown']);
  ensureNum(req.wheal_size_mm, 'wsm');
  ensureNum(req.flare_size_mm, 'fsm');
  ensureStr(req.provider, 'pr');
  return { tid: req.test_id };
}
function lymphocyte_subsets(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.test_id, 'tid');
  ensureNum(req.cd3_count, 'cd3');
  ensureNum(req.cd4_count, 'cd4');
  ensureNum(req.cd8_count, 'cd8');
  ensureNum(req.cd19_count, 'cd19');
  ensureNum(req.cd16_56_count, 'cdnk');
  ensureNum(req.cd4_cd8_ratio, 'ratio');
  ensureEnum(req.cd4_category, 'cc', ['normal','mild_depletion','moderate_depletion','severe_depletion','unknown','other']);
  ensureNum(req.absolute_lymph_count, 'alc');
  ensureStr(req.provider, 'pr');
  return { tid: req.test_id };
}
function complement_levels(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.test_id, 'tid');
  ensureNum(req.c3, 'c3');
  ensureNum(req.c4, 'c4');
  ensureNum(req.ch50, 'ch50');
  ensureNum(req.ah50, 'ah50');
  ensureNum(req.c1_inhibitor, 'ci');
  ensureEnum(req.deficiency, 'def', ['c1_inhibitor','c2','c3','c4','c5','c6','c7','c8','c9','none','other','unknown']);
  ensureBool(req.function_tested, 'ft');
  ensureStr(req.provider, 'pr');
  return { tid: req.test_id };
}
function cytokine_panel(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.test_id, 'tid');
  ensureNum(req.il_2, 'il2');
  ensureNum(req.il_6, 'il6');
  ensureNum(req.tnf_alpha, 'tnf');
  ensureNum(req.ifn_gamma, 'ifn');
  ensureNum(req.il_10, 'il10');
  ensureNum(req.crp, 'crp');
  ensureEnum(req.pattern, 'pat', ['pro_inflammatory','anti_inflammatory','mixed','normal','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { tid: req.test_id };
}
function neutrophil_function(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.test_id, 'tid');
  ensureEnum(req.test_type, 'tt', ['dhr','nitroblue_tetrazolium','oxidative_burst','chemotaxis','phagocytosis','other','unknown']);
  ensureNum(req.baseline_response, 'br');
  ensureNum(req.stimulated_response, 'sr');
  ensureNum(req.fold_increase, 'fi');
  ensureEnum(req.result, 'res', ['normal','abnormal','indeterminate','pending','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { tid: req.test_id };
}

function funcs() { return { allergy_testing, lymphocyte_subsets, complement_levels, cytokine_panel, neutrophil_function }; }
module.exports = { funcs, ValidationError };

