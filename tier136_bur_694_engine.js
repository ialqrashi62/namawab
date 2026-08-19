// filepath: tier136_bur_694_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function burn_assess(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.tbsa_pct, 'tb');
  ensureEnum(req.depth, 'dp', ['1st_superficial','1st_deep','2nd_superficial','2nd_deep','3rd','4th','mixed']);
  ensureEnum(req.mechanism, 'mc', ['thermal','chemical','electrical','radiation','friction','cold','inhalation']);
  ensureBool(req.inhalation_injury, 'ii');
  ensureStr(req.provider, 'pr');
  return { burn_id: `bun_${Date.now()}`, patient_id: req.patient_id, tbsa: req.tbsa_pct, depth: req.depth, mechanism: req.mechanism };
}
function fluid_resus(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.burn_id, 'bi');
  ensureNum(req.weight_kg, 'wk');
  ensureNum(req.tbsa_pct, 'tb');
  ensureEnum(req.formula, 'fm', ['Parkland','modified_Parkland','Baxter','Evans','Brooke','Galveston']);
  ensureNum(req.rate_ml_hr, 'rh');
  ensureNum(req.urine_output_ml_hr, 'uo');
  ensureStr(req.provider, 'pr');
  return { fluid_id: `flu_${Date.now()}`, patient_id: req.patient_id, formula: req.formula, rate: req.rate_ml_hr, uo: req.urine_output_ml_hr };
}
function wound_care(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.burn_id, 'bi');
  ensureEnum(req.dressing, 'dr', ['silver_sulfadiazine','mafenide','bacitracin','xeroform','acticoat','hydrocolloid','collagenase','honey','biobrane','allograft','autograft']);
  ensureEnum(req.excision, 'ex', ['none','tangential','fascial','escharectomy','amputation']);
  ensureBool(req.grafting, 'gr');
  ensureStr(req.provider, 'pr');
  ensureStr(req.site, 'si');
  return { wnd_id: `wnd_${Date.now()}`, patient_id: req.patient_id, dressing: req.dressing, excision: req.excision, grafting: req.grafting };
}
function inhalation(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.burn_id, 'bi');
  ensureBool(req.intubated, 'in');
  ensureNum(req.cxr_grade, 'cg');
  ensureBool(req.co_poisoning, 'co');
  ensureNum(req.cohb_pct, 'ch');
  ensureStr(req.provider, 'pr');
  ensureEnum(req.hyperbaric, 'hb', ['not_indicated','recommended','performed','declined','urgent']);
  return { inhal_id: `inh_${Date.now()}`, patient_id: req.patient_id, intubated: req.intubated, cohb: req.cohb_pct };
}
function rehab(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.day_post_burn, 'dp');
  ensureNum(req.range_motion_pct, 'rm');
  ensureNum(req.contracture_risk, 'cr');
  ensureBool(req.graft_healed, 'gh');
  ensureStr(req.provider, 'pr');
  ensureStr(req.pressure_garment, 'pg');
  return { rehab_id: `reb_${Date.now()}`, patient_id: req.patient_id, day: req.day_post_burn, rom: req.range_motion_pct };
}

function funcs() { return { burn_assess, fluid_resus, wound_care, inhalation, rehab }; }
module.exports = { funcs, ValidationError };
