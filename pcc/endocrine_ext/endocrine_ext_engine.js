// P3-BO endocrine_ext_engine.js — 10 pure functions
const Engine = {
  DiabetesT2: function (i) {
    const a1c = (i.a1c || 7);
    const egfr = (i.egfr || 90);
    const hf = (i.hf || 'no');
    if (a1c >= 10) return { plan: 'dual-therapy-and-MDI' };
    if (a1c >= 9) return { plan: 'dual-therapy-and-metformin' };
    if (a1c >= 7.5) return { plan: 'metformin-and-GLP1' };
    if (hf === 'yes' && egfr >= 30) return { plan: 'metformin-and-SGLT2' };
    if (egfr < 30) return { plan: 'insulin-and-eval' };
    if (a1c >= 7) return { plan: 'metformin-and-titrate' };
    return { plan: 'metformin-and-monitor' };
  },
  Hypothyroid: function (i) {
    const tsh = (i.tsh || 5);
    const symptom = (i.symptom || 'mild');
    if (tsh > 10) return { plan: 'levothyroxine-and-recheck' };
    if (tsh > 5 && symptom === 'severe') return { plan: 'levothyroxine-and-recheck' };
    if (tsh > 5) return { plan: 'recheck-and-monitor' };
    if (tsh < 0.1) return { plan: 'hyperthyroid-workup' };
    return { plan: 'monitor-and-recheck' };
  },
  Hyperthyroid: function (i) {
    const cause = (i.cause || 'unknown');
    const age = (i.age || 40);
    if (cause === 'Graves' && age < 50) return { plan: 'methimazole-and-RAIU' };
    if (cause === 'Graves' && age >= 50) return { plan: 'methimazole-or-RAI' };
    if (cause === 'toxic-nodule') return { plan: 'RAI-or-surgery' };
    if (cause === 'thyroiditis') return { plan: 'beta-blocker-and-monitor' };
    if (cause === 'amiodarone') return { plan: 'stop-amiodarone-and-eval' };
    return { plan: 'evaluate-and-decide' };
  },
  AdrenalInsufficient: function (i) {
    const cortisol = (i.cortisol || 10);
    const acth = (i.acth || 'unknown');
    const crisis = (i.crisis || 'no');
    if (crisis === 'yes') return { plan: 'IV-hydrocortisone-and-fluid' };
    if (cortisol < 3) return { plan: 'urgent-hydrocortisone-and-eval' };
    if (cortisol < 10 && acth === 'elevated') return { plan: 'primary-AI-and-hydrocortisone' };
    if (cortisol < 10) return { plan: 'secondary-AI-and-eval' };
    if (acth === 'elevated') return { plan: 'primary-AI-and-eval' };
    return { plan: 'monitor-and-eval' };
  },
  Cushings: function (i) {
    const test = (i.test || 'normal');
    const acth = (i.acth || 'unknown');
    if (test === 'positive' && acth === 'high') return { plan: 'Cushing-disease-and-MRI-pituitary' };
    if (test === 'positive' && acth === 'low') return { plan: 'adrenal-CT-and-eval' };
    if (test === 'equivocal') return { plan: 'low-dose-dex-and-eval' };
    if (test === 'normal') return { plan: 'no-Cushings' };
    return { plan: 'evaluate-and-decide' };
  },
  Pheo: function (i) {
    const screen = (i.screen || 'pending');
    const symptom = (i.symptom || 'mild');
    if (screen === 'positive' && symptom === 'severe') return { plan: 'urgent-alpha-block-and-CT' };
    if (screen === 'positive') return { plan: 'alpha-block-and-imaging' };
    if (symptom === 'severe' && screen === 'pending') return { plan: 'plasma-metanephrines' };
    if (screen === 'negative') return { plan: 'no-pheo-and-eval' };
    return { plan: 'screen-and-eval' };
  },
  Calcium: function (i) {
    const ca = (i.ca || 9);
    const pth = (i.pth || 50);
    const vitD = (i.vitD || 30);
    if (ca > 11 && pth > 65) return { plan: 'primary-hyperparathyroid-and-eval' };
    if (ca > 11) return { plan: 'PTHrP-and-malignancy-screen' };
    if (ca < 8.5 && pth < 20) return { plan: 'hypoparathyroid-and-eval' };
    if (ca < 8.5 && vitD < 20) return { plan: 'vitamin-D-and-calcium' };
    if (ca < 8.5) return { plan: 'evaluate-and-treat' };
    return { plan: 'normal-and-monitor' };
  },
  Pituitary: function (i) {
    const mass = (i.mass || 'micro');
    const hormone = (i.hormone || 'non-functional');
    if (mass === 'macro' && hormone === 'functional') return { plan: 'medical-or-surgical-eval' };
    if (mass === 'macro' && hormone === 'non-functional') return { plan: 'transsphenoidal-surgery' };
    if (mass === 'micro' && hormone === 'prolactinoma') return { plan: 'cabergoline' };
    if (mass === 'micro' && hormone === 'functional') return { plan: 'medical-eval' };
    if (mass === 'micro') return { plan: 'monitor-and-recheck' };
    return { plan: 'evaluate-and-treat' };
  },
  AdrenalIncidental: function (i) {
    const size = (i.size || 1);
    const hounsfield = (i.hounsfield || 0);
    if (size > 4) return { plan: 'adrenalectomy-eval' };
    if (hounsfield > 10) return { plan: 'biochem-eval-and-FU' };
    if (size < 4) return { plan: 'biochem-eval-and-FU-1y' };
    return { plan: 'biochem-eval-and-decide' };
  },
  GenderAffirming: function (i) {
    const age = (i.age || 25);
    const stage = (i.stage || 'puberty-suppression');
    if (age < 18 && stage === 'puberty-suppression') return { plan: 'GnRH-and-multidisciplinary' };
    if (age >= 18 && stage === 'hormone') return { plan: 'cross-sex-hormones-and-monitor' };
    if (stage === 'surgical') return { plan: 'surgical-eval-and-mental-health' };
    return { plan: 'multidisciplinary-eval' };
  },
};
module.exports = Engine;
