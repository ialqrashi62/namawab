// P3_EK pcc_pediatric_sleep_engine v3.101.0
'use strict';
function PediatricSleepApnea(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricSleepApnea-none';
  if (t === 'yes') plan = 'pediatricSleepApnea-protocol';
  return { plan, t };
}
function PediatricInsomnia(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricInsomnia-none';
  if (t === 'yes') plan = 'pediatricInsomnia-protocol';
  return { plan, t };
}
function PediatricNarcolepsy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricNarcolepsy-none';
  if (t === 'yes') plan = 'pediatricNarcolepsy-protocol';
  return { plan, t };
}
function PediatricParasomnias(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricParasomnias-none';
  if (t === 'yes') plan = 'pediatricParasomnias-protocol';
  return { plan, t };
}
function PediatricCircadianDisorder(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricCircadianDisorder-none';
  if (t === 'yes') plan = 'pediatricCircadianDisorder-protocol';
  return { plan, t };
}
function PediatricRestlessLeg(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricRestlessLeg-none';
  if (t === 'yes') plan = 'pediatricRestlessLeg-protocol';
  return { plan, t };
}
function PediatricSleepDisorderedBreathing(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricSleepDisorderedBreathing-none';
  if (t === 'yes') plan = 'pediatricSleepDisorderedBreathing-protocol';
  return { plan, t };
}
function PediatricNightTerrors(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricNightTerrors-none';
  if (t === 'yes') plan = 'pediatricNightTerrors-protocol';
  return { plan, t };
}
function PediatricBedwetting(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricBedwetting-none';
  if (t === 'yes') plan = 'pediatricBedwetting-protocol';
  return { plan, t };
}
function PediatricSleepHygiene(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricSleepHygiene-none';
  if (t === 'yes') plan = 'pediatricSleepHygiene-protocol';
  return { plan, t };
}
module.exports = { PediatricSleepApnea, PediatricInsomnia, PediatricNarcolepsy, PediatricParasomnias, PediatricCircadianDisorder, PediatricRestlessLeg, PediatricSleepDisorderedBreathing, PediatricNightTerrors, PediatricBedwetting, PediatricSleepHygiene };
