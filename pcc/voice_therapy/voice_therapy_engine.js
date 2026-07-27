// P3-AZ: Voice-Therapy Engine — 10 pure functions
const Engine = {};

Engine.VoiceEval = function ({ diagnosis = 'dysphonia', severity = 'moderate', professional = 'teacher', vhi = 35 } = {}) {
  let plan;
  if (severity === 'severe' && vhi >= 60) plan = 'intensive-VT-and-MD-eval';
  else if (diagnosis === 'vocal-nodules' && severity === 'mild') plan = 'vocal-hygiene-and-direct-VT';
  else if (professional === 'teacher' || professional === 'singer') plan = 'vocal-occupational-VT-and-amplification';
  else if (diagnosis === 'vocal-fold-paralysis') plan = 'medical-and-surgical-eval-and-VT';
  else if (diagnosis === 'muscle-tension') plan = 'manual-circumlaryngeal-VT-and-resonant-voice';
  else plan = 'standard-VT-evaluation';
  return { plan, recommendation: `${plan}-for-${diagnosis}-VHI-${vhi}` };
};

Engine.VocalHygiene = function ({ hydration = 'adequate', phonotrauma = 'moderate', reflux = 'mild', rest = 'partial' } = {}) {
  let plan;
  if (hydration === 'inadequate' || phonotrauma === 'severe') plan = 'hydration-90oz-water-and-voice-rest';
  else if (reflux === 'severe') plan = 'aggressive-reflux-treatment-and-VT';
  else if (phonotrauma === 'moderate') plan = 'reduce-throat-clearing-and-yelling';
  else if (reflux === 'mild') plan = 'PPI-and-dietary-reflux-modification';
  else if (rest === 'partial') plan = 'voice-rest-and-scheduled-silent-periods';
  else plan = 'maintain-vocal-hygiene';
  return { plan, recommendation: 'daily-vocal-hygiene-and-tracking' };
};

Engine.VoiceDisorder = function ({ pitch = 'low', loudness = 'normal', quality = 'hoarse', duration = '3-weeks' } = {}) {
  let diagnosis;
  if (duration < 2) diagnosis = 'acute-laryngitis-self-limited';
  else if (duration >= 3 && quality === 'hoarse') diagnosis = 'persistent-dysphonia-ENT-eval';
  else if (duration >= 3 && quality === 'breathy') diagnosis = 'vocal-fold-paralysis-or-bowing';
  else if (duration >= 3 && quality === 'strained') diagnosis = 'muscle-tension-dysphonia';
  else if (duration >= 6 && pitch === 'low') diagnosis = 'puberphonia-or-organic-evaluate';
  else if (duration >= 6) diagnosis = 'chronic-dysphonia-organic-vs-functional';
  else diagnosis = 'unspecified';
  return { diagnosis, recommendation: 'ENT-laryngoscopy-eval-and-VT' };
};

Engine.SLPResonantVoice = function ({ technique = 'resonant-voice', loudness = 'normal', dailyPractice = 15 } = {}) {
  let plan;
  if (technique === 'resonant-voice' && dailyPractice >= 15) plan = 'resonant-voice-therapy-Lessac-and-Yawn-Sigh';
  else if (technique === 'Lee-Silverman' && loudness === 'low') plan = 'LSVT-LOUD-for-Parkinson';
  else if (technique === 'stretches') plan = 'stretch-and-flow-phonation';
  else if (technique === 'manual-circumlaryngeal') plan = 'manual-circumlaryngeal-massage';
  else if (technique === 'twang') plan = 'twang-therapy-and-infraglottic-compression';
  else plan = 'standard-voice-therapy';
  return { plan, recommendation: '15-to-30-min-daily-2x-week-clinic' };
};

Engine.PediatricVoice = function ({ age = 8, diagnosis = 'vocal-nodules', parent = 'engaged', therapyType = 'direct' } = {}) {
  let plan;
  if (age < 4) plan = 'play-based-VT-and-family-counseling';
  else if (age < 8 && diagnosis === 'vocal-nodules' && parent === 'engaged') plan = 'family-centered-VT-and-shouting-chart';
  else if (age < 8) plan = 'play-based-VT-and-parent-coaching';
  else if (age < 18 && therapyType === 'direct') plan = 'direct-VT-and-vocal-hygiene';
  else if (age < 18 && therapyType === 'indirect') plan = 'indirect-VT-and-environment-modification';
  else plan = 'standard-pediatric-VT';
  return { plan, recommendation: 'pediatric-SLP-and-ENT' };
};

Engine.VoiceForSinger = function ({ voiceType = 'soprano', complaint = 'fatigue', performance = 'frequent', technique = 'mix' } = {}) {
  let plan;
  if (complaint === 'fatigue' && performance === 'frequent') plan = 'endurance-training-and-vocal-condtioning';
  else if (complaint === 'pitch-trouble' && technique === 'mix') plan = 'mix-voice-and-registration-balancing';
  else if (complaint === 'breath-control') plan = 'appoggio-and-breath-management-VT';
  else if (complaint === 'hoarseness') plan = 'vocal-fold-eval-and-modification-of-technique';
  else if (voiceType === 'tenor' || voiceType === 'soprano') plan = 'high-note-stamina-and-stretching';
  else plan = 'standard-singer-VT';
  return { plan, recommendation: 'singing-VT-and-ENT-eval-if-needed' };
};

Engine.TransgenderVoice = function ({ genderIdentity = 'transgender-female', current = 'androgynous', goals = 'feminine', pitch = 180 } = {}) {
  let plan;
  if (genderIdentity === 'transgender-female' && current === 'masculine') plan = 'feminine-voice-and-pitch-elevation';
  else if (genderIdentity === 'transgender-male') plan = 'masculine-voice-and-pitch-lowering-testosterone';
  else if (genderIdentity === 'non-binary') plan = 'androgynous-and-individualized-voice';
  else if (goals === 'feminine' && pitch >= 180) plan = 'feminine-voice-achieved-maintain';
  else if (goals === 'masculine' && pitch < 165) plan = 'masculine-voice-achieved-maintain';
  else plan = 'pitch-and-resonance-training';
  return { plan, recommendation: 'gender-affirming-VT-and-mental-health' };
};

Engine.VoiceLaryngectomy = function ({ surgery = 'total-laryngectomy', alaryngeal = 'tracheoesophageal', monthsPost = 3 } = {}) {
  let plan;
  if (surgery === 'total-laryngectomy' && alaryngeal === 'tracheoesophageal') plan = 'TEP-voice-prosthesis-and-voice-eval';
  else if (surgery === 'total-laryngectomy' && alaryngeal === 'esophageal') plan = 'esophageal-speech-training';
  else if (surgery === 'total-laryngectomy' && alaryngeal === 'electrolarynx') plan = 'electrolarynx-training-and-servicing';
  else if (surgery === 'partial-laryngectomy') plan = 'shunt-or-stretch-and-flow-VT';
  else if (monthsPost < 2) plan = 'pre-VT-eval-and-stoma-care';
  else plan = 'standard-alaryngeal-VT';
  return { plan, recommendation: 'SLP-and-ENT-and-prosthesis-clinic' };
};

Engine.VoiceDosing = function ({ minutesPerSession = 45, sessionsPerWeek = 2, weeks = 8 } = {}) {
  const totalHours = (minutesPerSession * sessionsPerWeek * weeks) / 60;
  let intensity;
  if (totalHours >= 24) intensity = 'intensive-voice-therapy';
  else if (totalHours >= 12) intensity = 'standard-voice-therapy';
  else if (totalHours >= 6) intensity = 'maintenance-voice-therapy';
  else intensity = 'supportive-voice-therapy';
  return { totalHours, intensity, recommendation: `${intensity}-${weeks}-weeks` };
};

Engine.VoiceOutcome = function ({ preVHI = 50, postVHI = 25, preCAPE_V = 8, postCAPE_V = 14, weeksElapsed = 8 } = {}) {
  const vhiDelta = preVHI - postVHI;
  const vhiPct = (vhiDelta / preVHI) * 100;
  const capevDelta = postCAPE_V - preCAPE_V;
  let result;
  if (vhiPct >= 50 || capevDelta >= 4) result = 'large-clinical-improvement';
  else if (vhiPct >= 30 || capevDelta >= 2) result = 'moderate-clinical-improvement';
  else if (vhiPct >= 10 || capevDelta >= 1) result = 'small-clinical-improvement';
  else if (vhiPct < 0) result = 'no-improvement-or-worsening';
  else result = 'plateau-or-stable';
  return { vhiDelta, vhiPct: Math.round(vhiPct), result, recommendation: result.includes('large') || result.includes('moderate') ? 'maintenance-and-taper' : 'modify-or-evaluate' };
};

module.exports = Engine;
