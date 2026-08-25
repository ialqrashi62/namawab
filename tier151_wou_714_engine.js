// filepath: tier151_wou_714_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function wound_assess(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.type, 'tp', ['diabetic','venous','arterial','pressure_stage_1','pressure_stage_2','pressure_stage_3','pressure_stage_4','unstageable','surgical','traumatic','burn','vasculitic','mixed','other','NA']);
  ensureStr(req.location, 'lc');
  ensureNum(req.length_cm, 'ln');
  ensureNum(req.width_cm, 'wd');
  ensureNum(req.depth_cm, 'dp');
  ensureEnum(req.stage, 'sg', ['I','II','III','IV','unstageable','DTPI','NA','unknown']);
  ensureEnum(req.exudate, 'ex', ['none','serous','sanguineous','serosanguineous','purulent','NA']);
  ensureEnum(req.odor, 'od', ['none','foul','sweet','NA','unknown']);
  ensureBool(req.undermining, 'un');
  ensureBool(req.tunneling, 'tn');
  ensureEnum(req.tissue, 'ti', ['granulation','slough','eschar','epithelial','mixed','necrotic','NA']);
  ensureBool(req.biofilm, 'bf');
  ensureStr(req.provider, 'pr');
  return { wa_id: `waa_${Date.now()}`, patient_id: req.patient_id, type: req.type, stage: req.stage };
}
function dressing(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.wound_id, 'wi');
  ensureEnum(req.dressing_type, 'dt', ['gauze','hydrocolloid','hydrogel','foam','film','alginate','collagen','antimicrobial_silver','antimicrobial_honey','iodine','PHMB','hydrofiber','NPWT_VAC','compression','unna_boot','other']);
  ensureNum(req.change_frequency_days, 'cf');
  ensureEnum(req.exudate_amount, 'ea', ['none','light','moderate','heavy','NA']);
  ensureBool(req.intact_at_change, 'ic');
  ensureBool(req.skin_maceration, 'sm');
  ensureBool(req.allergic_reaction, 'ar');
  ensureStr(req.provider, 'pr');
  return { dr_id: `drs_${Date.now()}`, patient_id: req.patient_id, wound_id: req.wound_id, type: req.dressing_type };
}
function debridement(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.wound_id, 'wi');
  ensureEnum(req.method, 'me', ['sharp_surgical','sharp_conservative','mechanical','enzymatic','autolytic','biological_maggot','hydrosurgical','ultrasonic','other']);
  ensureNum(req.tissue_removed_g, 'tr');
  ensureNum(req.blood_loss_ml, 'bl');
  ensureEnum(req.depth, 'dp', ['superficial','partial_thickness','full_thickness','subcutaneous','fascia','muscle','bone','NA']);
  ensureNum(req.duration_min, 'du');
  ensureBool(req.performed_at_bedside, 'pb');
  ensureEnum(req.anesthesia, 'an', ['none','topical','local','regional','conscious_sedation','general','other']);
  ensureStr(req.provider, 'pr');
  return { db_id: `dbm_${Date.now()}`, patient_id: req.patient_id, method: req.method };
}
function healing_progress(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.wound_id, 'wi');
  ensureNum(req.week, 'wk');
  ensureNum(req.area_cm2, 'ar');
  ensureNum(req.area_pct_change, 'ap');
  ensureNum(req.depth_cm, 'dp');
  ensureNum(req.healing_index, 'hi');
  ensureEnum(req.trajectory, 'tr', ['healing','plateau','deteriorating','static','NA','unknown']);
  ensureBool(req.complete_closure, 'cc');
  ensureNum(req.weeks_to_closure, 'wc');
  ensureStr(req.provider, 'pr');
  return { hp_id: `hpg_${Date.now()}`, patient_id: req.patient_id, trajectory: req.trajectory };
}
function wound_bio(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.wound_id, 'wi');
  ensureEnum(req.method, 'me', ['swab_culture','aspiration','biopsy','PCR','NA','unknown']);
  ensureEnum(req.organism, 'og', ['none','Staph_aureus','Staph_epidermidis','Strep_pyogenes','Pseudomonas','E_coli','Enterococcus','Proteus','Klebsiella','MRSA','VRE','fungus','mixed','other','NA','pending']);
  ensureEnum(req.sensitivity, 'se', ['sensitive','intermediate','resistant','NA','pending','unknown']);
  ensureNum(req.colony_count, 'cc');
  ensureBool(req.biofilm_present, 'bf');
  ensureBool(req.systemic_infection, 'si');
  ensureStr(req.provider, 'pr');
  return { wb_id: `wbi_${Date.now()}`, patient_id: req.patient_id, organism: req.organism };
}

function funcs() { return { wound_assess, dressing, debridement, healing_progress, wound_bio }; }
module.exports = { funcs, ValidationError };