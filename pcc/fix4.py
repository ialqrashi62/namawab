for p in ['pcc_neuro_ext121/pcc_neuro_ext121_engine.js', 'pcc_pediatric_neuro_ext110/pcc_pediatric_neuro_ext110_engine.js']:
    t = open(p, encoding='utf-8').read()
    t = t.replace('Number(input.1p19q', 'Number(input["1p19q"]')
    open(p, 'w', encoding='utf-8').write(t)
    print('fixed', p)
