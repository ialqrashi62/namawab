p = 'pcc_pediatric_neuro_ext105/pcc_pediatric_neuro_ext105_engine.js'
t = open(p, encoding='utf-8').read()
t = t.replace('0.18 + Number(input.age||8)*0.004 + Number(input.bp||180)*0.005', '0.15 + Number(input.age||8)*0.004 + Number(input.bp||180)*0.003')
open(p, 'w', encoding='utf-8').write(t)
print('done')
