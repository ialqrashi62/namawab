// P3-BY allergy_ext2_engine.js — 10 pure functions
const Engine = {
  Rhinitis: function (i) {
    const season = (i.season || 'no');
    if (season === 'yes') return { plan: 'antihist-and-IT-eval' };
    return { plan: 'antihist-and-eval' };
  },
  Asthma: function (i) {
    const control = (i.control || 'well');
    if (control === 'poor') return { plan: 'step-up-and-eval' };
    if (control === 'partial') return { plan: 'step-up-and-FU' };
    return { plan: 'continue-and-FU' };
  },
  Food: function (i) {
    const anaphyl = (i.anaphyl || 'no');
    if (anaphyl === 'yes') return { plan: 'epinephrine-and-AIT' };
    return { plan: 'avoid-and-AIT' };
  },
  Drug: function (i) {
    const severe = (i.severe || 'no');
    if (severe === 'yes') return { plan: 'desensitization-and-eval' };
    return { plan: 'alternative-and-eval' };
  },
  Urticaria: function (i) {
    const chronic = (i.chronic || 'no');
    if (chronic === 'yes') return { plan: 'omalizumab-and-eval' };
    return { plan: 'antihist-and-eval' };
  },
  Anaphylaxis: function (i) {
    const cause = (i.cause || 'unknown');
    if (cause === 'food') return { plan: 'epinephrine-and-AIT' };
    if (cause === 'drug') return { plan: 'epinephrine-and-eval' };
    return { plan: 'epinephrine-and-typed' };
  },
  Sting: function (i) {
    const systemic = (i.systemic || 'no');
    if (systemic === 'yes') return { plan: 'VIT-and-eval' };
    return { plan: 'monitor-and-typed' };
  },
  Eczema: function (i) {
    const severity = (i.severity || 'mild');
    if (severity === 'severe') return { plan: 'dupilumab-and-eval' };
    if (severity === 'moderate') return { plan: 'topical-steroid-and-eval' };
    return { plan: 'moisturizer-and-eval' };
  },
  Contact: function (i) {
    const finding = (i.finding || 'unknown');
    if (finding === 'positive') return { plan: 'avoid-and-steroid' };
    return { plan: 'patch-test-and-eval' };
  },
  AIT: function (i) {
    const type = (i.type || 'SCIT');
    if (type === 'SCIT') return { plan: 'buildup-and-eval' };
    if (type === 'SLIT') return { plan: 'tablet-and-FU' };
    return { plan: 'eval-and-typed' };
  },
};
module.exports = Engine;
