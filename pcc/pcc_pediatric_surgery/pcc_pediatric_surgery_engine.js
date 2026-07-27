// P3-DW pcc_pediatric_surgery_engine v3.87.0
'use strict';
function PediatricAppendectomyIndication(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricAppendectomyIndication-none';
  if (t === 'yes') plan = 'pediatricAppendectomyIndication-protocol';
  return { plan, t };
}
function PyloricStenosisPyloromyotomy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pyloricStenosisPyloromyotomy-none';
  if (t === 'yes') plan = 'pyloricStenosisPyloromyotomy-protocol';
  return { plan, t };
}
function PediatricHerniaRepair(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricHerniaRepair-none';
  if (t === 'yes') plan = 'pediatricHerniaRepair-protocol';
  return { plan, t };
}
function IntussusceptionReduction(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'intussusceptionReduction-none';
  if (t === 'yes') plan = 'intussusceptionReduction-protocol';
  return { plan, t };
}
function PediatricCircumcision(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricCircumcision-none';
  if (t === 'yes') plan = 'pediatricCircumcision-protocol';
  return { plan, t };
}
function PediatricTonsillectomy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricTonsillectomy-none';
  if (t === 'yes') plan = 'pediatricTonsillectomy-protocol';
  return { plan, t };
}
function PediatricCholecystectomy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricCholecystectomy-none';
  if (t === 'yes') plan = 'pediatricCholecystectomy-protocol';
  return { plan, t };
}
function PediatricBowelObstruction(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricBowelObstruction-none';
  if (t === 'yes') plan = 'pediatricBowelObstruction-protocol';
  return { plan, t };
}
function PediatricTracheostomy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricTracheostomy-none';
  if (t === 'yes') plan = 'pediatricTracheostomy-protocol';
  return { plan, t };
}
function PediatricChestWallDeformity(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricChestWallDeformity-none';
  if (t === 'yes') plan = 'pediatricChestWallDeformity-protocol';
  return { plan, t };
}
module.exports = { PediatricAppendectomyIndication, PyloricStenosisPyloromyotomy, PediatricHerniaRepair, IntussusceptionReduction, PediatricCircumcision, PediatricTonsillectomy, PediatricCholecystectomy, PediatricBowelObstruction, PediatricTracheostomy, PediatricChestWallDeformity };
