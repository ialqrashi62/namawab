// P3-BJ pharmacy_ext_engine.js — 10 pure functions (advanced clinical pharmacy)
const Engine = {
  RenalDosing: function (i) {
    const gfr = (i.gfr || 60);
    const drug = (i.drug || 'unknown');
    if (gfr >= 60) return { plan: 'standard-dose' };
    if (gfr >= 30 && gfr < 60) return { plan: 'reduce-dose-to-50-75%' };
    if (gfr >= 15 && gfr < 30) return { plan: 'reduce-dose-to-25-50%' };
    if (gfr < 15) return { plan: 'dose-after-dialysis-or-avoid' };
    if (drug === 'vancomycin') return { plan: 'trough-monitoring-and-auc' };
    return { plan: 'monitor-and-adjust' };
  },
  HepaticDosing: function (i) {
    const childPugh = (i.childPugh || 'A');
    const drug = (i.drug || 'unknown');
    if (childPugh === 'A') return { plan: 'standard-dose' };
    if (childPugh === 'B') return { plan: 'reduce-dose-25%' };
    if (childPugh === 'C') return { plan: 'reduce-dose-50%-or-avoid' };
    if (drug === 'warfarin') return { plan: 'INR-monitoring-and-reduce' };
    return { plan: 'monitor-and-adjust' };
  },
  AnticoagReversal: function (i) {
    const drug = (i.drug || 'unknown');
    const bleed = (i.bleed || 'no');
    if (drug === 'warfarin' && bleed === 'major') return { plan: 'vitamin-K-and-4F-PCC' };
    if (drug === 'warfarin' && bleed === 'minor') return { plan: 'vitamin-K-oral' };
    if (drug === 'DOAC' && bleed === 'major') return { plan: 'andexanet-alfa-or-4F-PCC' };
    if (drug === 'heparin' && bleed === 'major') return { plan: 'protamine' };
    if (drug === 'DOAC' && bleed === 'minor') return { plan: 'hold-and-monitor' };
    return { plan: 'evaluate-and-decide' };
  },
  AKIvancomycin: function (i) {
    const trough = (i.trough || 15);
    const scr = (i.scr || 1);
    const baseline = (i.baseline || 1);
    const ratio = scr / baseline;
    if (trough > 25 && ratio >= 2) return { plan: 'AKI-and-hold-vanco-and-switch' };
    if (trough > 20 && ratio >= 1.5) return { plan: 'AKI-eval-and-dose-reduction' };
    if (ratio >= 2) return { plan: 'AKI-eval-and-trough' };
    if (trough > 20) return { plan: 'reduce-dose-and-monitor' };
    return { plan: 'continue-and-monitor' };
  },
  Aminoglycoside: function (i) {
    const drug = (i.drug || 'gentamicin');
    const peak = (i.peak || 8);
    const trough = (i.trough || 1);
    if (drug === 'gentamicin' && peak < 5) return { plan: 'increase-dose' };
    if (drug === 'gentamicin' && trough > 2) return { plan: 'extend-interval-or-reduce' };
    if (drug === 'gentamicin' && peak > 10) return { plan: 'reduce-dose' };
    if (drug === 'gentamicin') return { plan: 'extended-interval-dosing' };
    if (drug === 'vancomycin') return { plan: 'AUC-monitoring' };
    return { plan: 'monitor-levels' };
  },
  PharmacokineticConsult: function (i) {
    const drug = (i.drug || 'unknown');
    const indication = (i.indication || 'general');
    if (indication === 'toxicity') return { plan: 'level-and-evaluate-toxicity' };
    if (drug === 'phenytoin' && indication === 'seizure') return { plan: 'load-and-trough' };
    if (drug === 'digoxin' && indication === 'arrhythmia') return { plan: 'level-and-renal' };
    if (drug === 'theophylline') return { plan: 'level-and-toxicity-eval' };
    if (drug === 'cyclosporine') return { plan: 'C0-and-C2-levels' };
    return { plan: 'standard-monitoring' };
  },
  IVtoPO: function (i) {
    const drug = (i.drug || 'unknown');
    const tolerance = (i.tolerance || 'tolerating');
    const gi = (i.gi || 'intact');
    if (tolerance === 'tolerating' && gi === 'intact' && drug === 'levofloxacin') return { plan: 'switch-to-PO' };
    if (tolerance === 'tolerating' && gi === 'intact' && drug === 'linezolid') return { plan: 'switch-to-PO' };
    if (tolerance === 'tolerating' && gi === 'intact' && drug === 'metronidazole') return { plan: 'switch-to-PO' };
    if (tolerance === 'not-tolerating' || gi === 'not-intact') return { plan: 'continue-IV' };
    if (drug === 'vancomycin-IV') return { plan: 'continue-IV-or-PO-for-CDI' };
    return { plan: 'evaluate-and-switch' };
  },
  TherapeuticSubstitution: function (i) {
    const original = (i.original || 'unknown');
    const indication = (i.indication || 'general');
    if (original === 'omeprazole') return { plan: 'substitute-pantoprazole' };
    if (original === 'rosuvastatin') return { plan: 'substitute-atorvastatin' };
    if (original === 'meropenem' && indication === 'stable') return { plan: 'substitute-ertapenem' };
    if (original === 'piperacillin-tazobactam' && indication === 'stable') return { plan: 'substitute-cefepime' };
    if (original === 'enoxaparin') return { plan: 'consider-rivaroxaban-or-keep' };
    return { plan: 'evaluate-and-substitute' };
  },
  Polypharmacy: function (i) {
    const meds = (i.meds || 0);
    const interactions = (i.interactions || 0);
    if (meds >= 15) return { plan: 'high-polypharmacy-and-deprescribing' };
    if (meds >= 10) return { plan: 'moderate-polypharmacy-and-review' };
    if (interactions >= 3) return { plan: 'multiple-interactions-and-discuss' };
    if (interactions >= 1) return { plan: 'minor-interactions-and-monitor' };
    return { plan: 'acceptable-polypharmacy' };
  },
  AllergyReconcile: function (i) {
    const reaction = (i.reaction || 'unknown');
    const severity = (i.severity || 'mild');
    if (severity === 'severe' && reaction === 'anaphylaxis') return { plan: 'strict-avoidance-and-alert' };
    if (severity === 'moderate' && reaction === 'rash') return { plan: 'avoid-and-document' };
    if (severity === 'mild' && reaction === 'nausea') return { plan: 'rechallenge-and-monitor' };
    if (reaction === 'sulfa' && severity === 'mild') return { plan: 'use-with-caution' };
    return { plan: 'document-and-flag' };
  },
};
module.exports = Engine;
