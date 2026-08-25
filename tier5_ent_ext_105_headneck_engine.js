// filepath: tier5_ent_ext_105_headneck_engine.js
// TIER5_ENT_EXT-105: Head & neck oncology
'use strict';
const CITATIONS = ['NCCN_HN_2020'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function mass(req){
  ensureNumber(req.size_cm, 'size_cm');
  ensureStr(req.location, 'location');
  ensureEnum(req.location, 'location', ['thyroid','salivary','lymph_node','neck_soft','carotid','parapharyngeal','submandibular','parotid','other','unknown']);
  ensureBool(req.imaging, 'imaging');
  ensureBool(req.fna_done, 'fna_done');
  ensureBool(req.documented, 'documented');
  let plan;
  if(req.fna_done===false) plan='continue_with_fna_then_reassess';
  else if(req.imaging===false) plan='continue_with_imaging_then_reassess';
  else if(req.documented===false) plan='continue_with_document_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function staging(req){
  ensureStr(req.t, 't');
  ensureEnum(req.t, 't', ['t0','t1','t2','t3','t4a','t4b','tx']);
  ensureStr(req.n, 'n');
  ensureEnum(req.n, 'n', ['n0','n1','n2a','n2b','n2c','n3','nx']);
  ensureStr(req.m, 'm');
  ensureEnum(req.m, 'm', ['m0','m1','mx']);
  ensureBool(req.imaging_done, 'imaging_done');
  ensureBool(req.mdt, 'mdt');
  let plan;
  if(req.t==='t4b' && req.mdt===false) plan='continue_with_review_then_reassess';
  else if(req.imaging_done===false) plan='continue_with_imaging_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function surgery(req){
  ensureStr(req.type, 'type');
  ensureEnum(req.type, 'type', ['primary','salvage','reconstructive','neck_dissection','selective','modified_radical','radical','none','other']);
  ensureBool(req.clear_margins, 'clear_margins');
  ensureBool(req.complications, 'complications');
  ensureBool(req.floss, 'floss');
  ensureBool(req.path, 'path');
  let plan;
  if(req.complications && req.floss===false) plan='continue_with_repair_then_reassess';
  else if(req.clear_margins===false && req.path===false) plan='continue_with_relook_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function radiochemo(req){
  ensureBool(req.indicated, 'indicated');
  ensureStr(req.regimen, 'regimen');
  ensureEnum(req.regimen, 'regimen', ['cisplatin','cetuximab','carboplatin','taxol','none','other','unknown']);
  ensureBool(req.mucositis, 'mucositis');
  ensureBool(req.neutropenia, 'neutropenia');
  ensureBool(req.weight_loss, 'weight_loss');
  let plan;
  if(req.indicated && req.mucositis===false) plan='continue_with_prevent_then_reassess';
  else if(req.mucositis && req.weight_loss===false) plan='continue_with_food_then_reassess';
  else if(req.neutropenia) plan='continue_with_growth_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function thyroid(req){
  ensureStr(req.cytology, 'cytology');
  ensureEnum(req.cytology, 'cytology', ['bethesda_1','bethesda_2','bethesda_3','bethesda_4','bethesda_5','bethesda_6','unknown']);
  ensureBool(req.lobectomy_planned, 'lobectomy_planned');
  ensureBool(req.total_planned, 'total_planned');
  ensureBool(req.calcium, 'calcium');
  ensureBool(req.voice, 'voice');
  let plan;
  if(req.cytology==='bethesda_5' || req.cytology==='bethesda_6') plan='continue_with_total_then_reassess';
  else if(req.cytology==='bethesda_4' && req.lobectomy_planned===false) plan='continue_with_lobectomy_then_reassess';
  else if(req.calcium===false) plan='continue_with_check_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function followup(req){
  ensureNumber(req.months, 'months');
  ensureBool(req.recurrence, 'recurrence');
  ensureBool(req.imaging_planned, 'imaging_planned');
  ensureBool(req.qol, 'qol');
  ensureBool(req.swallowing, 'swallowing');
  ensureBool(req.speech, 'speech');
  let plan;
  if(req.recurrence) plan='continue_with_refer_then_reassess';
  else if(req.imaging_planned===false) plan='continue_with_imaging_then_reassess';
  else if(req.qol===false) plan='continue_with_refer_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {mass,staging,surgery,radiochemo,thyroid,followup};}
module.exports={funcs,CITATIONS,ValidationError};