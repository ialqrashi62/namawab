import os
p = 'pcc_neuro_ext113/pcc_neuro_ext113_engine.js'
t = open(p, encoding='utf-8').read()
old = "'AlzheimerExt','0.18 + Number(input.age||70)*0.005 + Number(input.mmse||20)*0.04 + Number(input.outcome||1)*0.2'"
new = "'AlzheimerExt','0.15 + Number(input.age||70)*0.004 + Number(input.mmse||20)*0.03 + Number(input.outcome||1)*0.2'"
if old in t:
    t = t.replace(old, new)
    open(p, 'w', encoding='utf-8').write(t)
    print('FIXED Alzheimer')
else:
    print('NOT FOUND')
