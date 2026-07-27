// P3-BV derma_ext2_engine.js — 10 pure functions
const Engine = {
  Eczema: function (i) {
    const severity = (i.severity || 'mild');
    if (severity === 'severe') return { plan: 'systemic-steroid-and-eval' };
    if (severity === 'moderate') return { plan: 'topical-steroid-and-eval' };
    return { plan: 'moisturizer-and-eval' };
  },
  Psoriasis: function (i) {
    const coverage = (i.coverage || 5);
    if (coverage >= 30) return { plan: 'biologic-and-eval' };
    if (coverage >= 10) return { plan: 'phototherapy-and-eval' };
    return { plan: 'topical-and-FU' };
  },
  Acne: function (i) {
    const severity = (i.severity || 'mild');
    if (severity === 'severe') return { plan: 'isotretinoin-and-eval' };
    if (severity === 'moderate') return { plan: 'topical-retinoid-and-ABx' };
    return { plan: 'topical-and-eval' };
  },
  Melanoma: function (i) {
    const breslow = (i.breslow || 0.5);
    if (breslow >= 4) return { plan: 'wide-excision-and-SLN-bx' };
    if (breslow >= 1) return { plan: 'wide-excision-and-eval' };
    if (breslow >= 0.5) return { plan: 'wide-excision-and-FU' };
    return { plan: 'excision-and-FU' };
  },
  BCC: function (i) {
    const location = (i.location || 'low-risk');
    if (location === 'high-risk') return { plan: 'Mohs-and-eval' };
    return { plan: 'excision-and-eval' };
  },
  Rash: function (i) {
    const systemic = (i.systemic || 'no');
    if (systemic === 'yes') return { plan: 'workup-and-eval' };
    return { plan: 'topical-and-FU' };
  },
  Urticaria: function (i) {
    const angioedema = (i.angioedema || 'no');
    if (angioedema === 'yes') return { plan: 'antihist-and-steroid' };
    return { plan: 'antihist-and-eval' };
  },
  Autoimmune: function (i) {
    const type = (i.type || 'unknown');
    if (type === 'lupus') return { plan: 'ANA-and-rheum-eval' };
    if (type === 'scleroderma') return { plan: 'rheum-and-eval' };
    if (type === 'dermatomyositis') return { plan: 'CPK-and-rheum' };
    return { plan: 'workup-and-eval' };
  },
  Infxn: function (i) {
    const type = (i.type || 'cellulitis');
    if (type === 'abscess') return { plan: 'I&D-and-ABx' };
    if (type === 'cellulitis') return { plan: 'ABx-and-eval' };
    if (type === 'fungal') return { plan: 'antifungal-and-eval' };
    return { plan: 'eval-and-typed' };
  },
  Burns: function (i) {
    const degree = (i.degree || 'I');
    const tbsa = (i.tbsa || 5);
    if (degree === 'III' && tbsa > 10) return { plan: 'burn-center-and-graft' };
    if (degree === 'II' && tbsa > 20) return { plan: 'burn-center-and-fluid' };
    if (degree === 'I') return { plan: 'topical-and-eval' };
    return { plan: 'dressing-and-FU' };
  },
};
module.exports = Engine;
