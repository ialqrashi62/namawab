// filepath: tier138_gen_672_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string' || !v) throw new ValidationError(`${f} required`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function fastq_qc(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.sample_id, 'sid');
  ensureStr(req.platform, 'pl');
  ensureNum(req.read_count, 'rc');
  ensureNum(req.read_length, 'rl');
  ensureNum(req.q30_pct, 'q3');
  ensureNum(req.gc_pct, 'gc');
  ensureEnum(req.grade, 'gd', ['A','B','C','fail']);
  return { qc_id: `qc_${Date.now()}`, sample_id: req.sample_id, platform: req.platform, q30: req.q30_pct, grade: req.grade };
}
function alignment(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.sample_id, 'sid');
  ensureStr(req.reference, 'rf');
  ensureEnum(req.aligner, 'al', ['bwa','bwa_mem','bwa_mem2','minimap2','star','hisat2','bowtie2','subread','STARFusion','snap']);
  ensureNum(req.mapped_pct, 'mp');
  ensureNum(req.coverage, 'cv');
  ensureNum(req.insert_size, 'is');
  ensureStr(req.bam_path, 'bp');
  return { al_id: `al_${Date.now()}`, sample_id: req.sample_id, aligner: req.aligner, mapped: req.mapped_pct };
}
function variant_call(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.sample_id, 'sid');
  ensureStr(req.bam_path, 'bp');
  ensureEnum(req.caller, 'cr', ['GATK','Mutect2','Strelka2','VarScan2','DeepVariant','freebayes','LoFreq','VarDict','speedseq','Octopus']);
  ensureNum(req.snp_count, 'sn');
  ensureNum(req.indel_count, 'in');
  ensureStr(req.vcf_path, 'vp');
  ensureEnum(req.pipeline, 'pp', ['GATK_best_practices','Sentieon','DRAGEN','Strelka','custom','nf-core','OncoKB','CIViC']);
  return { vc_id: `vc_${Date.now()}`, sample_id: req.sample_id, caller: req.caller, snps: req.snp_count, indels: req.indel_count };
}
function annotation(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.vcf_path, 'vp');
  ensureEnum(req.annotator, 'an', ['VEP','SnpEff','ANNOVAR','ClinVar','OncoKB','CIViC','MyVariant','VARIANT','MutationTaster','CADD']);
  ensureNum(req.pathogenic_count, 'pc');
  ensureNum(req.vus_count, 'vu');
  ensureNum(req.benign_count, 'bc');
  ensureStr(req.report_path, 'rp');
  return { an_id: `an_${Date.now()}`, vcf: req.vcf_path, annotator: req.annotator, pathogenic: req.pathogenic_count };
}
function report(req) {
  ensureStr(req.tenant_id, 'tid');
  ensureStr(req.patient_id, 'pid');
  ensureStr(req.an_id, 'aid');
  ensureEnum(req.report_type, 'rt', ['germline','somatic','carrier','prenatal','neo','liquid_biopsy','PGx','immune','pharm','comprehensive']);
  ensureStr(req.findings, 'fi');
  ensureNum(req.actionable_count, 'ac');
  ensureStr(req.signoff, 'so');
  ensureStr(req.provider, 'pr');
  return { rep_id: `rep_${Date.now()}`, patient_id: req.patient_id, type: req.report_type, actionable: req.actionable_count };
}

function funcs() { return { fastq_qc, alignment, variant_call, annotation, report }; }
module.exports = { funcs, ValidationError };
