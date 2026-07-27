// P3-BV ent_ext2_engine.js — 10 pure functions
const Engine = {
  Hearing: function (i) {
    const loss = (i.loss || 'mild');
    if (loss === 'severe') return { plan: 'cochlear-eval' };
    if (loss === 'moderate') return { plan: 'hearing-aid-and-eval' };
    return { plan: 'monitor-and-eval' };
  },
  Tinnitus: function (i) {
    const acuteness = (i.acuteness || 'chronic');
    if (acuteness === 'acute') return { plan: 'steroids-and-MRI' };
    return { plan: 'CBT-and-eval' };
  },
  Vertigo: function (i) {
    const cause = (i.cause || 'BPPV');
    if (cause === 'central') return { plan: 'MRI-and-eval' };
    if (cause === 'BPPV') return { plan: 'Epley-and-FU' };
    if (cause === 'Meniere') return { plan: 'diuretic-and-eval' };
    return { plan: 'HINTS-and-eval' };
  },
  Sinus: function (i) {
    const chronic = (i.chronic || 'no');
    if (chronic === 'yes') return { plan: 'CT-sinus-and-surgery-eval' };
    return { plan: 'ABx-and-decongestant' };
  },
  OSA: function (i) {
    const ahi = (i.ahi || 10);
    if (ahi >= 30) return { plan: 'CPAP-and-eval' };
    if (ahi >= 15) return { plan: 'CPAP-and-FU' };
    if (ahi >= 5) return { plan: 'weight-loss-and-FU' };
    return { plan: 'monitor-and-eval' };
  },
  Hoarseness: function (i) {
    const chronic = (i.chronic || 'no');
    if (chronic === 'yes') return { plan: 'laryngoscopy-and-eval' };
    return { plan: 'voice-rest-and-FU' };
  },
  NeckMass: function (i) {
    const duration = (i.duration || 4);
    if (duration >= 6) return { plan: 'FNA-and-eval' };
    if (duration < 6) return { plan: 'ABx-and-FU' };
    return { plan: 'eval-and-typed' };
  },
  Epistaxis: function (i) {
    const severity = (i.severity || 'mild');
    if (severity === 'severe') return { plan: 'cautery-and-pack' };
    return { plan: 'pressure-and-eval' };
  },
  Dysphagia: function (i) {
    const source = (i.source || 'unknown');
    if (source === 'oropharyngeal') return { plan: 'FEES-and-SLP' };
    if (source === 'esophageal') return { plan: 'EGD-and-eval' };
    return { plan: 'barium-and-eval' };
  },
  Allergic: function (i) {
    const severity = (i.severity || 'mild');
    if (severity === 'severe') return { plan: 'antihist-and-steroid' };
    return { plan: 'antihist-and-FU' };
  },
};
module.exports = Engine;
