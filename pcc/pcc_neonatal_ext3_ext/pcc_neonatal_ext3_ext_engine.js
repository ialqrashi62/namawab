// P3_EB pcc_neonatal_ext3_ext_engine v3.92.0
'use strict';
function NICUDischargeReadiness(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'nICUDischargeReadiness-none';
  if (t === 'yes') plan = 'nICUDischargeReadiness-protocol';
  return { plan, t };
}
function NeonatalPainAssessment(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'neonatalPainAssessment-none';
  if (t === 'yes') plan = 'neonatalPainAssessment-protocol';
  return { plan, t };
}
function FamilyCenteredCare(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'familyCenteredCare-none';
  if (t === 'yes') plan = 'familyCenteredCare-protocol';
  return { plan, t };
}
function NICUQualityImprovement(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'nICUQualityImprovement-none';
  if (t === 'yes') plan = 'nICUQualityImprovement-protocol';
  return { plan, t };
}
function NeonatalThermoregulation(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'neonatalThermoregulation-none';
  if (t === 'yes') plan = 'neonatalThermoregulation-protocol';
  return { plan, t };
}
function KangarooCareProtocol(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'kangarooCareProtocol-none';
  if (t === 'yes') plan = 'kangarooCareProtocol-protocol';
  return { plan, t };
}
function NeonatalSkinCare(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'neonatalSkinCare-none';
  if (t === 'yes') plan = 'neonatalSkinCare-protocol';
  return { plan, t };
}
function NICUEquipmentSafety(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'nICUEquipmentSafety-none';
  if (t === 'yes') plan = 'nICUEquipmentSafety-protocol';
  return { plan, t };
}
function NeonatalNeurodevelopment(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'neonatalNeurodevelopment-none';
  if (t === 'yes') plan = 'neonatalNeurodevelopment-protocol';
  return { plan, t };
}
function NICULongTermFollowUp(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'nICULongTermFollowUp-none';
  if (t === 'yes') plan = 'nICULongTermFollowUp-protocol';
  return { plan, t };
}
module.exports = { NICUDischargeReadiness, NeonatalPainAssessment, FamilyCenteredCare, NICUQualityImprovement, NeonatalThermoregulation, KangarooCareProtocol, NeonatalSkinCare, NICUEquipmentSafety, NeonatalNeurodevelopment, NICULongTermFollowUp };
