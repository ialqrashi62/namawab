// filepath: tier31_nephrology_ext_189_dialysis_access_engine.js
// TIER31_NEPHROLOGY-189: Dialysis access
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function av_fistula(req) {
  ensureStr(req.access_id, 'access_id');
  ensureEnum(req.side, 'side', ['left_arm','right_arm','left_leg','right_leg','other']);
  ensureEnum(req.type, 'type', ['radiocephalic','brachiocephalic','brachiobasilic','snuffbox','other']);
  ensureNumber(req.maturity_weeks, 'maturity');
  ensureNumber(req.flow_ml_min, 'flow');
  ensureNumber(req.diameter_mm, 'diam');
  ensureEnum(req.complication, 'comp', ['none','stenosis','thrombosis','infection','aneurysm','steal_syndrome','other']);
  let status;
  if (req.maturity_weeks < 6) status = 'immature_fistula_wait';
  else if (req.flow_ml_min < 300) status = 'low_flow_review_for_failure';
  else if (req.complication === 'thrombosis') status = 'thrombosis_urgent_intervention';
  else if (req.complication === 'stenosis') status = 'stenosis_angioplasty_review';
  else status = 'av_fistula_functioning';
  return { status, flow: req.flow_ml_min };
}

function av_graft(req) {
  ensureStr(req.access_id, 'access_id');
  ensureEnum(req.type, 'type', ['ptfe_loop','ptfe_straight','biological_he_pro_graft','other']);
  ensureEnum(req.location, 'loc', ['forearm','upper_arm','thigh','chest_wall','other']);
  ensureNumber(req.flow_ml_min, 'flow');
  ensureEnum(req.complication, 'comp', ['none','stenosis','thrombosis','infection','pseudoaneurysm','seroma','other']);
  ensureEnum(req.intervention, 'intervention', ['none','angioplasty','thrombectomy','revision','ligation','other']);
  let status;
  if (req.complication === 'thrombosis' && req.intervention === 'none') status = 'thrombosis_urgent_thrombectomy';
  else if (req.complication === 'infection') status = 'graft_infection_antibiotics_review';
  else if (req.complication === 'stenosis' && req.intervention === 'angioplasty') status = 'stenosis_angioplasty_completed';
  else if (req.flow_ml_min < 600) status = 'low_graft_flow_monitor';
  else status = 'av_graft_functioning';
  return { status, g: req.type };
}

function tunneled_catheter(req) {
  ensureStr(req.catheter_id, 'cath_id');
  ensureEnum(req.site, 'site', ['right_ij','left_ij','right_subclavian','left_subclavian','right_femoral','left_femoral','other']);
  ensureStr(req.insertion_date, 'ins_date');
  ensureNumber(req.days_in_place, 'days');
  ensureBool(req.catheter_dysfunction, 'dys');
  ensureBool(req.infection_signs, 'inf');
  let status;
  if (req.infection_signs) status = 'catheter_infection_remove_culture';
  else if (req.days_in_place > 90 && !req.catheter_dysfunction) status = 'catheter_long_term_consider_avf';
  else if (req.catheter_dysfunction) status = 'catheter_dysfunction_tpa_lock';
  else status = 'tunneled_catheter_functioning';
  return { status, days: req.days_in_place };
}

function peritoneal_access(req) {
  ensureStr(req.access_id, 'access_id');
  ensureEnum(req.catheter_type, 'cath', ['tenckhoff','coiled','straight','swan_neck','presternal','other']);
  ensureEnum(req.insertion_technique, 'tech', ['laparoscopic','open','percutaneous','other']);
  ensureNumber(req.break_in_period_weeks, 'break_in');
  ensureEnum(req.complication, 'comp', ['none','leak','infection','catheter_migration','hernia','hemoperitoneum','other']);
  let status;
  if (req.complication === 'leak') status = 'peritoneal_leak_rest_pd';
  else if (req.complication === 'infection') status = 'peritonitis_antibiotics_review';
  else if (req.complication === 'catheter_migration') status = 'catheter_migration_review';
  else status = 'pd_access_functioning';
  return { status, type: req.catheter_type };
}

function access_monitoring(req) {
  ensureStr(req.access_id, 'access_id');
  ensureEnum(req.q_a_monitoring, 'monitor', ['monthly','quarterly','semi_annual','annual','none']);
  ensureNumber(req.flow_ml_min, 'flow');
  ensureBool(req.stenosis_signs, 'stenosis');
  ensureBool(req.infection_signs, 'inf');
  ensureBool(req.sound_normal, 'sound');
  let status;
  if (req.infection_signs) status = 'access_infection_urgent_workup';
  else if (req.stenosis_signs || !req.sound_normal) status = 'access_surveillance_abnormal_refer';
  else if (req.q_a_monitoring === 'none') status = 'no_monitoring_establish_protocol';
  else if (req.flow_ml_min < 500 && req.flow_ml_min >= 0) status = 'low_flow_investigate';
  else status = 'access_monitoring_appropriate';
  return { status, f: req.flow_ml_min };
}

function funcs() { return { av_fistula, av_graft, tunneled_catheter, peritoneal_access, access_monitoring }; }
module.exports = { funcs, ValidationError };