p = 'pcc_pediatric_surg_ext130/pcc_pediatric_surg_ext130_engine.js'
t = open(p, encoding='utf-8').read()
new_fn = "module.exports.functions['PediatricToxoplasmosisImmunoExt']=function(input){const score=Math.round((0.18 + Number(input.age||3)*0.04 + Number(input.sulfadiazine||1)*0.2 + Number(input.outcome||1)*0.2)*100)/100;return{version:'v3.240.0',module:'pcc_pediatric_surg_ext130',function:'PediatricToxoplasmosisImmunoExt',input,score,ts:new Date().toISOString()}};\n"
t = t + new_fn
open(p, 'w', encoding='utf-8').write(t)
print('added')
