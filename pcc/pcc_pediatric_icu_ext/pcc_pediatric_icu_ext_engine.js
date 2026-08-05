// P3_EN pcc_pediatric_icu_ext_engine v3.104.0
'use strict';
function PediatricShock(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricShock-none';
  if (t === 'yes') plan = 'pediatricShock-protocol';
  return { plan, t };
}
function PediatricARDS(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricARDS-none';
  if (t === 'yes') plan = 'pediatricARDS-protocol';
  return { plan, t };
}
function PediatricSepsisBundle(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricSepsisBundle-none';
  if (t === 'yes') plan = 'pediatricSepsisBundle-protocol';
  return { plan, t };
}
function PediatricStatusEpilepticus(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricStatusEpilepticus-none';
  if (t === 'yes') plan = 'pediatricStatusEpilepticus-protocol';
  return { plan, t };
}
function PediatricHypertensiveEmergency(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricHypertensiveEmergency-none';
  if (t === 'yes') plan = 'pediatricHypertensiveEmergency-protocol';
  return { plan, t };
}
function PediatricDKA(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricDKA-none';
  if (t === 'yes') plan = 'pediatricDKA-protocol';
  return { plan, t };
}
function PediatricTraumaResuscitation(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricTraumaResuscitation-none';
  if (t === 'yes') plan = 'pediatricTraumaResuscitation-protocol';
  return { plan, t };
}
function PediatricBurnMgmt(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricBurnMgmt-none';
  if (t === 'yes') plan = 'pediatricBurnMgmt-protocol';
  return { plan, t };
}
function PediatricToxicology(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricToxicology-none';
  if (t === 'yes') plan = 'pediatricToxicology-protocol';
  return { plan, t };
}
function PediatricPostCardiacArrest(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricPostCardiacArrest-none';
  if (t === 'yes') plan = 'pediatricPostCardiacArrest-protocol';
  return { plan, t };
}
module.exports = { PediatricShock, PediatricARDS, PediatricSepsisBundle, PediatricStatusEpilepticus, PediatricHypertensiveEmergency, PediatricDKA, PediatricTraumaResuscitation, PediatricBurnMgmt, PediatricToxicology, PediatricPostCardiacArrest };
