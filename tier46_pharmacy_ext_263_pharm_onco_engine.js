// filepath: tier46_pharmacy_ext_263_pharm_onco_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function chemo_regimen(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.regimen, 'reg');
  ensureNum(req.cycle, 'cycle');
  ensureNum(req.dose_reduction_pct, 'dr');
  ensureNum(req.toxicity_grade, 'tg');
  ensureEnum(req.response, 'resp', ['complete_response','partial_response','stable_disease','progression','mixed']);
  ensureEnum(req.next_cycle, 'nc', ['planned','delayed','held','discontinued']);
  return { regimen: req.regimen, cycle: req.cycle };
}
function targeted_therapy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.target, 'tgt');
  ensureStr(req.drug, 'drug');
  ensureStr(req.mutation_tested, 'mut');
  ensureNum(req.line, 'line');
  ensureEnum(req.response, 'resp', ['complete_response','partial_response','stable_disease','progression','ongoing']);
  return { drug: req.drug, target: req.target };
}
function immunotherapy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.class, 'cls', ['pdl1_inhibitor','pd1_inhibitor','ctla4_inhibitor','lag3_inhibitor','combo']);
  ensureStr(req.drug, 'drug');
  ensureStr(req.ir_ae, 'irae');
  ensureEnum(req.response, 'resp', ['complete_response','partial_response','stable_disease','progression','mixed']);
  ensureStr(req.monitoring, 'mon');
  return { drug: req.drug, class: req.class };
}
function supportive_care(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.support, 'sup');
  ensureStr(req.antiemetic, 'antiem');
  ensureStr(req.growth_factor, 'gf');
  ensureEnum(req.response, 'resp', ['tolerable','intolerable','requires_modification']);
  return { antiemetic: req.antiemetic, growth_factor: req.growth_factor };
}
function chemo_toxicity(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.agent, 'agent');
  ensureStr(req.toxicity_type, 'tox');
  ensureNum(req.grade, 'gr');
  ensureStr(req.intervention, 'int');
  ensureEnum(req.recovery, 'rec', ['none','partial','full','permanent']);
  return { agent: req.agent, toxicity: req.toxicity_type, grade: req.grade };
}

function funcs() { return { chemo_regimen, targeted_therapy, immunotherapy, supportive_care, chemo_toxicity }; }
module.exports = { funcs, ValidationError };