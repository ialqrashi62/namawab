// P3-BW repro_ext_engine.js — 10 pure functions
const Engine = {
  Infertility: function (i) {
    const cause = (i.cause || 'unknown');
    const year = (i.year || 1);
    if (cause === 'male') return { plan: 'urology-and-eval' };
    if (cause === 'tubal') return { plan: 'IVF-and-eval' };
    if (cause === 'ovulatory') return { plan: 'clomiphene-and-eval' };
    if (year >= 2 && cause === 'unknown') return { plan: 'workup-and-eval' };
    return { plan: 'monitor-and-FU' };
  },
  ART: function (i) {
    const type = (i.type || 'IVF');
    if (type === 'IVF') return { plan: 'IVF-and-eval' };
    if (type === 'IUI') return { plan: 'IUI-and-eval' };
    if (type === 'ICSI') return { plan: 'ICSI-and-eval' };
    return { plan: 'consult-and-typed' };
  },
  PCOS: function (i) {
    const desire = (i.desire || 'no');
    if (desire === 'pregnancy') return { plan: 'clomiphene-and-eval' };
    return { plan: 'OCP-and-metformin' };
  },
  Endometriosis: function (i) {
    const stage = (i.stage || 'I');
    if (stage === 'IV') return { plan: 'surgery-and-ART-eval' };
    if (stage === 'III') return { plan: 'surgery-and-eval' };
    if (stage === 'II') return { plan: 'medical-and-FU' };
    return { plan: 'NSAID-and-OCP' };
  },
  Fibroids: function (i) {
    const size = (i.size || 3);
    const sx = (i.sx || 'no');
    if (sx === 'yes' && size > 5) return { plan: 'myomectomy-and-eval' };
    if (sx === 'yes') return { plan: 'medical-and-eval' };
    return { plan: 'monitor-and-FU' };
  },
  Contraception: function (i) {
    const type = (i.type || 'OCP');
    if (type === 'IUD') return { plan: 'IUD-and-eval' };
    if (type === 'OCP') return { plan: 'OCP-and-FU' };
    if (type === 'implant') return { plan: 'implant-and-eval' };
    return { plan: 'counsel-and-typed' };
  },
  Menopause: function (i) {
    const sx = (i.sx || 'none');
    if (sx === 'hot-flash') return { plan: 'HRT-and-eval' };
    if (sx === 'bone-loss') return { plan: 'DEXA-and-bisphosphonate' };
    return { plan: 'monitor-and-eval' };
  },
  STI: function (i) {
    const type = (i.type || 'chlamydia');
    if (type === 'HIV') return { plan: 'ART-and-eval' };
    if (type === 'syphilis') return { plan: 'penicillin-and-typed' };
    if (type === 'chlamydia') return { plan: 'azithromycin-and-eval' };
    if (type === 'gonorrhea') return { plan: 'ceftriaxone-and-eval' };
    return { plan: 'ABx-and-typed' };
  },
  Sexual: function (i) {
    const issue = (i.issue || 'unknown');
    if (issue === 'dyspareunia') return { plan: 'eval-and-physical-therapy' };
    if (issue === 'low-libido') return { plan: 'counsel-and-eval' };
    return { plan: 'eval-and-typed' };
  },
  Preconception: function (i) {
    const issue = (i.issue || 'none');
    if (issue === 'high-risk') return { plan: 'MFM-and-eval' };
    if (issue === 'diabetes') return { plan: 'glycemic-and-eval' };
    return { plan: 'folic-acid-and-FU' };
  },
};
module.exports = Engine;
