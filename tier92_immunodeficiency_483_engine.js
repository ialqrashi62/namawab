// filepath: tier92_immunodeficiency_483_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function primary_immunodeficiency(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.pid_type, 'pt', ['x_linked_agammaglobulinemia','cvid','hyper_igm','xscid','ada_scid','wiskott_aldrich','digeorge','at_telangiectasia','other','unknown']);
  ensureNum(req.ige_level, 'ige');
  ensureNum(req.igg_level, 'igg');
  ensureNum(req.igm_level, 'igm');
  ensureNum(req.iga_level, 'iga');
  ensureNum(req.lymphocyte_count, 'lc');
  ensureNum(req.infections_per_year, 'ipy');
  ensureBool(req.ivig_replacement, 'ivr');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function hiv_care(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.cd4_count, 'cd4');
  ensureNum(req.viral_load, 'vl');
  ensureEnum(req.art_regimen, 'art', ['tld','biktarvy','triumeq','other','naive','unknown','none']);
  ensureNum(req.adherence_pct, 'adh');
  ensureEnum(req.oi_prophylaxis, 'oip', ['tmp_smx','azithromycin','fluconazole','none','other','unknown']);
  ensureBool(req.opportunistic_infections, 'oi');
  ensureNum(req.hep_b_screening, 'hbv');
  ensureStr(req.provider, 'pr');
  return { vid: req.visit_id };
}
function immunoglobulin_replacement(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.infusion_id, 'iid');
  ensureEnum(req.product, 'pd', ['privigen','gamunex','octagam','flebogamma','gammagard','other','unknown']);
  ensureNum(req.dose_g_kg, 'dk');
  ensureNum(req.duration_hours, 'dur');
  ensureNum(req.trough_igg, 'tigg');
  ensureBool(req.adverse_reaction, 'ar');
  ensureNum(req.infusions_per_month, 'ipm');
  ensureEnum(req.route, 'rt', ['iv','subcutaneous','unknown','other']);
  ensureStr(req.provider, 'pr');
  return { iid: req.infusion_id };
}
function vaccine_immunodeficiency(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.vaccines_due, 'vd');
  ensureNum(req.vaccines_administered, 'va');
  ensureNum(req.titer_checked, 'tc');
  ensureNum(req.titer_adequate, 'ta');
  ensureEnum(req.vaccine_type, 'vt', ['live','inactivated','mrna','subunit','other','unknown','none']);
  ensureNum(req.contraindicated_count, 'cic');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function autoimmune_screening(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.workup_id, 'wid');
  ensureNum(req.ana_titer, 'ana');
  ensureStr(req.ana_pattern, 'anp');
  ensureBool(req.anti_dsdna, 'add');
  ensureBool(req.anti_smith, 'asm');
  ensureBool(req.anti_rnp, 'arnp');
  ensureEnum(req.anti_cca, 'acc', ['positive','negative','pending','unknown','other','none']);
  ensureNum(req.crp, 'crp');
  ensureNum(req.esr, 'esr');
  ensureStr(req.provider, 'pr');
  return { wid: req.workup_id };
}

function funcs() { return { primary_immunodeficiency, hiv_care, immunoglobulin_replacement, vaccine_immunodeficiency, autoimmune_screening }; }
module.exports = { funcs, ValidationError };
