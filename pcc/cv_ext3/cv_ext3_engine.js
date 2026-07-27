// P3-BY cv_ext3_engine.js — 10 pure functions
const Engine = {
  Stroke: function (i) {
    const type = (i.type || 'ischemic');
    const nihss = (i.nihss || 5);
    if (type === 'hemorrhagic') return { plan: 'reverse-coag-and-eval' };
    if (nihss >= 6) return { plan: 'tPA-and-thrombectomy-eval' };
    if (nihss >= 1) return { plan: 'tPA-and-eval' };
    return { plan: 'monitor-and-typed' };
  },
  TIA: function (i) {
    const abc2 = (i.abc2 || 3);
    if (abc2 >= 6) return { plan: 'urgent-eval-and-MRI' };
    if (abc2 >= 4) return { plan: 'urgent-eval-and-CTA' };
    return { plan: 'workup-and-eval' };
  },
  SAH: function (i) {
    const hunt = (i.hunt || 1);
    if (hunt >= 4) return { plan: 'coil-and-ICU' };
    if (hunt >= 2) return { plan: 'coil-and-eval' };
    return { plan: 'monitor-and-CTA-FU' };
  },
  Aneurysm: function (i) {
    const size = (i.size || 5);
    if (size >= 7) return { plan: 'coil-or-clip' };
    if (size >= 3) return { plan: 'MRA-FU-and-eval' };
    return { plan: 'monitor-and-typed' };
  },
  AVM: function (i) {
    const spetzler = (i.spetzler || 1);
    if (spetzler >= 4) return { plan: 'multidisciplinary-eval' };
    if (spetzler >= 2) return { plan: 'embolization-and-eval' };
    return { plan: 'monitor-and-typed' };
  },
  Carotid: function (i) {
    const stenosis = (i.stenosis || 30);
    const sx = (i.sx || 'no');
    if (sx === 'yes' && stenosis >= 70) return { plan: 'CEA-and-eval' };
    if (stenosis >= 70) return { plan: 'stent-and-eval' };
    if (sx === 'yes') return { plan: 'CEA-and-eval' };
    return { plan: 'monitor-and-typed' };
  },
  ICP: function (i) {
    const icp = (i.icp || 10);
    if (icp > 30) return { plan: 'decompressive-craniectomy' };
    if (icp > 20) return { plan: 'osmotic-and-eval' };
    return { plan: 'monitor-and-typed' };
  },
  Seizure: function (i) {
    const type = (i.type || 'unknown');
    if (type === 'status') return { plan: 'lorazepam-and-ICU' };
    if (type === 'new-onset') return { plan: 'MRI-and-eval' };
    if (type === 'known') return { plan: 'level-and-eval' };
    return { plan: 'eval-and-typed' };
  },
  MS: function (i) {
    const relapse = (i.relapse || 'no');
    if (relapse === 'yes') return { plan: 'steroids-and-DMT' };
    return { plan: 'DMT-and-monitor' };
  },
  Park: function (i) {
    const stage = (i.stage || 'I');
    if (stage === 'advanced') return { plan: 'DBS-and-eval' };
    if (stage === 'moderate') return { plan: 'medication-and-eval' };
    return { plan: 'monitor-and-typed' };
  },
};
module.exports = Engine;
