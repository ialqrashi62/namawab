// filepath: tier150_hem_712_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function anticoag(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.indication, 'in', ['AFib','VTE_proximal','VTE_distal','PE','DVT','mechanical_valve','hypercoagulable','stroke_prevention','post_MI','cardioversion','bridging','other','NA']);
  ensureEnum(req.drug, 'dr', ['warfarin','apixaban','rivaroxaban','dabigatran','edoxaban','LMWH','UFH','fondaparinux','argatroban','bivalirudin','aspirin','clopidogrel','ticagrelor','prasugrel','DAPT','none','other']);
  ensureNum(req.inr, 'ir');
  ensureNum(req.inr_target_low, 'itl');
  ensureNum(req.inr_target_high, 'ith');
  ensureNum(req.dose_mg, 'ds');
  ensureNum(req.crcl, 'cc');
  ensureEnum(req.anti_xa_level, 'ax', ['therapeutic','sub_therapeutic','supra_therapeutic','NA','unknown','not_applicable']);
  ensureNum(req.time_in_therapeutic_range, 'tt');
  ensureStr(req.provider, 'pr');
  return { ac_id: `ant_${Date.now()}`, patient_id: req.patient_id, drug: req.drug };
}
function anticoag_bleed(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.bleed_site, 'bs', ['none','intracranial','GI','GU','epistaxis','hemoptysis','hemarthrosis','soft_tissue','retroperitoneal','perioperative','other','NA']);
  ensureEnum(req.severity, 'sv', ['none','minor','moderate','major','life_threatening','fatal','NA']);
  ensureNum(req.hgb_pre, 'hp');
  ensureNum(req.hgb_post, 'po');
  ensureNum(req.inr_at_event, 'ie');
  ensureNum(req.days_since_dose, 'dd');
  ensureBool(req.reversal_given, 'rv');
  ensureEnum(req.reversal_agent, 'ra', ['none','vitamin_K','FFP','PCC_4_factor','PCC_3_factor','andexanet','idarucizumab','protamine','platelet','other','NA']);
  ensureBool(req.dose_held, 'dh');
  ensureStr(req.provider, 'pr');
  return { ab_id: `bln_${Date.now()}`, patient_id: req.patient_id, severity: req.severity };
}
function thrombosis(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.event_type, 'et', ['DVT','PE','arterial','stroke','MI','unusual_site','NA','unknown']);
  ensureEnum(req.location, 'lc', ['proximal_LE','distal_LE','UE','IVC','iliac','renal','hepatic','portal','mesenteric','cerebral','coronary','pulmonary','other','NA']);
  ensureNum(req.d_dimer, 'dd');
  ensureEnum(req.workup, 'wk', ['imaging_confirmed','clinical_only','excluded','pending','NA']);
  ensureNum(req.bnp, 'bn');
  ensureNum(req.troponin, 'tr');
  ensureBool(req.unprovoked, 'up');
  ensureBool(req.recurrence, 'rc');
  ensureEnum(req.workup_hypercoag, 'wh', ['basic','extended','thrombophilia_panel','none','NA','pending']);
  ensureStr(req.provider, 'pr');
  return { th_id: `tht_${Date.now()}`, patient_id: req.patient_id, type: req.event_type };
}
function apheresis(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.type, 'tp', ['plasmapheresis','LDL_apheresis','RBC_exchange','WBC_reduction','platelet_reduction','stem_cell_collection','photopheresis','other']);
  ensureNum(req.volume_processed_ml, 'vp');
  ensureNum(req.replacement_fluid_ml, 'rf');
  ensureEnum(req.access, 'ac', ['peripheral','central_venous','AVF','NA']);
  ensureNum(req.plasma_exchange_volume, 'pe');
  ensureNum(req.duration_hr, 'du');
  ensureBool(req.complications, 'cp');
  ensureEnum(req.replacement, 'rp', ['albumin','FFP','cryo','saline','NA']);
  ensureEnum(req.indication, 'in', ['TTP','myasthenia_gravis','GBS','CIDP','SLE','anti_GMB','hyperviscosity','Waldenstrom','cryoglobulinemia','ABO_incompatible_transplant','severe_hypertriglyceridemia','other','NA']);
  ensureStr(req.provider, 'pr');
  return { ap_id: `aph_${Date.now()}`, patient_id: req.patient_id, type: req.type };
}
function hematology_dx(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.diagnosis, 'dx', ['iron_deficiency','B12_deficiency','folate_deficiency','hemolytic','aplastic','sickle_cell','thalassemia','G6PD','hereditary_spherocytosis','ITP','TTP','HIT','DIC','MAHA','PNH','other','unknown','NA']);
  ensureNum(req.hgb, 'hg');
  ensureNum(req.mcv, 'mc');
  ensureNum(req.retic, 'rt');
  ensureNum(req.ferritin, 'ft');
  ensureNum(req.b12, 'b12');
  ensureNum(req.haptoglobin, 'hp');
  ensureNum(req.ldh, 'ld');
  ensureNum(req.bilirubin_indirect, 'bi');
  ensureStr(req.provider, 'pr');
  return { hd_id: `hmd_${Date.now()}`, patient_id: req.patient_id, dx: req.diagnosis };
}

function funcs() { return { anticoag, anticoag_bleed, thrombosis, apheresis, hematology_dx }; }
module.exports = { funcs, ValidationError };