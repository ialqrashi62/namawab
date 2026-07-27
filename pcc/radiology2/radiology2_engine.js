// P3-BR radiology2_engine.js — 10 pure functions
const Engine = {
  CT: function (i) {
    const indication = (i.indication || 'r/o-fracture');
    const contrast = (i.contrast || 'no');
    if (contrast === 'yes' && i.gfr < 30) return { plan: 'defer-contrast-and-hydrate' };
    if (indication === 'PE') return { plan: 'CTPA-and-eval' };
    if (indication === 'trauma') return { plan: 'pan-scan-and-eval' };
    if (indication === 'stroke') return { plan: 'CT-head-and-CT-angio' };
    if (contrast === 'yes') return { plan: 'CT-with-contrast' };
    return { plan: 'CT-non-contrast' };
  },
  MRI: function (i) {
    const indication = (i.indication || 'r/o-tear');
    const body = (i.body || 'brain');
    if (i.pacemaker === 'yes') return { plan: 'MRI-conditional-eval' };
    if (i.claustrophobia === 'yes') return { plan: 'sedation-and-open-MRI' };
    if (indication === 'stroke' && body === 'brain') return { plan: 'MRI-DWI-and-eval' };
    if (body === 'spine') return { plan: 'MRI-spine-and-eval' };
    if (body === 'joint') return { plan: 'MRI-joint-and-arthrogram' };
    return { plan: 'MRI-and-contrast-eval' };
  },
  US: function (i) {
    const indication = (i.indication || 'r/o-GB');
    if (indication === 'AAA') return { plan: 'AAA-screen-and-eval' };
    if (indication === 'DVT') return { plan: 'DVT-duplex' };
    if (indication === 'GB') return { plan: 'RUQ-US-and-eval' };
    if (indication === 'FAST') return { plan: 'FAST-and-trauma-eval' };
    if (indication === 'OB') return { plan: 'OB-US-and-biometry' };
    return { plan: 'US-targeted-and-eval' };
  },
  Xray: function (i) {
    const body = (i.body || 'chest');
    if (body === 'chest' && i.indication === 'dyspnea') return { plan: 'CXR-PA-LAT-and-eval' };
    if (body === 'chest') return { plan: 'CXR-and-eval' };
    if (body === 'abdomen') return { plan: 'AXR-and-eval' };
    if (body === 'extremity') return { plan: 'Xray-2-view-and-eval' };
    return { plan: 'Xray-and-eval' };
  },
  Nuclear: function (i) {
    const type = (i.type || 'bone-scan');
    if (type === 'PET') return { plan: 'PET-CT-and-eval' };
    if (type === 'thyroid') return { plan: 'thyroid-scan-and-uptake' };
    if (type === 'bone') return { plan: 'bone-scan-and-eval' };
    if (type === 'V/Q') return { plan: 'V/Q-scan-and-eval' };
    return { plan: 'nuclear-and-eval' };
  },
  Interventional: function (i) {
    const type = (i.type || 'biopsy');
    const urgent = (i.urgent || 'no');
    if (type === 'embolization' && urgent === 'yes') return { plan: 'angio-and-embolize' };
    if (type === 'biopsy') return { plan: 'CT-guided-biopsy' };
    if (type === 'drain') return { plan: 'US-guided-drain' };
    if (type === 'stent') return { plan: 'angiogram-and-stent' };
    if (type === 'thrombolysis') return { plan: 'cath-directed-thrombolysis' };
    return { plan: 'IR-consult-and-eval' };
  },
  Mammo: function (i) {
    const type = (i.type || 'screening');
    const birads = (i.birads || 1);
    if (birads >= 4) return { plan: 'biopsy-and-surgeons' };
    if (birads === 3) return { plan: '6mo-FU-or-biopsy' };
    if (type === 'diagnostic') return { plan: 'diagnostic-mammo-and-US' };
    if (type === 'screening') return { plan: 'screening-mammo-and-FU' };
    return { plan: 'mammo-and-eval' };
  },
  Fluoro: function (i) {
    const indication = (i.indication || 'GI');
    if (indication === 'GI') return { plan: 'fluoro-and-contrast' };
    if (indication === 'urography') return { plan: 'IVP-or-CT-urogram' };
    if (indication === 'joint') return { plan: 'arthrogram-and-eval' };
    return { plan: 'fluoro-and-eval' };
  },
  PE: function (i) {
    const wells = (i.wells || 0);
    const dDimer = (i.dDimer || 0);
    if (wells >= 4) return { plan: 'CTPA-and-eval' };
    if (wells >= 2 && dDimer > 500) return { plan: 'CTPA-and-eval' };
    if (dDimer > 1000) return { plan: 'CTPA-and-eval' };
    if (dDimer > 500) return { plan: 'US-DVT-and-eval' };
    return { plan: 'no-imaging-and-FU' };
  },
  Biopsy: function (i) {
    const site = (i.site || 'soft-tissue');
    const depth = (i.depth || 'superficial');
    if (depth === 'deep') return { plan: 'CT-guided-biopsy' };
    if (site === 'thyroid' && i.bethesda === 4) return { plan: 'FNA-and-eval' };
    if (site === 'breast') return { plan: 'core-needle-and-eval' };
    if (site === 'lymph-node') return { plan: 'FNA-or-core-and-eval' };
    if (site === 'liver') return { plan: 'US-guided-biopsy' };
    return { plan: 'biopsy-and-eval' };
  },
};
module.exports = Engine;
