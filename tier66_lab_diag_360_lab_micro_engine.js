// filepath: tier66_lab_diag_360_lab_micro_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function culture_setup(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.culture_id, 'cid');
  ensureStr(req.specimen_id, 'sid');
  ensureEnum(req.specimen_type, 'st', ['urine','blood','sputum','wound','csf','stool','genital','eye','ear','tissue','fluid','respiratory','other']);
  ensureEnum(req.media_type, 'mt', ['blood_agar','mac_conkey','chocolate_agar','thioglycollate','sabouraud','tsa','cna','bcsa','anaerobic','mycobacterial','viral','mycology','other']);
  ensureStr(req.setup_date, 'sd');
  ensureNum(req.incubation_temp_c, 'itc');
  ensureStr(req.expected_read_at, 'era');
  ensureStr(req.technician, 'tech');
  return { culture: req.culture_id };
}
function gram_stain(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.culture_id, 'cid');
  ensureEnum(req.result, 'res', ['gram_positive_cocci','gram_positive_rods','gram_negative_cocci','gram_negative_rods','gram_positive_cocci_clusters','gram_positive_cocci_chains','gram_positive_rods_branced','gram_negative_rods_oxidase_pos','gram_negative_rods_oxidase_neg','gram_negative_coccobacilli','no_organism_seen','partial']);
  ensureEnum(req.quantification, 'quant', ['rare','few','moderate','many','1_plus','2_plus','3_plus','4_plus','tntoo','swarm','mixed','many_polymorphonuclear_cells','l_polymorphonuclear_cells']);
  ensureBool(req.wbc_seen, 'ws');
  ensureBool(req.epithelial_seen, 'es');
  ensureStr(req.organism_presumptive, 'op');
  ensureStr(req.technician, 'tech');
  ensureStr(req.reviewed_by, 'rev');
  return { result: req.result };
}
function susceptibility(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.culture_id, 'cid');
  ensureStr(req.organism, 'org');
  ensureStr(req.antibiotic, 'ab');
  ensureEnum(req.method, 'method', ['mic','disk_diffusion','etest','gradient_strip','broth_microdilution','agar_dilution','automated','other']);
  ensureEnum(req.result, 'res', ['sensitive','intermediate','resistant','sdd','susceptible','dose_dependent','non_susceptible','not_testable']);
  ensureNum(req.mic_value, 'mv');
  ensureBool(req.panel_complete, 'pc');
  ensureBool(req.cls_compliant, 'cls');
  return { result: req.result };
}
function organism_id(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.culture_id, 'cid');
  ensureStr(req.organism_name, 'on');
  ensureEnum(req.identification_method, 'im', ['vitek_2','vitek_ms','bactec','maldi_t','api_20','biochemical','gene_sequencing','16s_rrna','pcr','fish','mass_spec']);
  ensureNum(req.confidence, 'conf');
  ensureBool(req.rare_organism, 'ro');
  ensureBool(req.requires_confirm_test, 'rct');
  return { organism: req.organism_name };
}
function interpretation(req) {
  ensureStr(req.patient_id, 'patient_id');
  ensureStr(req.culture_id, 'cid');
  ensureStr(req.organism, 'org');
  ensureEnum(req.interpretation, 'interp', ['likely_pathogen','probable_contaminant','colonizer','mixed','no_significance','normal_flora','skin_contaminant','environmental']);
  ensureBool(req.significant_count, 'sc');
  ensureEnum(req.colonization_likelihood, 'cl', ['low','moderate','high','very_high','unknown']);
  ensureEnum(req.clinical_relevance, 'cr', ['low','moderate','high','critical','not_applicable','unknown']);
  ensureBool(req.provider_notified, 'pn');
  return { interpretation: req.interpretation };
}

function funcs() { return { culture_setup, gram_stain, susceptibility, organism_id, interpretation }; }
module.exports = { funcs, ValidationError };