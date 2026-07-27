// P3-BW psych_ext2_engine.js — 10 pure functions
const Engine = {
  Depression: function (i) {
    const phq = (i.phq || 5);
    const suicidal = (i.suicidal || 'no');
    if (suicidal === 'yes') return { plan: 'urgent-psych-and-safety' };
    if (phq >= 15) return { plan: 'SSRI-and-ECT-eval' };
    if (phq >= 10) return { plan: 'SSRI-and-CBT' };
    if (phq >= 5) return { plan: 'monitor-and-CBT' };
    return { plan: 'monitor-and-eval' };
  },
  Anxiety: function (i) {
    const gad = (i.gad || 5);
    if (gad >= 15) return { plan: 'SSRI-and-CBT' };
    if (gad >= 10) return { plan: 'SSRI-and-eval' };
    if (gad >= 5) return { plan: 'monitor-and-CBT' };
    return { plan: 'monitor-and-eval' };
  },
  Bipolar: function (i) {
    const phase = (i.phase || 'euthymic');
    if (phase === 'manic') return { plan: 'lithium-and-hospitalize' };
    if (phase === 'depressed') return { plan: 'mood-stabilizer-and-eval' };
    return { plan: 'monitor-and-mood-stabilizer' };
  },
  PTSD: function (i) {
    const score = (i.score || 30);
    if (score >= 60) return { plan: 'trauma-CBT-and-EMDR' };
    if (score >= 40) return { plan: 'CBT-and-eval' };
    return { plan: 'monitor-and-support' };
  },
  Substance: function (i) {
    const substance = (i.substance || 'alcohol');
    const withdrawal = (i.withdrawal || 'no');
    if (withdrawal === 'yes') return { plan: 'detox-and-eval' };
    if (substance === 'opioid') return { plan: 'buprenorphine-and-eval' };
    if (substance === 'alcohol') return { plan: 'naltrexone-and-eval' };
    return { plan: 'CBT-and-rehab-eval' };
  },
  Schizophrenia: function (i) {
    const positive = (i.positive || 'mild');
    if (positive === 'severe') return { plan: 'antipsychotic-and-hospitalize' };
    if (positive === 'moderate') return { plan: 'antipsychotic-and-eval' };
    return { plan: 'monitor-and-typed' };
  },
  ADHD: function (i) {
    const age = (i.age || 10);
    if (age < 6) return { plan: 'behavior-and-eval' };
    if (age < 18) return { plan: 'stimulant-and-eval' };
    return { plan: 'stimulant-and-eval' };
  },
  Autism: function (i) {
    const age = (i.age || 5);
    if (age < 3) return { plan: 'early-intervention-and-eval' };
    if (age < 12) return { plan: 'ABA-and-support' };
    return { plan: 'support-and-eval' };
  },
  Eating: function (i) {
    const bmi = (i.bmi || 18);
    if (bmi < 15) return { plan: 'inpatient-and-FE' };
    if (bmi < 18) return { plan: 'CBT-and-eval' };
    return { plan: 'monitor-and-support' };
  },
  Personality: function (i) {
    const type = (i.type || 'borderline');
    if (type === 'borderline') return { plan: 'DBT-and-eval' };
    if (type === 'antisocial') return { plan: 'structured-care-and-eval' };
    return { plan: 'long-term-therapy-and-typed' };
  },
};
module.exports = Engine;
