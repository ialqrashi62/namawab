// filepath: tier30_hematology_ext_186_cell_therapy_engine.js
// TIER30_HEMATOLOGY-186: Cell therapy products
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function car_t_recovery(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.cell_product, 'product', ['tisagenlecleucel','axicabtagene_ciloleucel','brexucabtagene_autoleucel','lisocabtagene_maraleucel','idecabtagene_vicleucel','cilta_cel','other']);
  ensureNumber(req.infusion_day, 'day');
  ensureNumber(req.cytokine_release_syndrome_grade, 'crs_grade');
  ensureNumber(req.icans_grade, 'icans');
  ensureEnum(req.response, 'response', ['complete','partial','stable','progression','unknown']);
  ensureNumber(req.monitoring_days, 'monitor_days');
  let status;
  if (req.cytokine_release_syndrome_grade >= 4) status = 'severe_crs_icu_tocilizumab';
  else if (req.icans_grade >= 3) status = 'severe_icans_icu_steroids';
  else if (req.cytokine_release_syndrome_grade >= 2) status = 'moderate_crs_tocilizumab_review';
  else if (req.response === 'progression') status = 'disease_progression_review_options';
  else status = 'car_t_recovery_stable';
  return { status, response: req.response, monitor: req.monitoring_days };
}

function til_therapy(req) {
  ensureStr(req.session_id, 'session_id');
  ensureEnum(req.tumor_type, 'tumor', ['melanoma','cervical','head_neck','lung_nsq','sarcoma','breast','other']);
  ensureNumber(req.infusion_cells, 'cells');
  ensureEnum(req.response, 'response', ['complete','partial','stable','progression','mixed','unknown']);
  ensureEnum(req.complication, 'comp', ['none','hypotension','ards','cytokine_release','encephalopathy','cardiac','other']);
  ensureNumber(req.response_assessment_day, 'response_day');
  let status;
  if (req.complication === 'ards') status = 'ards_icu_support';
  else if (req.response === 'progression' && req.response_assessment_day < 90) status = 'early_progression_review';
  else if (req.response === 'complete' || req.response === 'partial') status = 'til_response_favorable';
  else status = 'til_therapy_stable';
  return { status, resp: req.response };
}

function nk_cell(req) {
  ensureStr(req.session_id, 'session_id');
  ensureNumber(req.cell_dose, 'dose');
  ensureEnum(req.donor_source, 'donor', ['haploidentical','cord_blood','autologous','peripheral_donor','other']);
  ensureEnum(req.response, 'response', ['complete','partial','stable','progression','unknown']);
  ensureEnum(req.complication, 'comp', ['none','gvhd','cytokine_release','infusion_reaction','other']);
  ensureNumber(req.follow_up_day, 'fup_day');
  let status;
  if (req.donor_source === 'haploidentical' && req.complication === 'gvhd') status = 'gvhd_review_treatment';
  else if (req.response === 'complete') status = 'nk_cell_complete_response';
  else if (req.response === 'progression') status = 'progression_review_options';
  else status = 'nk_cell_stable';
  return { status, fup: req.follow_up_day };
}

function regenerative_injection(req) {
  ensureStr(req.session_id, 'session_id');
  ensureEnum(req.tissue_target, 'target', ['joint','tendon','ligament','muscle','wound','cartilage','bone','other']);
  ensureEnum(req.cell_type, 'cell_type', ['prp','bmac','fatac','msc','culture_expanded','other']);
  ensureNumber(req.platelet_concentration, 'plt_conc');
  ensureNumber(req.volume_ml, 'vol');
  ensureEnum(req.response, 'response', ['improved','no_change','worsened','unknown']);
  let status;
  if (req.cell_type === 'prp' && req.platelet_concentration < 2) status = 'prp_below_standard_concentration_review';
  else if (req.response === 'improved') status = 'regenerative_response_favorable';
  else if (req.response === 'worsened') status = 'worsened_review_alternative';
  else status = 'regenerative_stable';
  return { status, resp: req.response };
}

function autologous_therapy(req) {
  ensureStr(req.session_id, 'session_id');
  ensureEnum(req.cell_product, 'product', ['autologous_culture','autologous_whole','autologous_processed','other']);
  ensureNumber(req.cell_viability, 'viability');
  ensureEnum(req.response, 'response', ['complete','partial','stable','progression','improved','no_change','worsened','unknown']);
  ensureNumber(req.follow_up_day, 'fup');
  let status;
  if (req.cell_viability < 70) status = 'low_viability_quality_review';
  else if (req.response === 'progression' || req.response === 'worsened') status = 'progression_review_alternative';
  else if (req.response === 'complete' || req.response === 'improved') status = 'autologous_response_favorable';
  else status = 'autologous_stable';
  return { status, fup: req.follow_up_day };
}

function funcs() { return { car_t_recovery, til_therapy, nk_cell, regenerative_injection, autologous_therapy }; }
module.exports = { funcs, ValidationError };