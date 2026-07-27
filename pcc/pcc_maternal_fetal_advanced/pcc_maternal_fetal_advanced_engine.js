// P3-DR pcc_maternal_fetal_advanced_engine v3.82.0
'use strict';
function FetalGrowthRestriction(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'fetalgrowthrestriction-none';
  if (t === 'yes') plan = 'fetalgrowthrestriction-protocol';
  return { plan, t };
}
function TwinTwinTransfusion(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'twintwintransfusion-none';
  if (t === 'yes') plan = 'twintwintransfusion-protocol';
  return { plan, t };
}
function FetalAnemia(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'fetalanemia-none';
  if (t === 'yes') plan = 'fetalanemia-protocol';
  return { plan, t };
}
function FetalArrhythmia(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'fetalarrhythmia-none';
  if (t === 'yes') plan = 'fetalarrhythmia-protocol';
  return { plan, t };
}
function CongenitalInfections(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'congenitalinfections-none';
  if (t === 'yes') plan = 'congenitalinfections-protocol';
  return { plan, t };
}
function RedCellAlloimmunization(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'redcellalloimmunization-none';
  if (t === 'yes') plan = 'redcellalloimmunization-protocol';
  return { plan, t };
}
function PretermLaborTocolysis(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pretermlabortocolysis-none';
  if (t === 'yes') plan = 'pretermlabortocolysis-protocol';
  return { plan, t };
}
function CervicalInsufficiency(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'cervicalinsufficiency-none';
  if (t === 'yes') plan = 'cervicalinsufficiency-protocol';
  return { plan, t };
}
function MaternalCardiacDisease(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'maternalcardiacdisease-none';
  if (t === 'yes') plan = 'maternalcardiacdisease-protocol';
  return { plan, t };
}
function MaternalRenalDisease(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'maternalrenaldisease-none';
  if (t === 'yes') plan = 'maternalrenaldisease-protocol';
  return { plan, t };
}
module.exports = {
  FetalGrowthRestriction, TwinTwinTransfusion, FetalAnemia, FetalArrhythmia, CongenitalInfections, RedCellAlloimmunization, PretermLaborTocolysis, CervicalInsufficiency, MaternalCardiacDisease, MaternalRenalDisease
};
