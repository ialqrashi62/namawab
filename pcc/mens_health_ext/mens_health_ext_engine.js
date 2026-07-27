// P3-BG mens_health_ext_engine.js — 10 pure functions
const Engine = {
  WellMan: function (i) {
    const age = (i.age || 40);
    const screening = (i.screening || 'current');
    if (age >= 50 && screening === 'current') return { plan: 'colon-screen-and-AAA-and-PSA-discussion' };
    if (age >= 40 && screening === 'current') return { plan: 'lipid-and-BP-and-AAA-eval' };
    if (screening === 'overdue') return { plan: 'catch-up-screening' };
    return { plan: 'annual-physical-and-screening' };
  },
  Testosterone: function (i) {
    const total = (i.total || 400);
    const free = (i.free || 100);
    const symptoms = (i.symptoms || 'mild');
    if (total < 200 && symptoms === 'severe') return { plan: 'testosterone-replacement-therapy' };
    if (total < 300 && symptoms === 'moderate') return { plan: 'trial-of-TRT' };
    if (total < 300 && symptoms === 'mild') return { plan: 'lifestyle-and-recheck' };
    if (free < 50 && symptoms === 'severe') return { plan: 'free-T-replacement' };
    return { plan: 'normal-and-monitor' };
  },
  ErectileDysfunction: function (i) {
    const cause = (i.cause || 'unknown');
    const severity = (i.severity || 'mild');
    const cvRisk = (i.cvRisk || 'low');
    if (cause === 'cardiovascular' && cvRisk === 'high') return { plan: 'cardiology-eval-first' };
    if (severity === 'severe') return { plan: 'PDE5-and-urology-eval' };
    if (cause === 'psychogenic') return { plan: 'counseling-and-PDE5' };
    if (severity === 'moderate') return { plan: 'PDE5-trial' };
    return { plan: 'lifestyle-and-monitor' };
  },
  ProstateScreen: function (i) {
    const age = (i.age || 50);
    const psa = (i.psa || 1);
    const family = (i.family || 'no');
    if (psa > 4) return { plan: 'urology-referral-and-biopsy' };
    if (psa > 2.5 && family === 'yes') return { plan: 'shared-decision-and-MRI' };
    if (age >= 55 && psa > 2) return { plan: 'shared-decision-and-MRI-option' };
    if (family === 'yes' && age >= 45) return { plan: 'annual-PSA-and-DRE' };
    return { plan: 'routine-screening' };
  },
  BPH: function (i) {
    const ipss = (i.ipss || 0);
    const prostate = (i.prostate || 'small');
    if (ipss >= 20) return { plan: 'alpha-blocker-and-5ARI-and-urology' };
    if (ipss >= 8) return { plan: 'alpha-blocker-or-5ARI' };
    if (prostate === 'large') return { plan: '5ARI-and-watchful-waiting' };
    if (ipss < 8) return { plan: 'watchful-waiting' };
    return { plan: 'lifestyle-and-monitor' };
  },
  Hypogonadism: function (i) {
    const lh = (i.lh || 5);
    const fsh = (i.fsh || 5);
    const total = (i.total || 400);
    if (total < 200 && lh > 10) return { plan: 'primary-hypogonadism-and-eval' };
    if (total < 200 && lh < 2) return { plan: 'secondary-hypogonadism-and-MRI-pituitary' };
    if (total < 300 && fsh > 15) return { plan: 'testicular-failure-eval' };
    if (total >= 300) return { plan: 'normal-axis' };
    return { plan: 'recheck-and-monitor' };
  },
  InfertilityMale: function (i) {
    const count = (i.count || 20);
    const motility = (i.motility || 40);
    const morphology = (i.morphology || 4);
    if (count < 5) return { plan: 'severe-azoospermia-and-urology' };
    if (count < 15 && motility < 30) return { plan: 'oligospermia-and-ART' };
    if (motility < 20) return { plan: 'asthenozoospermia-and-eval' };
    if (morphology < 4) return { plan: 'teratozoospermia-and-ART' };
    if (count < 15) return { plan: 'oligospermia-and-eval' };
    return { plan: 'normal-semen-analysis' };
  },
  STI: function (i) {
    const pathogen = (i.pathogen || 'chlamydia');
    const symptoms = (i.symptoms || 'present');
    const partner = (i.partner || 'unknown');
    if (pathogen === 'HIV') return { plan: 'urgent-ID-referral-and-PEP-eval' };
    if (pathogen === 'syphilis') return { plan: 'penicillin-and-stage' };
    if (pathogen === 'gonorrhea' && symptoms === 'present') return { plan: 'ceftriaxone-and-azithromycin' };
    if (pathogen === 'chlamydia' && partner === 'unknown') return { plan: 'doxycycline-and-expedited-partner' };
    if (pathogen === 'chlamydia') return { plan: 'doxycycline-and-partner-treatment' };
    if (symptoms === 'present') return { plan: 'empiric-treatment' };
    return { plan: 'test-and-treat' };
  },
  HairLoss: function (i) {
    const pattern = (i.pattern || 'diffuse');
    const age = (i.age || 35);
    const family = (i.family || 'no');
    if (pattern === 'androgenetic' && age < 40) return { plan: 'finasteride-and-minoxidil' };
    if (pattern === 'androgenetic' && age >= 40) return { plan: 'minoxidil-and-finasteride-eval' };
    if (pattern === 'alopecia-areata') return { plan: 'derm-referral-and-corticosteroids' };
    if (pattern === 'diffuse' && family === 'yes') return { plan: 'workup-TSH-iron-and-eval' };
    return { plan: 'monitor-and-reassess' };
  },
  MentalHealthMale: function (i) {
    const phq9 = (i.phq9 || 0);
    const gad7 = (i.gad7 || 0);
    const suicidal = (i.suicidal || 'no');
    if (suicidal === 'yes') return { plan: 'urgent-psych-eval-and-safety' };
    if (phq9 >= 20) return { plan: 'severe-depression-and-medication-and-therapy' };
    if (phq9 >= 15) return { plan: 'moderate-severe-and-medication' };
    if (phq9 >= 10 || gad7 >= 15) return { plan: 'moderate-and-therapy-or-medication' };
    if (phq9 >= 5) return { plan: 'mild-and-monitor-and-therapy' };
    return { plan: 'screen-and-monitor' };
  },
};
module.exports = Engine;
