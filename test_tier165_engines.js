// filepath: test_tier165_engines.js
const ENGINE_TESTS = [
  { mod: 'tier165_gen_771', fns: ['variant_interpret','pharmacogenomics','rare_disease','family_cascade','gen_result_report'] },
  { mod: 'tier165_phr_772', fns: ['cyp_metabolizer','drug_response','dose_adjust','adverse_risk','regimen_select'] },
  { mod: 'tier165_bio_773', fns: ['sequence_alignment','variant_calling','pca_analysis','gene_expression','pathway_analysis'] },
  { mod: 'tier165_eth_774', fns: ['consent_capacity','end_of_life_ethics','refusal_care','research_ethics','resource_allocation'] }
];
const base = { tenant_id: 't1', patient_id: 'p1', provider: 'p' };
function bodyFor(mod, fn) {
  if (mod === 'tier165_gen_771') {
    if (fn === 'variant_interpret') return { ...base, gene: 'BRCA1', variant: 'c.5266dupC', classification: 'pathogenic', acmg_score: 4, clinvar_pathogenic: true, allele_freq: 0.01, coverage: 50, zygosity: 'het', inheritance: 'AD', actionable: 'medication' };
    if (fn === 'pharmacogenomics') return { ...base, age: 30, gene: 'CYP2D6', metabolizer: 'poor', drug: 'codeine', standard_dose_mg: 60, adjusted_dose_mg: 0, action: 'alternate', adverse_risk_score: 7, benefit_score: 0.2 };
    if (fn === 'rare_disease') return { ...base, age: 25, disease: 'Marfan', diagnostic_journey_years: 5, physicians_consulted: 8, genetic_tests: 3, diagnosis_method: 'genetic', variants_found: 1, family_cascade: true, treatment_options: 2 };
    if (fn === 'family_cascade') return { ...base, proband_variant: 'BRCA1 c.5266dupC', disease: 'BRCA', first_degree_count: 4, first_degree_tested: 3, second_degree_count: 6, second_degree_tested: 4, carriers_identified: 2, affected_identified: 1, counseling_sessions: 3 };
    if (fn === 'gen_result_report') return { ...base, age: 30, panel: 'WGS', variants_total: 5000, variants_pathogenic: 2, variants_recessive: 5, variants_drug: 3, report_pages: 25, delivery_days: 30, complexity: 'complex' };
  }
  if (mod === 'tier165_phr_772') {
    if (fn === 'cyp_metabolizer') return { ...base, age: 30, gene: 'CYP2C19', metabolizer: 'intermediate', clinical_significance: 'moderate', allele: '*2', drug: 'clopidogrel', action: 'alternate' };
    if (fn === 'drug_response') return { ...base, age: 30, drug: 'warfarin', gene: 'VKORC1', variant: '-1639G>A', expected_response: 'increased', dose_adjustment_pct: 30, monitoring: 'frequent', outcome: 'responds' };
    if (fn === 'dose_adjust') return { ...base, age: 30, standard_dose_mg: 100, adjusted_dose_mg: 75, gene: 'CYP2D6', metabolizer: 'intermediate', drug: 'codeine', rationale: 'reduced_clearance', result: 'appropriate' };
    if (fn === 'adverse_risk') return { ...base, age: 30, drug: 'simvastatin', gene: 'SLCO1B1', variant: 'c.521T>C', risk_score: 5, risk_category: 'moderate', monitoring: 'frequent', outcome: 'precaution' };
    if (fn === 'regimen_select') return { ...base, age: 30, primary_drug: 'codeine', alternative_drug: 'morphine', gene: 'CYP2D6', metabolizer: 'poor', score: 8, rationale: 'better_metabolism', recommendation: 'switch' };
  }
  if (mod === 'tier165_bio_773') {
    if (fn === 'sequence_alignment') return { ...base, sample_id: 's1', ref_genome: 'GRCh38', reads_count: 1000000, coverage_avg: 30, q30_pct: 90, mapping_rate_pct: 95, insertion_size: 300, quality_score: 35, alignment_tool: 'bwa' };
    if (fn === 'variant_calling') return { ...base, sample_id: 's1', caller: 'GATK', snv_count: 5000, indel_count: 200, ti_tv_ratio: 2.5, het_hom_ratio: 1.5, gene_count: 3000, qc_pass: true, recall_score: 0.95 };
    if (fn === 'pca_analysis') return { ...base, dataset: 'pop1', samples_count: 1000, snps_count: 50000, components: 10, variance_explained: 0.85, outliers_detected: 5, population: 'mixed', software: 'PLINK' };
    if (fn === 'gene_expression') return { ...base, sample_id: 's1', platform: 'RNA-seq', genes_quantified: 20000, normalization_method: 'TPM', differentially_expressed: 500, fold_change_threshold: 2, fdr_threshold: 0.05, analysis: 'DESeq2' };
    if (fn === 'pathway_analysis') return { ...base, gene_set: 'broad', genes_in_set: 1000, input_genes: 500, pathways_count: 50, top_pathway: 'PI3K', enrichment_pvalue: 0.001, method: 'GSEA', database: 'KEGG' };
  }
  if (mod === 'tier165_eth_774') {
    if (fn === 'consent_capacity') return { ...base, age: 75, mmse_score: 22, moca_score: 18, diagnosis: true, aid_capacity: 1, overall: 'partial', assessor: 1, improvement: false, reassess_days: 30 };
    if (fn === 'end_of_life_ethics') return { ...base, age: 70, diagnosis: 'cancer', competent: true, wishes: 'comfort', advance_directive: true, family_count: 4, consensus: 'full', ethic_consult: 'none' };
    if (fn === 'refusal_care') return { ...base, age: 40, treatment_refused: 'transfusion', competent: true, decision_maker: 'self', discussion_hours: 2, understands_risk: true, alternatives_offered: 'comprehensive', documented: 'comprehensive' };
    if (fn === 'research_ethics') return { ...base, age: 30, study_type: 'observational', consent: true, consent_version: 1, ethics_review: 'approved', compensation: true, compensation_type: 'voucher', withdraw_days: 30, cohort_minimal_risk: true };
    if (fn === 'resource_allocation') return { ...base, age: 50, resource_type: 'ICU_bed', priority_score: 8, urgency: 9, allocation_method: 'severity', consensus_panel: true, waiting_days: 0, outcome: 'allocated' };
  }
  return { ...base };
}
let pass = 0, fail = 0;
for (const t of ENGINE_TESTS) {
  const { funcs } = require('./' + t.mod + '_engine.js');
  const f = funcs();
  for (const fn of t.fns) {
    const b = bodyFor(t.mod, fn);
    try {
      const out = f[fn](b);
      if (out && out.patient_id) { console.log('OK', t.mod + '.' + fn); pass++; }
      else { console.log('FAIL', t.mod + '.' + fn, 'no patient_id'); fail++; }
    } catch (e) {
      console.log('FAIL', t.mod + '.' + fn + ':', e.message);
      fail++;
    }
  }
}
console.log('TOTALS: pass=' + pass + ' fail=' + fail);