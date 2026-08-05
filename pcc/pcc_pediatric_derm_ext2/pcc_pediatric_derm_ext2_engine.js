// P3_EU pcc_pediatric_derm_ext2_engine v3.111.0
'use strict';
function PediatricGenodermatoses(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricGenodermatoses-none';
  if (t === 'yes') plan = 'pediatricGenodermatoses-protocol';
  return { plan, t };
}
function PediatricIchthyosis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricIchthyosis-none';
  if (t === 'yes') plan = 'pediatricIchthyosis-protocol';
  return { plan, t };
}
function PediatricEB(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricEB-none';
  if (t === 'yes') plan = 'pediatricEB-protocol';
  return { plan, t };
}
function PediatricCutisLaxa(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricCutisLaxa-none';
  if (t === 'yes') plan = 'pediatricCutisLaxa-protocol';
  return { plan, t };
}
function PediatricEhlersDanlos(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricEhlersDanlos-none';
  if (t === 'yes') plan = 'pediatricEhlersDanlos-protocol';
  return { plan, t };
}
function PediatricMarfan(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricMarfan-none';
  if (t === 'yes') plan = 'pediatricMarfan-protocol';
  return { plan, t };
}
function PediatricNeurofibromatosisSkin(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricNeurofibromatosisSkin-none';
  if (t === 'yes') plan = 'pediatricNeurofibromatosisSkin-protocol';
  return { plan, t };
}
function PediatricTSCSutscutaneous(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricTSCSutscutaneous-none';
  if (t === 'yes') plan = 'pediatricTSCSutscutaneous-protocol';
  return { plan, t };
}
function PediatricXP(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricXP-none';
  if (t === 'yes') plan = 'pediatricXP-protocol';
  return { plan, t };
}
function PediatricPorphyrias(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricPorphyrias-none';
  if (t === 'yes') plan = 'pediatricPorphyrias-protocol';
  return { plan, t };
}
module.exports = { PediatricGenodermatoses, PediatricIchthyosis, PediatricEB, PediatricCutisLaxa, PediatricEhlersDanlos, PediatricMarfan, PediatricNeurofibromatosisSkin, PediatricTSCSutscutaneous, PediatricXP, PediatricPorphyrias };
