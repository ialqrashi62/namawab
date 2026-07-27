// P3-BR pathology_ext_engine.js — 10 pure functions
const Engine = {
  Biopsy: function (i) {
    const type = (i.type || 'tissue');
    const site = (i.site || 'unknown');
    if (type === 'tissue' && site === 'skin') return { plan: 'shave-or-punch-and-eval' };
    if (type === 'tissue') return { plan: 'incisional-or-excisional' };
    if (type === 'core-needle') return { plan: 'core-needle-and-eval' };
    if (type === 'FNA') return { plan: 'FNA-and-cytopath' };
    return { plan: 'biopsy-and-eval' };
  },
  Frozen: function (i) {
    const intraop = (i.intraop || 'no');
    if (intraop === 'no') return { plan: 'permanent-and-eval' };
    if (intraop === 'yes') return { plan: 'frozen-section-and-eval' };
    return { plan: 'frozen-and-eval' };
  },
  ImmunoHisto: function (i) {
    const marker = (i.marker || 'unknown');
    const tissue = (i.tissue || 'unknown');
    if (marker === 'ER' && tissue === 'breast') return { plan: 'ER-PR-Her2-and-eval' };
    if (marker === 'CD20' && tissue === 'lymph-node') return { plan: 'B-cell-panel-and-eval' };
    if (marker === 'pan-CK') return { plan: 'epithelial-panel-and-eval' };
    if (marker === 'Ki-67') return { plan: 'proliferation-and-grade' };
    return { plan: 'IHC-panel-and-eval' };
  },
  Molecular: function (i) {
    const test = (i.test || 'PCR');
    const disease = (i.disease || 'unknown');
    if (test === 'NGS' && disease === 'cancer') return { plan: 'NGS-panel-and-treatment' };
    if (test === 'PCR' && disease === 'infection') return { plan: 'PCR-and-targeted-ABx' };
    if (test === 'FISH' && disease === 'cancer') return { plan: 'FISH-and-prognosis' };
    if (test === 'karyotype') return { plan: 'karyotype-and-counsel' };
    return { plan: 'molecular-and-eval' };
  },
  Cyto: function (i) {
    const type = (i.type || 'FNA');
    if (type === 'FNA-thyroid') return { plan: 'Bethesda-and-eval' };
    if (type === 'FNA') return { plan: 'cytopath-and-typed' };
    if (type === 'effusion') return { plan: 'cell-block-and-eval' };
    if (type === 'urine') return { plan: 'cytology-and-eval' };
    return { plan: 'cyto-and-eval' };
  },
  HematoPath: function (i) {
    const test = (i.test || 'unknown');
    if (test === 'lymphoma') return { plan: 'lymphoma-panel-and-eval' };
    if (test === 'leukemia') return { plan: 'flow-and-marrow-eval' };
    if (test === 'marrow') return { plan: 'marrow-biopsy-and-eval' };
    if (test === 'coag') return { plan: 'coag-panel-and-eval' };
    return { plan: 'hematopath-and-eval' };
  },
  Surgical: function (i) {
    const specimen = (i.specimen || 'unknown');
    if (specimen === 'appendix') return { plan: 'gross-and-microscopic' };
    if (specimen === 'GB') return { plan: 'gross-and-microscopic' };
    if (specimen === 'colon') return { plan: 'gross-and-margins' };
    if (specimen === 'breast') return { plan: 'gross-and-margins-and-IHC' };
    return { plan: 'surgical-path-and-eval' };
  },
  Autopsy: function (i) {
    const consent = (i.consent || 'no');
    if (consent === 'no') return { plan: 'no-autopsy' };
    if (consent === 'yes') return { plan: 'full-autopsy-and-report' };
    if (consent === 'limited') return { plan: 'limited-autopsy-and-report' };
    return { plan: 'eval-and-consent' };
  },
  Consult: function (i) {
    const question = (i.question || 'unknown');
    if (question === 'second-opinion') return { plan: 'review-and-typed-report' };
    if (question === 'frozen-eval') return { plan: 'frozen-and-typed' };
    if (question === 'IHC-review') return { plan: 'IHC-and-typed-report' };
    return { plan: 'consult-and-typed-report' };
  },
  MolecularDx: function (i) {
    const panel = (i.panel || 'unknown');
    if (panel === 'solid-tumor') return { plan: 'NGS-solid-tumor-and-treat' };
    if (panel === 'heme') return { plan: 'heme-myeloid-and-treat' };
    if (panel === 'liquid-biopsy') return { plan: 'ctDNA-and-monitor' };
    if (panel === 'pharmaco') return { plan: 'PGx-and-medication-adjust' };
    return { plan: 'molecular-dx-and-eval' };
  },
};
module.exports = Engine;
