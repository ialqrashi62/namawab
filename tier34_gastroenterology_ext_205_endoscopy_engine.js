// filepath: tier34_gastroenterology_ext_205_endoscopy_engine.js
// TIER34_GASTROENTEROLOGY-205: Endoscopy
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function egd_findings(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.indication, 'ind', ['dyspepsia','reflux','dysphagia','gi_bleeding','anemia','weight_loss','surveillance','variceal_screening','other']);
  ensureEnum(req.findings, 'find', ['normal','gastric_erosions','gastric_ulcer','duodenal_ulcer','esophagitis','barretts','varices','mass','stricture','other']);
  ensureBool(req.biopsies_taken, 'bx');
  ensureBool(req.barretts_suspected, 'barretts');
  ensureEnum(req.complication, 'comp', ['none','perforation','bleeding','aspiration','sedation','other']);
  let status;
  if (req.findings === 'varices') status = 'varices_band_ligation_refer';
  else if (req.findings === 'mass') status = 'mass_biopsy_pathology_review';
  else if (req.complication === 'perforation') status = 'perforation_surgical_consult';
  else if (req.barretts_suspected && req.biopsies_taken) status = 'barretts_surveillance_protocol';
  else status = 'egd_findings_review';
  return { status, f: req.findings };
}

function colonoscopy_quality(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.bowel_prep, 'prep', ['adequate','inadequate','poor','excellent','other']);
  ensureBool(req.cecum_intubated, 'cecum');
  ensureNumber(req.withdrawal_time_min, 'wt');
  ensureNumber(req.adenoma_detection_rate, 'adr');
  ensureNumber(req.polyp_count, 'polyps');
  let status;
  if (!req.cecum_intubated) status = 'incomplete_colonoscopy_repeat';
  else if (req.bowel_prep === 'poor' || req.bowel_prep === 'inadequate') status = 'poor_prep_repeat_colonoscopy';
  else if (req.withdrawal_time_min < 6) status = 'withdrawal_time_too_short_review';
  else if (req.adenoma_detection_rate < 25) status = 'low_adr_endoscopist_review';
  else status = 'colonoscopy_quality_appropriate';
  return { status, adr: req.adenoma_detection_rate };
}

function ercp(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.indication, 'ind', ['choledocholithiasis','bile_leak','biliary_stricture','ampullary_mass','sphincter_of_oddi','biliary_pancreatitis','other']);
  ensureBool(req.sphincterotomy, 'sphinc');
  ensureBool(req.stone_extracted, 'stone');
  ensureBool(req.stent_placed, 'stent');
  ensureEnum(req.complication, 'comp', ['none','pancreatitis','bleeding','perforation','cholangitis','other']);
  let status;
  if (req.complication === 'pancreatitis') status = 'post_ercp_pancreatitis_treat';
  else if (req.complication === 'perforation') status = 'ercp_perforation_surgical_consult';
  else if (req.indication === 'choledocholithiasis' && req.stone_extracted) status = 'stone_cleared_complete';
  else if (req.stent_placed && req.bile_leak) status = 'stent_for_leak_appropriate';
  else status = 'ercp_review';
  return { status, ind: req.indication };
}

function eus_evaluation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.indication, 'ind', ['pancreatic_mass','biliary_dilation','subepithelial_lesion','cystic_lesion','staging','other']);
  ensureNumber(req.mass_size_mm, 'size');
  ensureBool(req.fna_done, 'fna');
  ensureEnum(req.pathology, 'path', ['adenocarcinoma','neuroendocrine','lymphoma','ipmn','mcn','spt','pseudocyst','gi stromal','benign','inconclusive','not_done','other']);
  ensureEnum(req.t_stage, 't', ['t1','t2','t3','t4','tx','t1a','t1b','t1c','other']);
  let status;
  if (req.pathology === 'adenocarcinoma' && req.t_stage === 't2') status = 'pancreatic_adeno_t2_resectable_review';
  else if (req.indication === 'pancreatic_mass' && !req.fna_done) status = 'fna_indicated_obtain_tissue';
  else if (req.pathology === 'inconclusive') status = 'inconclusive_repeat_eus_fna';
  else status = 'eus_review_appropriate';
  return { status, pat: req.pathology };
}

function endoscopic_bleeding(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureEnum(req.source, 'src', ['variceal','peptic_ulcer','mallory_weiss','angiodysplasia','dieulafoy','tumor','gastric_anastomosis','unknown','other']);
  ensureBool(req.hemorrhagic_shock, 'shock');
  ensureEnum(req.therapy_applied, 'tx', ['injection','clipping','thermal_coagulation','band_ligation','argon_plasma','combination','none','other']);
  ensureEnum(req.rebleeding_risk, 'risk', ['low','moderate','high','very_high']);
  ensureNumber(req.transfusion_units, 'tx_units');
  let status;
  if (req.hemorrhagic_shock) status = 'hemorrhagic_shock_icu_resuscitation';
  else if (req.rebleeding_risk === 'very_high' && req.transfusion_units >= 4) status = 'high_risk_continue_obs_repeat_endoscopy';
  else if (req.source === 'variceal' && req.therapy_applied === 'band_ligation') status = 'variceal_band_ligation_appropriate';
  else if (req.therapy_applied === 'none') status = 'no_therapy_applied_re_endoscopy';
  else status = 'endoscopic_bleeding_review';
  return { status, src: req.source };
}

function funcs() { return { egd_findings, colonoscopy_quality, ercp, eus_evaluation, endoscopic_bleeding }; }
module.exports = { funcs, ValidationError };