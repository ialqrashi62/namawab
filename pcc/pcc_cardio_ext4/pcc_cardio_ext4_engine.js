// P3-CL pcc_cardio_ext4_engine v3.50.0
'use strict';
function RiskStratification(input) {
  const i = input || {};
  const r = Number(i.r ?? 0);
  let plan = 'low-risk';
  if (r >= 100) plan = 'very-high-risk';
  else if (r >= 50) plan = 'high-risk';
  else if (r >= 20) plan = 'intermediate-risk';
  return { plan, r };
}
function ACS(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-ACS';
  if (t === 'STEMI') plan = 'STEMI-activation';
  else if (t === 'NSTEMI') plan = 'NSTEMI-pathway';
  else if (t === 'UA') plan = 'unstable-angina';
  return { plan, t };
}
function HeartFailure(input) {
  const i = input || {};
  const nyha = Number(i.nyha ?? 1);
  let plan = 'NYHA-I';
  if (nyha >= 4) plan = 'NYHA-IV-severe';
  else if (nyha >= 3) plan = 'NYHA-III';
  else if (nyha >= 2) plan = 'NYHA-II';
  return { plan, nyha };
}
function Arrhythmia(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'sinus-rhythm';
  if (t === 'AF') plan = 'atrial-fibrillation';
  else if (t === 'VT') plan = 'ventricular-tachycardia';
  return { plan, t };
}
function Valvular(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-valve-disease';
  if (t === 'AS') plan = 'aortic-stenosis';
  else if (t === 'MR') plan = 'mitral-regurgitation';
  return { plan, t };
}
function Hypertension(input) {
  const i = input || {};
  const sbp = Number(i.sbp ?? 120);
  let plan = 'normal-BP';
  if (sbp >= 180) plan = 'hypertensive-crisis';
  else if (sbp >= 140) plan = 'stage-2-hypertension';
  else if (sbp >= 130) plan = 'stage-1-hypertension';
  return { plan, sbp };
}
function Lipid(input) {
  const i = input || {};
  const ldl = Number(i.ldl ?? 100);
  let plan = 'normal-LDL';
  if (ldl >= 190) plan = 'severe-hypercholesterolemia';
  else if (ldl >= 160) plan = 'high-LDL';
  else if (ldl >= 130) plan = 'borderline-LDL';
  return { plan, ldl };
}
function Anticoag(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-anticoag';
  if (t === 'warfarin') plan = 'warfarin-INR-monitor';
  else if (t === 'DOAC') plan = 'DOAC-no-monitoring';
  return { plan, t };
}
function Cardioversion(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'no-cardioversion';
  if (t === 'electrical') plan = 'electrical-cardioversion';
  else if (t === 'chemical') plan = 'chemical-cardioversion';
  return { plan, t };
}
function Echo(input) {
  const i = input || {};
  const ef = Number(i.ef ?? 60);
  let plan = 'normal-EF';
  if (ef <= 30) plan = 'HFrEF';
  else if (ef <= 40) plan = 'mid-range-EF';
  else if (ef <= 50) plan = 'borderline-EF';
  return { plan, ef };
}
module.exports = {
  RiskStratification, ACS, HeartFailure, Arrhythmia, Valvular, Hypertension, Lipid, Anticoag, Cardioversion, Echo
};
