// P3-BZ rheum_ext3_engine.js — 10 pure functions
const Engine = {
  RA: function (i) {
    const das28 = (i.das28 || 3);
    if (das28 >= 5.1) return { plan: 'biologics-and-eval' };
    if (das28 >= 3.2) return { plan: 'csDMARD-and-eval' };
    return { plan: 'csDMARD-and-FU' };
  },
  SLE: function (i) {
    const active = (i.active || 'no');
    if (active === 'yes') return { plan: 'steroids-and-belly' };
    return { plan: 'hydroxychloroquine-and-FU' };
  },
  SSc: function (i) {
    const subset = (i.subset || 'limited');
    if (subset === 'diffuse') return { plan: 'mycophenolate-and-eval' };
    return { plan: 'monitor-and-eval' };
  },
  Vasculitis: function (i) {
    const type = (i.type || 'ANCA');
    if (type === 'GPA') return { plan: 'rituximab-and-eval' };
    if (type === 'MPA') return { plan: 'cyclophosphamide-and-eval' };
    if (type === 'Takayasu') return { plan: 'steroids-and-eval' };
    return { plan: 'workup-and-typed' };
  },
  Gout: function (i) {
    const acute = (i.acute || 'no');
    if (acute === 'yes') return { plan: 'colchicine-and-NSAID' };
    return { plan: 'allopurinol-and-FU' };
  },
  OA: function (i) {
    const joint = (i.joint || 'knee');
    if (joint === 'hip' && i.severity === 'severe') return { plan: 'THA-and-eval' };
    if (joint === 'knee' && i.severity === 'severe') return { plan: 'TKA-and-eval' };
    return { plan: 'PT-and-NSAID' };
  },
  SpA: function (i) {
    const type = (i.type || 'axSpA');
    if (type === 'axSpA') return { plan: 'TNF-i-and-eval' };
    if (type === 'psoriatic') return { plan: 'TNF-i-and-eval' };
    if (type === 'reactive') return { plan: 'NSAID-and-eval' };
    return { plan: 'workup-and-typed' };
  },
  PMR: function (i) {
    const sx = (i.sx || 'no');
    if (sx === 'yes') return { plan: 'prednisone-and-eval' };
    return { plan: 'monitor-and-typed' };
  },
  Sjogren: function (i) {
    const sx = (i.sx || 'mild');
    if (sx === 'severe') return { plan: 'rituximab-and-eval' };
    return { plan: 'pilocarpine-and-eval' };
  },
  Myositis: function (i) {
    const cpk = (i.cpk || 200);
    if (cpk >= 5000) return { plan: 'steroids-and-IVIG' };
    if (cpk >= 1000) return { plan: 'steroids-and-eval' };
    return { plan: 'monitor-and-typed' };
  },
};
module.exports = Engine;
