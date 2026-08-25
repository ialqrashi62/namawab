// filepath: tier36_infectious_disease_ext_216_tropical_engine.js
// TIER36_INFX-216: Tropical infections
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function malaria(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.species, 'sp', ['falciparum','vivax','ovale','malariae','knowlesi','mixed','unknown']);
  ensureNumber(req.parasitemia_pct, 'parasitemia');
  ensureEnum(req.severity, 'sev', ['uncomplicated','severe','cerebral','other']);
  ensureEnum(req.treatment, 'rx', ['act','artesunate_iv','quinine_iv','chloroquine','primaquine','tafenoquine','combination','none','other']);
  ensureNumber(req.travel_return, 'tr');
  let status;
  if (req.severity === 'severe' || req.severity === 'cerebral') status = 'severe_malaria_iv_artesunate';
  else if (req.species === 'falciparum' && req.parasitemia_pct >= 5) status = 'high_parasitemia_falciparum_consider_iv';
  else if (req.species === 'vivax' && req.treatment === 'chloroquine') status = 'vivax_chloroquine_then_primaquine';
  else if (req.species === 'falciparum' && req.treatment === 'act') status = 'falciparum_act_uncomplicated_appropriate';
  else status = 'malaria_review_appropriate';
  return { status, sp: req.species };
}

function dengue(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureBool(req.igm_positive, 'igm');
  ensureNumber(req.platelet, 'plt');
  ensureNumber(req.hct, 'hct');
  ensureEnum(req.severity, 'sev', ['dengue_without_warning','dengue_with_warning_signs','severe_dengue','dengue_fever','other']);
  ensureEnum(req.treatment, 'rx', ['supportive','supportive_fluid','iv_fluid','monitoring_only','hospitalization','other']);
  let status;
  if (req.severity === 'severe_dengue') status = 'severe_dengue_icu_fluid_resuscitation';
  else if (req.severity === 'dengue_with_warning_signs' && req.treatment === 'supportive') status = 'dengue_warning_intensify_monitoring';
  else if (req.platelet < 20000 && req.hct > 50) status = 'thrombocytopenia_hct_high_bleeding_risk';
  else if (req.treatment === 'iv_fluid' && req.severity === 'dengue_with_warning_signs') status = 'dengue_warning_iv_fluid_appropriate';
  else status = 'dengue_review';
  return { status, sev: req.severity };
}

function typhoid(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.culture, 'cx', ['blood_positive','urine_positive','stool_positive','bone_marrow_positive','negative','pending','not_done','other']);
  ensureEnum(req.sensitivity, 'sens', ['sensitive','multidrug_resistant','extensively_drug_resistant','pending','not_done','other']);
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe','complicated','other']);
  ensureEnum(req.treatment, 'rx', ['ceftriaxone','cefotaxime','azithromycin','ciprofloxacin','meropenem','none','other']);
  ensureEnum(req.complication, 'comp', ['none','gi_bleeding','perforation','myocarditis','encephalopathy','sepsis','other']);
  let status;
  if (req.complication === 'perforation') status = 'typhoid_perforation_surgical_consult';
  else if (req.sensitivity === 'multidrug_resistant' && req.treatment === 'ceftriaxone') status = 'mdr_typhoid_ceftriaxone_appropriate';
  else if (req.sensitivity === 'extensively_drug_resistant') status = 'xdrt_typhoid_meropenem_azithro';
  else if (req.severity === 'severe' && req.treatment !== 'ceftriaxone') status = 'severe_typhoid_initiate_ceftriaxone';
  else status = 'typhoid_review';
  return { status, c: req.complication };
}

function chikungunya(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureBool(req.igm_positive, 'igm');
  ensureEnum(req.arthralgia, 'arth', ['none','acute','subacute','chronic','persistent','other']);
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe','other']);
  ensureEnum(req.treatment, 'rx', ['supportive','supportive_nsaids','nsaids','steroids','physical_therapy','combination','other']);
  ensureEnum(req.chronicity, 'chr', ['acute','subacute','chronic_persistent','resolved','other']);
  let status;
  if (req.chronicity === 'chronic_persistent' && req.treatment === 'nsaids') status = 'chronic_chik_add_physical_therapy';
  else if (req.arthralgia === 'chronic' && req.treatment === 'nsaids') status = 'chronic_arthralgia_intensify_treatment';
  else if (req.severity === 'severe' && req.treatment === 'supportive') status = 'severe_chik_intensify_management';
  else status = 'chik_review';
  return { status, c: req.chronicity };
}

function parasitic_infection(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.parasite, 'par', ['strongyloides','schistosoma','hookworm','ascaris','giardia','entamoeba','taenia','echinococcus','other']);
  ensureBool(req.stool_ova, 'ova');
  ensureEnum(req.serology, 'ser', ['positive','negative','inconclusive','pending','not_done','other']);
  ensureEnum(req.treatment, 'rx', ['ivermectin','albendazole','mebendazole','praziquantel','metronidazole','tinidazole','combination','none','other']);
  ensureNumber(req.follow_up, 'fup');
  let status;
  if (req.parasite === 'strongyloides' && req.treatment === 'albendazole') status = 'strongyloides_ivermectin_preferred';
  else if (req.parasite === 'giardia' && req.treatment === 'metronidazole') status = 'giardia_metronidazole_appropriate';
  else if (req.follow_up < 30) status = 'inadequate_follow_up_extend';
  else if (req.serology === 'positive' && !req.stool_ova) status = 'parasite_serology_only_treat';
  else status = 'parasitic_review';
  return { status, p: req.parasite };
}

function funcs() { return { malaria, dengue, typhoid, chikungunya, parasitic_infection }; }
module.exports = { funcs, ValidationError };