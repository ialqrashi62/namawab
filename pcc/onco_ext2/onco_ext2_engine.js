// P3-BM onco_ext2_engine.js — 10 pure functions (advanced oncology)
const Engine = {
  TNMStaging: function (i) {
    const t = (i.t || 1);
    const n = (i.n || 0);
    const m = (i.m || 0);
    if (m === 1) return { plan: 'Stage-IV-and-systemic-therapy' };
    if (n === 2 || t === 4) return { plan: 'Stage-IIIA-IIIC-and-multimodal' };
    if (n === 1 || t === 3) return { plan: 'Stage-II-IIIA-and-multimodal' };
    if (n === 0 && t === 2) return { plan: 'Stage-II-and-adjuvant' };
    if (n === 0 && t === 1) return { plan: 'Stage-I-and-surgery' };
    return { plan: 'Stage-0-or-Tis' };
  },
  ChemoRegimen: function (i) {
    const cancer = (i.cancer || 'unknown');
    const stage = (i.stage || 'I');
    if (cancer === 'breast' && stage === 'III') return { plan: 'AC-T-and-trastuzumab' };
    if (cancer === 'breast' && stage === 'II') return { plan: 'TC-and-hormonal' };
    if (cancer === 'colon' && stage === 'III') return { plan: 'FOLFOX-12-cycles' };
    if (cancer === 'lung-NSCLC' && stage === 'IV') return { plan: 'PD-L1-and-chemo-IO' };
    if (cancer === 'lymphoma' && stage === 'III') return { plan: 'R-CHOP-6-cycles' };
    if (cancer === 'breast' && stage === 'I') return { plan: 'hormonal-only-or-no-Rx' };
    return { plan: 'multidisciplinary-tumor-board' };
  },
  TumorResponse: function (i) {
    const pre = (i.pre || 0);
    const post = (i.post || 0);
    const change = ((pre - post) / pre) * 100;
    if (change >= 30) return { plan: 'partial-response-and-continue' };
    if (change <= -20) return { plan: 'progression-and-switch' };
    if (change >= 20 && change < 30) return { plan: 'stable-disease-and-monitor' };
    if (change < 20 && change > -20) return { plan: 'stable-disease-and-monitor' };
    return { plan: 'evaluate-and-RECIST' };
  },
  FebrileNeutropenia: function (i) {
    const temp = (i.temp || 38);
    const anc = (i.anc || 5);
    const risk = (i.risk || 'low');
    if (temp >= 38.3 && anc < 0.5) return { plan: 'empiric-pip-tazo-and-admit' };
    if (temp >= 38.3 && risk === 'high') return { plan: 'empiric-abx-and-admit' };
    if (temp >= 38.3 && risk === 'low') return { plan: 'empiric-abx-and-eval' };
    if (anc < 0.5) return { plan: 'GCSF-and-isolation' };
    if (temp >= 38) return { plan: 'cultures-and-eval' };
    return { plan: 'monitor-and-eval' };
  },
  TumorLysis: function (i) {
    const risk = (i.risk || 'low');
    const k = (i.k || 4);
    const ua = (i.ua || 5);
    if (risk === 'high') return { plan: 'aggressive-hydration-and-rasburicase' };
    if (k > 6 || ua > 10) return { plan: 'emergent-hydration-and-rasburicase' };
    if (k > 5) return { plan: 'hydration-and-allopurinol' };
    if (risk === 'medium') return { plan: 'hydration-and-allopurinol' };
    return { plan: 'monitor-and-hydration' };
  },
  OncEmergency: function (i) {
    const syndrome = (i.syndrome || 'unknown');
    if (syndrome === 'SVC') return { plan: 'emergent-radiation-and-stent' };
    if (syndrome === 'spinal-cord-compression') return { plan: 'emergent-steroid-and-MRI' };
    if (syndrome === 'hypercalcemia') return { plan: 'hydration-and-bisphosphonate' };
    if (syndrome === 'tumor-lysis') return { plan: 'emergent-hydration-and-rasburicase' };
    if (syndrome === 'hyperviscosity') return { plan: 'plasmapheresis-and-hydration' };
    if (syndrome === 'cardiac-tamponade') return { plan: 'pericardiocentesis' };
    return { plan: 'evaluate-and-stabilize' };
  },
  Survivorship: function (i) {
    const years = (i.years || 0);
    const primary = (i.primary || 'breast');
    if (years < 1) return { plan: 'acute-treatment-and-monitor' };
    if (years < 5 && primary === 'breast') return { plan: 'surveillance-and-hormonal' };
    if (years < 5) return { plan: 'surveillance-and-screening' };
    if (years >= 5) return { plan: 'long-term-followup-and-screening' };
    return { plan: 'continue-survivorship' };
  },
  ClinicalTrial: function (i) {
    const phase = (i.phase || 'I');
    const line = (i.line || 'first');
    if (phase === 'I' && line === 'first') return { plan: 'phase-I-eligible' };
    if (phase === 'III' && line === 'first') return { plan: 'phase-III-eligible' };
    if (phase === 'II' && line === 'second') return { plan: 'phase-II-eligible' };
    if (phase === 'II') return { plan: 'screen-and-refer' };
    if (line === 'third') return { plan: 'phase-I-trial' };
    return { plan: 'screen-and-refer' };
  },
  Immunotherapy: function (i) {
    const cancer = (i.cancer || 'unknown');
    const pdl1 = (i.pdl1 || 0);
    const indication = (i.indication || 'first-line');
    if (cancer === 'lung-NSCLC' && pdl1 >= 50) return { plan: 'pembrolizumab-monotherapy' };
    if (cancer === 'lung-NSCLC' && pdl1 >= 1) return { plan: 'pembro-plus-chemo' };
    if (cancer === 'melanoma') return { plan: 'nivo-plus-ipi-or-pembro' };
    if (cancer === 'renal') return { plan: 'nivo-plus-ipi-or-cabo' };
    if (indication === 'MSI-high') return { plan: 'pembrolizumab' };
    return { plan: 'standard-and-eval' };
  },
  TargetedTx: function (i) {
    const mutation = (i.mutation || 'unknown');
    const cancer = (i.cancer || 'unknown');
    if (mutation === 'EGFR-mut' && cancer === 'lung-NSCLC') return { plan: 'osimertinib' };
    if (mutation === 'BRAF-V600' && cancer === 'melanoma') return { plan: 'dabrafenib-and-trametinib' };
    if (mutation === 'HER2-amplified' && cancer === 'breast') return { plan: 'trastuzumab-deruxtecan' };
    if (mutation === 'BCR-ABL') return { plan: 'imatinib-or-dasatinib' };
    if (mutation === 'ALK-rearranged') return { plan: 'alectinib-or-lorlatinib' };
    if (mutation === 'BRCA-mut') return { plan: 'olaparib' };
    return { plan: 'molecular-board' };
  },
};
module.exports = Engine;
