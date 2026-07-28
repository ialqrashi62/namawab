// filepath: pcc/pcc_neuro_ext110/pcc_neuro_ext110_engine.js
// pcc_neuro_ext110 engine (deterministic)
module.exports.version='v3.209.0';
module.exports.module='pcc_neuro_ext110';
module.exports.functions={};
module.exports.functions['ParkinsonsExt']=function(input){const score=Math.round((0.18 + Number(input.hoehnYahr||2)*0.1 + Number(input.tremor||1)*0.2 + Number(input.outcome||1)*0.2)*100)/100;return{version:'v3.209.0',module:'pcc_neuro_ext110',function:'ParkinsonsExt',input,score,ts:new Date().toISOString()};};
module.exports.functions['ParkinsonsDBSext']=function(input){const score=Math.round((0.18 + Number(input.dbs||1)*0.2 + Number(input.motor||1)*0.2 + Number(input.outcome||1)*0.2)*100)/100;return{version:'v3.209.0',module:'pcc_neuro_ext110',function:'ParkinsonsDBSext',input,score,ts:new Date().toISOString()};};
module.exports.functions['HuntingtonsExt']=function(input){const score=Math.round((0.18 + Number(input.cag||45)*0.01 + Number(input.chorea||1)*0.2 + Number(input.outcome||1)*0.2)*100)/100;return{version:'v3.209.0',module:'pcc_neuro_ext110',function:'HuntingtonsExt',input,score,ts:new Date().toISOString()};};
module.exports.functions['DystoniaExt']=function(input){const score=Math.round((0.18 + Number(input.bfm||1)*0.2 + Number(input.dbs||1)*0.2 + Number(input.outcome||1)*0.2)*100)/100;return{version:'v3.209.0',module:'pcc_neuro_ext110',function:'DystoniaExt',input,score,ts:new Date().toISOString()};};
module.exports.functions['TourettesExt']=function(input){const score=Math.round((0.18 + Number(input.yale||1)*0.2 + Number(input.tics||1)*0.2 + Number(input.outcome||1)*0.2)*100)/100;return{version:'v3.209.0',module:'pcc_neuro_ext110',function:'TourettesExt',input,score,ts:new Date().toISOString()};};
module.exports.functions['EssentialTremorExt']=function(input){const score=Math.round((0.18 + Number(input.tremor||1)*0.2 + Number(input.family||1)*0.2 + Number(input.outcome||1)*0.2)*100)/100;return{version:'v3.209.0',module:'pcc_neuro_ext110',function:'EssentialTremorExt',input,score,ts:new Date().toISOString()};};
module.exports.functions['CerebellarAtaxiaExt']=function(input){const score=Math.round((0.18 + Number(input.sara||1)*0.2 + Number(input.ataxia||1)*0.2 + Number(input.outcome||1)*0.2)*100)/100;return{version:'v3.209.0',module:'pcc_neuro_ext110',function:'CerebellarAtaxiaExt',input,score,ts:new Date().toISOString()};};
module.exports.functions['FriedreichAtaxiaExt']=function(input){const score=Math.round((0.18 + Number(input.frda||1)*0.2 + Number(input.sara||1)*0.2 + Number(input.outcome||1)*0.2)*100)/100;return{version:'v3.209.0',module:'pcc_neuro_ext110',function:'FriedreichAtaxiaExt',input,score,ts:new Date().toISOString()};};
module.exports.functions['SpinocerebellarExt']=function(input){const score=Math.round((0.18 + Number(input.sca||1)*0.2 + Number(input.sara||1)*0.2 + Number(input.outcome||1)*0.2)*100)/100;return{version:'v3.209.0',module:'pcc_neuro_ext110',function:'SpinocerebellarExt',input,score,ts:new Date().toISOString()};};
module.exports.functions['WilsonExt']=function(input){const score=Math.round((0.18 + Number(input.copper||1)*0.2 + Number(input.kfr||1)*0.2 + Number(input.outcome||1)*0.2)*100)/100;return{version:'v3.209.0',module:'pcc_neuro_ext110',function:'WilsonExt',input,score,ts:new Date().toISOString()};};

// TS: v3.209.0
