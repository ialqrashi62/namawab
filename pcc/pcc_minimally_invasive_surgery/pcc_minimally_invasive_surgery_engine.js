// P3_DX pcc_minimally_invasive_surgery_engine v3.88.0
'use strict';
function LaparoscopicCholecystectomy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'laparoscopicCholecystectomy-none';
  if (t === 'yes') plan = 'laparoscopicCholecystectomy-protocol';
  return { plan, t };
}
function RoboticProstatectomyIndication(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'roboticProstatectomyIndication-none';
  if (t === 'yes') plan = 'roboticProstatectomyIndication-protocol';
  return { plan, t };
}
function LaparoscopicHerniaRepair(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'laparoscopicHerniaRepair-none';
  if (t === 'yes') plan = 'laparoscopicHerniaRepair-protocol';
  return { plan, t };
}
function ThoracoscopicLobectomy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'thoracoscopicLobectomy-none';
  if (t === 'yes') plan = 'thoracoscopicLobectomy-protocol';
  return { plan, t };
}
function EndoscopicSinusSurgery(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'endoscopicSinusSurgery-none';
  if (t === 'yes') plan = 'endoscopicSinusSurgery-protocol';
  return { plan, t };
}
function LaparoscopicColonResection(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'laparoscopicColonResection-none';
  if (t === 'yes') plan = 'laparoscopicColonResection-protocol';
  return { plan, t };
}
function RoboticHysterectomy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'roboticHysterectomy-none';
  if (t === 'yes') plan = 'roboticHysterectomy-protocol';
  return { plan, t };
}
function NOTESProcedureSelection(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'nOTESProcedureSelection-none';
  if (t === 'yes') plan = 'nOTESProcedureSelection-protocol';
  return { plan, t };
}
function LaparoscopicNephrectomy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'laparoscopicNephrectomy-none';
  if (t === 'yes') plan = 'laparoscopicNephrectomy-protocol';
  return { plan, t };
}
function MISPatientSelectionCriteria(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'mISPatientSelectionCriteria-none';
  if (t === 'yes') plan = 'mISPatientSelectionCriteria-protocol';
  return { plan, t };
}
module.exports = { LaparoscopicCholecystectomy, RoboticProstatectomyIndication, LaparoscopicHerniaRepair, ThoracoscopicLobectomy, EndoscopicSinusSurgery, LaparoscopicColonResection, RoboticHysterectomy, NOTESProcedureSelection, LaparoscopicNephrectomy, MISPatientSelectionCriteria };
