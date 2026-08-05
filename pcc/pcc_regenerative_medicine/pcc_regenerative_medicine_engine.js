// P3_DB pcc_regenerative_medicine_engine v3.66.0
'use strict';
function StemCellTherapy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'stemcelltherapy-none';
  if (t === 'yes') plan = 'stemcelltherapy-protocol';
  return { plan, t };
}
function PRPInjection(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'prpinjection-none';
  if (t === 'yes') plan = 'prpinjection-protocol';
  return { plan, t };
}
function ExosomeTherapy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'exosometherapy-none';
  if (t === 'yes') plan = 'exosometherapy-protocol';
  return { plan, t };
}
function CartilageRegeneration(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'cartilageregeneration-none';
  if (t === 'yes') plan = 'cartilageregeneration-protocol';
  return { plan, t };
}
function TissueEngineering(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'tissueengineering-none';
  if (t === 'yes') plan = 'tissueengineering-protocol';
  return { plan, t };
}
function CellularReprogramming(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'cellularreprogramming-none';
  if (t === 'yes') plan = 'cellularreprogramming-protocol';
  return { plan, t };
}
function GeneEditing(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'geneediting-none';
  if (t === 'yes') plan = 'geneediting-protocol';
  return { plan, t };
}
function ImmuneReset(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'immunereset-none';
  if (t === 'yes') plan = 'immunereset-protocol';
  return { plan, t };
}
function WoundRegeneration(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'woundregeneration-none';
  if (t === 'yes') plan = 'woundregeneration-protocol';
  return { plan, t };
}
function AntiAging(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'antiaging-none';
  if (t === 'yes') plan = 'antiaging-protocol';
  return { plan, t };
}
module.exports = {
  StemCellTherapy, PRPInjection, ExosomeTherapy, CartilageRegeneration, TissueEngineering, CellularReprogramming, GeneEditing, ImmuneReset, WoundRegeneration, AntiAging
};
