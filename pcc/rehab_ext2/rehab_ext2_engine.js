// P3-BL rehab_ext2_engine.js — 10 pure functions
const Engine = {
  StrokeRehab: function (i) {
    const phase = (i.phase || 'acute');
    const funcStatus = (i.funcStatus || 'low');
    if (phase === 'acute') return { plan: 'early-mobilization-and-positioning' };
    if (phase === 'subacute' && funcStatus === 'low') return { plan: 'intensive-PT-and-OT' };
    if (phase === 'subacute') return { plan: 'task-specific-training' };
    if (phase === 'chronic') return { plan: 'community-reintegration-and-aerobic' };
    return { plan: 'continue-and-progress' };
  },
  TBIRehab: function (i) {
    const severity = (i.severity || 'mild');
    const days = (i.days || 0);
    if (severity === 'severe' && days < 30) return { plan: 'inpatient-rehab-and-24h-nursing' };
    if (severity === 'severe' && days < 90) return { plan: 'PT-OT-ST-and-cognitive' };
    if (severity === 'moderate') return { plan: 'day-program-and-cognitive' };
    if (severity === 'mild' && days < 14) return { plan: 'rest-and-gradual-return' };
    if (severity === 'mild') return { plan: 'PT-and-cognitive-eval' };
    return { plan: 'evaluate-and-rehab' };
  },
  SPInjury: function (i) {
    const level = (i.level || 'unknown');
    const complete = (i.complete || 'incomplete');
    if (level === 'C1-C4' && complete === 'complete') return { plan: 'ventilator-and-complete-care' };
    if (level === 'C5-C8' && complete === 'incomplete') return { plan: 'intensive-PT-OT-and-functional' };
    if (level === 'T1-T6') return { plan: 'wheelchair-and-balance' };
    if (level === 'T7-L2') return { plan: 'PT-and-ambulation' };
    if (level === 'L3-S5') return { plan: 'ambulation-training' };
    return { plan: 'rehab-and-monitor' };
  },
  Amputee: function (i) {
    const level = (i.level || 'unknown');
    const days = (i.days || 0);
    if (level === 'transfemoral' && days < 60) return { plan: 'shrinker-and-pre-prosthetic' };
    if (level === 'transfemoral') return { plan: 'prosthetic-fitting-and-gait' };
    if (level === 'transtibial' && days < 30) return { plan: 'shrinker-and-pre-prosthetic' };
    if (level === 'transtibial') return { plan: 'prosthetic-and-gait' };
    if (level === 'upper-extremity') return { plan: 'myoelectric-or-body-powered' };
    return { plan: 'evaluate-and-fit' };
  },
  CardiacRehab: function (i) {
    const phase = (i.phase || 'I');
    const mets = (i.mets || 2);
    if (phase === 'I') return { plan: 'inpatient-early-mob-and-edu' };
    if (phase === 'II' && mets < 5) return { plan: 'ECG-monitored-aerobic' };
    if (phase === 'II') return { plan: 'aerobic-and-resistance' };
    if (phase === 'III' && mets < 8) return { plan: 'maintenance-and-progress' };
    if (phase === 'III') return { plan: 'community-based-and-self-monitor' };
    return { plan: 'continue-and-monitor' };
  },
  PulmonaryRehab: function (i) {
    const fev1 = (i.fev1 || 60);
    const dyspnea = (i.dyspnea || 'mild');
    if (fev1 < 30) return { plan: 'oxygen-and-graded-exercise' };
    if (fev1 < 50 && dyspnea === 'severe') return { plan: 'supervised-and-pursed-lip' };
    if (fev1 < 50) return { plan: 'endurance-and-breathing' };
    if (dyspnea === 'moderate') return { plan: 'graded-aerobic' };
    if (fev1 >= 50) return { plan: 'maintenance-and-edu' };
    return { plan: 'continue-and-monitor' };
  },
  BurnRehab: function (i) {
    const tbsa = (i.tbsa || 5);
    const contracture = (i.contracture || 'no');
    if (tbsa > 30) return { plan: 'positioning-and-splinting-and-early-PT' };
    if (contracture === 'yes') return { plan: 'splinting-and-stretching' };
    if (tbsa > 10) return { plan: 'PT-OT-and-pressure-garment' };
    if (tbsa > 5) return { plan: 'PT-and-scar-management' };
    return { plan: 'PT-and-monitor' };
  },
  JointRepl: function (i) {
    const day = (i.day || 1);
    const joint = (i.joint || 'knee');
    if (day === 1) return { plan: 'PT-same-day-and-ambulation' };
    if (day <= 3) return { plan: 'PT-OT-and-early-ambulation' };
    if (day <= 14 && joint === 'hip') return { plan: 'PT-and-precautions' };
    if (day <= 14) return { plan: 'PT-and-ROM-and-strength' };
    if (day <= 42) return { plan: 'outpatient-PT' };
    return { plan: 'home-exercise-and-progress' };
  },
  PainRehab: function (i) {
    const chronicity = (i.chronicity || 'acute');
    const catastro = (i.catastrophizing || 'no');
    if (chronicity === 'chronic' && catastro === 'yes') return { plan: 'CBT-and-PT-and-graded-activity' };
    if (chronicity === 'chronic') return { plan: 'PT-and-CBT-and-self-mgmt' };
    if (catastro === 'yes') return { plan: 'CBT-and-PT' };
    if (chronicity === 'subacute') return { plan: 'PT-and-graded-return' };
    return { plan: 'PT-and-NSAID' };
  },
  ProstheticUse: function (i) {
    const hours = (i.hours || 0);
    const gait = (i.gait || 'normal');
    if (hours < 2) return { plan: 'build-tolerance-and-residuum-care' };
    if (hours < 6 && gait === 'abnormal') return { plan: 'gait-training-and-socket-fit' };
    if (gait === 'abnormal') return { plan: 'socket-adjustment-and-gait' };
    if (hours < 6) return { plan: 'increase-wear-time' };
    return { plan: 'maintain-and-advanced-skills' };
  },
};
module.exports = Engine;
