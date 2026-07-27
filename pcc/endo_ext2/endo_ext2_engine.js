// P3-BX endo_ext2_engine.js — 10 pure functions
const Engine = {
  Diabetes: function (i) {
    const a1c = (i.a1c || 7);
    const type = (i.type || 'T2');
    if (a1c >= 10) return { plan: 'basal-bolus-and-eval' };
    if (a1c >= 8 && type === 'T1') return { plan: 'basal-bolus-and-CGM' };
    if (a1c >= 8) return { plan: 'intensify-and-eval' };
    if (a1c >= 7) return { plan: 'continue-and-monitor' };
    return { plan: 'monitor-annually' };
  },
  Thyroid: function (i) {
    const tsh = (i.tsh || 2);
    if (tsh >= 10) return { plan: 'levothyroxine-and-eval' };
    if (tsh >= 5) return { plan: 'levothyroxine-and-FU' };
    if (tsh <= 0.1) return { plan: 'hyperthyroid-workup' };
    return { plan: 'monitor-annually' };
  },
  Adrenal: function (i) {
    const cortisol = (i.cortisol || 15);
    if (cortisol > 50) return { plan: 'Cushing-workup' };
    if (cortisol < 3) return { plan: 'Addison-eval' };
    if (cortisol > 20) return { plan: 'workup-and-typed' };
    return { plan: 'monitor-and-eval' };
  },
  Pituitary: function (i) {
    const finding = (i.finding || 'incidental');
    if (finding === 'macro') return { plan: 'hormone-panel-and-MRI' };
    if (finding === 'micro') return { plan: 'hormone-panel-and-FU' };
    return { plan: 'monitor-and-typed' };
  },
  Calcium: function (i) {
    const ca = (i.ca || 9.5);
    const pth = (i.pth || 50);
    if (ca > 11) return { plan: 'PTH-and-workup' };
    if (ca < 8) return { plan: 'PTH-and-eval' };
    if (pth > 100) return { plan: 'hyperparathyroid-eval' };
    return { plan: 'monitor-annually' };
  },
  Bone: function (i) {
    const tscore = (i.tscore || -1);
    if (tscore <= -2.5) return { plan: 'bisphosphonate-and-eval' };
    if (tscore <= -1) return { plan: 'calcium-and-D' };
    return { plan: 'monitor-and-exercise' };
  },
  AdrenalMass: function (i) {
    const size = (i.size || 1);
    const functional = (i.functional || 'no');
    if (functional === 'yes' || size >= 4) return { plan: 'workup-and-typed' };
    if (size >= 1) return { plan: 'CT-FU-and-eval' };
    return { plan: 'monitor-and-typed' };
  },
  Obesity: function (i) {
    const bmi = (i.bmi || 30);
    if (bmi >= 40) return { plan: 'bariatric-eval' };
    if (bmi >= 35) return { plan: 'medical-and-eval' };
    if (bmi >= 30) return { plan: 'lifestyle-and-eval' };
    return { plan: 'monitor-annually' };
  },
  Lipid: function (i) {
    const ldl = (i.ldl || 100);
    if (ldl >= 190) return { plan: 'high-intensity-statin' };
    if (ldl >= 130) return { plan: 'moderate-statin-and-eval' };
    return { plan: 'lifestyle-and-monitor' };
  },
  ReproEndo: function (i) {
    const issue = (i.issue || 'none');
    if (issue === 'amenorrhea') return { plan: 'FSH-and-eval' };
    if (issue === 'hirsutism') return { plan: 'testosterone-and-eval' };
    if (issue === 'infertility') return { plan: 'workup-and-eval' };
    return { plan: 'monitor-and-eval' };
  },
};
module.exports = Engine;
