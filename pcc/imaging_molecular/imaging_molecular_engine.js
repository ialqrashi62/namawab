// P3-AT: Imaging-Molecular Engine — 10 pure functions
const Engine = {};

Engine.PETCTReporting = function ({ suvMax = 0, lesionSize = 0, location = 'lung', comparisonToPrior = 'stable' } = {}) {
  let category;
  if (suvMax >= 5 && lesionSize >= 1) category = 'PET-positive-likely-malignancy';
  else if (suvMax >= 3.5 && comparisonToPrior === 'increased') category = 'progressive-disease-on-PET';
  else if (suvMax >= 2.5) category = 'indeterminate-biopsy-consider';
  else if (suvMax < 2.5 && comparisonToPrior === 'decreased') category = 'treatment-response-on-PET';
  else category = 'no-definite-metabolic-activity';
  return { category, recommendation: category.includes('likely') || category.includes('progressive') ? 'oncology-and-biopsy' : category.includes('response') ? 'continue-treatment' : 'followup' };
};

Engine.MolecularImagingTracer = function ({ tracer = 'FDG', indication = 'cancer-staging', time = 60 } = {}) {
  let pathway;
  if (tracer === 'FDG' && indication === 'cancer-staging') pathway = 'F18-FDG-60-min-uptake-PET';
  else if (tracer === 'DOTATATE') pathway = 'Ga68-DOTATATE-neuroendocrine-tumor';
  else if (tracer === 'PSMA') pathway = 'Ga68-PSMA-prostate-cancer';
  else if (tracer === 'FLT') pathway = 'F18-FLT-proliferation';
  else if (tracer === 'Amyloid-PET') pathway = 'amyloid-PET-alzheimers';
  else if (tracer === 'Tau-PET') pathway = 'tau-PET-tauopathy';
  else pathway = 'unspecified-tracer';
  return { pathway, recommendation: 'follow-protocol-for-tracer' };
};

Engine.DeauvilleScore = function ({ mediastinalBloodPool = 3, liverBackground = 3, residualLesionSUV = 4 } = {}) {
  let score;
  if (residualLesionSUV <= mediastinalBloodPool) score = 'Deauville-1-or-2-complete-response';
  else if (residualLesionSUV > mediastinalBloodPool && residualLesionSUV <= liverBackground) score = 'Deauville-3-likely-complete-response';
  else if (residualLesionSUV > liverBackground && residualLesionSUV <= 7) score = 'Deauville-4-residual-disease';
  else if (residualLesionSUV > 7) score = 'Deauville-5-progressive-disease';
  else score = 'Deauville-3-uncertain';
  return { score, recommendation: score.includes('complete') ? 'continue-surveillance' : 'salvage-therapy-consider' };
};

Engine.MIBGAdrenal = function ({ metanephrine = 50, normetanephrine = 200, mibgUptake = 'positive', lesionSize = 3 } = {}) {
  let diagnosis;
  if (mibgUptake === 'positive' && (metanephrine > 200 || normetanephrine > 400)) diagnosis = 'pheochromocytoma-confirmed';
  else if (mibgUptake === 'positive' && metanephrine > 100) diagnosis = 'possible-pheochromocytoma-biochem-confirm';
  else if (mibgUptake === 'negative' && (metanephrine > 200 || normetanephrine > 400)) diagnosis = 'non-MIBG-avid-tumor-consider-other';
  else if (mibgUptake === 'negative' && metanephrine < 100) diagnosis = 'not-pheochromocytoma';
  else diagnosis = 'unspecified';
  return { diagnosis, recommendation: diagnosis.includes('confirmed') || diagnosis.includes('possible') ? 'endocrine-and-surgery' : 'reassess' };
};

Engine.MRISPECTBrain = function ({ perfusionPattern = 'normal', dopamineTransporter = 'normal', amyloid = 'negative', tau = 'negative' } = {}) {
  let pattern;
  if (perfusionPattern === 'posterior-deficit' && amyloid === 'positive' && tau === 'negative') pattern = 'Alzheimers-disease-pattern';
  else if (perfusionPattern === 'frontal-deficit' && tau === 'positive') pattern = 'FTD-pattern';
  else if (dopamineTransporter === 'reduced') pattern = 'parkinsonian-syndrome';
  else if (perfusionPattern === 'normal' && amyloid === 'negative' && tau === 'negative') pattern = 'normal-aging';
  else pattern = 'non-specific-pattern';
  return { pattern, recommendation: pattern.includes('Alzheimers') || pattern.includes('FTD') ? 'neurology-and-neuropsych' : 'monitor' };
};

Engine.MRECist = function ({ mriLesionType = 'simple', size = 1, enhancement = 'none' } = {}) {
  let category;
  if (mriLesionType === 'simple' && size < 3) category = 'Bosniak-I-simple-cyst';
  else if (mriLesionType === 'minimally-complex' && size < 3) category = 'Bosniak-II-minimally-complex';
  else if (mriLesionType === 'minimally-complex' && enhancement === 'mild') category = 'Bosniak-IIF-need-followup';
  else if (enhancement === 'thick' || enhancement === 'nodular') category = 'Bosniak-IV-surgical-or-active-surveillance';
  else if (size >= 4) category = 'Bosniak-III-indeterminate-surgical';
  else category = 'Bosniak-I-or-II-no-followup';
  return { category, recommendation: category.includes('I') || category.includes('II-') ? 'no-followup' : (category.includes('IIF') ? 'yearly-MRI' : 'surgery') };
};

Engine.PSMAPETProstate = function ({ psa = 10, lesionSite = 'prostate', suvMax = 0, priorTherapy = 'none' } = {}) {
  let interpretation;
  if (psa > 20 && suvMax >= 10) interpretation = 'high-risk-metastatic-disease';
  else if (psa > 10 && suvMax >= 5) interpretation = 'oligo-recurrent-disease';
  if (priorTherapy === 'prostatectomy' && psa > 0.2) interpretation += '-biochemical-recurrence';
  else if (priorTherapy === 'radiation') interpretation += '-post-radiation';
  return { interpretation, recommendation: interpretation.includes('metastatic') ? 'androgen-deprivation-therapy' : 'salvage-radiation' };
};

Engine.DOTATATENET = function ({ lesionSite = 'pancreas', suvMax = 0, ki67 = 5 } = {}) {
  let grading;
  if (ki67 < 3) grading = 'NET-grade-1';
  else if (ki67 < 20) grading = 'NET-grade-2';
  else grading = 'NET-grade-3-high-grade';
  let dotatate;
  if (suvMax >= 10) dotatate = 'DOTATATE-strongly-positive-eligible-for-PRRT';
  else if (suvMax >= 5) dotatate = 'DOTATATE-positive-consider-PRRT';
  else if (suvMax < 5) dotatate = 'DOTATATE-low-or-negative-PRRT-not-eligible';
  return { grading, dotatate, recommendation: dotatate.includes('eligible') ? 'PRRT-referral' : 'consider-other-therapy' };
};

Engine.MolecularBrainPET = function ({ indication = 'dementia', amyloid = 'negative', tau = 'negative', fdgPattern = 'normal' } = {}) {
  let diagnosis;
  if (indication === 'dementia' && amyloid === 'positive' && tau === 'positive') diagnosis = 'Alzheimers-disease-confirmed';
  else if (indication === 'dementia' && amyloid === 'positive' && tau === 'negative') diagnosis = 'amyloid-positive-MCI';
  else if (indication === 'dementia' && tau === 'positive') diagnosis = 'non-AD-tauopathy';
  else if (fdgPattern === 'hypometabolic-posterior') diagnosis = 'AD-pattern-on-FDG';
  else if (indication === 'dementia' && amyloid === 'negative' && tau === 'negative') diagnosis = 'non-AD-dementia';
  else diagnosis = 'unspecified';
  return { diagnosis, recommendation: 'neurology-and-neuropsych' };
};

Engine.ImagingBioDose = function ({ modality = 'CT', ctdivol = 5, dlp = 500 } = {}) {
  let dose;
  if (modality === 'CT' && ctdivol) dose = `effective-dose-approx-${(ctdivol * 0.014).toFixed(2)}-mSv`;
  else if (modality === 'PET') dose = 'FDG-PET-effective-dose-7-mSv';
  else if (modality === 'MRI') dose = 'no-ionizing-radiation';
  else dose = 'standard-dose';
  return { dose, recommendation: 'ALARA-principle-and-tracking' };
};

module.exports = Engine;
