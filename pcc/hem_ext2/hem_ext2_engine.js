// P3-BU hem_ext2_engine.js — 10 pure functions
const Engine = {
  Anemia: function (i) {
    const hgb = (i.hgb || 8);
    const chronic = (i.chronic || 'no');
    if (hgb < 7) return { plan: 'transfuse-and-eval' };
    if (hgb < 10 && chronic === 'yes') return { plan: 'EPO-and-iron' };
    if (hgb < 10) return { plan: 'iron-and-eval' };
    return { plan: 'monitor-and-eval' };
  },
  Thrombocyt: function (i) {
    const plt = (i.plt || 100);
    const bleeding = (i.bleeding || 'no');
    if (plt < 20 || bleeding === 'yes') return { plan: 'transfuse-and-eval' };
    if (plt < 50) return { plan: 'monitor-and-eval' };
    return { plan: 'monitor-and-typed' };
  },
  Coag: function (i) {
    const inr = (i.inr || 1);
    const bleeding = (i.bleeding || 'no');
    if (inr > 3 && bleeding === 'yes') return { plan: 'FFP-and-vitK' };
    if (inr > 3) return { plan: 'vitK-and-eval' };
    return { plan: 'monitor-and-typed' };
  },
  DVT: function (i) {
    const provok = (i.provok || 'no');
    if (provok === 'yes') return { plan: 'anticoag-3mo' };
    if (provok === 'no') return { plan: 'workup-and-anticoag' };
    return { plan: 'monitor-and-typed' };
  },
  Anticoag: function (i) {
    const ind = (i.ind || 'AF');
    if (ind === 'AF' && i.cha2ds2 >= 2) return { plan: 'anticoag-and-eval' };
    if (ind === 'DVT') return { plan: 'anticoag-3mo' };
    if (ind === 'PE') return { plan: 'anticoag-3mo' };
    return { plan: 'monitor-and-typed' };
  },
  Bleed: function (i) {
    const source = (i.source || 'unknown');
    const severity = (i.severity || 'mild');
    if (severity === 'major') return { plan: 'massive-transfusion' };
    if (source === 'GI' && severity === 'minor') return { plan: 'scope-and-eval' };
    if (source === 'GU' && severity === 'minor') return { plan: 'imaging-and-eval' };
    return { plan: 'workup-and-typed' };
  },
  TTP: function (i) {
    const plts = (i.plts || 100);
    const microang = (i.microang || 'no');
    if (plts < 30 && microang === 'yes') return { plan: 'plasmex-and-eval' };
    if (plts < 50) return { plan: 'workup-and-eval' };
    return { plan: 'monitor-and-typed' };
  },
  DIC: function (i) {
    const pt = (i.pt || 12);
    const bleeding = (i.bleeding || 'no');
    if (pt > 20 && bleeding === 'yes') return { plan: 'FFP-and-eval' };
    if (pt > 20) return { plan: 'treat-cause' };
    return { plan: 'monitor-and-typed' };
  },
  Sickle: function (i) {
    const crisis = (i.crisis || 'none');
    if (crisis === 'chest') return { plan: 'transfuse-and-eval' };
    if (crisis === 'vaso-occlusive') return { plan: 'pain-and-eval' };
    if (crisis === 'none') return { plan: 'monitor-and-eval' };
    return { plan: 'monitor-and-typed' };
  },
  Lymphoma: function (i) {
    const type = (i.type || 'NHL');
    const stage = (i.stage || 'I');
    if (type === 'Hodgkin' && stage === 'I') return { plan: 'chemo-and-radiation' };
    if (type === 'NHL' && stage === 'III') return { plan: 'R-CHOP-and-eval' };
    if (type === 'NHL') return { plan: 'biopsy-and-typed' };
    return { plan: 'multidisciplinary-and-typed' };
  },
};
module.exports = Engine;
