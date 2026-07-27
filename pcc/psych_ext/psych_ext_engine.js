// P3-BK psych_ext_engine.js — 10 pure functions
const Engine = {
  Depression: function (i) {
    const phq9 = (i.phq9 || 5);
    const prior = (i.prior || 'no');
    const suicidal = (i.suicidal || 'no');
    if (suicidal === 'yes') return { plan: 'urgent-psych-and-safety' };
    if (phq9 >= 20) return { plan: 'severe-and-combo-and-ECT-eval' };
    if (phq9 >= 15) return { plan: 'moderate-severe-and-SSRI-and-therapy' };
    if (phq9 >= 10 && prior === 'yes') return { plan: 'recurrent-and-SSRI-and-therapy' };
    if (phq9 >= 10) return { plan: 'moderate-and-therapy-or-SSRI' };
    if (phq9 >= 5) return { plan: 'mild-and-therapy-and-monitor' };
    return { plan: 'minimal-and-monitor' };
  },
  Anxiety: function (i) {
    const gad7 = (i.gad7 || 5);
    const panic = (i.panic || 'no');
    if (gad7 >= 15) return { plan: 'severe-and-SSRI-and-CBT' };
    if (gad7 >= 10) return { plan: 'moderate-and-CBT-and-SSRI' };
    if (panic === 'yes') return { plan: 'panic-disorder-and-SSRI-high-dose' };
    if (gad7 >= 5) return { plan: 'mild-and-CBT-and-monitor' };
    return { plan: 'minimal-and-monitor' };
  },
  Bipolar: function (i) {
    const phase = (i.phase || 'euthymic');
    const lithium = (i.lithium || 'no');
    if (phase === 'manic' && lithium === 'no') return { plan: 'start-mood-stabilizer-and-antipsychotic' };
    if (phase === 'manic') return { plan: 'lithium-and-atypical-antipsychotic' };
    if (phase === 'depressed') return { plan: 'lithium-and-quetiapine-or-lamotrigine' };
    if (phase === 'euthymic' && lithium === 'yes') return { plan: 'continue-lithium-and-monitor' };
    if (phase === 'euthymic') return { plan: 'start-mood-stabilizer' };
    return { plan: 'evaluate-and-mood-stabilize' };
  },
  PTSD: function (i) {
    const duration = (i.duration || 0);
    const caps = (i.caps || 0);
    if (caps >= 60) return { plan: 'severe-and-trauma-focused-CBT-and-SSRI' };
    if (caps >= 40) return { plan: 'moderate-and-CPT-or-EMDR' };
    if (duration < 1) return { plan: 'acute-stress-and-watchful-wait' };
    if (caps >= 20) return { plan: 'mild-and-trauma-focused-therapy' };
    return { plan: 'monitor-and-support' };
  },
  OCD: function (i) {
    const ybocs = (i.ybocs || 10);
    const insight = (i.insight || 'good');
    if (ybocs >= 30) return { plan: 'severe-and-SSRI-high-dose-and-ERP' };
    if (ybocs >= 20) return { plan: 'moderate-and-SSRI-and-ERP' };
    if (insight === 'poor') return { plan: 'CBT-and-consider-SSRI' };
    if (ybocs >= 10) return { plan: 'mild-and-ERP-and-SSRI' };
    return { plan: 'monitor-and-CBT' };
  },
  Eating: function (i) {
    const bmi = (i.bmi || 22);
    const restriction = (i.restriction || 'no');
    const binge = (i.binge || 'no');
    if (bmi < 15 && restriction === 'yes') return { plan: 'inpatient-medical-stabilization' };
    if (bmi < 18 && restriction === 'yes') return { plan: 'intensive-outpatient-and-FBT' };
    if (binge === 'yes' && bmi >= 25) return { plan: 'CBT-and-stimulant-eval' };
    if (binge === 'yes') return { plan: 'CBT-BN-and-FBT' };
    if (bmi < 18) return { plan: 'CBT-E-and-medical-monitor' };
    return { plan: 'monitor-and-CBT' };
  },
  Substance: function (i) {
    const substance = (i.substance || 'alcohol');
    const withdrawal = (i.withdrawal || 'no');
    const motivation = (i.motivation || 'low');
    if (withdrawal === 'severe') return { plan: 'inpatient-detox' };
    if (substance === 'opioid') return { plan: 'buprenorphine-or-methadone' };
    if (substance === 'alcohol' && withdrawal === 'yes') return { plan: 'benzo-taper-and-thiamine' };
    if (motivation === 'high') return { plan: 'CBT-and-12-step-or-AA' };
    if (substance === 'alcohol') return { plan: 'naltrexone-and-CBT' };
    if (substance === 'stimulant') return { plan: 'CBT-and-monitor' };
    return { plan: 'motivational-interviewing' };
  },
  Suicide: function (i) {
    const plan = (i.plan || 'no');
    const means = (i.means || 'no');
    const intent = (i.intent || 'no');
    if (plan === 'yes' && means === 'yes' && intent === 'yes') return { plan: '1:1-observation-and-inpatient' };
    if (plan === 'yes' && intent === 'yes') return { plan: 'urgent-psych-and-safety-plan' };
    if (means === 'yes') return { plan: 'means-restriction-and-therapy' };
    if (intent === 'yes') return { plan: 'safety-plan-and-therapy' };
    if (plan === 'no' && means === 'no') return { plan: 'safety-plan-and-follow-up' };
    return { plan: 'monitor-and-support' };
  },
  ADHD: function (i) {
    const asrs = (i.asrs || 0);
    const age = (i.age || 25);
    const cvRisk = (i.cvRisk || 'low');
    if (age < 18 && asrs >= 6) return { plan: 'stimulant-and-behavioral-and-parent-training' };
    if (asrs >= 6 && cvRisk === 'low') return { plan: 'stimulant-and-CBT' };
    if (asrs >= 6 && cvRisk === 'high') return { plan: 'non-stimulant-and-atomoxetine' };
    if (asrs >= 4) return { plan: 'CBT-and-monitor' };
    return { plan: 'screen-and-monitor' };
  },
  Psychosis: function (i) {
    const duration = (i.duration || 0);
    const insight = (i.insight || 'good');
    const functioning = (i.functioning || 'preserved');
    if (duration < 1 && functioning === 'impaired') return { plan: 'acute-psychosis-and-inpatient' };
    if (duration < 6) return { plan: 'first-episode-and-antipsychotic-and-CBT' };
    if (insight === 'poor') return { plan: 'LAI-antipsychotic-and-CBT' };
    if (functioning === 'impaired') return { plan: 'CSC-team-and-antipsychotic' };
    return { plan: 'continue-antipsychotic-and-monitor' };
  },
};
module.exports = Engine;
