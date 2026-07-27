// P3-DI pcc_vascular_health_engine v3.73.0
'use strict';
function VenousInsufficiency(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'venousinsufficiency-none';
  if (t === 'yes') plan = 'venousinsufficiency-protocol';
  return { plan, t };
}
function PeripheralArtery(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'peripheralartery-none';
  if (t === 'yes') plan = 'peripheralartery-protocol';
  return { plan, t };
}
function AorticHealth(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'aortichealth-none';
  if (t === 'yes') plan = 'aortichealth-protocol';
  return { plan, t };
}
function Microcirculation(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'microcirculation-none';
  if (t === 'yes') plan = 'microcirculation-protocol';
  return { plan, t };
}
function VascularInflammation(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'vascularinflammation-none';
  if (t === 'yes') plan = 'vascularinflammation-protocol';
  return { plan, t };
}
function EndothelialRepair(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'endothelialrepair-none';
  if (t === 'yes') plan = 'endothelialrepair-protocol';
  return { plan, t };
}
function CompressionTherapy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'compressiontherapy-none';
  if (t === 'yes') plan = 'compressiontherapy-protocol';
  return { plan, t };
}
function VascularScreening(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'vascularscreening-none';
  if (t === 'yes') plan = 'vascularscreening-protocol';
  return { plan, t };
}
function ClotRisk(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'clotrisk-none';
  if (t === 'yes') plan = 'clotrisk-protocol';
  return { plan, t };
}
function VascularSurgeryPrep(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'vascularsurgeryprep-none';
  if (t === 'yes') plan = 'vascularsurgeryprep-protocol';
  return { plan, t };
}
module.exports = {
  VenousInsufficiency, PeripheralArtery, AorticHealth, Microcirculation, VascularInflammation, EndothelialRepair, CompressionTherapy, VascularScreening, ClotRisk, VascularSurgeryPrep
};
