// filepath: pcc/pcc_neuro_ext108/pcc_neuro_ext108_engine.js
// pcc_neuro_ext108 engine (deterministic)
module.exports.version='v3.207.0';
module.exports.module='pcc_neuro_ext108';
module.exports.functions={};
module.exports.functions['AcuteMeningitisExt']=function(input){const score=Math.round((0.18 + Number(input.age||40)*0.005 + Number(input.gcs||12)*0.04 + Number(input.outcome||1)*0.2)*100)/100;return{version:'v3.207.0',module:'pcc_neuro_ext108',function:'AcuteMeningitisExt',input,score,ts:new Date().toISOString()};};
module.exports.functions['BacterialMeningitisExt']=function(input){const score=Math.round((0.18 + Number(input.gram||1)*0.2 + Number(input.lumbar||1)*0.2 + Number(input.outcome||1)*0.2)*100)/100;return{version:'v3.207.0',module:'pcc_neuro_ext108',function:'BacterialMeningitisExt',input,score,ts:new Date().toISOString()};};
module.exports.functions['ViralMeningitisExt']=function(input){const score=Math.round((0.18 + Number(input.pcr||1)*0.2 + Number(input.symptom||1)*0.2 + Number(input.outcome||1)*0.2)*100)/100;return{version:'v3.207.0',module:'pcc_neuro_ext108',function:'ViralMeningitisExt',input,score,ts:new Date().toISOString()};};
module.exports.functions['TBmeningitisExt']=function(input){const score=Math.round((0.18 + Number(input.afb||1)*0.2 + Number(input.treatment||1)*0.2 + Number(input.outcome||1)*0.2)*100)/100;return{version:'v3.207.0',module:'pcc_neuro_ext108',function:'TBmeningitisExt',input,score,ts:new Date().toISOString()};};
module.exports.functions['FungalMeningitisExt']=function(input){const score=Math.round((0.18 + Number(input.culture||1)*0.2 + Number(input.immune||1)*0.2 + Number(input.outcome||1)*0.2)*100)/100;return{version:'v3.207.0',module:'pcc_neuro_ext108',function:'FungalMeningitisExt',input,score,ts:new Date().toISOString()};};
module.exports.functions['BrainAbscessExt']=function(input){const score=Math.round((0.18 + Number(input.size||2)*0.1 + Number(input.location||1)*0.2 + Number(input.outcome||1)*0.2)*100)/100;return{version:'v3.207.0',module:'pcc_neuro_ext108',function:'BrainAbscessExt',input,score,ts:new Date().toISOString()};};
module.exports.functions['EpiduralAbscessExt']=function(input){const score=Math.round((0.18 + Number(input.size||2)*0.1 + Number(input.spine||1)*0.2 + Number(input.outcome||1)*0.2)*100)/100;return{version:'v3.207.0',module:'pcc_neuro_ext108',function:'EpiduralAbscessExt',input,score,ts:new Date().toISOString()};};
module.exports.functions['SubduralEmpyemaExt']=function(input){const score=Math.round((0.18 + Number(input.size||2)*0.1 + Number(input.surgery||1)*0.2 + Number(input.outcome||1)*0.2)*100)/100;return{version:'v3.207.0',module:'pcc_neuro_ext108',function:'SubduralEmpyemaExt',input,score,ts:new Date().toISOString()};};
module.exports.functions['NeuroLymeExt']=function(input){const score=Math.round((0.18 + Number(input.tick||1)*0.2 + Number(input.serology||1)*0.2 + Number(input.outcome||1)*0.2)*100)/100;return{version:'v3.207.0',module:'pcc_neuro_ext108',function:'NeuroLymeExt',input,score,ts:new Date().toISOString()};};
module.exports.functions['NeuroSyphilisExt']=function(input){const score=Math.round((0.18 + Number(input.trep||1)*0.2 + Number(input.stage||1)*0.2 + Number(input.outcome||1)*0.2)*100)/100;return{version:'v3.207.0',module:'pcc_neuro_ext108',function:'NeuroSyphilisExt',input,score,ts:new Date().toISOString()};};

// TS: v3.207.0
