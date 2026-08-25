// filepath: tier89_hematology_benign_470_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function anemia_workup(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.workup_id, 'wid');
  ensureNum(req.hemoglobin, 'hgb');
  ensureNum(req.hematocrit, 'hct');
  ensureNum(req.mcv, 'mcv');
  ensureNum(req.mch, 'mch');
  ensureNum(req.mchc, 'mchc');
  ensureNum(req.rdw, 'rdw');
  ensureNum(req.retic_count, 'ret');
  ensureNum(req.ferritin, 'fer');
  ensureNum(req.tsat, 'tsat');
  ensureNum(req.b12, 'b12');
  ensureNum(req.folate, 'fol');
  ensureNum(req.haptoglobin, 'hap');
  ensureStr(req.provider, 'pr');
  return { wid: req.workup_id };
}
function iron_deficiency(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureNum(req.ferritin, 'fer');
  ensureNum(req.tsat, 'tsat');
  ensureEnum(req.cause, 'cause', ['menstrual','gi_bleeding','malabsorption','dietary','pregnancy','chronic_disease','other','unknown']);
  ensureBool(req.gi_workup, 'giw');
  ensureBool(req.colonoscopy_done, 'colo');
  ensureBool(req.egd_done, 'egd');
  ensureEnum(req.treatment, 'tx', ['oral_iron','iv_iron','transfusion','none','other','unknown']);
  ensureNum(req.dose_mg, 'dose');
  ensureNum(req.weeks_to_response, 'wks');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}
function hemolysis_workup(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.workup_id, 'wid');
  ensureNum(req.ldh, 'ldh');
  ensureNum(req.haptoglobin, 'hap');
  ensureNum(req.retic_count, 'ret');
  ensureNum(req.indirect_bilirubin, 'ib');
  ensureBool(req.peripheral_smear_schistocytes, 'pss');
  ensureBool(req.direct_coombs, 'dc');
  ensureBool(req.indirect_coombs, 'ic');
  ensureEnum(req.mechanism, 'mech', ['intravascular','extravascular','mechanical','autoimmune','drug_induced','infection','other','unknown','none']);
  ensureEnum(req.diagnosis, 'dx', ['hereditary_spherocytosis','g6pd','sickle','thalassemia','aiha','dic','ttp','hus','mechanical','other','unknown','none']);
  ensureStr(req.provider, 'pr');
  return { wid: req.workup_id };
}
function bone_marrow(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.procedure_id, 'pid');
  ensureEnum(req.site, 'site', ['iliac_crest','sternum','tibia','other','unknown']);
  ensureNum(req.cellularity_pct, 'cell');
  ensureNum(req.mye_eryth_ratio, 'mer');
  ensureNum(req.blasts_pct, 'bl');
  ensureNum(req.megakaryocytes, 'meg');
  ensureBool(req.flow_cytometry, 'fc');
  ensureBool(req.cytogenetics, 'cyg');
  ensureBool(req.molecular_studies, 'mol');
  ensureEnum(req.impression, 'imp', ['normal','reactive','hypocellular','hypercellular','malignant','other','unknown']);
  ensureStr(req.provider, 'pr');
  return { pid: req.procedure_id };
}
function anticoagulation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.assessment_id, 'aid');
  ensureEnum(req.anticoagulant, 'ac', ['warfarin','apixaban','rivaroxaban','dabigatran','enoxaparin','heparin','fondaparinux','other','unknown','none']);
  ensureNum(req.dose_mg, 'dose');
  ensureNum(req.inr, 'inr');
  ensureEnum(req.indication, 'ind', ['afib','vte','mech_valve','dvt','pe','hypercoag','other','unknown','none']);
  ensureNum(req.duration_months, 'du');
  ensureBool(req.bridging, 'br');
  ensureBool(req.bleeding_event, 'be');
  ensureNum(req.most_recent_creatinine, 'cr');
  ensureNum(req.time_in_therapeutic_range, 'ttr');
  ensureStr(req.provider, 'pr');
  return { aid: req.assessment_id };
}

function funcs() { return { anemia_workup, iron_deficiency, hemolysis_workup, bone_marrow, anticoagulation }; }
module.exports = { funcs, ValidationError };
