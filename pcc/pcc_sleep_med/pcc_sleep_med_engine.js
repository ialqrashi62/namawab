// P3-CW pcc_sleep_med_engine v3.61.0
'use strict';
function Ahi(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'ahi-none';
  if (t === 'yes') plan = 'ahi-protocol';
  return { plan, t };
}
function Insomnia(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'insomnia-none';
  if (t === 'yes') plan = 'insomnia-protocol';
  return { plan, t };
}
function Cpap(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'cpap-none';
  if (t === 'yes') plan = 'cpap-protocol';
  return { plan, t };
}
function Daytime(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'daytime-none';
  if (t === 'yes') plan = 'daytime-protocol';
  return { plan, t };
}
function Apnea(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'apnea-none';
  if (t === 'yes') plan = 'apnea-protocol';
  return { plan, t };
}
function Oxygen(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'oxygen-none';
  if (t === 'yes') plan = 'oxygen-protocol';
  return { plan, t };
}
function Restless(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'restless-none';
  if (t === 'yes') plan = 'restless-protocol';
  return { plan, t };
}
function Narcolepsy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'narcolepsy-none';
  if (t === 'yes') plan = 'narcolepsy-protocol';
  return { plan, t };
}
function Parasomnia(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'parasomnia-none';
  if (t === 'yes') plan = 'parasomnia-protocol';
  return { plan, t };
}
function Hypopnea(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'hypopnea-none';
  if (t === 'yes') plan = 'hypopnea-protocol';
  return { plan, t };
}
module.exports = {
  Ahi, Insomnia, Cpap, Daytime, Apnea, Oxygen, Restless, Narcolepsy, Parasomnia, Hypopnea
};
