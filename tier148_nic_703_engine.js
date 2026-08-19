// filepath: tier148_nic_703_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function admit(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.birth_id, 'bi');
  ensureNum(req.ga_weeks, 'gw');
  ensureNum(req.birth_weight_grams, 'bw');
  ensureEnum(req.level, 'lv', ['I_well_newborn','II_special_care','III_NICU','IV_regional_NICU','unknown']);
  ensureNum(req.apgar_1, 'ap1');
  ensureNum(req.apgar_5, 'ap5');
  ensureNum(req.head_circumference_cm, 'hc');
  ensureNum(req.length_cm, 'ln');
  ensureEnum(req.resuscitation, 'rs', ['none','suction','bag_mask','CPAP','intubation','chest_compression','epinephrine','NA']);
  ensureStr(req.admit_diagnosis, 'ad');
  ensureStr(req.provider, 'pr');
  return { ad_id: `adm_${Date.now()}`, patient_id: req.patient_id, ga: req.ga_weeks, weight: req.birth_weight_grams };
}
function vent(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.mode, 'md', ['CMV','IMV','SIMV','PC_AC','PC_SIMV','VC_AC','PRVC','HFOV','NIV_NAVA','NIV_BiPAP','NIV_CPAP','RAM','NAVA','HFNC','other','NA']);
  ensureNum(req.pip_cmh2o, 'pp');
  ensureNum(req.peep_cmh2o, 'pe');
  ensureNum(req.rate_per_min, 'ra');
  ensureNum(req.fio2_pct, 'fo');
  ensureNum(req.tidal_ml_kg, 'tv');
  ensureNum(req.mve_l_min, 'mv');
  ensureEnum(req.indication, 'in', ['RDS','TTN','MAS','pneumonia','sepsis','PPHN','apnea','peri_extubation','post_surgical','other','NA']);
  ensureNum(req.duration_hr, 'du');
  ensureStr(req.provider, 'pr');
  return { vt_id: `vnt_${Date.now()}`, patient_id: req.patient_id, mode: req.mode, fio2: req.fio2_pct };
}
function feeding(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.type, 'tp', ['TPN','human_milk','donor_milk','formula_preterm','formula_term','mixed','NPO','trophic','other']);
  ensureNum(req.feed_volume_ml_kg_day, 'fv');
  ensureNum(req.feed_interval_hr, 'fi');
  ensureEnum(req.route, 'rt', ['PO','NG','OG','NJ','gastrostomy','jejunostomy','TPN','IV','other']);
  ensureBool(req.tolerance, 'to');
  ensureEnum(req.complications, 'cp', ['none','aspiration','reflux','NEC','constipation','diarrhea','other']);
  ensureNum(req.weight_gain_g_day, 'wg');
  ensureStr(req.provider, 'pr');
  return { fd_id: `fed_${Date.now()}`, patient_id: req.patient_id, type: req.type, route: req.route };
}
function sepsis_screen(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.wbc, 'wb');
  ensureNum(req.it_ratio, 'ir');
  ensureNum(req.crp, 'cr');
  ensureNum(req.culture_count, 'cc');
  ensureEnum(req.pathogen, 'pa', ['none','GBS','E_coli','S_aureus','S_epidermidis','Klebsiella','Enterococcus','Pseudomonas','Listeria','CMV','HSV','fungus','other','pending']);
  ensureEnum(req.antibiotic, 'ab', ['none','ampicillin','gentamicin','cefotaxime','ceftazidime','meropenem','vancomycin','ampicillin_neonatal','other']);
  ensureNum(req.days_antibiotic, 'da');
  ensureBool(req.meningitis, 'mn');
  ensureStr(req.provider, 'pr');
  return { ss_id: `ssn_${Date.now()}`, patient_id: req.patient_id, pathogen: req.pathogen };
}
function discharge(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.los_days, 'ld');
  ensureNum(req.discharge_weight_grams, 'dw');
  ensureEnum(req.feeding_at_discharge, 'fa', ['breast','bottle','mixed','gavage','TPN','other','NA']);
  ensureBool(req.car_seat_test, 'cs');
  ensureBool(req.hearing_screen, 'hs');
  ensureBool(req.metabolic_screen, 'ms');
  ensureBool(req.shot_hepB, 'sh');
  ensureEnum(req.followup, 'fu', ['PCP_2d','peds_specialist','home_health','early_intervention','other','NA']);
  ensureStr(req.provider, 'pr');
  return { dc_id: `nic_${Date.now()}`, patient_id: req.patient_id, los: req.los_days };
}

function funcs() { return { admit, vent, feeding, sepsis_screen, discharge }; }
module.exports = { funcs, ValidationError };