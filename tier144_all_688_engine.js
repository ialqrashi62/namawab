// filepath: tier144_all_688_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function skin_test(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.allergen, 'ag', ['pollen','dust_mite','mold','pet_dander','food','latex','drug','venom','contact','other']);
  ensureNum(req.wheal_mm, 'wh');
  ensureNum(req.flare_mm, 'fl');
  ensureEnum(req.reaction, 'rc', ['negative','positive_1','positive_2','positive_3','positive_4','irritant','equivocal','positive_late']);
  ensureNum(req.naive_control_mm, 'nc');
  ensureNum(req.histamine_control_mm, 'hc');
  ensureStr(req.provider, 'pr');
  return { st_id: `skt_${Date.now()}`, patient_id: req.patient_id, reaction: req.reaction, wheal: req.wheal_mm };
}
function ige(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.total_ige_kiu_l, 'ti');
  ensureNum(req.specific_ige_kiu_l, 'si');
  ensureStr(req.allergen, 'ag');
  ensureEnum(req.class, 'cl', ['0_absent','0_equivocal','1_low','2_moderate','3_high','4_very_high','5_very_high']);
  ensureNum(req.trend, 'tr');
  ensureBool(req.new_sensitization, 'ns');
  ensureStr(req.provider, 'pr');
  return { ig_id: `ige_${Date.now()}`, patient_id: req.patient_id, allergen: req.allergen, level: req.specific_ige_kiu_l };
}
function immunotherapy(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.type, 'tp', ['SCIT','SLIT','oral','sublingual','cluster','rush','custom','other']);
  ensureNum(req.vial_strength, 'vs');
  ensureNum(req.dose_ml, 'ds');
  ensureNum(req.dose_count, 'dc');
  ensureNum(req.total_visits, 'tv');
  ensureEnum(req.local_reaction, 'lr', ['none','erythema','swelling','induration','other']);
  ensureEnum(req.systemic_reaction, 'sr', ['none','mild','moderate','severe','anaphylaxis']);
  ensureStr(req.provider, 'pr');
  return { it_id: `imt_${Date.now()}`, patient_id: req.patient_id, type: req.type, dose: req.dose_ml };
}
function anaphylaxis(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.trigger, 'tr', ['food','drug','insect','latex','food_additive','diagnostic_agent','serum','vaccine','anesthetic','unknown','other']);
  ensureEnum(req.severity, 'sv', ['mild','moderate','severe','cardiac_arrest','death']);
  ensureNum(req.epinephrine_doses, 'ed');
  ensureNum(req.biphasic_reaction, 'br');
  ensureBool(req.icu_admission, 'ia');
  ensureStr(req.management, 'mg');
  ensureStr(req.provider, 'pr');
  return { an_id: `ana_${Date.now()}`, patient_id: req.patient_id, trigger: req.trigger, severity: req.severity };
}
function biologic(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.medication, 'md', ['omalizumab','mepolizumab','benralizumab','dupilumab','secukinumab','adalimumab','rituximab','etanercept','ustekinumab','tezepelumab','other']);
  ensureNum(req.dose_mg, 'ds');
  ensureEnum(req.route, 'rt', ['SC','IM','IV']);
  ensureNum(req.frequency_weeks, 'fw');
  ensureEnum(req.response, 'rs', ['excellent','partial','minimal','no_response','tolerance_lost','pending']);
  ensureNum(req.serum_ige, 'si');
  ensureNum(req.eosinophil_count, 'ec');
  ensureStr(req.provider, 'pr');
  return { bi_id: `bio_${Date.now()}`, patient_id: req.patient_id, medication: req.medication, response: req.response };
}

function funcs() { return { skin_test, ige, immunotherapy, anaphylaxis, biologic }; }
module.exports = { funcs, ValidationError };
