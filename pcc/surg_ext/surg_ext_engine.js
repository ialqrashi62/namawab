// P3-BQ surg_ext_engine.js — 10 pure functions
const Engine = {
  PreopRisk: function (i) {
    const asa = (i.asa || 1);
    const surgery = (i.surgery || 'low');
    if (asa >= 4 && surgery === 'high') return { plan: 'high-risk-and-postop-ICU' };
    if (asa >= 3 && surgery === 'high') return { plan: 'elevated-risk-and-step-down' };
    if (asa >= 3) return { plan: 'moderate-risk-and-monitor' };
    if (surgery === 'high') return { plan: 'elevated-risk-and-optimize' };
    return { plan: 'low-risk-and-day-surgery' };
  },
  Wound: function (i) {
    const type = (i.type || 'clean');
    const day = (i.day || 1);
    if (type === 'dirty' && day > 3) return { plan: 'open-wound-and-secondary' };
    if (type === 'clean' && day > 5) return { plan: 'eval-for-rupture' };
    if (day === 1) return { plan: 'monitor-dressing' };
    if (day <= 3) return { plan: 'monitor-and-dressing-change' };
    return { plan: 'monitor-and-FU' };
  },
  SBO: function (i) {
    const acuteness = (i.acuteness || 'partial');
    const signs = (i.signs || 'no');
    if (signs === 'peritonitis') return { plan: 'urgent-OR-and-exploration' };
    if (acuteness === 'complete') return { plan: 'NG-tube-and-OR' };
    if (acuteness === 'partial' && signs === 'no') return { plan: 'NG-tube-and-conservative' };
    return { plan: 'monitor-and-eval' };
  },
  Perforation: function (i) {
    const source = (i.source || 'unknown');
    const stable = (i.stable || 'no');
    if (stable === 'no' && source === 'colon') return { plan: 'Hartmann-or-resection' };
    if (stable === 'yes' && source === 'duodenal') return { plan: 'OR-and-repair' };
    if (source === 'appendiceal') return { plan: 'OR-and-appendectomy' };
    if (source === 'colon') return { plan: 'OR-and-resection' };
    return { plan: 'OR-and-eval' };
  },
  Cholecystitis: function (i) {
    const severity = (i.severity || 'mild');
    const acalculous = (i.acalculous || 'no');
    if (severity === 'severe' || acalculous === 'yes') return { plan: 'urgent-LC-and-ABx' };
    if (severity === 'moderate') return { plan: 'early-LC-within-72h' };
    if (severity === 'mild') return { plan: 'LC-elective' };
    return { plan: 'eval-and-typed' };
  },
  Appendicitis: function (i) {
    const type = (i.type || 'uncomplicated');
    const perforation = (i.perforation || 'no');
    if (type === 'complicated' || perforation === 'yes') return { plan: 'urgent-OR-and-ABx' };
    if (type === 'uncomplicated') return { plan: 'laparoscopic-appendectomy' };
    return { plan: 'eval-and-surgery' };
  },
  Hernia: function (i) {
    const type = (i.type || 'inguinal');
    const incarcerated = (i.incarcerated || 'no');
    if (incarcerated === 'yes') return { plan: 'urgent-reduction-and-repair' };
    if (incarcerated === 'no' && type === 'inguinal') return { plan: 'elective-mesh-repair' };
    if (type === 'umbilical' && i.symptomatic === 'yes') return { plan: 'elective-repair' };
    if (type === 'incisional') return { plan: 'complex-repair-and-CT' };
    return { plan: 'monitor-and-decide' };
  },
  TraumaLap: function (i) {
    const injury = (i.injury || 'unknown');
    const stable = (i.stable || 'yes');
    if (injury === 'splenic-rupture' && stable === 'no') return { plan: 'urgent-OR-and-splenectomy' };
    if (injury === 'liver-laceration' && stable === 'no') return { plan: 'angioembolization-and-OR' };
    if (stable === 'yes' && injury === 'splenic-rupture') return { plan: 'angioembolization-and-monitor' };
    if (stable === 'yes') return { plan: 'monitor-and-non-operative' };
    return { plan: 'eval-and-decide' };
  },
  Postop: function (i) {
    const day = (i.day || 1);
    const complication = (i.complication || 'none');
    if (complication === 'bleeding') return { plan: 'OR-and-hemostasis' };
    if (complication === 'leak') return { plan: 'OR-and-repair' };
    if (complication === 'SSI') return { plan: 'I&D-and-ABx' };
    if (day === 1) return { plan: 'ambulation-and-diet' };
    if (day <= 3) return { plan: 'monitor-and-progress-diet' };
    return { plan: 'continue-recovery-and-FU' };
  },
  Bariatric: function (i) {
    const bmi = (i.bmi || 35);
    const comorbidity = (i.comorbidity || 'no');
    if (bmi >= 40) return { plan: 'sleeve-or-bypass-eval' };
    if (bmi >= 35 && comorbidity === 'yes') return { plan: 'sleeve-or-bypass-eval' };
    if (bmi >= 30 && comorbidity === 'yes') return { plan: 'medical-and-surgery-eval' };
    if (bmi < 30) return { plan: 'medical-and-eval' };
    return { plan: 'eval-and-decide' };
  },
};
module.exports = Engine;
