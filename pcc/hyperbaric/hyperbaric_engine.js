// P3-AT: Hyperbaric-Medicine Engine — 10 pure functions
const Engine = {};

Engine.HBOIndication = function ({ indication = 'decomp', severity = 'moderate', delayHours = 0 } = {}) {
  let pathway;
  if (indication === 'decomp') pathway = 'HBO-emergent-decompression-sickness-USN-Table-6';
  else if (indication === 'CO' && severity === 'severe') pathway = 'HBO-emergent-CO-with-neurologic';
  else if (indication === 'CO') pathway = 'HBO-CO-poisoning';
  else if (indication === 'gas-gangrene') pathway = 'HBO-emergent-clostridial-myonecrosis';
  else if (indication === 'arterial-gas-embolism') pathway = 'HBO-emergent-arterial-gas-embolism';
  else if (indication === 'radiation-tissue-injury') pathway = 'HBO-elective-radiation-injury';
  else if (indication === 'diabetic-wagner-3') pathway = 'HBO-elective-diabetic-foot';
  else if (indication === 'chronic-refractory-wound') pathway = 'HBO-elective-chronic-refractory';
  else if (delayHours > 6) pathway += '-delayed-reduced-benefit';
  return { pathway, recommendation: pathway.includes('emergent') ? 'HBO-immediately' : pathway.includes('elective') ? 'HBO-elective' : 'no-HBO' };
};

Engine.HBOTreatmentTable = function ({ table = 'USN-6', depthFeet = 60, oxygenBreaks = 5, totalMinutes = 285 } = {}) {
  let protocol;
  if (table === 'USN-6') protocol = '60-feet-285-min-oxygen-air-cycles';
  else if (table === 'USN-5') protocol = '60-feet-135-min-short-emergent';
  else if (table === 'USN-9') protocol = '2.5-ATA-90-min-emergent-CO';
  else if (table === 'COMEX-30') protocol = '30-meter-saturation-extended';
  else protocol = 'unspecified-table';
  return { protocol, recommendation: 'follow-table-and-monitor' };
};

Engine.HBOContraindication = function ({ pneumothorax = false, recentThoracicSurgery = false, claustrophobia = false, pregnancy = false, seizureHistory = false } = {}) {
  let absolute;
  let relative;
  if (pneumothorax && !recentThoracicSurgery) absolute = 'untreated-pneumothorax-emergent-chest-tube-first';
  if (recentThoracicSurgery) relative = 'recent-thoracic-surgery-caution';
  if (claustrophobia) relative = 'claustrophobia-sedation-consider';
  if (pregnancy) relative = 'pregnancy-elective-only';
  if (seizureHistory) relative = 'seizure-history-monitor-O2-toxicity';
  return { absolute, relative, recommendation: absolute ? 'treat-pneumothorax-first' : (relative ? 'consider-carefully' : 'HBO-OK') };
};

Engine.HBOTreatmentResponse = function ({ sessionsCompleted = 10, indication = 'chronic-wound', woundSizeChange = -10, oxygenSaturation = 99 } = {}) {
  let response;
  if (sessionsCompleted < 5) response = 'early-evaluate-further';
  else if (woundSizeChange <= -50) response = 'excellent-response';
  else if (woundSizeChange <= -25) response = 'good-response';
  else if (woundSizeChange <= 0) response = 'slow-response-continue';
  else if (woundSizeChange > 0) response = 'wound-worsening-reassess-indication';
  return { response, recommendation: response.includes('worsening') ? 'reassess-indication-and-stop' : response.includes('excellent') || response.includes('good') ? 'continue-and-titrate' : 'continue' };
};

Engine.HBOComplication = function ({ oxygenToxicity = false, middleEarBarotrauma = false, sinusBarotrauma = false, claustrophobiaEpisode = false, hypoglycemia = false } = {}) {
  let complication;
  if (oxygenToxicity) complication = 'CNS-oxygen-toxicity-seizure-stop-treatment';
  else if (middleEarBarotrauma) complication = 'middle-ear-barotrauma-decongestant-and-myringotomy-consider';
  else if (sinusBarotrauma) complication = 'sinus-barotrauma-decongestant';
  else if (claustrophobiaEpisode) complication = 'claustrophobia-episode-sedation';
  else if (hypoglycemia) complication = 'hypoglycemia-in-DM-glucose-check';
  else complication = 'no-complication';
  return { complication, recommendation: complication.includes('toxicity') || complication.includes('hypoglycemia') ? 'stop-and-treat' : 'manage-and-monitor' };
};

Engine.HBOPneumothoraxManagement = function ({ pneumothorax = 'small', oxygen = 0, hemodynamics = 'stable' } = {}) {
  let management;
  if (pneumothorax === 'tension') management = 'emergent-needle-decompression-and-chest-tube';
  else if (pneumothorax === 'large' && hemodynamics === 'stable') management = 'chest-tube-and-100-percent-O2';
  else if (pneumothorax === 'large' && hemodynamics === 'unstable') management = 'emergent-chest-tube';
  else if (pneumothorax === 'small') management = 'observation-and-100-percent-O2';
  else management = 'no-pneumothorax';
  return { management, recommendation: management.includes('emergent') ? 'thoracic-surgery-immediate' : 'monitor-and-document' };
};

Engine.HBOWoundProtocol = function ({ indication = 'diabetic-foot', sessionsNeeded = 30, tcomUsed = false } = {}) {
  let protocol;
  if (indication === 'diabetic-foot' && tcomUsed) protocol = 'HBO-with-TCOM-monitoring-30-sessions';
  else if (indication === 'diabetic-foot') protocol = 'HBO-2.4-ATA-90-min-30-sessions';
  else if (indication === 'radiation-injury') protocol = 'HBO-2.4-ATA-90-min-30-40-sessions';
  else if (indication === 'chronic-refractory') protocol = 'HBO-2.0-ATA-30-sessions';
  else protocol = 'unspecified';
  return { protocol, recommendation: 'follow-evidence-based-protocol' };
};

Engine.HBOPediatric = function ({ age = 5, indication = 'CO', sedationNeeded = false, parentAvailable = true } = {}) {
  let pathway;
  if (age < 5) pathway = 'pediatric-HBO-with-sedation-and-parent-accompaniment';
  else if (age < 12 && parentAvailable) pathway = 'pediatric-HBO-parent-accompaniment';
  else if (age < 18) pathway = 'pediatric-HBO-with-consent';
  else pathway = 'adult-HBO-protocol';
  if (sedationNeeded) pathway += '-with-anesthesia-sedation';
  return { pathway, recommendation: 'pediatric-HBO-team-and-monitor' };
};

Engine.HBOCarboxyhemoglobin = function ({ initialCOHb = 30, hoursSinceExposure = 4, currentCOHb = 5, oxygenGiven = '100-percent' } = {}) {
  let management;
  if (initialCOHb >= 25 && hoursSinceExposure <= 6) management = 'HBO-CO-eligible';
  else if (initialCOHb >= 40) management = 'HBO-CO-emergent';
  else if (initialCOHb >= 15 && currentCOHb > 10) management = '100-percent-O2-and-monitor';
  else if (currentCOHb <= 3) management = 'resolved-continue-monitoring';
  else management = 'standard-O2-and-monitor';
  return { management, recommendation: management.includes('HBO') ? 'HBO-immediately' : '100-percent-O2' };
};

Engine.HBOOutcome = function ({ indication = 'CO', age = 30, sessionsCompleted = 0, neurological = false } = {}) {
  let outcome;
  if (indication === 'CO' && neurological) outcome = 'excellent-with-HBO';
  else if (indication === 'decomp') outcome = 'excellent-recovery-with-HBO';
  else if (indication === 'diabetic-foot' && sessionsCompleted >= 30) outcome = '70-percent-healing-rate';
  else if (indication === 'radiation-injury') outcome = '60-80-percent-improvement';
  else outcome = 'variable-outcome';
  return { outcome, recommendation: 'complete-protocol-and-monitor' };
};

module.exports = Engine;
