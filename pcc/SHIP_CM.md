# P3-CM Ship Report

**Version:** v3.51.0
**Modules:** 3 (pcc_gi_ext3, pcc_endo_ext3, pcc_rheum_ext4)
**Tests:** +72 (30 unit + 42 integ) → **5343 total**
**Audit:** 234 PASS (was 231)

## What shipped

| Module | Endpoint | Functions |
|---|---|---|
| pcc_gi_ext3 | /api/v1/pcc-gi-ext3/{list,call/:fn,record} | Dysphagia, GERD, IBS, IBD, Celiac, HepB, HepC, Cirr, Ppi, Scope |
| pcc_endo_ext3 | /api/v1/pcc-endo-ext3/{list,call/:fn,record} | DmType, A1c, Thyroid, Calcium, Adrenal, Pituitary, Osteo, Pcos, Dka, Lipid |
| pcc_rheum_ext4 | /api/v1/pcc-rheum-ext4/{list,call/:fn,record} | Ra, Sle, Spa, Vasculitis, Gout, Osteo, Sjogren, Scleroderma, Myositis, Biologic |

## Server

- `pcc/server.js` v3.51.0, 236 modules wired
- 3 endpoints verified

## Audit

- 234/234 PASS

## Next: P3-CN candidates

`pcc_hem_ext3`, `pcc_id_ext3`, `pcc_pulm_ext3`
