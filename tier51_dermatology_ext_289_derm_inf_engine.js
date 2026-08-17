// filepath: tier51_dermatology_ext_289_derm_inf_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function bacterial_cellulitis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.site, 'site');
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe','necrotizing']);
  ensureStr(req.microbial_etiology, 'eti');
  ensureStr(req.antibiotic, 'abx');
  ensureNum(req.duration_days, 'dur');
  ensureStr(req.complications, 'comp');
  return { site: req.site, severity: req.severity };
}
function fungal_skin(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'typ', ['tinea_corporis','tinea_pedis','tinea_unguium','tinea_cruris','tinea_versicolor','candidiasis']);
  ensureStr(req.site, 'site');
  ensureEnum(req.diagnostic, 'dx', ['koh_positive','culture_positive','clinical_only','pending']);
  ensureStr(req.therapy, 'tx');
  ensureNum(req.duration_weeks, 'dur');
  return { type: req.type };
}
function parasitic_skin(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.parasite, 'par', ['scabies','lice','leishmaniasis','myiasis','cutaneous_larva_migrans']);
  ensureBool(req.family_members_affected, 'fma');
  ensureStr(req.therapy, 'tx');
  ensureBool(req.household_treatment, 'ht');
  ensureNum(req.follow_up_weeks, 'fu');
  return { parasite: req.parasite };
}
function viral_herpes(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.type, 'typ', ['hsv1_oral','hsv1_genital','hsv2_genital','hsv2_oral','vzv_primary','vzv_reactivation']);
  ensureEnum(req.episode, 'ep', ['primary','recurrent','asymptomatic_shedding']);
  ensureEnum(req.severity, 'sev', ['mild','moderate','severe','complicated']);
  ensureStr(req.antiviral, 'av');
  ensureStr(req.suppressive_therapy, 'st');
  ensureEnum(req.response, 'resp', ['well_controlled','partial','breakthrough','resistant']);
  return { type: req.type };
}
function warts_molluscum(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.lesion_type, 'lt', ['verruca_vulgaris','verruca_plantaris','verruca_plana','condyloma_acuminatum','molluscum_contagiosum']);
  ensureNum(req.count, 'count');
  ensureStr(req.location, 'loc');
  ensureStr(req.therapy, 'tx');
  ensureEnum(req.response, 'resp', ['clearing','partial','stable','recalcitrant']);
  return { lesion_type: req.lesion_type };
}

function funcs() { return { bacterial_cellulitis, fungal_skin, parasitic_skin, viral_herpes, warts_molluscum }; }
module.exports = { funcs, ValidationError };