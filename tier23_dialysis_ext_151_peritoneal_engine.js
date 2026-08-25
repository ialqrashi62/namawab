// filepath: tier23_dialysis_ext_151_peritoneal_engine.js
// TIER23_DIALYSIS-151: Peritoneal dialysis, PET test, UF, peritonitis
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function pet_test(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.d_p_cr, 'd_p_cr');
  ensureNumber(req.d4_d0, 'd4_d0');
  ensureEnum(req.transport_type, 'transport_type', ['high','high_average','low_average','low','unknown','other']);
  ensureNumber(req.ultrafiltration_4h_ml, 'uf_4h');
  ensureEnum(req.dextrose_concentration, 'dextrose', ['1_5','2_5','4_25','icodextrin','other']);
  let status;
  if (req.transport_type === 'high' && req.ultrafiltration_4h_ml < 400) status = 'high_transporter_icodextrin_overnight';
  else if (req.transport_type === 'low' && req.ultrafiltration_4h_ml < 200) status = 'low_transporter_extended_dwell';
  else if (req.d4_d0 > 0.81) status = 'pet_high_transporter_short_dwells';
  else if (req.d4_d0 < 0.5) status = 'pet_low_transporter_long_dwells';
  else status = 'pet_classified_average';
  return { status, transport: req.transport_type };
}

function peritonitis(req) {
  ensureStr(req.episode_id, 'episode_id');
  ensureNumber(req.wbc_cells_mm3, 'wbc');
  ensureNumber(req.neutrophil_pct, 'neut');
  ensureBool(req.cloudy_effluent, 'cloudy');
  ensureBool(req.culture_positive, 'culture');
  ensureEnum(req.organism, 'organism', ['coag_neg_staph','staph_aureus','pseudomonas','e_coli','klebsiella','candida','culture_negative','mixed','other']);
  ensureNumber(req.days_since_start, 'days');
  let status;
  if (req.wbc_cells_mm3 >= 100 && req.neutrophil_pct >= 50) status = 'peritonitis_diagnosed_start_intraperitoneal_abx';
  else if (req.organism === 'candida') status = 'candida_peritonitis_remove_catheter_antifungal';
  else if (req.organism === 'pseudomonas' && req.days_since_start > 5) status = 'pseudomonas_consider_catheter_removal';
  else if (req.days_since_start >= 5 && req.wbc_cells_mm3 > 100) status = 'persistent_peritonitis_reassess_catheter';
  else status = 'peritonitis_monitor';
  return { status, wbc: req.wbc_cells_mm3 };
}

function uf_capacity(req) {
  ensureStr(req.session_id, 'session_id');
  ensureNumber(req.fill_volume_l, 'fill');
  ensureNumber(req.drain_volume_l, 'drain');
  ensureEnum(req.dextrose, 'dextrose', ['1_5','2_5','4_25','icodextrin','amino_acid','other']);
  ensureNumber(req.dwell_time_h, 'dwell');
  let net = req.drain_volume_l - req.fill_volume_l;
  let status;
  if (req.dextrose === 'icodextrin' && net < 0.2) status = 'icodextrin_low_uf_review_membrane';
  else if (req.dextrose === '4_25' && net < 0.4) status = 'high_dextrose_low_uf_membrane_failure';
  else if (net > 0.8) status = 'good_ultrafiltration';
  else status = 'adequate_ultrafiltration';
  return { status, net_uf: Math.round(net * 100) / 100 };
}

function pd_adequacy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.weekly_ktv, 'ktv');
  ensureNumber(req.pet_crcl, 'crcl');
  ensureEnum(req.modality, 'modality', ['capd','apd_ccpd','apd_tidal','apd_nipd','other']);
  ensureNumber(req.residual_kidney_function_ml_min, 'rkf');
  let status;
  if (req.weekly_ktv < 1.7) status = 'pd_adequacy_below_target_1_7';
  else if (req.weekly_ktv >= 2.0) status = 'pd_adequate';
  else if (req.residual_kidney_function_ml_min > 5) status = 'rkf_contributing_review_pet';
  else status = 'pd_borderline_adequacy';
  return { status, weekly_ktv: req.weekly_ktv };
}

function catheter_pd(req) {
  ensureStr(req.catheter_id, 'catheter_id');
  ensureEnum(req.type, 'type', ['tenckhoff_double_cuffed','tenckhoff_single_cuffed','coiled','straight','swan_neck','presto','other']);
  ensureBool(req.exit_site_clean, 'exit_site');
  ensureBool(req.tunnel_clean, 'tunnel');
  ensureNumber(req.days_since_insertion, 'days');
  ensureEnum(req.complication, 'complication', ['none','exit_site_infection','tunnel_infection','cuff_extrusion','leak','herniation','obstruction','migration','other']);
  let status;
  if (req.days_since_insertion < 14) status = 'early_catheter_break_in_period';
  else if (req.complication === 'cuff_extrusion') status = 'cuff_extrusion_abx_assess_removal';
  else if (req.complication === 'tunnel_infection') status = 'tunnel_infection_abx_assess_removal';
  else if (req.complication === 'leak') status = 'leak_low_volume_dwells_assess_repair';
  else status = 'catheter_functional';
  return { status, complication: req.complication };
}

const CITATIONS = { ISPD_2024: 'ISPD 2024 Peritonitis', KDOQI_PD_2024: 'KDOQI PD 2024' };

function funcs() { return { pet_test, peritonitis, uf_capacity, pd_adequacy, catheter_pd }; }
module.exports = { funcs, CITATIONS, ValidationError };