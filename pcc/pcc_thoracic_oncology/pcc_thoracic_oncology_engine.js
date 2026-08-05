// P3_DZ pcc_thoracic_oncology_engine v3.90.0
'use strict';
function LungCancerStaging(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'lungCancerStaging-none';
  if (t === 'yes') plan = 'lungCancerStaging-protocol';
  return { plan, t };
}
function MediastinalMassWorkup(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'mediastinalMassWorkup-none';
  if (t === 'yes') plan = 'mediastinalMassWorkup-protocol';
  return { plan, t };
}
function MesotheliomaManagement(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'mesotheliomaManagement-none';
  if (t === 'yes') plan = 'mesotheliomaManagement-protocol';
  return { plan, t };
}
function SuperiorSulcusTumor(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'superiorSulcusTumor-none';
  if (t === 'yes') plan = 'superiorSulcusTumor-protocol';
  return { plan, t };
}
function TrachealTumorResection(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'trachealTumorResection-none';
  if (t === 'yes') plan = 'trachealTumorResection-protocol';
  return { plan, t };
}
function ChestWallTumorReconstruction(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'chestWallTumorReconstruction-none';
  if (t === 'yes') plan = 'chestWallTumorReconstruction-protocol';
  return { plan, t };
}
function PancoastTumorProtocol(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pancoastTumorProtocol-none';
  if (t === 'yes') plan = 'pancoastTumorProtocol-protocol';
  return { plan, t };
}
function EndobronchialTumorStent(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'endobronchialTumorStent-none';
  if (t === 'yes') plan = 'endobronchialTumorStent-protocol';
  return { plan, t };
}
function ThymomaStaging(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'thymomaStaging-none';
  if (t === 'yes') plan = 'thymomaStaging-protocol';
  return { plan, t };
}
function LungMetastasectomy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'lungMetastasectomy-none';
  if (t === 'yes') plan = 'lungMetastasectomy-protocol';
  return { plan, t };
}
module.exports = { LungCancerStaging, MediastinalMassWorkup, MesotheliomaManagement, SuperiorSulcusTumor, TrachealTumorResection, ChestWallTumorReconstruction, PancoastTumorProtocol, EndobronchialTumorStent, ThymomaStaging, LungMetastasectomy };
