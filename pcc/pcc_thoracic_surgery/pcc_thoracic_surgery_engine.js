// P3_DK pcc_thoracic_surgery_engine v3.75.0
'use strict';
function ThoracotomyRisk(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'thoracotomyrisk-none';
  if (t === 'yes') plan = 'thoracotomyrisk-protocol';
  return { plan, t };
}
function VatsEligibility(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'vatseligibility-none';
  if (t === 'yes') plan = 'vatseligibility-protocol';
  return { plan, t };
}
function LobectomyAssessment(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'lobectomyassessment-none';
  if (t === 'yes') plan = 'lobectomyassessment-protocol';
  return { plan, t };
}
function ChestTubeProtocol(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'chesttubeprotocol-none';
  if (t === 'yes') plan = 'chesttubeprotocol-protocol';
  return { plan, t };
}
function PneumothoraxManagement(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pneumothoraxmanagement-none';
  if (t === 'yes') plan = 'pneumothoraxmanagement-protocol';
  return { plan, t };
}
function PleuralEffusionPlan(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pleuraleffusionplan-none';
  if (t === 'yes') plan = 'pleuraleffusionplan-protocol';
  return { plan, t };
}
function MediastinalMassWorkup(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'mediastinalmassworkup-none';
  if (t === 'yes') plan = 'mediastinalmassworkup-protocol';
  return { plan, t };
}
function ThoracicTraumaTriage(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'thoracictraumatriage-none';
  if (t === 'yes') plan = 'thoracictraumatriage-protocol';
  return { plan, t };
}
function EsophagealSurgeryPrep(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'esophagealsurgeryprep-none';
  if (t === 'yes') plan = 'esophagealsurgeryprep-protocol';
  return { plan, t };
}
function PostThoracotomyCare(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'postthoracotomycare-none';
  if (t === 'yes') plan = 'postthoracotomycare-protocol';
  return { plan, t };
}
module.exports = {
  ThoracotomyRisk, VatsEligibility, LobectomyAssessment, ChestTubeProtocol, PneumothoraxManagement, PleuralEffusionPlan, MediastinalMassWorkup, ThoracicTraumaTriage, EsophagealSurgeryPrep, PostThoracotomyCare
};
