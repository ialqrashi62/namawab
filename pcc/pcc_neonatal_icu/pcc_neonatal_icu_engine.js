// P3-DU pcc_neonatal_icu_engine v3.85.0
'use strict';
function NICUAdmissionCriteria(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'nICUAdmissionCriteria-none';
  if (t === 'yes') plan = 'nICUAdmissionCriteria-protocol';
  return { plan, t };
}
function ThermoregulationProtocol(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'thermoregulationProtocol-none';
  if (t === 'yes') plan = 'thermoregulationProtocol-protocol';
  return { plan, t };
}
function NeonatalVentilation(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'neonatalVentilation-none';
  if (t === 'yes') plan = 'neonatalVentilation-protocol';
  return { plan, t };
}
function TPNNeonatal(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'tPNNeonatal-none';
  if (t === 'yes') plan = 'tPNNeonatal-protocol';
  return { plan, t };
}
function NeonatalSepsisKaiser(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'neonatalSepsisKaiser-none';
  if (t === 'yes') plan = 'neonatalSepsisKaiser-protocol';
  return { plan, t };
}
function BronchopulmonaryDysplasia(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'bronchopulmonaryDysplasia-none';
  if (t === 'yes') plan = 'bronchopulmonaryDysplasia-protocol';
  return { plan, t };
}
function IVHPremature(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'iVHPremature-none';
  if (t === 'yes') plan = 'iVHPremature-protocol';
  return { plan, t };
}
function ROPExamSchedule(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'rOPExamSchedule-none';
  if (t === 'yes') plan = 'rOPExamSchedule-protocol';
  return { plan, t };
}
function NeonatalSeizureWorkup(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'neonatalSeizureWorkup-none';
  if (t === 'yes') plan = 'neonatalSeizureWorkup-protocol';
  return { plan, t };
}
function CongenitalHeartDuctus(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'congenitalHeartDuctus-none';
  if (t === 'yes') plan = 'congenitalHeartDuctus-protocol';
  return { plan, t };
}
module.exports = { NICUAdmissionCriteria, ThermoregulationProtocol, NeonatalVentilation, TPNNeonatal, NeonatalSepsisKaiser, BronchopulmonaryDysplasia, IVHPremature, ROPExamSchedule, NeonatalSeizureWorkup, CongenitalHeartDuctus };
