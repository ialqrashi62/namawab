// filepath: tier168_ped_784_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function well_child(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age_months, 'am'); ensureNum(req.weight_kg, 'wk');
  ensureNum(req.height_cm, 'hc'); ensureNum(req.head_cm, 'hd');
  ensureEnum(req.feeding, 'fd', ['breast','formula','mixed','solids','NA']);
  ensureEnum(req.development, 'dv', ['normal','delayed','regression','NA']);
  ensureNum(req.immunizations_count, 'ic'); ensureNum(req.next_visit_days, 'nv');
  ensureStr(req.provider, 'pr');
  return { wc_id: `wc_${Date.now()}`, patient_id: req.patient_id, age: req.age_months, dev: req.development };
}

function growth_chart(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age_months, 'am'); ensureNum(req.weight_kg, 'wk');
  ensureNum(req.height_cm, 'hc'); ensureNum(req.bmi, 'bm');
  ensureNum(req.weight_z, 'wz'); ensureNum(req.height_z, 'hz');
  ensureEnum(req.percentile_band, 'pb', ['<5','5-15','15-50','50-85','85-95','>95','NA']);
  ensureEnum(req.trend, 'tr', ['stable','gaining','losing','faltering','NA']);
  ensureStr(req.provider, 'pr');
  return { gc_id: `gc_${Date.now()}`, patient_id: req.patient_id, band: req.percentile_band, trend: req.trend };
}

function immunization_peds(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age_months, 'am'); ensureEnum(req.vaccine, 'vc', ['HepB','DTaP','Hib','PCV13','IPV','Rotavirus','MMR','Varicella','HepA','NA']);
  ensureNum(req.dose_number, 'dn'); ensureNum(req.doses_total, 'dt');
  ensureBool(req.contraindication, 'ci'); ensureNum(req.observation_min, 'ob');
  ensureBool(req.ae, 'ae'); ensureBool(req.up_to_date, 'ud');
  ensureStr(req.provider, 'pr');
  return { ip_id: `ip_${Date.now()}`, patient_id: req.patient_id, vaccine: req.vaccine, dose: req.dose_number };
}

function developmental_screen(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age_months, 'am'); ensureEnum(req.tool, 'tl', ['ASQ','MCHAT','PEDS','survey','NA']);
  ensureNum(req.score, 'sc'); ensureEnum(req.domain_concern, 'dc', ['none','motor','language','cognitive','social','multiple','NA']);
  ensureBool(req.referral_made, 'rm'); ensureNum(req.referral_count, 'rc');
  ensureEnum(req.disposition, 'di', ['normal','monitor','refer','therapy','NA']);
  ensureStr(req.provider, 'pr');
  return { ds_id: `ds_${Date.now()}`, patient_id: req.patient_id, tool: req.tool, dom: req.domain_concern };
}

function adolescent_care(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureNum(req.height_cm, 'hc');
  ensureNum(req.weight_kg, 'wk'); ensureEnum(req.tanner_stage, 'ts', ['I','II','III','IV','V','NA']);
  ensureEnum(req.mental_health_screen, 'mh', ['PHQ','GAD','none','NA']);
  ensureBool(req.substance_use_screen, 'su'); ensureBool(req.sexual_health_screen, 'sh');
  ensureEnum(req.disposition, 'di', ['normal','follow_up','referral','NA']);
  ensureStr(req.provider, 'pr');
  return { ac_id: `ac_${Date.now()}`, patient_id: req.patient_id, age: req.age, tanner: req.tanner_stage };
}

function funcs() { return { well_child, growth_chart, immunization_peds, developmental_screen, adolescent_care }; }
module.exports = { funcs, ValidationError };