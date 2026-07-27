'use strict';

// Dermatology-Extended PCC — deterministic scoring/classification engines.
// 10 pure functions. No I/O. Returns { result, recommendation } shapes.

const Engine = module.exports = {};

// 1) Psoriasis severity — PASI body surface area + erythema/induration/desquamation
Engine.PsoriasisPASISeverity = function (input = {}) {
  const { psaScore = 0, bodySurfaceArea = 0 } = input;
  let category;
  if (bodySurfaceArea < 3) category = 'mild-localized';
  else if (bodySurfaceArea < 10) category = 'mild-moderate';
  else if (bodySurfaceArea < 20) category = 'moderate';
  else category = 'severe';
  const total = psaScore + bodySurfaceArea;
  return { total, category, recommendation: total > 15 ? 'biologics-evaluation' : 'topical-PUVA' };
};

// 2) Eczema severity — SCORAD composite
Engine.EczemaSCORADSeverity = function (input = {}) {
  const { extent = 0, intensity = 0, symptoms = 0 } = input;
  const total = (extent / 100) * 20 + intensity + symptoms;
  let category;
  if (total < 25) category = 'mild';
  else if (total < 50) category = 'moderate';
  else if (total < 80) category = 'severe';
  else category = 'very-severe';
  return { total, category, recommendation: total > 50 ? 'systemic-immunosuppressant' : 'topical-corticosteroid' };
};

// 3) Melanoma staging — Breslow thickness + ulceration + mitotic rate
Engine.MelanomaStaging = function (input = {}) {
  const { breslowThickness = 0, ulceration = false, mitoticRate = 0, metastasis = false } = input;
  let stage;
  if (metastasis) stage = 'stage-IV';
  else if (breslowThickness > 4 || (ulceration && breslowThickness > 2)) stage = 'stage-IIIB-IIC';
  else if (breslowThickness > 2) stage = 'stage-II-IIA';
  else if (breslowThickness > 1) stage = 'stage-IB-IIA';
  else if (breslowThickness > 0.8) stage = 'stage-IB';
  else stage = 'stage-IA';
  if (mitoticRate >= 1) stage += '-high-mitotic';
  return { stage, recommendation: metastasis ? 'immunotherapy-BRAF-targeted' : 'wide-local-excision' };
};

// 4) Acne severity — global evaluation by lesion counts
Engine.AcneGlobalSeverity = function (input = {}) {
  const { comedones = 0, papules = 0, pustules = 0, nodules = 0 } = input;
  const total = comedones + papules + pustules + (nodules * 3);
  let category;
  if (nodules >= 5) category = 'severe-nodulocystic';
  else if (total > 50 || nodules > 0) category = 'moderate';
  else if (total > 10) category = 'mild-moderate';
  else category = 'mild';
  return { total, category, recommendation: nodules >= 5 ? 'isotretinoin' : (total > 50 ? 'oral-antibiotics' : 'topical-retinoid') };
};

// 5) Drug reaction — Stevens-Johnson/TEN spectrum by BSA
Engine.StevensJohnsonSpectrum = function (input = {}) {
  const { bsaDetachment = 0, mucosalInvolvement = false, drugExposure = 'unknown' } = input;
  let category;
  if (bsaDetachment >= 30) category = 'TEN-toxic-epidermal-necrolysis';
  else if (bsaDetachment >= 10) category = 'SJS-TEN-overlap';
  else if (bsaDetachment > 0 && mucosalInvolvement) category = 'SJS-stevens-johnson';
  else category = 'minor-drug-eruption';
  return { category, recommendation: bsaDetachment >= 10 ? 'ICU-burn-unit-IVIG' : 'oral-antihistamine-topical-steroid' };
};

// 6) Hidradenitis suppurativa — Hurley staging
Engine.HidradenitisSuppurativaHurley = function (input = {}) {
  const { abscesses = 0, sinusTracts = 0, scarring = false } = input;
  let stage;
  if (sinusTracts >= 2 || (scarring && sinusTracts > 0)) stage = 'Hurley-III-severe';
  else if (abscesses > 1 || scarring) stage = 'Hurley-II-moderate';
  else stage = 'Hurley-I-mild';
  return { stage, recommendation: stage === 'Hurley-III-severe' ? 'biologics-adalimumab-surgery' : 'antibiotics-clindamycin' };
};

// 7) Vitiligo extent — body surface area coverage
Engine.VitiligoExtent = function (input = {}) {
  const { bodySurfaceArea = 0, active = false, acral = false } = input;
  let category;
  if (bodySurfaceArea >= 50) category = 'extensive';
  else if (bodySurfaceArea >= 10) category = 'generalized';
  else if (acral) category = 'acrofocal-stable';
  else category = 'focal-localized';
  return { category, recommendation: active ? 'narrowband-UVB-topical-steroid' : 'phototherapy-monitoring' };
};

// 8) Basal cell carcinoma risk — high-risk features
Engine.BasalCellCarcinomaRisk = function (input = {}) {
  const { location = 'low-risk', size = 0, recurrent = false, histologicSubtype = 'nodular', perineuralInvasion = false } = input;
  const highRisk = ['nose', 'ear', 'eyelid', 'lip', 'genital'].includes(location);
  const aggressive = ['morpheaform', 'infiltrative', 'micronodular'].includes(histologicSubtype);
  let risk;
  if (perineuralInvasion || (recurrent && aggressive)) risk = 'very-high-risk';
  else if (aggressive || size > 20 || (highRisk && recurrent)) risk = 'high-risk';
  else if (highRisk || size > 10) risk = 'intermediate-risk';
  else risk = 'low-risk';
  return { risk, recommendation: risk === 'very-high-risk' ? 'Mohs-micrographic-surgery' : (risk === 'low-risk' ? 'standard-excision' : 'Mohs-or-wide-excision') };
};

// 9) Atopic dermatitis — EASI score (Eczema Area and Severity Index)
Engine.AtopicDermatitisEASI = function (input = {}) {
  const { erythema = 0, induration = 0, excoriation = 0, lichenification = 0, bodyAreaFactor = 0.1 } = input;
  const totalBodyScore = (erythema + induration + excoriation + lichenification) * bodyAreaFactor;
  let category;
  if (totalBodyScore === 0) category = 'clear';
  else if (totalBodyScore < 7) category = 'mild';
  else if (totalBodyScore < 21) category = 'moderate';
  else category = 'severe';
  return { total: totalBodyScore, category, recommendation: totalBodyScore >= 21 ? 'dupilumab-systemic' : 'topical-TCS-TCI' };
};

// 10) Wound healing risk — diabetic foot ulcer classification
Engine.DiabeticFootUlcerRisk = function (input = {}) {
  const { wagnerGrade = 0, infection = false, ischemia = false, neuropathy = true } = input;
  let risk;
  if (wagnerGrade >= 4 || (ischemia && infection)) risk = 'critical-limb-threatening';
  else if (wagnerGrade === 3 || infection || ischemia) risk = 'high-risk';
  else if (wagnerGrade === 2) risk = 'moderate-risk';
  else if (neuropathy) risk = 'low-risk-surveillance';
  else risk = 'minimal-risk';
  return { wagnerGrade, risk, recommendation: risk === 'critical-limb-threatening' ? 'vascular-surgery-IV-antibiotics' : (risk === 'high-risk' ? 'debridement-oral-antibiotics' : 'wound-care-offloading') };
};
