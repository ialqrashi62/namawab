// filepath: tier95_hepatology_cirrhosis_499_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function cirrhosis_assessment(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.meld_score, 'meld');
  ensureEnum(req.child_pugh, 'cp', ['A','B','C','unknown','other']);
  ensureNum(req.albumin, 'alb');
  ensureNum(req.inr, 'inr');
  ensureNum(req.bilirubin, 'bil');
  ensureEnum(req.ascites, 'as', ['none','mild','moderate','severe','refractory','other','unknown']);
  ensureEnum(req.encephalopathy, 'enc', ['none','grade_1','grade_2','grade_3','grade_4','unknown','other']);
  ensureEnum(req.etiology, 'et', ['alcohol','viral','nash','autoimmune','cryptogenic','drug','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function ascites_management(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.ascites_grade, 'ag', ['1','2','3','refractory','unknown','other']);
  ensureBool(req.diuretic_response, 'dr');
  ensureBool(req.lactulose_used, 'lu');
  ensureBool(req.spontaneous_bacterial_peritonitis, 'sbp');
  ensureNum(req.large_volume_paracentesis_count, 'lvpc');
  ensureNum(req.serum_creatinine, 'sc');
  ensureNum(req.sodium, 'na');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function hepatic_encephalopathy(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.grade, 'gr');
  ensureBool(req.asterixis, 'ast');
  ensureNum(req.lactulose_dose, 'ld');
  ensureBool(req.rifaximin_use, 'ru');
  ensureNum(req.triggers, 'tri');
  ensureBool(req.hospitalization, 'hosp');
  ensureNum(req.improvement_days, 'id');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function spontaneous_bacterial_peritonitis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.anc_count, 'anc');
  ensureNum(req.ascites_fluid_pmn, 'pmn');
  ensureStr(req.culture, 'cul');
  ensureEnum(req.antibiotic, 'ab', ['cefotaxime','ceftriaxone','other','unknown','none']);
  ensureBool(req.iv_albumin, 'iva');
  ensureEnum(req.response, 'res', ['improved','stable','worsened','died','other','unknown']);
  ensureNum(req.hospital_days, 'hd');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function variceal_bleeding(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.episode_id, 'eid');
  ensureBool(req.active_bleeding, 'ab');
  ensureNum(req.variceal_grade, 'vg');
  ensureNum(req.banding_done, 'bd');
  ensureEnum(req.vasoconstrictor, 'vas', ['octreotide','terlipressin','somatostatin','other','unknown','none']);
  ensureEnum(req.antibiotic, 'ab', ['ceftriaxone','ciprofloxacin','other','unknown','none']);
  ensureNum(req.transfused_units, 'tu');
  ensureNum(req.mortality_risk, 'mr');
  ensureStr(req.provider, 'pr');
  return { eid: req.episode_id };
}

function funcs() { return { cirrhosis_assessment, ascites_management, hepatic_encephalopathy, spontaneous_bacterial_peritonitis, variceal_bleeding }; }
module.exports = { funcs, ValidationError };
