// filepath: tier172_bun_799_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function pain_evaluation(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureNum(req.pain_score, 'ps');
  ensureEnum(req.location, 'lo', ['head','neck','back','chest','abdomen','joint','muscle','widespread','NA']);
  ensureNum(req.duration_days, 'du'); ensureEnum(req.quality, 'qa', ['sharp','dull','burning','tingling','aching','throbbing','NA']);
  ensureBool(req.neuropathic, 'ne'); ensureNum(req.dn4_score, 'd4');
  ensureNum(req.pqas_score, 'pq'); ensureStr(req.provider, 'pr');
  return { pe_id: `pe_${Date.now()}`, patient_id: req.patient_id, score: req.pain_score, loc: req.location };
}

function nerve_block(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureEnum(req.nerve, 'ne', ['femoral','sciatic','brachial_plexus','stellate','epidural','NA']);
  ensureEnum(req.approach, 'ap', ['landmark','ultrasound','CT','fluoroscopy','NA']);
  ensureNum(req.local_volume_ml, 'lv'); ensureNum(req.local_dose_mg, 'ld');
  ensureNum(req.duration_hr, 'du'); ensureNum(req.success_pct, 'sp');
  ensureEnum(req.complication, 'co', ['none','bleeding','infection','nerve_damage','pneumothorax','NA']);
  ensureNum(req.pain_pre, 'pp'); ensureNum(req.pain_post, 'po');
  ensureStr(req.provider, 'pr');
  return { nb_id: `nb_${Date.now()}`, patient_id: req.patient_id, nerve: req.nerve, success: req.success_pct };
}

function epidural(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureNum(req.height_cm, 'hc');
  ensureNum(req.weight_kg, 'wk'); ensureNum(req.catheter_level, 'cl');
  ensureEnum(req.medication, 'md', ['bupivacaine','ropivacaine','lidocaine','morphine','fentanyl','combination','NA']);
  ensureNum(req.infusion_rate_ml_hr, 'ir'); ensureNum(req.days_in_place, 'dp');
  ensureEnum(req.outcome, 'ot', ['effective','partial','failed','dislodged','NA']);
  ensureNum(req.complication_score, 'cs'); ensureStr(req.provider, 'pr');
  return { ep_id: `ep_${Date.now()}`, patient_id: req.patient_id, med: req.medication, days: req.days_in_place };
}

function pca_pump(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureEnum(req.drug, 'dr', ['morphine','hydromorphone','fentanyl','NA']);
  ensureNum(req.dose_mg, 'ds'); ensureNum(req.lockout_min, 'lo');
  ensureNum(req.demands_24h, 'd2'); ensureNum(req.deliveries_24h, 'dv');
  ensureNum(req.pain_score_avg, 'pa'); ensureNum(req.sedation_score, 'ss');
  ensureEnum(req.disposition, 'di', ['continue','adjust','stop','NA']);
  ensureNum(req.days_in_use, 'du'); ensureStr(req.provider, 'pr');
  return { pc_id: `pc_${Date.now()}`, patient_id: req.patient_id, drug: req.drug, demands: req.demands_24h };
}

function multimodal(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureEnum(req.surgery, 'su', ['laparoscopic','open','ortho','thoracic','abdominal','NA']);
  ensureNum(req.opioid_mme_24h, 'op'); ensureNum(req.adjuvants_count, 'ac');
  ensureBool(req.acetaminophen, 'ac'); ensureBool(req.nsaid, 'ns');
  ensureBool(req.gabapentinoid, 'gp'); ensureBool(req.lidocaine, 'li');
  ensureNum(req.pain_score, 'ps'); ensureNum(req.opioid_adverse, 'oa');
  ensureStr(req.provider, 'pr');
  return { mm_id: `mm_${Date.now()}`, patient_id: req.patient_id, opioid: req.opioid_mme_24h, ps: req.pain_score };
}

function funcs() { return { pain_evaluation, nerve_block, epidural, pca_pump, multimodal }; }
module.exports = { funcs, ValidationError };