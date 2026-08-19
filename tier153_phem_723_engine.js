// filepath: tier153_phem_723_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function sickle(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.genotype, 'gt', ['HbSS','HbSC','HbS_beta_thal_0','HbS_beta_thal_plus','HbS_HPFH','other','NA']);
  ensureNum(req.hgb, 'hg');
  ensureNum(req.retic_pct, 'rt');
  ensureNum(req.hgb_f_pct, 'hf');
  ensureEnum(req.hydroxyurea, 'hu', ['yes','no','planned','declined','intolerant','NA']);
  ensureNum(req.hydroxyurea_dose, 'hd');
  ensureNum(req.last_voe_count_yr, 'vc');
  ensureBool(req.chronic_transfusion, 'ct');
  ensureNum(req.iron_overload_ferritin, 'io');
  ensureEnum(req.iron_chelator, 'ic', ['none','deferasirox','deferoxamine','deferiprone','other','NA']);
  ensureStr(req.provider, 'pr');
  return { sk_id: `skc_${Date.now()}`, patient_id: req.patient_id, genotype: req.genotype };
}
function hemophilia(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.type, 'tp', ['A_factor_8','B_factor_9','acquired','inhibitor','other','NA']);
  ensureEnum(req.severity, 'sv', ['severe_less_1','moderate_1_5','mild_greater_5','NA']);
  ensureNum(req.baseline_factor_pct, 'bf');
  ensureBool(req.inhibitor_screen, 'is');
  ensureEnum(req.inhibitor_titer, 'it', ['none','low_less_5','high_greater_5','NA','pending']);
  ensureNum(req.bleeds_per_year, 'bp');
  ensureEnum(req.prophylaxis, 'pp', ['none','factor_prophylaxis','emicizumab','non_factor_replacement','gene_therapy','other','NA']);
  ensureEnum(req.bypassing_agent, 'ba', ['none','FEIBA','Novoseven','recombinant_VIIa','combination','other','NA']);
  ensureStr(req.provider, 'pr');
  return { hf_id: `hmb_${Date.now()}`, patient_id: req.patient_id, type: req.type };
}
function thalassemia(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.type, 'tp', ['alpha_1_gene','alpha_2_gene','alpha_3_gene','alpha_4_HbBart','beta_thal_major','beta_thal_intermedia','beta_thal_minor','HbE_beta','other','NA']);
  ensureNum(req.hgb, 'hg');
  ensureNum(req.mcv, 'mc');
  ensureNum(req.hgb_f_pct, 'hf');
  ensureNum(req.hgb_a2_pct, 'ha');
  ensureNum(req.ferritin, 'ft');
  ensureNum(req.transfusions_per_year, 'ty');
  ensureBool(req.splenectomy, 'sp');
  ensureNum(req.lv_ef_pct, 'le');
  ensureEnum(req.chelation, 'ch', ['none','deferasirox','deferoxamine','deferiprone','combination','other','NA']);
  ensureStr(req.provider, 'pr');
  return { th_id: `thl_${Date.now()}`, patient_id: req.patient_id, type: req.type };
}
function itp(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.plt_count, 'pc');
  ensureNum(req.bleeding_score, 'bs');
  ensureEnum(req.phase, 'ph', ['new_diagnosis','persistent','chronic','remission','NA','unknown']);
  ensureEnum(req.treatment, 'tr', ['observation','IVIG','steroid','anti_D','rituximab','TPO_receptor_agonist','splenectomy','combination','other','NA']);
  ensureBool(req.diagnosed_exclusion, 'de');
  ensureNum(req.duration_months, 'du');
  ensureBool(req.marrow_done, 'bm');
  ensureEnum(req.outcome, 'ot', ['remission','partial_response','no_response','NA','unknown']);
  ensureStr(req.provider, 'pr');
  return { it_id: `itp_${Date.now()}`, patient_id: req.patient_id };
}
function transfusion_peds(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureNum(req.age_months, 'am');
  ensureNum(req.weight_kg, 'wk');
  ensureEnum(req.product, 'pd', ['PRBC','platelet','FFP','cryo','whole_blood','washed_RBC','irradiated','volume_reduced','pathogen_reduced','other','NA']);
  ensureNum(req.volume_ml, 'vl');
  ensureNum(req.volume_ml_kg, 'vk');
  ensureEnum(req.indication, 'in', ['symptomatic_anemia','pre_op','pre_chemo','exchange','exchange_chronic','HUS','TTP','hemorrhage','NA','other']);
  ensureNum(req.pre_hgb, 'ph');
  ensureNum(req.post_hgb, 'po');
  ensureBool(req.reaction, 'rx');
  ensureEnum(req.reaction_type, 'rt', ['none','febrile','allergic','hemolytic','TACO','TRALI','other','NA']);
  ensureStr(req.provider, 'pr');
  return { tf_id: `tnp_${Date.now()}`, patient_id: req.patient_id, product: req.product };
}

function funcs() { return { sickle, hemophilia, thalassemia, itp, transfusion_peds }; }
module.exports = { funcs, ValidationError };