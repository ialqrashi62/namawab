// P3-BV gi_ext2_engine.js — 10 pure functions
const Engine = {
  Dysphagia: function (i) {
    const cause = (i.cause || 'unknown');
    if (cause === 'cancer') return { plan: 'scope-and-staging' };
    if (cause === 'stricture') return { plan: 'dilatation-and-eval' };
    if (cause === 'motility') return { plan: 'manometry-and-typed' };
    return { plan: 'barium-and-eval' };
  },
  GERD: function (i) {
    const severity = (i.severity || 'mild');
    if (severity === 'severe') return { plan: 'PPI-and-eval' };
    if (severity === 'moderate') return { plan: 'PPI-and-FU' };
    return { plan: 'lifestyle-and-PRN' };
  },
  PUD: function (i) {
    const source = (i.source || 'unknown');
    const bleeding = (i.bleeding || 'no');
    if (bleeding === 'yes' && source === 'duodenal') return { plan: 'scope-and-clip' };
    if (source === 'H.pylori') return { plan: 'triple-therapy-and-test' };
    if (bleeding === 'yes') return { plan: 'scope-and-eval' };
    return { plan: 'PPI-and-H.pylori-test' };
  },
  IBD: function (i) {
    const type = (i.type || 'CD');
    const severity = (i.severity || 'mild');
    if (severity === 'severe' && type === 'UC') return { plan: 'biologics-and-eval' };
    if (severity === 'moderate') return { plan: 'immunomod-and-eval' };
    if (type === 'CD') return { plan: '5-ASA-and-FU' };
    return { plan: '5-ASA-and-FU' };
  },
  IBS: function (i) {
    const subtype = (i.subtype || 'mixed');
    if (subtype === 'diarrhea') return { plan: 'antidiarrheal-and-FODMAP' };
    if (subtype === 'constipation') return { plan: 'osmotic-lax-and-FODMAP' };
    return { plan: 'FODMAP-and-antispasmodic' };
  },
  Celiac: function (i) {
    const ttg = (i.ttg || 50);
    if (ttg > 100) return { plan: 'biopsy-and-gluten-free' };
    if (ttg > 30) return { plan: 'biopsy-and-eval' };
    return { plan: 'monitor-and-typed' };
  },
  Pancreatitis: function (i) {
    const severity = (i.severity || 'mild');
    if (severity === 'severe') return { plan: 'ICU-and-support' };
    if (severity === 'moderate') return { plan: 'NPO-and-eval' };
    return { plan: 'NPO-and-eval' };
  },
  Cirrhosis: function (i) {
    const meld = (i.meld || 12);
    const ascites = (i.ascites || 'no');
    if (meld >= 25) return { plan: 'transplant-eval' };
    if (ascites === 'yes' && meld >= 18) return { plan: 'paracentesis-and-eval' };
    if (meld >= 15) return { plan: 'monitor-and-typed' };
    return { plan: 'monitor-and-FU' };
  },
  Jaundice: function (i) {
    const bili = (i.bili || 2);
    const obstructive = (i.obstructive || 'no');
    if (obstructive === 'yes' && bili > 5) return { plan: 'MRCP-and-eval' };
    if (bili > 5) return { plan: 'workup-and-typed' };
    return { plan: 'monitor-and-eval' };
  },
  Bleed: function (i) {
    const source = (i.source || 'unknown');
    const stable = (i.stable || 'yes');
    if (stable === 'no' && source === 'variceal') return { plan: 'scope-and-band' };
    if (source === 'lower') return { plan: 'colon-and-eval' };
    if (source === 'upper') return { plan: 'EGD-and-eval' };
    return { plan: 'localize-and-eval' };
  },
};
module.exports = Engine;
