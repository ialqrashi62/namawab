// filepath: tier83_derm_ext_440_derm_immuno_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function psoriasis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.pasi_score, 'ps');
  ensureNum(req.bsa_pct, 'bsa');
  ensureEnum(req.type, 't', ['plaque','guttate','pustular','erythrodermic','inverse','nail','other','unknown']);
  ensureBool(req.joint_involvement, 'ji');
  ensureEnum(req.comorbidities, 'cm', ['none','psoriatic_arthritis','metabolic_syndrome','ibd','depression','other']);
  ensureStr(req.treatment, 'tx');
  ensureBool(req.biologic_started, 'bs');
  ensureNum(req.dlqi_score, 'dl');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function eczema(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.scorad_score, 'ss');
  ensureNum(req.bsa_pct, 'bsa');
  ensureBool(req.intense_itch, 'ii');
  ensureBool(req.sleep_disturbance, 'sd');
  ensureEnum(req.type, 't', ['atopic','contact','dyshidrotic','nummular','seborrheic','stasis','other','unknown']);
  ensureStr(req.triggers, 'trig');
  ensureStr(req.treatment, 'tx');
  ensureBool(req.phototherapy_started, 'ps');
  ensureNum(req.dlqi_score, 'dl');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function dermatitis(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureEnum(req.type, 't', ['contact_allergic','contact_irritant','atopic','seborrheic','diaper','perioral','stasis','other','unknown']);
  ensureStr(req.affected_areas, 'aa');
  ensureBool(req.prior_episodes, 'pe');
  ensureBool(req.patch_testing_done, 'ptd');
  ensureStr(req.allergens_identified, 'alg');
  ensureStr(req.treatment, 'tx');
  ensureBool(req.phototherapy_started, 'ps');
  ensureNum(req.dlqi_score, 'dl');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function acne(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.visit_id, 'vid');
  ensureNum(req.age, 'age');
  ensureEnum(req.type, 't', ['comedonal','papular','pustular','nodulocystic','conglobata','fulminans','hormonal','drug_induced','other','unknown']);
  ensureNum(req.lesion_count_inflammatory, 'lci');
  ensureNum(req.lesion_count_non_inflammatory, 'lcni');
  ensureBool(req.scarring_present, 'sp');
  ensureEnum(req.treatment, 'tx', ['topical_retinoid','topical_bp','topical_antibiotic','oral_antibiotic','hormonal','isotretinoin','combination','observation','other']);
  ensureBool(req.isotretinoin_started, 'is');
  ensureBool(req.mental_health_screen, 'mhs');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { vid: req.visit_id };
}
function biologics(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.medication_id, 'mid');
  ensureEnum(req.medication, 'med', ['adalimumab','etanercept','infliximab','ustekinumab','secukinumab','ixekizumab','brodalumab','guselkumab','risankizumab','tildrakizumab','dupilumab','tralokinumab','abrocitinib','upadacitinib','other','unknown']);
  ensureNum(req.dose_mg, 'dose');
  ensureEnum(req.frequency, 'freq', ['weekly','biweekly','monthly','every_2months','every_3months','other']);
  ensureNum(req.tb_screen_done, 'tbs');
  ensureBool(req.tb_recent, 'tbr');
  ensureBool(req.pregnancy_test_done, 'ptd');
  ensureBool(req.vaccinations_current, 'vc');
  ensureNum(req.follow_up_weeks, 'fuw');
  ensureStr(req.efficacy_score, 'es');
  ensureStr(req.provider, 'pr');
  ensureNum(req.next_review, 'nr');
  return { mid: req.medication_id };
}

function funcs() { return { psoriasis, eczema, dermatitis, acne, biologics }; }
module.exports = { funcs, ValidationError };