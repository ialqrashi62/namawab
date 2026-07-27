// P3-BI rad_ext_engine.js — 10 pure functions (advanced radiology)
const Engine = {
  CTHead: function (i) {
    const presentation = (i.presentation || 'trauma');
    const gcs = (i.gcs || 15);
    if (presentation === 'stroke-alert' && gcs < 14) return { plan: 'CTA-and-CTP-and-tPA' };
    if (presentation === 'trauma' && gcs < 8) return { plan: 'CT-and-neurosurg-consult' };
    if (presentation === 'headache' && gcs < 14) return { plan: 'CT-and-LP-eval' };
    if (presentation === 'trauma' && gcs >= 13) return { plan: 'CT-and-rule-out-fracture' };
    if (presentation === 'headache') return { plan: 'CT-and-rule-out-bleed' };
    return { plan: 'CT-with-contrast-or-eval' };
  },
  MRIProtocol: function (i) {
    const organ = (i.organ || 'brain');
    const question = (i.question || 'general');
    if (organ === 'brain' && question === 'stroke') return { plan: 'DWI-and-MRA-and-perfusion' };
    if (organ === 'brain' && question === 'tumor') return { plan: 'T1-contrast-and-FLAIR-and-DWI' };
    if (organ === 'spine' && question === 'cord-compression') return { plan: 'MRI-with-and-without-contrast' };
    if (organ === 'knee' && question === 'meniscus') return { plan: 'knee-MRI-without-contrast' };
    if (organ === 'liver' && question === 'mass') return { plan: 'liver-MRI-with-Primovist' };
    return { plan: 'standard-MRI-and-tailored' };
  },
  Ultrasound: function (i) {
    const organ = (i.organ || 'general');
    const question = (i.question || 'general');
    if (organ === 'gallbladder' && question === 'stones') return { plan: 'RUQ-US-and-cholecystitis-eval' };
    if (organ === 'renal' && question === 'obstruction') return { plan: 'renal-US-and-hydronephrosis' };
    if (organ === 'DVT') return { plan: 'compression-US-and-Doppler' };
    if (organ === 'AAA') return { plan: 'AAA-screen-and-5cm-cutoff' };
    if (organ === 'pelvis' && question === 'mass') return { plan: 'transvaginal-US-and-eval' };
    return { plan: 'US-and-targeted' };
  },
  ContrastReaction: function (i) {
    const severity = (i.severity || 'mild');
    const symptom = (i.symptom || 'urticaria');
    if (severity === 'severe' && symptom === 'anaphylaxis') return { plan: 'epinephrine-and-emergency' };
    if (severity === 'moderate' && symptom === 'bronchospasm') return { plan: 'epi-and-steroid-and-monitor' };
    if (severity === 'mild' && symptom === 'urticaria') return { plan: 'diphenhydramine-and-monitor' };
    if (severity === 'mild' && symptom === 'nausea') return { plan: 'supportive-and-slow-rate' };
    return { plan: 'mild-and-monitor' };
  },
  RadiationDose: function (i) {
    const modality = (i.modality || 'CT');
    const age = (i.age || 50);
    const study = (i.study || 'chest');
    if (modality === 'CT' && age < 18 && study === 'chest') return { plan: 'low-dose-CT-and-pediatric-protocol' };
    if (modality === 'CT' && study === 'abdomen') return { plan: 'standard-dose-and-renal-protection' };
    if (modality === 'PET') return { plan: 'high-dose-and-justify' };
    if (modality === 'X-ray') return { plan: 'low-dose-and-acceptable' };
    if (modality === 'MRI') return { plan: 'no-radiation-and-safe' };
    return { plan: 'low-dose-and-justified' };
  },
  Biopsy: function (i) {
    const target = (i.target || 'unknown');
    const risk = (i.risk || 'low');
    const imaging = (i.imaging || 'CT');
    if (risk === 'high' && target === 'pancreas') return { plan: 'EUS-FNA-and-cytology' };
    if (target === 'liver' && imaging === 'US') return { plan: 'US-guided-biopsy-and-coag' };
    if (target === 'lung' && risk === 'high') return { plan: 'bronchoscopy-or-TTNA' };
    if (risk === 'low' && imaging === 'CT') return { plan: 'CT-guided-core-biopsy' };
    if (target === 'lymph-node') return { plan: 'US-or-CT-FNA' };
    return { plan: 'evaluate-and-choose' };
  },
  PediatricDose: function (i) {
    const weight = (i.weight || 20);
    const modality = (i.modality || 'CT');
    if (modality === 'CT' && weight < 30) return { plan: 'weight-based-CT-dose' };
    if (modality === 'MRI' && weight < 10) return { plan: 'feed-and-swaddle-and-no-sedation' };
    if (modality === 'X-ray' && weight < 10) return { plan: 'gonadal-shield-and-minimal-views' };
    if (weight < 5) return { plan: 'incubator-protocol-and-minimal' };
    return { plan: 'pediatric-protocol-and-weight-based' };
  },
  IVContrastRenal: function (i) {
    const gfr = (i.gfr || 90);
    const study = (i.study || 'CT');
    if (gfr >= 60) return { plan: 'standard-contrast-and-safe' };
    if (gfr >= 30 && gfr < 60) return { plan: 'hydration-and-monitor' };
    if (gfr >= 15 && gfr < 30) return { plan: 'low-dose-and-nephrology-consult' };
    if (gfr < 15) return { plan: 'avoid-contrast-or-dialysis' };
    if (study === 'MRI') return { plan: 'gadolinium-NSF-risk' };
    return { plan: 'evaluate-and-decide' };
  },
  ImageQuality: function (i) {
    const motion = (i.motion || 'minimal');
    const bmi = (i.bmi || 25);
    const organ = (i.organ || 'general');
    if (motion === 'severe') return { plan: 'repeat-and-sedation' };
    if (bmi > 40) return { plan: 'high-kV-and-larger-FOV' };
    if (organ === 'lung' && motion === 'moderate') return { plan: 'breath-hold-and-HRCT' };
    if (organ === 'abdomen' && motion === 'moderate') return { plan: 'respiratory-triggering' };
    return { plan: 'acceptable-quality' };
  },
  CriticalFinding: function (i) {
    const finding = (i.finding || 'unknown');
    const time = (i.time || 1);
    if (finding === 'PE-massive') return { plan: 'immediate-call-and-thrombolysis' };
    if (finding === 'aortic-dissection') return { plan: 'immediate-call-and-CT-surge' };
    if (finding === 'tension-pneumothorax') return { plan: 'immediate-call-and-chest-tube' };
    if (finding === 'ruptured-AAA') return { plan: 'immediate-call-and-OR' };
    if (finding === 'acute-stroke-LVO') return { plan: 'stroke-alert-and-thrombectomy' };
    if (time > 1) return { plan: 'within-1h-of-discovery' };
    return { plan: 'standard-reporting' };
  },
};
module.exports = Engine;
