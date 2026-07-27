// P3-AX: Music-Therapy Engine — 10 pure functions
const Engine = {};

Engine.MusicTherapyAssessment = function ({ age = 30, diagnosis = 'depression', musicalBackground = 'none', engagement = 'high', goals = 'emotional-expression' } = {}) {
  let plan;
  if (engagement === 'high' && musicalBackground !== 'none') plan = 'active-music-making-improvisation-and-songwriting';
  else if (engagement === 'high') plan = 'active-receptive-listening-and-rhythmic-entrainment';
  else if (engagement === 'moderate') plan = 'receptive-music-and-song-discussion';
  else if (engagement === 'low') plan = 'gentle-passive-music-listening-environmental';
  else plan = 'assess-barriers-to-engagement';
  let population;
  if (age < 5) population = 'neonatal-pediatric-music-therapy';
  else if (age < 18) population = 'child-adolescent-music-therapy';
  else if (age >= 65) population = 'geriatric-music-therapy';
  else population = 'adult-music-therapy';
  return { plan, population, recommendation: `music-therapy-for-${diagnosis}-${goals}` };
};

Engine.RhythmicEntrainment = function ({ activity = 'gait-training', bpm = 110, motorPattern = 'normal', cognitiveLoad = 'low' } = {}) {
  let prescription;
  if (activity === 'gait-training' && motorPattern === 'normal') prescription = `RAS-gait-cadence-${bpm}-bpm`;
  else if (activity === 'gait-training' && motorPattern === 'hemiparetic') prescription = `RAS-gait-cadence-${bpm}-bpm-cueing-with-metronome`;
  else if (activity === 'upper-extremity') prescription = `bi-manual-rhythmic-${bpm}-bpm-task`;
  else if (activity === 'speech') prescription = `melodic-intonation-therapy-${bpm}-bpm`;
  else if (activity === 'pain') prescription = `low-frequency-rhythmic-40-to-60-bpm-sedative`;
  else prescription = 'rhythmic-entrainment-not-applicable';
  return { prescription, recommendation: '10-to-30-min-daily-or-PRN' };
};

Engine.NeuroMusicTherapy = function ({ deficit = 'apraxia-of-speech', technique = 'MIT', severity = 'moderate' } = {}) {
  let protocol;
  if (deficit === 'apraxia-of-speech') protocol = 'MIT-or-Speech-Music-therapy-for-AOS';
  else if (deficit === 'aphasia' && technique === 'MIT') protocol = 'MIT-melodic-intonation-therapy';
  else if (deficit === 'aphasia' && technique === 'Singing') protocol = 'singing-as-language-rehearsal';
  else if (deficit === 'neglect') protocol = 'musical-neglect-training-active-instrument';
  else if (deficit === 'Parkinson') protocol = 'RAS-Rhythmic-Auditory-Stimulation-gait';
  else if (deficit === 'memory') protocol = 'reminiscence-music-and-autobiographical';
  else if (deficit === 'consciousness') protocol = 'preferred-music-stimulation-DOC';
  else protocol = 'standard-NMT-protocol';
  let intensity;
  if (severity === 'mild') intensity = '2-to-3-sessions-per-week';
  else if (severity === 'moderate') intensity = '3-to-5-sessions-per-week';
  else intensity = '5-to-7-sessions-per-week-intensive';
  return { protocol, intensity, recommendation: `${protocol}-${intensity}` };
};

Engine.MusicPain = function ({ painScore = 5, anxiety = 'moderate', procedure = 'wound-care', musicPref = 'patient-preferred' } = {}) {
  let plan;
  if (musicPref === 'patient-preferred' && painScore >= 4) plan = 'patient-preferred-music-listening-30-min';
  else if (anxiety === 'severe') plan = 'live-music-and-guided-imagery';
  else if (procedure === 'wound-care' || procedure === 'surgical') plan = 'patient-preferred-music-during-procedure';
  else if (painScore >= 7) plan = 'music-combined-with-pharmacologic-analgesia';
  else if (painScore >= 4) plan = 'music-listening-3-to-4-times-daily';
  else plan = 'maintenance-and-as-needed';
  return { plan, recommendation: plan.includes('pharmacologic') ? 'multi-modal-pain-control' : 'music-therapy-as-adjunct' };
};

Engine.PediatricMusic = function ({ age = 8, indication = 'procedural-anxiety', developmental = 'typical', parentAvailable = true } = {}) {
  let plan;
  if (age < 2) plan = 'infant-directed-singing-and-lullaby';
  else if (age < 5 && developmental === 'typical') plan = 'active-music-play-and-instrument-exploration';
  else if (age < 12 && parentAvailable) plan = 'family-centered-music-therapy';
  else if (indication === 'procedural-anxiety') plan = 'music-distraction-and-coping';
  else if (indication === 'palliative-care') plan = 'legacy-building-and-songwriting';
  else plan = 'standard-pediatric-music-therapy';
  return { plan, recommendation: `${plan}-30-to-45-min-weekly` };
};

Engine.MusicPalliative = function ({ goals = 'legacy', lucidity = 'full', family = 'engaged', symptoms = 'pain-anxiety' } = {}) {
  let plan;
  if (goals === 'legacy' && lucidity === 'full') plan = 'songwriting-legacy-project-or-life-review-song';
  else if (goals === 'comfort' && symptoms.includes('pain')) plan = 'live-music-and-music-assisted-relaxation';
  else if (goals === 'spiritual') plan = 'hymns-or-spiritual-music-and-familial-singing';
  else if (family === 'engaged' && lucidity !== 'full') plan = 'preferred-music-for-comfort-and-family-presence';
  else plan = 'receptive-music-and-silence-as-needed';
  return { plan, recommendation: 'MT-BC-and-palliative-team' };
};

Engine.MusicInpatient = function ({ setting = 'ICU', indication = 'delirium', depth = 'agitated' } = {}) {
  let plan;
  if (setting === 'ICU' && indication === 'delirium' && depth === 'agitated') plan = 'preferred-music-30-to-60-min-and-orienting-cues';
  else if (setting === 'ICU' && indication === 'delirium') plan = 'calm-preferred-music-twice-daily';
  else if (setting === 'cardiac') plan = 'sedative-music-pre-procedure-and-recovery';
  else if (setting === 'oncology' && indication === 'anxiety') plan = 'songwriting-or-receptive-music-during-chemo';
  else if (setting === 'NICU') plan = 'parent-lullaby-and-l的声音-stimulation';
  else if (setting === 'burn') plan = 'active-music-and-procedural-support';
  else plan = 'standard-inpatient-music-therapy';
  return { plan, recommendation: `${plan}-daily` };
};

Engine.MusicPsychiatric = function ({ diagnosis = 'schizophrenia', symptoms = 'auditory-hallucinations', engagement = 'moderate' } = {}) {
  let plan;
  if (diagnosis === 'schizophrenia' && symptoms === 'auditory-hallucinations') plan = 'active-music-making-and-songwriting-to-replace-voice';
  else if (diagnosis === 'PTSD' && engagement === 'moderate') plan = 'group-music-and-GIM-guided-imagery-music';
  else if (diagnosis === 'depression') plan = 'preferred-music-and-active-songwriting';
  else if (diagnosis === 'anxiety') plan = 'live-music-and-breathing-entrainment';
  else if (diagnosis === 'substance-use') plan = 'songwriting-and-drumming-group';
  else plan = 'standard-psychiatric-music-therapy';
  return { plan, recommendation: 'MT-BC-and-psych-team-coordinated' };
};

Engine.MusicDosing = function ({ activeMinutes = 30, receptiveMinutes = 30, sessionsPerWeek = 3, duration = 8 } = {}) {
  const totalWeeklyMin = (activeMinutes + receptiveMinutes) * sessionsPerWeek;
  let intensity;
  if (totalWeeklyMin >= 240) intensity = 'intensive-music-therapy';
  else if (totalWeeklyMin >= 120) intensity = 'standard-music-therapy';
  else if (totalWeeklyMin >= 60) intensity = 'maintenance-music-therapy';
  else intensity = 'supportive-music-listening';
  return { totalWeeklyMin, intensity, recommendation: `${intensity}-${duration}-weeks` };
};

Engine.MusicOutcome = function ({ preScore = 60, postScore = 45, scale = 'pain-VAS', weeksElapsed = 6 } = {}) {
  const delta = preScore - postScore;
  const pctChange = (delta / preScore) * 100;
  let result;
  if (pctChange >= 50) result = 'large-effect-music-therapy';
  else if (pctChange >= 30) result = 'moderate-effect-music-therapy';
  else if (pctChange >= 15) result = 'small-but-clinically-meaningful-effect';
  else if (pctChange >= 5) result = 'minimal-effect-continue-or-modify';
  else if (pctChange < 0) result = 'no-improvement-reassess-goals';
  return { preScore, postScore, delta, pctChange: Math.round(pctChange), result, recommendation: result.includes('large') || result.includes('moderate') ? 'continue-and-taper' : 'modify-protocol' };
};

module.exports = Engine;
