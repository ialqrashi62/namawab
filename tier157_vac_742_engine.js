// filepath: tier157_vac_742_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function travel_consult(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag');
  ensureStr(req.destination, 'ds');
  ensureNum(req.duration_days, 'du');
  ensureNum(req.departure_days, 'dd');
  ensureEnum(req.purpose, 'pp', ['leisure','business','mission','medical','research','vfr','pilgrimage','adoption','education','volunteer','other']);
  ensureEnum(req.risk, 'rk', ['low','moderate','high','extreme','NA']);
  ensureNum(req.vaccines_due, 'vd');
  ensureBool(req.malaria_prophylaxis, 'mp');
  ensureNum(req.meds_count, 'mc');
  ensureBool(req.pre_travel_clearance, 'pc');
  ensureStr(req.provider, 'pr');
  return { tc_id: `tvl_${Date.now()}`, patient_id: req.patient_id, dest: req.destination };
}
function altitude(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.target_altitude_m, 'ta');
  ensureNum(req.acclimatization_days, 'ad');
  ensureNum(req.ascent_rate_m_day, 'ar');
  ensureEnum(req.altitude_sickness_risk, 'ar2', ['low','moderate','high','extreme','NA']);
  ensureNum(req.spo2_predicted, 'sp');
  ensureNum(req.hct_predicted, 'hc');
  ensureBool(req.diamox_prophylaxis, 'dp');
  ensureNum(req.dexamethasone_dose_mg, 'dd');
  ensureBool(req.knowledge_warning, 'kw');
  ensureEnum(req.conditions, 'cn', ['none','cardiac','pulm','hematologic','pregnant','pediatric','other']);
  ensureStr(req.provider, 'pr');
  return { al_id: `alt_${Date.now()}`, patient_id: req.patient_id };
}
function dive_med(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag');
  ensureEnum(req.certification, 'ce', ['none','OW','AOW','Rescue','Divemaster','Instructor','NA']);
  ensureNum(req.max_depth_m, 'md');
  ensureNum(req.dives_planned, 'dp');
  ensureEnum(req.fitness_clearance, 'fc', ['cleared','cleared_with_caveat','deferred','not_cleared','NA']);
  ensureBool(req.ent_clearance, 'ec');
  ensureBool(req.cardiac_clearance, 'cc');
  ensureBool(req.pulm_clearance, 'pc');
  ensureEnum(req.dcs_history, 'dh', ['none','DCS_1','DCS_2','AGE','DCI','unknown','NA']);
  ensureNum(req.bps_dive_log, 'bl');
  ensureStr(req.provider, 'pr');
  return { dm_id: `div_${Date.now()}`, patient_id: req.patient_id };
}
function vaccination(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag');
  ensureEnum(req.vaccine, 'va', ['influenza','covid19','Tdap','HPV','pneumococcal_PCV13','pneumococcal_PPSV23','shingles_shingrix','MMR','varicella','hepatitis_A','hepatitis_B','meningococcal','typhoid','yellow_fever','rabies','japanese_encephalitis','cholera','BCG','tick_borne_enceph','hemophilus','RSV','other']);
  ensureNum(req.dose_number, 'dn');
  ensureNum(req.dose_age, 'da');
  ensureNum(req.antibody_titer, 'at');
  ensureEnum(req.contraindication, 'ci', ['none','anaphylaxis_history','immunocompromised','pregnant','acute_illness','age_restriction','other','NA']);
  ensureEnum(req.route, 'rt', ['IM','SC','ID','PO','IN','NA','other']);
  ensureBool(req.adverse_event, 'ae');
  ensureStr(req.provider, 'pr');
  return { vc_id: `vcn_${Date.now()}`, patient_id: req.patient_id, vaccine: req.vaccine };
}
function occupational(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag');
  ensureEnum(req.occupation, 'oc', ['healthcare','construction','mining','agriculture','fire_fighter','police','military','asbestos','chemical','radiation','office','driver','pilot','seafood','food_service','aviation','other','NA']);
  ensureEnum(req.exposure, 'ex', ['none','chemicals','dust','asbestos','radiation','noise','biological','ergonomic','heat','cold','vibration','other']);
  ensureBool(req.ppe_compliance, 'pc');
  ensureNum(req.exposure_years, 'ey');
  ensureNum(req.pulmonary_function_pct, 'pf');
  ensureNum(req.nerve_conduction_score, 'nc');
  ensureEnum(req.fit_duty, 'fd', ['fit','fit_with_restrictions','unfit','pending','NA']);
  ensureStr(req.provider, 'pr');
  return { oc_id: `ocp_${Date.now()}`, patient_id: req.patient_id, occupation: req.occupation };
}

function funcs() { return { travel_consult, altitude, dive_med, vaccination, occupational }; }
module.exports = { funcs, ValidationError };