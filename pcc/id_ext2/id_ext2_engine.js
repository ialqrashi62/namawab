// P3-BZ id_ext2_engine.js — 10 pure functions
const Engine = {
  UTI: function (i) {
    const complicated = (i.complicated || 'no');
    if (complicated === 'yes') return { plan: 'culture-and-IV-ABx' };
    return { plan: 'nitro-and-oral-ABx' };
  },
  Pneumonia: function (i) {
    const severity = (i.severity || 'mild');
    if (severity === 'severe') return { plan: 'ICU-and-IV-ABx' };
    if (severity === 'moderate') return { plan: 'inpatient-and-ABx' };
    return { plan: 'outpatient-and-ABx' };
  },
  SSTI: function (i) {
    const mrsa = (i.mrsa || 'no');
    if (mrsa === 'yes') return { plan: 'vanco-and-eval' };
    return { plan: 'cefazolin-and-eval' };
  },
  Cdiff: function (i) {
    const severe = (i.severe || 'no');
    if (severe === 'yes') return { plan: 'oral-vanco-and-eval' };
    return { plan: 'oral-vanco-and-FU' };
  },
  Sepsis: function (i) {
    const source = (i.source || 'unknown');
    const shock = (i.shock || 'no');
    if (shock === 'yes') return { plan: 'norepi-and-1hr-bundle' };
    if (source === 'unknown') return { plan: 'empiric-and-1hr-bundle' };
    return { plan: 'source-ABx-and-1hr-bundle' };
  },
  HIV: function (i) {
    const cd4 = (i.cd4 || 500);
    const start = (i.start || 'no');
    if (start === 'no' && cd4 < 350) return { plan: 'ART-and-prophylaxis' };
    if (start === 'no') return { plan: 'ART-and-FU' };
    return { plan: 'continue-and-monitor' };
  },
  TB: function (i) {
    const active = (i.active || 'no');
    if (active === 'yes') return { plan: 'RIPE-and-eval' };
    return { plan: 'INH-and-eval' };
  },
  HepB: function (i) {
    const chronic = (i.chronic || 'no');
    if (chronic === 'yes') return { plan: 'antiviral-and-monitor' };
    return { plan: 'monitor-and-FU' };
  },
  HepC: function (i) {
    const detectable = (i.detectable || 'no');
    if (detectable === 'yes') return { plan: 'DAA-and-eval' };
    return { plan: 'monitor-and-FU' };
  },
  Influenza: function (i) {
    const onset = (i.onset || 5);
    if (onset <= 2) return { plan: 'oseltamivir-and-eval' };
    return { plan: 'supportive-and-eval' };
  },
};
module.exports = Engine;
