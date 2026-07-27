// P3-BT breast_ext_engine.js — 10 pure functions
const Engine = {
  Screen: function (i) {
    const age = (i.age || 50);
    const family = (i.family || 'no');
    if (family === 'yes' && age < 40) return { plan: 'high-risk-screening-and-MRI' };
    if (age >= 40) return { plan: 'annual-mammo-and-FU' };
    if (age >= 30 && family === 'yes') return { plan: 'MRI-and-mammo' };
    return { plan: 'mammo-and-FU' };
  },
  Mass: function (i) {
    const birads = (i.birads || 2);
    const mobility = (i.mobility || 'mobile');
    if (birads >= 4) return { plan: 'biopsy-and-surgeons' };
    if (birads === 3) return { plan: '6mo-FU-or-biopsy' };
    if (mobility === 'fixed') return { plan: 'imaging-and-biopsy' };
    return { plan: 'mammo-and-eval' };
  },
  Nipple: function (i) {
    const finding = (i.finding || 'discharge');
    if (finding === 'bloody') return { plan: 'ductogram-and-eval' };
    if (finding === 'spontaneous') return { plan: 'MRI-and-eval' };
    return { plan: 'mammo-and-eval' };
  },
  Cancer: function (i) {
    const stage = (i.stage || 'I');
    const subtype = (i.subtype || 'ER-positive');
    if (stage === 'IV') return { plan: 'systemic-and-palliative' };
    if (stage === 'III') return { plan: 'neoadjuvant-and-surgery' };
    if (subtype === 'TNBC' && stage === 'II') return { plan: 'neoadjuvant-chemo' };
    if (subtype === 'HER2+' && stage === 'II') return { plan: 'neoadjuvant-targeted' };
    if (stage === 'I') return { plan: 'surgery-and-adjuvant' };
    return { plan: 'multidisciplinary-and-typed' };
  },
  BRCA: function (i) {
    const family = (i.family || 'no');
    const age = (i.age || 35);
    if (family === 'yes' && age < 50) return { plan: 'genetic-counseling' };
    if (family === 'yes') return { plan: 'screen-and-FU' };
    return { plan: 'screen-and-FU' };
  },
  Mastectomy: function (i) {
    const indication = (i.indication || 'cancer');
    if (indication === 'prophylactic') return { plan: 'counsel-and-reconstruct' };
    if (indication === 'cancer') return { plan: 'cancer-resection-and-reconstruct' };
    return { plan: 'eval-and-typed' };
  },
  Reconstruction: function (i) {
    const type = (i.type || 'implant');
    if (type === 'DIEP') return { plan: 'preop-imaging-and-microsurg' };
    if (type === 'implant') return { plan: 'preop-and-2-stage' };
    if (type === 'lat-flap') return { plan: 'pedicled-flap-and-eval' };
    return { plan: 'eval-and-decide' };
  },
  Lactation: function (i) {
    const issue = (i.issue || 'mastitis');
    if (issue === 'abscess') return { plan: 'I&D-and-ABx' };
    if (issue === 'mastitis') return { plan: 'ABx-and-continue-feeding' };
    if (issue === 'low-supply') return { plan: 'lactation-consult' };
    return { plan: 'eval-and-typed' };
  },
  Gynecomastia: function (i) {
    const cause = (i.cause || 'unknown');
    if (cause === 'medication') return { plan: 'review-and-taper' };
    if (cause === 'mass') return { plan: 'imaging-and-eval' };
    return { plan: 'workup-and-eval' };
  },
  Survivorship: function (i) {
    const years = (i.years || 1);
    const sx = (i.sx || 'none');
    if (years < 1) return { plan: 'surveillance-and-support' };
    if (years >= 5) return { plan: 'annual-surveillance' };
    if (sx !== 'none') return { plan: 'workup-and-support' };
    return { plan: 'surveillance-and-FU' };
  },
};
module.exports = Engine;
