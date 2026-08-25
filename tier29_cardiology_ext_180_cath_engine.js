// filepath: tier29_cardiology_ext_180_cath_engine.js
// TIER29_CARDIOLOGY-180: Cath lab, PCI, structural
class ValidationError extends Error { constructor(message, field) { super(message); this.name = 'ValidationError'; this.field = field; this.kind = 'validation'; } }
function ensureNumber(v, f) { if (typeof v !== 'number' || !isFinite(v)) throw new ValidationError(`${f} must be a finite number`, f); }
function ensureStr(v, f) { if (typeof v !== 'string' || !v.length) throw new ValidationError(`${f} required`, f); }
function ensureEnum(v, f, allowed) { if (!allowed.includes(v)) throw new ValidationError(`${f} must be one of ${allowed.join('|')}`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }

function cath_plan(req) {
  ensureStr(req.procedure_id, 'procedure_id');
  ensureEnum(req.access, 'access', ['radial','femoral','brachial','ulnar','other']);
  ensureEnum(req.approach, 'approach', ['diagnostic_only','diagnostic_with_pci','pci_only','ivus','oct','ffr','structural','other']);
  ensureNumber(req.door_to_balloon_min, 'dtb');
  ensureEnum(req.findings, 'findings', ['normal','non_obstructive','single_vessel','multi_vessel','left_main','ctv','other']);
  ensureEnum(req.timiflow, 'timiflow', ['0','1','2','3','unknown','other']);
  let status;
  if (req.door_to_balloon_min > 90) status = 'dtb_over_90_review_quality';
  else if (req.findings === 'left_main') status = 'left_main_disease_cabg_review';
  else if (req.timiflow === '0' || req.timiflow === '1') status = 'slow_flow_no_reflow_review';
  else status = 'cath_plan_completed';
  return { status, findings: req.findings };
}

function pci_outcome(req) {
  ensureStr(req.pci_id, 'pci_id');
  ensureNumber(req.stent_count, 'stents');
  ensureEnum(req.complication, 'complication', ['none','dissection','no_reflow','perforation','stent_thrombosis','side_branch_compromise','access_bleed','retroperitoneal','other']);
  ensureBool(req.timiflow_post, 'timi_post');
  ensureNumber(req.fluoroscopy_min, 'fluoro');
  ensureNumber(req.contrast_ml, 'contrast');
  let status;
  if (req.complication === 'perforation') status = 'perforation_emergency_covered_stent_or_surgery';
  else if (req.complication === 'stent_thrombosis') status = 'stent_thrombosis_rescue';
  else if (req.contrast_ml > 400) status = 'high_contrast_aki_risk_review';
  else status = 'pci_outcome_successful';
  return { status, comp: req.complication };
}

function tav(req) {
  ensureStr(req.procedure_id, 'procedure_id');
  ensureEnum(req.approach, 'approach', ['transfemoral','transapical','transaortic','transcaval','subclavian','other']);
  ensureEnum(req.valve_type, 'valve_type', ['balloon_expandable','self_expanding','mechanical','other']);
  ensureBool(req.pre_baa, 'pre_baa');
  ensureNumber(req.gradient_post, 'grad_post');
  ensureEnum(req.paravalvular_leak, 'pv_leak', ['none','mild','moderate','severe','other']);
  ensureNumber(req.conduction_disturbance, 'cd');
  let status;
  if (req.paravalvular_leak === 'severe') status = 'severe_pvl_review';
  else if (req.gradient_post > 20) status = 'high_post_gradient_review_prosthesis_mismatch';
  else if (req.cd >= 1) status = 'conduction_disturbance_pacemaker_review';
  else status = 'tav_successful';
  return { status, pv: req.paravalvular_leak };
}

function mitraclip(req) {
  ensureStr(req.procedure_id, 'procedure_id');
  ensureEnum(req.indication, 'indication', ['primary_mr','secondary_mr','tr_repair','other']);
  ensureNumber(req.clips_deployed, 'clips');
  ensureEnum(req.post_mr_severity, 'post_mr', ['none','mild','moderate','severe','other']);
  ensureNumber(req.strait_orifice_area, 'soa');
  ensureNumber(req.mlap, 'mlap');
  let status;
  if (req.post_mr_severity === 'severe') status = 'residual_severe_mr_review_additional_clip';
  else if (req.mlap > 5) status = 'elevated_mlap_gradient_review';
  else if (req.clips_deployed >= 3 && req.strait_orifice_area < 1.5) status = 'ms_3_clips_soa_review';
  else status = 'mitraclip_completed';
  return { status, clips: req.clips_deployed };
}

function lad_revascularization(req) {
  ensureStr(req.episode_id, 'episode_id');
  ensureEnum(req.territory, 'territory', ['lad','lca','rca','left_main','ramus','graft','other']);
  ensureNumber(req.syntax_score, 'syntax');
  ensureBool(req.diabetic, 'diabetic');
  ensureEnum(req.recommendation, 'recommendation', ['medical','pci','cabg','hybrid','other']);
  ensureNumber(req.stenosis_pct, 'stenosis');
  let status;
  if (req.stenosis_pct < 70) status = 'non_significant_stenosis';
  else if (req.syntax >= 23 && req.recommendation !== 'cabg') status = 'syntax_high_cabg_refer';
  else if (req.diabetic && req.territory === 'left_main' && req.recommendation !== 'cabg') status = 'diabetic_left_main_cabg_recommended';
  else status = 'revascularization_appropriate';
  return { status, syn: req.syntax_score };
}

const CITATIONS = { ACC_AHA_PCI_2024: 'ACC/AHA PCI 2024', TAVR_2024: 'TAVR Guidelines 2024' };

function funcs() { return { cath_plan, pci_outcome, tav, mitraclip, lad_revascularization }; }
module.exports = { funcs, CITATIONS, ValidationError };