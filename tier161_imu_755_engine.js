// filepath: tier161_imu_755_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function allergy_assess(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.allergen_type, 'at', ['food','drug','environmental','latex','insect','contact','other','NA']);
  ensureEnum(req.reaction_type, 'rt', ['urticaria','angioedema','anaphylaxis','eczema','rhinitis','asthma','gi','other','NA']);
  ensureNum(req.skin_test_mm, 'st'); ensureBool(req.ige_elevated, 'ie'); ensureNum(req.ige_total, 'ig');
  ensureNum(req.skin_prick_wheal, 'sp'); ensureEnum(req.severity, 'sv', ['mild','moderate','severe','life_threatening','NA']);
  ensureBool(req.epipen_prescribed, 'ep'); ensureStr(req.provider, 'pr');
  return { al_id: `al_${Date.now()}`, patient_id: req.patient_id, allergen: req.allergen_type, severity: req.severity };
}

function immunodeficiency(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.category, 'ct', ['primary','secondary','combined','humoral','cellular','complement','phagocytic','other','NA']);
  ensureNum(req.igg_level, 'il'); ensureNum(req.iga_level, 'ia'); ensureNum(req.igm_level, 'im');
  ensureNum(req.cd4_count, 'cc'); ensureNum(req.cd8_count, 'c8'); ensureBool(req.vaccine_response, 'vr');
  ensureEnum(req.substitution, 'sb', ['IVIG','SCIG','none','planned','NA']);
  ensureStr(req.provider, 'pr');
  return { id_id: `id_${Date.now()}`, patient_id: req.patient_id, category: req.category, igg: req.igg_level };
}

function autoinflammatory(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.disease, 'ds', ['FMF','CAPS','TRAPS','HIDS','DIRA','Schnitzler','Still','Behcet','other','NA']);
  ensureNum(req.crp, 'cp'); ensureNum(req.esr, 'es'); ensureNum(req.saa, 'sa');
  ensureNum(req.fever_episodes_30d, 'fe'); ensureNum(req.flare_days_30d, 'fd');
  ensureEnum(req.treatment, 'tr', ['colchicine','anakinra','canakinumab','tocilizumab','NSAID','steroid','other','NA']);
  ensureBool(req.amyloidosis_screen, 'as'); ensureStr(req.provider, 'pr');
  return { ai_id: `ai_${Date.now()}`, patient_id: req.patient_id, disease: req.disease, crp: req.crp };
}

function iga_deficiency(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureNum(req.iga_level, 'ia'); ensureNum(req.igg_level, 'il');
  ensureNum(req.igm_level, 'im'); ensureEnum(req.iga_classification, 'ic', ['selective_partial','selective_complete','combined','other','NA']);
  ensureBool(req.recurrent_infections, 'ri'); ensureNum(req.infections_30d, 'ix');
  ensureBool(req.autoimmune_comorb, 'ac'); ensureEnum(req.vaccine_response, 've', ['normal','partial','poor','NA']);
  ensureStr(req.provider, 'pr');
  return { ig_id: `ig_${Date.now()}`, patient_id: req.patient_id, iga: req.iga_level, infections: req.infections_30d };
}

function hypersensitivity(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureEnum(req.gell_coombs, 'gc', ['I','II','III','IV','combined','unknown','NA']);
  ensureBool(req.urticaria, 'ur'); ensureBool(req.angioedema, 'ae'); ensureBool(req.anaphylaxis, 'ax');
  ensureNum(req.bp_systolic, 'bs'); ensureNum(req.hr, 'hr');
  ensureEnum(req.trigger, 'tr', ['drug','food','venom','latex','contrast','anesthetic','other','NA']);
  ensureNum(req.episode_count, 'ep'); ensureBool(req.treatment_response, 'te');
  ensureStr(req.provider, 'pr');
  return { hy_id: `hy_${Date.now()}`, patient_id: req.patient_id, type: req.gell_coombs, trigger: req.trigger };
}

function funcs() { return { allergy_assess, immunodeficiency, autoinflammatory, iga_deficiency, hypersensitivity }; }
module.exports = { funcs, ValidationError };