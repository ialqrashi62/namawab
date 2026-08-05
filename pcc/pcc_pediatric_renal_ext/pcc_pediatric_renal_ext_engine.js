// P3_EQ pcc_pediatric_renal_ext_engine v3.107.0
'use strict';
function PediatricAKI(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricAKI-none';
  if (t === 'yes') plan = 'pediatricAKI-protocol';
  return { plan, t };
}
function PediatricCKDEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricCKDEval-none';
  if (t === 'yes') plan = 'pediatricCKDEval-protocol';
  return { plan, t };
}
function PediatricNS(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricNS-none';
  if (t === 'yes') plan = 'pediatricNS-protocol';
  return { plan, t };
}
function PediatricHUS(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricHUS-none';
  if (t === 'yes') plan = 'pediatricHUS-protocol';
  return { plan, t };
}
function PediatricRPGN(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricRPGN-none';
  if (t === 'yes') plan = 'pediatricRPGN-protocol';
  return { plan, t };
}
function PediatricUTIExt(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricUTIExt-none';
  if (t === 'yes') plan = 'pediatricUTIExt-protocol';
  return { plan, t };
}
function PediatricVUR(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricVUR-none';
  if (t === 'yes') plan = 'pediatricVUR-protocol';
  return { plan, t };
}
function PediatricRenalTubularAcidosis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricRenalTubularAcidosis-none';
  if (t === 'yes') plan = 'pediatricRenalTubularAcidosis-protocol';
  return { plan, t };
}
function PediatricBartterSyndrome(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricBartterSyndrome-none';
  if (t === 'yes') plan = 'pediatricBartterSyndrome-protocol';
  return { plan, t };
}
function PediatricGitelmanSyndrome(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricGitelmanSyndrome-none';
  if (t === 'yes') plan = 'pediatricGitelmanSyndrome-protocol';
  return { plan, t };
}
module.exports = { PediatricAKI, PediatricCKDEval, PediatricNS, PediatricHUS, PediatricRPGN, PediatricUTIExt, PediatricVUR, PediatricRenalTubularAcidosis, PediatricBartterSyndrome, PediatricGitelmanSyndrome };
