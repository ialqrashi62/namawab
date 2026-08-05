// P3_DK pcc_respiratory_therapy_engine v3.75.0
'use strict';
function AerosolTherapy(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'aerosoltherapy-none';
  if (t === 'yes') plan = 'aerosoltherapy-protocol';
  return { plan, t };
}
function MechanicalVentilationWean(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'mechanicalventilationwean-none';
  if (t === 'yes') plan = 'mechanicalventilationwean-protocol';
  return { plan, t };
}
function NonInvasiveVentilation(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'noninvasiveventilation-none';
  if (t === 'yes') plan = 'noninvasiveventilation-protocol';
  return { plan, t };
}
function HighFlowNasalCannula(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'highflownasalcannula-none';
  if (t === 'yes') plan = 'highflownasalcannula-protocol';
  return { plan, t };
}
function ArterialBloodGasInterpret(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'arterialbloodgasinterpret-none';
  if (t === 'yes') plan = 'arterialbloodgasinterpret-protocol';
  return { plan, t };
}
function BronchoscopyPrep(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'bronchoscopyprep-none';
  if (t === 'yes') plan = 'bronchoscopyprep-protocol';
  return { plan, t };
}
function SputumInduction(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'sputuminduction-none';
  if (t === 'yes') plan = 'sputuminduction-protocol';
  return { plan, t };
}
function PulmonaryFunctionTestPrep(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pulmonaryfunctiontestprep-none';
  if (t === 'yes') plan = 'pulmonaryfunctiontestprep-protocol';
  return { plan, t };
}
function OxygenConservingDevice(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'oxygenconservingdevice-none';
  if (t === 'yes') plan = 'oxygenconservingdevice-protocol';
  return { plan, t };
}
function RespiratoryEmergencyBag(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'respiratoryemergencybag-none';
  if (t === 'yes') plan = 'respiratoryemergencybag-protocol';
  return { plan, t };
}
module.exports = {
  AerosolTherapy, MechanicalVentilationWean, NonInvasiveVentilation, HighFlowNasalCannula, ArterialBloodGasInterpret, BronchoscopyPrep, SputumInduction, PulmonaryFunctionTestPrep, OxygenConservingDevice, RespiratoryEmergencyBag
};
