// P3-AP: Transfusion-Medicine Engine — 10 pure functions
const Engine = {};

Engine.BloodTypeCompatibility = function ({ recipientABO = 'O', donorABO = 'O', rh = 'positive', recipientRh = 'unknown', donorRh = 'unknown' } = {}) {
  const compatibility = {
    'O-O': true, 'O-A': false, 'O-B': false, 'O-AB': false,
    'A-O': true, 'A-A': true, 'A-B': false, 'A-AB': false,
    'B-O': true, 'B-A': false, 'B-B': true, 'B-AB': false,
    'AB-O': true, 'AB-A': true, 'AB-B': true, 'AB-AB': true
  };
  const key = `${recipientABO}-${donorABO}`;
  const compatible = compatibility[key] || false;
  const rhCompat = (recipientRh === 'unknown' || donorRh === 'unknown') ? true : !(donorRh === 'positive' && recipientRh === 'negative');
  return { compatible, rhCompatible: rhCompat, recommendation: compatible ? 'crossmatch-and-transfuse' : 'do-not-transfuse' };
};

Engine.MassiveTransfusionProtocol = function ({ heartRate = 100, sbp = 90, shockIndex = 1.0, lactate = 2.0, mechanism = 'blunt' } = {}) {
  let activate;
  if (sbp < 90 && shockIndex > 1.0 && lactate > 4) activate = 'activate-MTP-immediately';
  else if (sbp < 90 && mechanism === 'penetrating') activate = 'activate-MTP';
  else if (lactate > 4 && mechanism === 'blunt') activate = 'consider-MTP';
  else if (sbp < 90 || shockIndex > 1.4) activate = 'monitor-and-prepare';
  else activate = 'no-MTP-monitor';
  return { activate, recommendation: activate.includes('immediately') || activate.includes('MTP') ? 'page-blood-bank-and-MTP' : 'standard-transfusion' };
};

Engine.PlateletRefractoriness = function ({ preCount = 0, postCount = 0, weight = 70, plateletDose = 5 } = {}) {
  const cci = (postCount - preCount) * 1000 * 100 / (weight * 5);
  let refractoriness;
  if (cci < 5) refractoriness = 'refractory-immunologic-or-non-immunologic';
  else if (cci < 10) refractoriness = 'borderline-refractoriness';
  else refractoriness = 'adequate-response';
  return { cci: Math.round(cci), refractoriness, recommendation: refractoriness.includes('refractory') ? 'HLA-matched-platelets-and-workup' : 'continue' };
};

Engine.TransfusionReaction = function ({ temperature = 37, chills = false, hypotension = false, dyspnea = false, hemoglobinuria = false, hives = false } = {}) {
  let type;
  if (temperature >= 39 && chills) type = 'febrile-non-hemolytic-transfusion-reaction-FNHTR';
  else if (hives) type = 'allergic-urticarial';
  else if (hypotension && dyspnea) type = 'anaphylaxis-or-TRALI-stop-and-support';
  else if (hemoglobinuria) type = 'acute-hemolytic-transfusion-reaction-stop-and-workup';
  else if (dyspnea && !hypotension) type = 'TRALI-or-TACO-workup';
  else if (fever && hypotension) type = 'sepsis-contaminated-unit-stop';
  else type = 'no-reaction';
  return { type, recommendation: type.includes('Stop') || type.includes('acute') || type.includes('anaphylaxis') ? 'stop-transfusion-and-investigate' : 'monitor' };
};

Engine.RhIgProphylaxis = function ({ motherRh = 'negative', babyRh = 'positive', weeksGestation = 28, postpartum = false } = {}) {
  let dose;
  if (postpartum && babyRh === 'positive') dose = '300mcg-RhoGAM-postpartum';
  else if (weeksGestation === 28 && motherRh === 'negative') dose = '300mcg-RhoGAM-28-weeks';
  else if (motherRh === 'positive' || babyRh === 'negative') dose = 'not-needed';
  else dose = '300mcg-RhoGAM-after-event';
  return { dose, recommendation: 'antibody-screen-each-pregnancy' };
};

Engine.ComponentTherapyRatio = function ({ prbcUnits = 0, ffpUnits = 0, plateletUnits = 0, cryoUnits = 0 } = {}) {
  const total = prbcUnits + ffpUnits + plateletUnits + cryoUnits;
  if (total === 0) return { ratio: 'N/A', recommendation: 'no-transfusion' };
  const ffpRatio = ffpUnits / prbcUnits;
  const pltRatio = plateletUnits / prbcUnits;
  let interpretation;
  if (prbcUnits >= 4 && ffpRatio >= 0.5 && pltRatio >= 0.5) interpretation = 'balanced-ratio-good';
  else if (prbcUnits >= 4 && ffpRatio < 0.3) interpretation = 'low-FFP-ratio-consider-more-FFP';
  else if (prbcUnits >= 4 && pltRatio < 0.3) interpretation = 'low-platelet-ratio-consider-platelets';
  else interpretation = 'sub-massive-transfusion';
  return { ratio: `${Math.round(ffpRatio*10)/10}:${Math.round(pltRatio*10)/10}:1`, interpretation, recommendation: 'reassess-after-each-cycle' };
};

Engine.TransfusionThreshold = function ({ indication = 'anemia', hemoglobin = 7, activeBleed = false, cardiacDisease = false } = {}) {
  let threshold;
  if (activeBleed) threshold = 'transfuse-immediately-bleeding';
  else if (cardiacDisease && hemoglobin < 8) threshold = 'transfuse-restrictive-8-cardiac';
  else if (indication === 'sepsis' && hemoglobin < 7) threshold = 'transfuse-sepsis-7';
  else if (indication === 'postop' && hemoglobin < 8) threshold = 'transfuse-postop-8';
  else if (hemoglobin < 7) threshold = 'transfuse-restrictive-7';
  else threshold = 'no-transfusion-needed';
  return { threshold, recommendation: threshold.includes('transfuse') ? 'transfuse-1-unit-and-recheck' : 'monitor-and-iron' };
};

Engine.PlateletThreshold = function ({ indication = 'prophylaxis', plateletCount = 20, surgery = 'none', activeBleed = false, neurosurgery = false } = {}) {
  let threshold;
  if (neurosurgery && plateletCount < 100) threshold = 'transfuse-neurosurgery-100';
  else if (surgery !== 'none' && plateletCount < 50) threshold = 'transfuse-surgery-50';
  else if (activeBleed && plateletCount < 50) threshold = 'transfuse-bleed-50';
  else if (indication === 'chemotherapy' && plateletCount < 10) threshold = 'transfuse-chemo-10';
  else if (indication === 'prophylaxis' && plateletCount < 10) threshold = 'transfuse-prophylaxis-10';
  else if (indication === 'prophylaxis' && plateletCount < 20) threshold = 'consider-prophylaxis-20';
  else threshold = 'no-transfusion';
  return { threshold, recommendation: threshold.includes('transfuse') ? 'platelet-transfusion' : 'monitor' };
};

Engine.FFPTransfusion = function ({ inr = 1.0, bleeding = false, surgery = 'none' } = {}) {
  let threshold;
  if (bleeding && inr > 1.5) threshold = 'transfuse-FFP-bleeding-INR-1.5';
  else if (surgery !== 'none' && inr > 1.5) threshold = 'transfuse-FFP-surgery-INR-1.5';
  else if (inr > 3.0 && !bleeding) threshold = 'consider-FFP-INR-3';
  else if (inr > 10) threshold = 'transfuse-warfarin-reversal-FFP-and-vitamin-K';
  else threshold = 'no-FFP-needed';
  return { threshold, recommendation: threshold.includes('transfuse') ? 'FFP-15ml-kg-and-recheck-INR' : 'monitor' };
};

Engine.CryoprecipitateDosing = function ({ fibrinogen = 1.5, bleeding = false, target = 1.5 } = {}) {
  const needed = Math.max(0, Math.ceil((target - fibrinogen) / 0.1));
  let threshold;
  if (fibrinogen < 1.0 && bleeding) threshold = 'transfuse-cryo-10-units-emergent';
  else if (fibrinogen < 1.5 && bleeding) threshold = 'transfuse-cryo-bleeding';
  else if (fibrinogen < 1.0 && !bleeding) threshold = 'consider-cryo-DIC';
  else if (fibrinogen < 2.0 && surgery) threshold = 'preop-cryo-target-2';
  else threshold = 'no-cryo-needed';
  const cryoBags = needed > 0 ? needed : 0;
  return { threshold, cryoBags, recommendation: threshold.includes('transfuse') ? `cryo-${cryoBags}-bags-and-recheck` : 'monitor' };
};

module.exports = Engine;
