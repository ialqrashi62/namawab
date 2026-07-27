// P3-BM ophth_ext_engine.js — 10 pure functions
const Engine = {
  Glaucoma: function (i) {
    const iop = (i.iop || 18);
    const opticNerve = (i.opticNerve || 'normal');
    const visualField = (i.visualField || 'normal');
    if (iop >= 30 && opticNerve === 'damaged') return { plan: 'urgent-trabeculectomy-or-tube' };
    if (iop >= 25 && visualField === 'progressing') return { plan: 'laser-trabeculoplasty-and-medication' };
    if (iop >= 22) return { plan: 'prostaglandin-and-beta-blocker' };
    if (opticNerve === 'damaged') return { plan: 'prostaglandin-and-eval' };
    return { plan: 'monitor-and-recheck' };
  },
  DiabeticRetinopathy: function (i) {
    const stage = (i.stage || 'none');
    const edema = (i.edema || 'no');
    if (stage === 'proliferative' && edema === 'yes') return { plan: 'PRP-and-anti-VEGF' };
    if (stage === 'proliferative') return { plan: 'PRP-and-eval' };
    if (stage === 'severe-NPDR' && edema === 'yes') return { plan: 'anti-VEGF-and-eval' };
    if (stage === 'severe-NPDR') return { plan: 'close-FU-and-PRP-eval' };
    if (stage === 'moderate-NPDR' && edema === 'yes') return { plan: 'anti-VEGF-and-recheck' };
    if (edema === 'yes') return { plan: 'anti-VEGF-and-monitor' };
    return { plan: 'annual-screen' };
  },
  MacularDegeneration: function (i) {
    const type = (i.type || 'dry');
    const oct = (i.oct || 'normal');
    if (type === 'wet' && oct === 'fluid') return { plan: 'anti-VEGF-monthly' };
    if (type === 'wet') return { plan: 'anti-VEGF-PRN' };
    if (type === 'dry' && oct === 'drusen') return { plan: 'AREDS2-and-monitor' };
    if (type === 'dry') return { plan: 'monitor-and-AREDS2' };
    return { plan: 'monitor-and-eval' };
  },
  Cataract: function (i) {
    const visualAcuity = (i.visualAcuity || 20);
    const dailyActivity = (i.dailyActivity || 'affected');
    if (visualAcuity >= 20 && dailyActivity === 'affected') return { plan: 'phaco-and-IOL' };
    if (visualAcuity >= 20) return { plan: 'phaco-if-symptomatic' };
    if (visualAcuity < 20) return { plan: 'phaco-and-IOL' };
    if (dailyActivity === 'affected') return { plan: 'phaco-and-IOL' };
    return { plan: 'monitor-and-recheck' };
  },
  Conjunctivitis: function (i) {
    const type = (i.type || 'unknown');
    const discharge = (i.discharge || 'mild');
    if (type === 'bacterial' && discharge === 'purulent') return { plan: 'topical-fluoroquinolone' };
    if (type === 'viral') return { plan: 'supportive-and-cold-compress' };
    if (type === 'allergic') return { plan: 'antihistamine-and-mast-cell' };
    if (type === 'bacterial') return { plan: 'topical-abx' };
    if (type === 'gonococcal' || type === 'chlamydial') return { plan: 'systemic-abx' };
    return { plan: 'evaluate-and-treat' };
  },
  Uveitis: function (i) {
    const location = (i.location || 'anterior');
    const chronic = (i.chronic || 'no');
    if (location === 'posterior' && chronic === 'yes') return { plan: 'steroid-and-immunosuppressant' };
    if (location === 'posterior') return { plan: 'systemic-steroid-and-eval' };
    if (location === 'intermediate' && chronic === 'yes') return { plan: 'intravitreal-steroid' };
    if (location === 'intermediate') return { plan: 'steroid-and-eval' };
    if (location === 'anterior' && chronic === 'yes') return { plan: 'topical-steroid-and-immunosuppressant' };
    if (location === 'anterior') return { plan: 'topical-steroid-and-cycloplegic' };
    return { plan: 'evaluate-and-treat' };
  },
  RetinalDetach: function (i) {
    const type = (i.type || 'unknown');
    const macula = (i.macula || 'on');
    if (type === 'rhegmatogenous' && macula === 'off') return { plan: 'emergent-vitrectomy-or-scleral-buckle' };
    if (type === 'rhegmatogenous') return { plan: 'urgent-scleral-buckle-or-pneumatic' };
    if (type === 'tractional') return { plan: 'vitrectomy-and-eval' };
    if (type === 'exudative') return { plan: 'find-cause-and-treat' };
    return { plan: 'urgent-retina-consult' };
  },
  CornealAbrasion: function (i) {
    const size = (i.size || 'small');
    const contactLens = (i.contactLens || 'no');
    if (size === 'large') return { plan: 'patch-and-cycloplegic-and-FU' };
    if (contactLens === 'yes') return { plan: 'abx-and-urgent-FU-and-fungal' };
    if (size === 'medium') return { plan: 'abx-and-cycloplegic' };
    if (size === 'small') return { plan: 'abx-and-lubrication' };
    return { plan: 'evaluate-and-treat' };
  },
  Strabismus: function (i) {
    const age = (i.age || 5);
    const type = (i.type || 'eso');
    const binocular = (i.binocular || 'present');
    if (age < 2 && binocular === 'absent') return { plan: 'urgent-occlusion-and-surgery' };
    if (age < 6 && type === 'eso' && binocular === 'present') return { plan: 'patching-and-glasses' };
    if (age < 6) return { plan: 'glasses-and-occlusion' };
    if (age >= 6) return { plan: 'surgery-or-prism' };
    return { plan: 'evaluate-and-treat' };
  },
  EyeTrauma: function (i) {
    const type = (i.type || 'unknown');
    const globe = (i.globe || 'intact');
    if (globe === 'ruptured') return { plan: 'shield-and-emergent-OR' };
    if (type === 'chemical' && globe === 'intact') return { plan: 'irrigate-and-pH-and-eval' };
    if (type === 'IOFB') return { plan: 'emergent-OR-and-vitrectomy' };
    if (type === 'hyphema') return { plan: 'shield-and-steroid-and-eval' };
    if (type === 'orbital-fracture') return { plan: 'CT-and-eval' };
    return { plan: 'evaluate-and-treat' };
  },
};
module.exports = Engine;
