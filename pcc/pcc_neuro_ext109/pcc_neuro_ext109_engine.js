// filepath: pcc/pcc_neuro_ext109/pcc_neuro_ext109_engine.js
// pcc_neuro_ext109 engine (deterministic)
module.exports.version='v3.208.0';
module.exports.module='pcc_neuro_ext109';
module.exports.functions={};
module.exports.functions['MultipleSclerosisExt']=function(input){const score=Math.round((0.18 + Number(input.edss||4)*0.05 + Number(input.relapse||1)*0.2 + Number(input.outcome||1)*0.2)*100)/100;return{version:'v3.208.0',module:'pcc_neuro_ext109',function:'MultipleSclerosisExt',input,score,ts:new Date().toISOString()};};
module.exports.functions['NMOExt']=function(input){const score=Math.round((0.18 + Number(input.aq4||1)*0.2 + Number(input.optico||1)*0.2 + Number(input.outcome||1)*0.2)*100)/100;return{version:'v3.208.0',module:'pcc_neuro_ext109',function:'NMOExt',input,score,ts:new Date().toISOString()};};
module.exports.functions['MOGExt']=function(input){const score=Math.round((0.18 + Number(input.mog||1)*0.2 + Number(input.demyel||1)*0.2 + Number(input.outcome||1)*0.2)*100)/100;return{version:'v3.208.0',module:'pcc_neuro_ext109',function:'MOGExt',input,score,ts:new Date().toISOString()};};
module.exports.functions['ADEMExt']=function(input){const score=Math.round((0.18 + Number(input.acute||1)*0.2 + Number(input.mri||1)*0.2 + Number(input.outcome||1)*0.2)*100)/100;return{version:'v3.208.0',module:'pcc_neuro_ext109',function:'ADEMExt',input,score,ts:new Date().toISOString()};};
module.exports.functions['GBSext']=function(input){const score=Math.round((0.18 + Number(input.albumin||1)*0.2 + Number(input.weakness||1)*0.2 + Number(input.outcome||1)*0.2)*100)/100;return{version:'v3.208.0',module:'pcc_neuro_ext109',function:'GBSext',input,score,ts:new Date().toISOString()};};
module.exports.functions['CIDPExt']=function(input){const score=Math.round((0.18 + Number(input.chronic||1)*0.2 + Number(input.ivig||1)*0.2 + Number(input.outcome||1)*0.2)*100)/100;return{version:'v3.208.0',module:'pcc_neuro_ext109',function:'CIDPExt',input,score,ts:new Date().toISOString()};};
module.exports.functions['MyastheniaGravisExt']=function(input){const score=Math.round((0.18 + Number(input.ach||1)*0.2 + Number(input.weakness||1)*0.2 + Number(input.outcome||1)*0.2)*100)/100;return{version:'v3.208.0',module:'pcc_neuro_ext109',function:'MyastheniaGravisExt',input,score,ts:new Date().toISOString()};};
module.exports.functions['LambertEatonExt']=function(input){const score=Math.round((0.18 + Number(input.vgcc||1)*0.2 + Number(input.weakness||1)*0.2 + Number(input.outcome||1)*0.2)*100)/100;return{version:'v3.208.0',module:'pcc_neuro_ext109',function:'LambertEatonExt',input,score,ts:new Date().toISOString()};};
module.exports.functions['PolymyositisExt']=function(input){const score=Math.round((0.18 + Number(input.ck||1)*0.2 + Number(input.weakness||1)*0.2 + Number(input.outcome||1)*0.2)*100)/100;return{version:'v3.208.0',module:'pcc_neuro_ext109',function:'PolymyositisExt',input,score,ts:new Date().toISOString()};};
module.exports.functions['DermatomyositisExt']=function(input){const score=Math.round((0.18 + Number(input.rash||1)*0.2 + Number(input.weakness||1)*0.2 + Number(input.outcome||1)*0.2)*100)/100;return{version:'v3.208.0',module:'pcc_neuro_ext109',function:'DermatomyositisExt',input,score,ts:new Date().toISOString()};};

// TS: v3.208.0
