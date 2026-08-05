// P3_DJ pcc_sleep_disorders_engine v3.74.0
'use strict';
function SleepApnea(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'sleepapnea-none';
  if (t === 'yes') plan = 'sleepapnea-protocol';
  return { plan, t };
}
function InsomniaCBT(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'insomniacbt-none';
  if (t === 'yes') plan = 'insomniacbt-protocol';
  return { plan, t };
}
function CircadianRhythm(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'circadianrhythm-none';
  if (t === 'yes') plan = 'circadianrhythm-protocol';
  return { plan, t };
}
function RestlessLegs(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'restlesslegs-none';
  if (t === 'yes') plan = 'restlesslegs-protocol';
  return { plan, t };
}
function Narcolepsy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'narcolepsy-none';
  if (t === 'yes') plan = 'narcolepsy-protocol';
  return { plan, t };
}
function Parasomnias(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'parasomnias-none';
  if (t === 'yes') plan = 'parasomnias-protocol';
  return { plan, t };
}
function Hypersomnia(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'hypersomnia-none';
  if (t === 'yes') plan = 'hypersomnia-protocol';
  return { plan, t };
}
function SleepHygieneAdvanced(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'sleephygieneadvanced-none';
  if (t === 'yes') plan = 'sleephygieneadvanced-protocol';
  return { plan, t };
}
function CPAPTitration(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'cpaptitration-none';
  if (t === 'yes') plan = 'cpaptitration-protocol';
  return { plan, t };
}
function SleepSurgery(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'sleepsurgery-none';
  if (t === 'yes') plan = 'sleepsurgery-protocol';
  return { plan, t };
}
module.exports = {
  SleepApnea, InsomniaCBT, CircadianRhythm, RestlessLegs, Narcolepsy, Parasomnias, Hypersomnia, SleepHygieneAdvanced, CPAPTitration, SleepSurgery
};
