// P3-CD pcc_infection_engine.js — 10 pure functions
const Engine = {
  Source: function (i) {
    const src = (i.src || 'unknown');
    if (src === 'pulmonary') return { plan: 'pneumonia-bundle' };
    if (src === 'urinary') return { plan: 'UTI-bundle' };
    if (src === 'abdominal') return { plan: 'abdominal-bundle' };
    if (src === 'skin') return { plan: 'skin-bundle' };
    return { plan: 'source-unknown' };
  },
  Severity: function (i) {
    const qsofa = (i.qsofa || 0);
    if (qsofa >= 2) return { plan: 'septic-1hr-bundle' };
    if (qsofa === 1) return { plan: 'monitor-and-eval' };
    return { plan: 'standard-care' };
  },
  Cultures: function (i) {
    const type = (i.type || 'blood');
    if (type === 'blood') return { plan: 'blood-culture' };
    if (type === 'urine') return { plan: 'urine-culture' };
    if (type === 'sputum') return { plan: 'sputum-culture' };
    return { plan: 'culture-typed' };
  },
  Empiric: function (i) {
    const coverage = (i.coverage || 'standard');
    if (coverage === 'broad') return { plan: 'broad-spectrum-ABx' };
    if (coverage === 'standard') return { plan: 'standard-ABx' };
    if (coverage === 'narrow') return { plan: 'narrow-ABx' };
    return { plan: 'ABx-typed' };
  },
  Deescalation: function (i) {
    const result = (i.result || 'pending');
    if (result === 'positive') return { plan: 'narrow-to-specific' };
    if (result === 'negative') return { plan: 'discontinue-ABx' };
    return { plan: 'await-culture' };
  },
  Duration: function (i) {
    const days = (i.days || 7);
    if (days >= 14) return { plan: 'long-course' };
    if (days >= 7) return { plan: 'standard-course' };
    return { plan: 'short-course' };
  },
  Prophylaxis: function (i) {
    const type = (i.type || 'surgical');
    if (type === 'surgical') return { plan: 'preop-ABx' };
    if (type === 'medical') return { plan: 'prophylaxis-ABx' };
    return { plan: 'prophylaxis-typed' };
  },
  Resistance: function (i) {
    const risk = (i.risk || 'low');
    if (risk === 'high') return { plan: 'broad-spectrum' };
    if (risk === 'medium') return { plan: 'empiric-broad' };
    return { plan: 'empiric-standard' };
  },
  Outbreak: function (i) {
    const cluster = (i.cluster || 'no');
    if (cluster === 'yes') return { plan: 'outbreak-investigation' };
    return { plan: 'isolated-case' };
  },
  Isolation: function (i) {
    const type = (i.type || 'standard');
    if (type === 'airborne') return { plan: 'airborne-isolation' };
    if (type === 'droplet') return { plan: 'droplet-isolation' };
    if (type === 'contact') return { plan: 'contact-isolation' };
    return { plan: 'standard-precautions' };
  },
};
module.exports = Engine;
