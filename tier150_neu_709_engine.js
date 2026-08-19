// filepath: tier150_neu_709_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function stroke(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.type, 'tp', ['ischemic','hemorrhagic','SAH','TGA','TIA','mimic','unknown']);
  ensureNum(req.nihss_admit, 'na');
  ensureNum(req.nihss_24h, 'n2');
  ensureNum(req.nihss_discharge, 'nd');
  ensureEnum(req.toast, 'to', ['large_artery','cardioembolic','small_vessel','other_cause','undetermined','NA']);
  ensureBool(req.tpa_given, 'tg');
  ensureBool(req.thrombectomy, 'th');
  ensureNum(req.door_to_needle_min, 'dn');
  ensureNum(req.door_to_groin_min, 'dg');
  ensureNum(req.mrs_discharge, 'mr');
  ensureStr(req.provider, 'pr');
  return { st_id: `sk_${Date.now()}`, patient_id: req.patient_id, type: req.type, nihss: req.nihss_admit };
}
function epilepsy(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.seizure_type, 'st', ['generalized_tonic_clonic','focal_aware','focal_impaired_awareness','absence','myoclonic','atonic','tonic','clonic','status_epilepticus','febrile','unknown','NA']);
  ensureNum(req.frequency_per_month, 'fm');
  ensureNum(req.duration_sec, 'du');
  ensureEnum(req.eeg_finding, 'ef', ['normal','epileptiform_left','epileptiform_right','epileptiform_generalized','focal_slowing','generalized_slowing','NA','unknown']);
  ensureEnum(req.mri_finding, 'mf', ['normal','mesial_sclerosis','focal_cortical_dysplasia','tumor','AVM','cavernoma','encephalomalacia','other','NA','unknown']);
  ensureNum(req.aed_count, 'ac');
  ensureEnum(req.aed_levels, 'al', ['therapeutic','sub_therapeutic','supra_therapeutic','NA','unknown']);
  ensureNum(req.last_seizure_days, 'ls');
  ensureStr(req.provider, 'pr');
  return { ep_id: `ep_${Date.now()}`, patient_id: req.patient_id, type: req.seizure_type };
}
function ms(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.type, 'tp', ['RRMS','SPMS','PPMS','PRMS','CIS','NMOSD','MOG_AD','other','unknown']);
  ensureNum(req.edss, 'ed');
  ensureNum(req.relapse_count_2yr, 'rc');
  ensureNum(req.mri_lesions_t2, 'm2');
  ensureNum(req.mri_lesions_gad, 'mg');
  ensureNum(req.oled_band_count, 'ol');
  ensureEnum(req.dmt, 'dm', ['none','interferon_beta','glatiramer','dimethyl_fumarate','teriflunomide','fingolimod','siponimod','natalizumab','ocrelizumab','rituximab','alemtuzumab','cladribine','mitoxantrone','other']);
  ensureNum(req.dmt_duration_months, 'dd');
  ensureBool(req.progression, 'pg');
  ensureStr(req.provider, 'pr');
  return { ms_id: `ms_${Date.now()}`, patient_id: req.patient_id, type: req.type, edss: req.edss };
}
function movement(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.disorder, 'di', ['Parkinsons','MSA','PSP','CBD','Lewy_body','essential_tremor','dystonia_focal','dystonia_generalized','tardive','Huntingtons','Tourette','Wilson','drug_induced','other','unknown','NA']);
  ensureEnum(req.hoehn_yahr, 'hy', ['I','II','III','IV','V','unknown','NA']);
  ensureNum(req.updrs_total, 'ut');
  ensureEnum(req.motor_complications, 'mc', ['none','dyskinesia','on_off','wearing_off','freezing','dystonia','other','NA']);
  ensureNum(req.ledd_mg, 'le');
  ensureNum(req.dbs_settings, 'db');
  ensureBool(req.falls_30d, 'fa');
  ensureNum(req.fall_count_30d, 'fc');
  ensureStr(req.provider, 'pr');
  return { mv_id: `mvt_${Date.now()}`, patient_id: req.patient_id, disorder: req.disorder };
}
function neuropathy(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureEnum(req.type, 'tp', ['diabetic','CIDP','GBS','vasculitic','toxic','B12_deficiency','hereditary_CMT','idiopathic','small_fiber','autonomic','carpal_tunnel','cubital_tunnel','peroneal','other','unknown','NA']);
  ensureNum(req.duration_months, 'du');
  ensureEnum(req.distribution, 'ds', ['distal_symmetric','distal_asymmetric','proximal','multifocal','focal','length_dependent','NA','unknown']);
  ensureEnum(req.fiber_type, 'ft', ['large','small','mixed','autonomic','NA','unknown']);
  ensureNum(req.ncv_conduction, 'nc');
  ensureNum(req.emg_fibrillation, 'em');
  ensureNum(req.pain_score, 'ps');
  ensureEnum(req.treatment, 'tr', ['none','gabapentin','pregabalin','duloxetine','amitriptyline','TCAs','SNRI','opioid','IVIG','steroid','plasma_exchange','other']);
  ensureStr(req.provider, 'pr');
  return { np_id: `nrp_${Date.now()}`, patient_id: req.patient_id, type: req.type };
}

function funcs() { return { stroke, epilepsy, ms, movement, neuropathy }; }
module.exports = { funcs, ValidationError };