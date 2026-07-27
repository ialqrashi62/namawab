// P3-EV pcc_pediatric_neuro_ext2_engine v3.112.0
'use strict';
function PediatricFebrileSeizure(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricFebrileSeizure-none';
  if (t === 'yes') plan = 'pediatricFebrileSeizure-protocol';
  return { plan, t };
}
function PediatricStatusEpilepticusExt(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricStatusEpilepticusExt-none';
  if (t === 'yes') plan = 'pediatricStatusEpilepticusExt-protocol';
  return { plan, t };
}
function PediatricEpilepsySyndrome(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricEpilepsySyndrome-none';
  if (t === 'yes') plan = 'pediatricEpilepsySyndrome-protocol';
  return { plan, t };
}
function PediatricLennoxGastaut(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricLennoxGastaut-none';
  if (t === 'yes') plan = 'pediatricLennoxGastaut-protocol';
  return { plan, t };
}
function PediatricWestSyndrome(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricWestSyndrome-none';
  if (t === 'yes') plan = 'pediatricWestSyndrome-protocol';
  return { plan, t };
}
function PediatricDravet(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricDravet-none';
  if (t === 'yes') plan = 'pediatricDravet-protocol';
  return { plan, t };
}
function PediatricDooseSyndrome(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricDooseSyndrome-none';
  if (t === 'yes') plan = 'pediatricDooseSyndrome-protocol';
  return { plan, t };
}
function PediatricLandauKleffner(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricLandauKleffner-none';
  if (t === 'yes') plan = 'pediatricLandauKleffner-protocol';
  return { plan, t };
}
function PediatricCSWSSyndrome(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricCSWSSyndrome-none';
  if (t === 'yes') plan = 'pediatricCSWSSyndrome-protocol';
  return { plan, t };
}
function PediatricEpilepsySurgeryEval(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricEpilepsySurgeryEval-none';
  if (t === 'yes') plan = 'pediatricEpilepsySurgeryEval-protocol';
  return { plan, t };
}
module.exports = { PediatricFebrileSeizure, PediatricStatusEpilepticusExt, PediatricEpilepsySyndrome, PediatricLennoxGastaut, PediatricWestSyndrome, PediatricDravet, PediatricDooseSyndrome, PediatricLandauKleffner, PediatricCSWSSyndrome, PediatricEpilepsySurgeryEval };
