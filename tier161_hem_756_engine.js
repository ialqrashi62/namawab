// filepath: tier161_hem_756_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function anemia_workup(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.hgb, 'hg'); ensureNum(req.mcv, 'mc'); ensureNum(req.mch, 'mh');
  ensureNum(req.retic_pct, 'rp'); ensureNum(req.ferritin, 'fr'); ensureNum(req.b12, 'b1');
  ensureNum(req.folate, 'fo'); ensureEnum(req.classification, 'cl', ['microcytic','macrocytic','normocytic','hemolytic','aplastic','other','NA']);
  ensureBool(req.workup_complete, 'wc'); ensureStr(req.provider, 'pr');
  return { an_id: `an_${Date.now()}`, patient_id: req.patient_id, hgb: req.hgb, type: req.classification };
}

function coag_disorder(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.pt, 'pt'); ensureNum(req.inr, 'in'); ensureNum(req.ptt, 'pa');
  ensureNum(req.fibrinogen, 'fb'); ensureNum(req.platelet_count, 'pl');
  ensureEnum(req.disorder, 'ds', ['hemophilia_A','hemophilia_B','von_Willebrand','DIC','ITP','TTP','liver_coag','other','NA']);
  ensureBool(req.family_history, 'fh'); ensureEnum(req.bleeding_score, 'bs', ['none','mild','moderate','severe','NA']);
  ensureStr(req.provider, 'pr');
  return { co_id: `co_${Date.now()}`, patient_id: req.patient_id, disorder: req.disorder, inr: req.inr };
}

function transfusion_med(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.hgb_pre, 'hp'); ensureNum(req.units_ordered, 'uo');
  ensureEnum(req.product, 'pr', ['PRBC','platelets','FFP','cryo','whole_blood','albumin','other','NA']);
  ensureEnum(req.indication, 'in', ['acute_blood_loss','anemia','peri_op','coagulopathy','thrombocytopenia','other','NA']);
  ensureBool(req.type_crossmatch, 'tc'); ensureBool(req.abo_compatible, 'ab');
  ensureNum(req.pre_medication_min, 'pm'); ensureBool(req.monitored, 'mo');
  ensureStr(req.provider, 'pr');
  return { tr_id: `tr_${Date.now()}`, patient_id: req.patient_id, product: req.product, units: req.units_ordered };
}

function hematologic_malignancy(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureEnum(req.diagnosis, 'dx', ['AML','ALL','CML','CLL','HL','NHL','MM','MDS','MDS_MPN','T_cell','other','NA']);
  ensureNum(req.wbc, 'wb'); ensureNum(req.hgb, 'hg'); ensureNum(req.platelet, 'pl');
  ensureNum(req.bone_marrow_blast_pct, 'bm'); ensureEnum(req.stage, 'st', ['low','intermediate','high','very_high','NA']);
  ensureEnum(req.cytogenetics, 'cy', ['favorable','intermediate','adverse','normal','failed','NA']);
  ensureEnum(req.treatment_line, 'tl', ['first','second','third','relapsed','refractory','NA']);
  ensureStr(req.provider, 'pr');
  return { hm_id: `hm_${Date.now()}`, patient_id: req.patient_id, dx: req.diagnosis, blast: req.bone_marrow_blast_pct };
}

function bone_marrow(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureNum(req.age, 'ag'); ensureEnum(req.site, 'si', ['iliac_crest','sternum','tibial','other','NA']);
  ensureNum(req.cellularity_pct, 'ce'); ensureNum(req.blast_pct, 'bl');
  ensureEnum(req.interpretation, 'in', ['normal','hypocellular','hypercellular','aplastic','infiltrated','other','NA']);
  ensureNum(req.cd34_count, 'cd'); ensureNum(req.biopsy_volume_ml, 'bv');
  ensureBool(req.flow_cytometry, 'fc'); ensureNum(req.cyto_results, 'cy');
  ensureStr(req.provider, 'pr');
  return { bm_id: `bm_${Date.now()}`, patient_id: req.patient_id, site: req.site, cellularity: req.cellularity_pct };
}

function funcs() { return { anemia_workup, coag_disorder, transfusion_med, hematologic_malignancy, bone_marrow }; }
module.exports = { funcs, ValidationError };