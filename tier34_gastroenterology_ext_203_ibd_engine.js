// filepath: tier34_gastroenterology_ext_203_ibd_engine.js
// TIER34_GASTROENTEROLOGY-203: IBD
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function ibd_classification(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.ibd_type, 'type', ['crohns','uc','ibd_unspecified','other']);
  ensureNumber(req.age_at_diagnosis, 'age');
  ensureEnum(req.disease_location, 'loc', ['ileal','colonic','ileocolonic','upper_gi','perianal','extensive','left_sided','proctitis','other']);
  ensureEnum(req.disease_behavior, 'beh', ['inflammatory','stricturing','penetrating','mixed','other']);
  ensureEnum(req.extra_intestinal, 'eim', ['none','arthritis','pyoderma','uveitis','primary_sclerosing_cholangitis','multiple','other']);
  let status;
  if (req.disease_behavior === 'penetrating' && req.disease_location === 'ileocolonic') status = 'complex_crohn_fistula_review';
  else if (req.extra_intestinal === 'primary_sclerosing_cholangitis') status = 'psc_surveillance_colonoscopy';
  else if (req.ibd_type === 'crohns' && req.age_at_diagnosis < 20) status = 'early_onset_crohn_aggressive_review';
  else status = 'ibd_classified_appropriate';
  return { status, type: req.ibd_type };
}

function ibd_disease_activity(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.ibd_type, 'type', ['crohns','uc','ibd_unspecified']);
  ensureNumber(req.crp_mg_l, 'crp');
  ensureNumber(req.calprotectin_ug_g, 'calp');
  ensureNumber(req.mayo_score, 'mayo');
  ensureNumber(req.sccai_score, 'sccai');
  ensureEnum(req.flare_status, 'flare', ['remission','mild','moderate','severe','fulminant','other']);
  let status;
  if (req.flare_status === 'severe' && req.crp_mg_l >= 50) status = 'severe_flare_hospitalize_iv_steroids';
  else if (req.calprotectin_ug_g >= 250 && req.mayo_score >= 6) status = 'active_uc_optimize_therapy';
  else if (req.flare_status === 'remission' && req.calprotectin_ug_g < 50) status = 'remission_maintain';
  else if (req.flare_status === 'moderate') status = 'moderate_flare_optimize_immunomodulator';
  else status = 'ibd_activity_review';
  return { status, f: req.flare_status };
}

function ibd_medication(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.medication, 'med', ['mesalamine','corticosteroid','azathioprine','methotrexate','infliximab','adalimumab','vedolizumab','ustekinumab','risankizumab','tofacitinib','other']);
  ensureNumber(req.dose_mg, 'dose');
  ensureNumber(req.interval_weeks, 'int');
  ensureBool(req.antibody_present, 'ab');
  ensureEnum(req.response, 'resp', ['maintained','partial','lost_response','intolerant','naive','other']);
  ensureBool(req.biosim_switched, 'bsim');
  let status;
  if (req.response === 'lost_response' && req.antibody_present) status = 'lost_response_due_to_antibodies_switch';
  else if (req.response === 'lost_response' && !req.antibody_present) status = 'lost_response_optimize_dose_interval';
  else if (req.response === 'maintained' && req.medication.includes('mab')) status = 'maintained_biologic_continue';
  else if (req.biosim_switched && req.response === 'partial') status = 'biosim_partial_response_review';
  else status = 'ibd_medication_appropriate';
  return { status, med: req.medication };
}

function ibd_surveillance(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureNumber(req.years_diagnosis, 'yrs');
  ensureStr(req.last_colonoscopy_date, 'last_date');
  ensureNumber(req.surveillance_interval_years, 'int_yrs');
  ensureBool(req.dysplasia_found, 'dys');
  ensureBool(req.chromoendoscopy_done, 'chr');
  let status;
  if (req.dysplasia_found) status = 'dysplasia_found_refer_surgery_review';
  else if (req.years_diagnosis >= 8 && !req.chromoendoscopy_done) status = 'long_standing_ibd_chromoendoscopy';
  else if (req.years_diagnosis >= 8 && req.surveillance_interval_years > 3) status = 'surveillance_interval_too_long_shorten';
  else status = 'ibd_surveillance_appropriate';
  return { status, y: req.years_diagnosis };
}

function ibd_surgery(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.surgery_type, 'type', ['ileocecal_resection','right_hemicolectomy','subtotal_colectomy','ileal_pouch_anal_anastomosis','stricturoplasty','seton_drainage','fistulotomy','other']);
  ensureEnum(req.indication, 'ind', ['stricture','fistula','abscess','refractory_disease','cancer_prevention','perforation','toxic_megacolon','other']);
  ensureBool(req.laparoscopic, 'lap');
  ensureEnum(req.complication, 'comp', ['none','bleeding','anastomotic_leak','wound_infection','ileus','sepsis','other']);
  ensureEnum(req.recurrence, 'rec', ['none','endoscopic','clinical','surgical','other']);
  let status;
  if (req.complication === 'anastomotic_leak') status = 'anastomotic_leak_re_exploration';
  else if (req.complication === 'sepsis') status = 'post_op_sepsis_aggressive_treatment';
  else if (req.recurrence === 'surgical' && req.indication === 'stricture') status = 'recurrent_stricture_review_crohn';
  else if (req.surgery_type === 'ileocecal_resection' && req.laparoscopic && req.complication === 'none') status = 'lap_resection_uncomplicated';
  else status = 'ibd_surgery_review';
  return { status, sx: req.surgery_type };
}

function funcs() { return { ibd_classification, ibd_disease_activity, ibd_medication, ibd_surveillance, ibd_surgery }; }
module.exports = { funcs, ValidationError };