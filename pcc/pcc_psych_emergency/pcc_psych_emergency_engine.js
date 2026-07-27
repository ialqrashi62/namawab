// P3-DT pcc_psych_emergency_engine v3.84.0
'use strict';
function ColumbiaSuicideSeverity(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'columbiaSuicideSeverity-none';
  if (t === 'yes') plan = 'columbiaSuicideSeverity-protocol';
  return { plan, t };
}
function PHQ2PHQ9Triage(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'pHQ2PHQ9Triage-none';
  if (t === 'yes') plan = 'pHQ2PHQ9Triage-protocol';
  return { plan, t };
}
function GAD7Triage(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'gAD7Triage-none';
  if (t === 'yes') plan = 'gAD7Triage-protocol';
  return { plan, t };
}
function CIWATriage(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'cIWATriage-none';
  if (t === 'yes') plan = 'cIWATriage-protocol';
  return { plan, t };
}
function DeliriumCAMICU(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'deliriumCAMICU-none';
  if (t === 'yes') plan = 'deliriumCAMICU-protocol';
  return { plan, t };
}
function AcutePsychosisScreen(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'acutePsychosisScreen-none';
  if (t === 'yes') plan = 'acutePsychosisScreen-protocol';
  return { plan, t };
}
function SubstanceIntoxicationTriage(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'substanceIntoxicationTriage-none';
  if (t === 'yes') plan = 'substanceIntoxicationTriage-protocol';
  return { plan, t };
}
function RestraintIndication(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'restraintIndication-none';
  if (t === 'yes') plan = 'restraintIndication-protocol';
  return { plan, t };
}
function InvoluntaryHoldCriteria(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'involuntaryHoldCriteria-none';
  if (t === 'yes') plan = 'involuntaryHoldCriteria-protocol';
  return { plan, t };
}
function PsychiatricDisposition(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'psychiatricDisposition-none';
  if (t === 'yes') plan = 'psychiatricDisposition-protocol';
  return { plan, t };
}
module.exports = { ColumbiaSuicideSeverity, PHQ2PHQ9Triage, GAD7Triage, CIWATriage, DeliriumCAMICU, AcutePsychosisScreen, SubstanceIntoxicationTriage, RestraintIndication, InvoluntaryHoldCriteria, PsychiatricDisposition };
