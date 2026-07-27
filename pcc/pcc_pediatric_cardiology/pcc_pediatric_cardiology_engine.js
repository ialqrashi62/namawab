// P3-EC pcc_pediatric_cardiology_engine v3.93.0
'use strict';
function CongenitalHeartDiseaseAssessment(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'congenitalHeartDiseaseAssessment-none';
  if (t === 'yes') plan = 'congenitalHeartDiseaseAssessment-protocol';
  return { plan, t };
}
function PediatricECGInterpretation(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricECGInterpretation-none';
  if (t === 'yes') plan = 'pediatricECGInterpretation-protocol';
  return { plan, t };
}
function KawasakiDiseaseManagement(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'kawasakiDiseaseManagement-none';
  if (t === 'yes') plan = 'kawasakiDiseaseManagement-protocol';
  return { plan, t };
}
function PediatricEchocardiography(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricEchocardiography-none';
  if (t === 'yes') plan = 'pediatricEchocardiography-protocol';
  return { plan, t };
}
function PediatricHeartFailure(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricHeartFailure-none';
  if (t === 'yes') plan = 'pediatricHeartFailure-protocol';
  return { plan, t };
}
function TetralogyOfFallot(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'tetralogyOfFallot-none';
  if (t === 'yes') plan = 'tetralogyOfFallot-protocol';
  return { plan, t };
}
function VSDManagement(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'vSDManagement-none';
  if (t === 'yes') plan = 'vSDManagement-protocol';
  return { plan, t };
}
function AtrialSeptalDefectClosure(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'atrialSeptalDefectClosure-none';
  if (t === 'yes') plan = 'atrialSeptalDefectClosure-protocol';
  return { plan, t };
}
function PediatricArrhythmia(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pediatricArrhythmia-none';
  if (t === 'yes') plan = 'pediatricArrhythmia-protocol';
  return { plan, t };
}
function FontanCirculationManagement(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'fontanCirculationManagement-none';
  if (t === 'yes') plan = 'fontanCirculationManagement-protocol';
  return { plan, t };
}
module.exports = { CongenitalHeartDiseaseAssessment, PediatricECGInterpretation, KawasakiDiseaseManagement, PediatricEchocardiography, PediatricHeartFailure, TetralogyOfFallot, VSDManagement, AtrialSeptalDefectClosure, PediatricArrhythmia, FontanCirculationManagement };
