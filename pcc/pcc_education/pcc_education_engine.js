// P3-CE pcc_education_engine v3.43.0
'use strict';
function Curriculum(input) {
  const i = input || {};
  const yr = Number(i.year ?? 0);
  let plan = 'orientation';
  if (yr >= 5) plan = 'PGY-5-advanced';
  else if (yr >= 4) plan = 'PGY-4-senior';
  else if (yr >= 3) plan = 'PGY-3-mid';
  else if (yr >= 2) plan = 'PGY-2-junior';
  else if (yr >= 1) plan = 'PGY-1-intern';
  return { plan, yr };
}
function Rotation(input) {
  const i = input || {};
  const spec = String(i.spec || '');
  let plan = 'general-rotation';
  if (spec === 'icu') plan = 'ICU-rotation';
  else if (spec === 'ed') plan = 'ED-rotation';
  else if (spec === 'elective') plan = 'elective-rotation';
  return { plan, spec };
}
function Simulation(input) {
  const i = input || {};
  const type = String(i.type || '');
  let plan = 'table-top';
  if (type === 'code') plan = 'code-blue-simulation';
  else if (type === 'trauma') plan = 'trauma-simulation';
  else if (type === 'crisis') plan = 'CRM-crisis-simulation';
  return { plan, type };
}
function Eval(input) {
  const i = input || {};
  const score = Number(i.score ?? 0);
  let plan = 'remedial-needed';
  if (score >= 90) plan = 'exceeds-expectations';
  else if (score >= 75) plan = 'meets-expectations';
  else if (score >= 60) plan = 'approaching';
  return { plan, score };
}
function Lecture(input) {
  const i = input || {};
  const dur = Number(i.dur ?? 0);
  let plan = 'short-briefing';
  if (dur >= 120) plan = 'grand-rounds';
  else if (dur >= 60) plan = 'full-lecture';
  else if (dur >= 30) plan = 'short-lecture';
  return { plan, dur };
}
function Bedside(input) {
  const i = input || {};
  const setting = String(i.setting || '');
  let plan = 'walk-rounds';
  if (setting === 'preop') plan = 'preop-briefing';
  else if (setting === 'or') plan = 'or-handoff';
  else if (setting === 'icu') plan = 'ICU-family-meeting';
  return { plan, setting };
}
function Cert(input) {
  const i = input || {};
  const t = String(i.t || '');
  let plan = 'BLS';
  if (t === 'ACLS') plan = 'ACLS-recert';
  else if (t === 'PALS') plan = 'PALS-recert';
  else if (t === 'ATLS') plan = 'ATLS-recert';
  return { plan, t };
}
function Fellow(input) {
  const i = input || {};
  const yr = Number(i.yr ?? 0);
  let plan = 'junior-fellow';
  if (yr >= 3) plan = 'senior-fellow';
  else if (yr >= 2) plan = 'mid-fellow';
  return { plan, yr };
}
function CEU(input) {
  const i = input || {};
  const credits = Number(i.credits ?? 0);
  let plan = 'partial-credit';
  if (credits >= 30) plan = 'full-CEU-cycle';
  else if (credits >= 15) plan = 'mid-cycle';
  return { plan, credits };
}
function Exam(input) {
  const i = input || {};
  const type = String(i.type || '');
  let plan = 'written-only';
  if (type === 'oral') plan = 'oral-board';
  else if (type === 'OSCE') plan = 'OSCE-stations';
  else if (type === 'board') plan = 'board-cert';
  return { plan, type };
}
module.exports = {
  Curriculum, Rotation, Simulation, Eval, Lecture, Bedside, Cert, Fellow, CEU, Exam
};
