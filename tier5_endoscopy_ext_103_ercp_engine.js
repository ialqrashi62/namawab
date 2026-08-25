// filepath: tier5_endoscopy_ext_103_ercp_engine.js
// TIER5_ENDOSCOPY_EXT-103: ERCP
'use strict';
const CITATIONS = ['ASGE_ERCP_2015'];
class ValidationError extends Error { constructor(m,f){super(m);this.name='ValidationError';this.field=f;this.kind='validation';} }
function ensureNumber(v,f){if(typeof v!=='number'||!isFinite(v))throw new ValidationError(`${f} must be finite number`,f);}
function ensureStr(v,f){if(typeof v!=='string'||!v.length)throw new ValidationError(`${f} required`,f);}
function ensureEnum(v,f,a){if(!a.includes(v))throw new ValidationError(`${f} must be one of ${a.join('|')}`,f);}
function ensureBool(v,f){if(typeof v!=='boolean')throw new ValidationError(`${f} must be boolean`,f);}

function indications(req){
  ensureStr(req.indication, 'indication');
  ensureEnum(req.indication, 'indication', ['choledocholithiasis','malignant_obstruction','benign_stricture','bile_leak','cholangitis','jaundice','post_liver_tx','sphincter_of_odd_dysfunction','pseudocyst','ampullectomy','other']);
  ensureBool(req.mrcp_done, 'mrcp_done');
  ensureBool(req.alternative, 'alternative');
  let plan;
  if(req.indication==='cholangitis') plan='continue_with_emergent_then_reassess';
  else if(req.mrcp_done===false) plan='continue_with_mrcp_then_reassess';
  else if(req.alternative) plan='continue_with_consider_alternative_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function cannulation(req){
  ensureBool(req.cannulated, 'cannulated');
  ensureBool(req.wire_passed, 'wire_passed');
  ensureBool(req.guidewire_assist, 'guidewire_assist');
  ensureNumber(req.tries, 'tries');
  ensureBool(req.access_papilla, 'access_papilla');
  let plan;
  if(req.cannulated===false) plan='continue_with_pancreatography_then_reassess';
  else if(req.tries>5) plan='continue_with_expert_then_reassess';
  else if(req.wire_passed===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function sphincterotomy(req){
  ensureBool(req.performed, 'performed');
  ensureBool(req.complete, 'complete');
  ensureBool(req.bleeding, 'bleeding');
  ensureBool(req.precut, 'precut');
  ensureBool(req.difficult_anatomy, 'difficult_anatomy');
  let plan;
  if(req.bleeding) plan='continue_with_treat_then_reassess';
  else if(req.performed===false) plan='continue_with_review_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function stone(req){
  ensureNumber(req.stone_size, 'stone_size');
  ensureBool(req.extracted, 'extracted');
  ensureBool(req.lithotripsy, 'lithotripsy');
  ensureBool(req.basket_used, 'basket_used');
  ensureBool(req.balloon_used, 'balloon_used');
  ensureBool(req.cleared, 'cleared');
  let plan;
  if(req.cleared===false) plan='continue_with_review_then_reassess';
  else if(req.stone_size>=15 && req.lithotripsy===false) plan='continue_with_lithotripsy_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function stent(req){
  ensureBool(req.plastic_placed, 'plastic_placed');
  ensureBool(req.metal_placed, 'metal_placed');
  ensureBool(req.brushings, 'brushings');
  ensureBool(req.patency, 'patency');
  ensureBool(req.removed, 'removed');
  let plan;
  if(req.metal_placed && req.brushings===false) plan='continue_with_brushings_then_reassess';
  else if(req.plastic_placed && req.removed===false) plan='continue_with_remove_plan_then_reassess';
  else if(req.patency===false) plan='continue_with_replace_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function complications(req){
  ensureBool(req.pancreatitis, 'pancreatitis');
  ensureBool(req.perforation, 'perforation');
  ensureBool(req.bleeding, 'bleeding');
  ensureBool(req.cholangitis, 'cholangitis');
  ensureBool(req.cardiopulmonary, 'cardiopulmonary');
  ensureBool(req.managed, 'managed');
  let plan;
  if(req.perforation) plan='continue_with_surgery_then_reassess';
  else if(req.pancreatitis && req.managed===false) plan='continue_with_treat_then_reassess';
  else if(req.bleeding && req.managed===false) plan='continue_with_treat_then_reassess';
  else if(req.cholangitis) plan='continue_with_antibiotics_then_reassess';
  else plan='continue_with_observation_then_reassess';
  return {plan};
}
function funcs(){return {indications,cannulation,sphincterotomy,stone,stent,complications};}
module.exports={funcs,CITATIONS,ValidationError};