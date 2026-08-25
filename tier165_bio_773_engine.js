// filepath: tier165_bio_773_engine.js
class ValidationError extends Error { constructor(m, f) { super(m); this.field = f; } }
function ensureStr(v, f) { if (typeof v !== 'string') throw new ValidationError(`${f} must be string`, f); }
function ensureNum(v, f) { if (typeof v !== 'number' || isNaN(v)) throw new ValidationError(`${f} must be number`, f); }
function ensureBool(v, f) { if (typeof v !== 'boolean') throw new ValidationError(`${f} must be boolean`, f); }
function ensureEnum(v, f, list) { if (!list.includes(String(v))) throw new ValidationError(`${f} must be one of ${list.join('|')}`, f); }

function sequence_alignment(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureStr(req.sample_id, 'si'); ensureEnum(req.ref_genome, 'rg', ['GRCh37','GRCh38','T2T','custom','NA']);
  ensureNum(req.reads_count, 'rc'); ensureNum(req.coverage_avg, 'ca');
  ensureNum(req.q30_pct, 'q3'); ensureNum(req.mapping_rate_pct, 'mr');
  ensureNum(req.insertion_size, 'is'); ensureNum(req.quality_score, 'qs');
  ensureEnum(req.alignment_tool, 'at', ['bwa','bowtie2','star','hisat2','minimap2','NA']);
  ensureStr(req.provider, 'pr');
  return { sa_id: `sa_${Date.now()}`, patient_id: req.patient_id, sample: req.sample_id, cov: req.coverage_avg };
}

function variant_calling(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureStr(req.sample_id, 'si'); ensureEnum(req.caller, 'cr', ['GATK','VarScan','LoFreq','Mutect2','Strelka','NA']);
  ensureNum(req.snv_count, 'sn'); ensureNum(req.indel_count, 'ic');
  ensureNum(req.ti_tv_ratio, 'tt'); ensureNum(req.het_hom_ratio, 'hh');
  ensureNum(req.gene_count, 'gc'); ensureBool(req.qc_pass, 'qp');
  ensureNum(req.recall_score, 'rs'); ensureStr(req.provider, 'pr');
  return { vc_id: `vc_${Date.now()}`, patient_id: req.patient_id, snv: req.snv_count, indel: req.indel_count };
}

function pca_analysis(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureStr(req.dataset, 'ds'); ensureNum(req.samples_count, 'sc');
  ensureNum(req.snps_count, 'sn'); ensureNum(req.components, 'cp');
  ensureNum(req.variance_explained, 've'); ensureNum(req.outliers_detected, 'od');
  ensureEnum(req.population, 'pp', ['EUR','AFR','EAS','SAS','mixed','unknown','NA']);
  ensureEnum(req.software, 'sw', ['PLINK','GCTA','EIGENSTRAT','smartpca','NA']);
  ensureStr(req.provider, 'pr');
  return { pa_id: `pa_${Date.now()}`, patient_id: req.patient_id, dataset: req.dataset, variance: req.variance_explained };
}

function gene_expression(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureStr(req.sample_id, 'si'); ensureEnum(req.platform, 'pl', ['RNA-seq','microarray','nano_string','qPCR','NA']);
  ensureNum(req.genes_quantified, 'gq'); ensureEnum(req.normalization_method, 'nm', ['TPM','FPKM','RPKM','counts','NA']);
  ensureNum(req.differentially_expressed, 'de'); ensureNum(req.fold_change_threshold, 'fc');
  ensureNum(req.fdr_threshold, 'ft'); ensureEnum(req.analysis, 'an', ['DESeq2','edgeR','limma','NA']);
  ensureStr(req.provider, 'pr');
  return { ge_id: `ge_${Date.now()}`, patient_id: req.patient_id, platform: req.platform, de: req.differentially_expressed };
}

function pathway_analysis(req) {
  ensureStr(req.tenant_id, 'tid'); ensureStr(req.patient_id, 'pid');
  ensureEnum(req.gene_set, 'gs', ['broad','narrow','custom','tissue_specific','NA']);
  ensureNum(req.genes_in_set, 'gi'); ensureNum(req.input_genes, 'ig');
  ensureNum(req.pathways_count, 'pc'); ensureStr(req.top_pathway, 'tp');
  ensureNum(req.enrichment_pvalue, 'ep'); ensureEnum(req.method, 'mt', ['GSEA','ORA','Enrichr','DAVID','NA']);
  ensureEnum(req.database, 'db', ['KEGG','Reactome','GO','MSigDB','NA']);
  ensureStr(req.provider, 'pr');
  return { pw_id: `pw_${Date.now()}`, patient_id: req.patient_id, top: req.top_pathway, p: req.enrichment_pvalue };
}

function funcs() { return { sequence_alignment, variant_calling, pca_analysis, gene_expression, pathway_analysis }; }
module.exports = { funcs, ValidationError };