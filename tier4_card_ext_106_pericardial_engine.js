'use strict';
// TIER4_CARD_EXT-106: Pericardial — tamponade vs pericarditis
class ValidationError extends Error {
  constructor(msg, fields = {}) {
    super(msg);
    this.name = 'ValidationError';
    this.fields = fields;
  }
}
const CITATIONS = ['ESC_Pericardial_2015', 'AHA_Pericardial_2022'];

function ensureNumber(v, field) {
  const n = Number(v);
  if (!Number.isFinite(n)) throw new ValidationError(`${field} must be number`, { [field]: v });
  return n;
}
function ensureBool(v, field) {
  if (typeof v !== 'boolean') throw new ValidationError(`${field} must be boolean`, { [field]: v });
  return v;
}
function ensureStr(v, field) {
  if (typeof v !== 'string' || !v.length) throw new ValidationError(`${field} required`, { [field]: v });
  return v;
}

function tamponade(req) {
  ensureNumber(req.sbp, 'sbp');
  ensureNumber(req.heart_rate, 'heart_rate');
  ensureNumber(req.resp_rate, 'resp_rate');
  ensureBool(req.jvd, 'jvd');
  ensureBool(req.pulsus_paradoxus, 'pulsus_paradoxus');
  ensureBool(req.muffled_heart_sounds, 'muffled_heart_sounds');
  ensureBool(req.pericardial_effusion_large, 'pericardial_effusion_large');
  ensureBool(req.ra_systolic_collapse, 'ra_systolic_collapse');
  ensureBool(req.rv_diastolic_collapse, 'rv_diastolic_collapse');

  const clinical_signs = [req.jvd, req.pulsus_paradoxus, req.muffled_heart_sounds].filter(Boolean).length;
  const echo_signs = [req.pericardial_effusion_large, req.ra_systolic_collapse, req.rv_diastolic_collapse].filter(Boolean).length;
  const hemodynamic_compromise = req.sbp < 90 || req.heart_rate > 130;

  const tamponade_likely = hemodynamic_compromise && (clinical_signs >= 2 || echo_signs >= 1);
  return {
    clinical_signs,
    echo_signs,
    hemodynamic_compromise,
    tamponade_likely,
    action: tamponade_likely ? 'emergent_pericardiocentesis_or_surgical_window' :
      hemodynamic_compromise ? 'urgent_pericardiocentesis' : 'monitor_echo_repeat',
    citations: CITATIONS,
  };
}

function pericarditis(req) {
  ensureBool(req.chest_pain, 'chest_pain');
  ensureBool(req.chest_pain_improves_with_leaning_forward, 'chest_pain_improves_with_leaning_forward');
  ensureBool(req.pericardial_friction_rub, 'pericardial_friction_rub');
  ensureBool(req.ecg_diffuse_st_elevation, 'ecg_diffuse_st_elevation');
  ensureBool(req.pericardial_effusion, 'pericardial_effusion');
  ensureNumber(req.crp, 'crp');
  ensureNumber(req.fever, 'fever');
  ensureBool(req.autoimmune, 'autoimmune');
  ensureBool(req.recent_viral, 'recent_viral');
  ensureBool(req.post_mi_weeks_2_8, 'post_mi_weeks_2_8');

  const criteria = [req.chest_pain, req.chest_pain_improves_with_leaning_forward,
    req.pericardial_friction_rub, req.ecg_diffuse_st_elevation,
    req.pericardial_effusion, req.crp > 50].filter(Boolean).length;

  let diagnosis, treatment;
  if (criteria >= 2) {
    diagnosis = req.post_mi_weeks_2_8 ? 'dressler_syndrome' :
      req.autoimmune ? 'autoimmune_pericarditis' :
        req.recent_viral ? 'viral_or_idiopathic_pericarditis' :
          req.fever >= 38 ? 'bacterial_or_malignant_pericarditis' : 'idiopathic_pericarditis';
    treatment = req.post_mi_weeks_2_8 || req.autoimmune ? 'colchicine_plus_nsaid_with_taper_and_steroids' :
      'nsaid_plus_colchicine';
  } else {
    diagnosis = 'incomplete_criteria';
    treatment = 'repeat_workup_serology_imaging';
  }
  return {
    criteria_count: criteria,
    diagnosis,
    treatment,
    citations: CITATIONS,
  };
}

module.exports = { tamponade, pericarditis, CITATIONS, ValidationError };