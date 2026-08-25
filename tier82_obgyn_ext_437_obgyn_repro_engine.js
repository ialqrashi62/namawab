// filepath: tier82_obgyn_ext_437_obgyn_repro_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function ivf_cycle(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.cycle_id, 'cid');
  ensureNum(req.cycle_number, 'cn');
  ensureNum(req.eggs_retrieved, 'er');
  ensureNum(req.eggs_mature, 'em');
  ensureNum(req.eggs_fertilized, 'ef');
  ensureNum(req.blastocysts_formed, 'bf');
  ensureEnum(req.embryo_quality, 'eq', ['poor','fair','good','excellent','unknown']);
  ensureNum(req.endometrial_thickness_mm, 'etm');
  ensureNum(req.days_of_stim, 'dos');
  ensureEnum(req.progesterone_route, 'pr', ['im','vaginal','oral','combination','other']);
  ensureBool(req.pregnancy_achieved, 'pa');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { cid: req.cycle_id };
}
function iui_cycle(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.cycle_id, 'cid');
  ensureNum(req.cycle_number, 'cn');
  ensureNum(req.follicles_grown, 'fg');
  ensureNum(req.endometrial_thickness_mm, 'etm');
  ensureEnum(req.medication, 'med', ['clomid','letrozole','gonadotropin','natural','other','unknown']);
  ensureNum(req.total_motile_sperm_million, 'tmsm');
  ensureBool(req.sperm_wash_done, 'swd');
  ensureBool(req.pregnancy_achieved, 'pa');
  ensureNum(req.beta_hcg_initial, 'bhi');
  ensureNum(req.beta_hcg_48h, 'bh2');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { cid: req.cycle_id };
}
function recurrent_pregnancy_loss(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.previous_losses, 'pl');
  ensureNum(req.gestational_age_last_loss, 'gal');
  ensureBool(req.karyotype_done, 'kd');
  ensureBool(req.thrombophilia_workup, 'tw');
  ensureBool(req.uterine_anomaly_workup, 'uw');
  ensureNum(req.amh, 'amh');
  ensureBool(req.aps_workup, 'aw');
  ensureBool(req.couple_karyotype, 'ck');
  ensureStr(req.findings, 'find');
  ensureEnum(req.management, 'mg', ['pgs','nk_cells','hcg','progesterone','ivf_pgs','expectant','other','unknown']);
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}
function pcos_eval(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.age, 'age');
  ensureNum(req.bmi, 'bmi');
  ensureBool(req.oligo_amenorrhea, 'oa');
  ensureBool(req.hyperandrogenism_bio, 'ha');
  ensureBool(req.ultrasound_polycystic, 'up');
  ensureNum(req.lh_fsh_ratio, 'lfr');
  ensureNum(req.fasting_insulin, 'fi');
  ensureNum(req.homa_ir, 'hir');
  ensureBool(req.metformin_started, 'ms');
  ensureEnum(req.first_line, 'fl', ['lifestyle','metformin','clomid','letrozole','ivf','ovarian_drilling','iui','combination','other']);
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function endometriosis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.age, 'age');
  ensureNum(req.asrm_score, 'asrm');
  ensureEnum(req.stage, 'stage', ['minimal','mild','moderate','severe','unknown']);
  ensureBool(req.laparoscopy_done, 'ld');
  ensureBool(req.histologic_confirmation, 'hc');
  ensureNum(req.ultrasound_finding, 'uf');
  ensureBool(req.infertility_associated, 'ia');
  ensureEnum(req.management, 'mg', ['nsaids','combined_ocps','progestin','gnrh_agonist','surgery','ivf','iui','combination','observation','other']);
  ensureBool(req.referred_repro, 'rr');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { aid: req.assessment_id };
}

function funcs() { return { ivf_cycle, iui_cycle, recurrent_pregnancy_loss, pcos_eval, endometriosis }; }
module.exports = { funcs, ValidationError };