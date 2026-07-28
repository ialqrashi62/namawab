p = 'pcc_neuro_ext113/pcc_neuro_ext113_engine.js'
t = open(p, encoding='utf-8').read()
t = t.replace('0.18 + Number(input.age||70)*0.005 + Number(input.mmse||20)*0.04', '0.15 + Number(input.age||70)*0.004 + Number(input.mmse||20)*0.03')
open(p, 'w', encoding='utf-8').write(t)
print('done')
