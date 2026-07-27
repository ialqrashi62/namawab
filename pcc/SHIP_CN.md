# P3-CN Ship Report

**Version:** v3.52.0
**Modules:** 3 (pcc_hem_ext3, pcc_id_ext3, pcc_pulm_ext3)
**Tests:** +72 (30 unit + 42 integ) → **5415 total**
**Audit:** 237 PASS (was 234)

## What shipped

| Module | Endpoint | Functions |
|---|---|---|
| pcc_hem_ext3 | /api/v1/pcc-hem-ext3/{list,call/:fn,record} | Anemia, Transfusion, Coag, Marrow, Mds, Mpn, Lymphoma, Leukemia, Transplant, Iron |
| pcc_id_ext3 | /api/v1/pcc-id-ext3/{list,call/:fn,record} | Cdiff, Mrsa, Vre, Esbl, Tbflu, Malaria, Tb, Hiv, Hep, Travel |
| pcc_pulm_ext3 | /api/v1/pcc-pulm-ext3/{list,call/:fn,record} | Asthma, Copd, Pna, Tb, Pe, Ca, Mesothelioma, Sarcoid, Ipf, Sleep |

## Server

- `pcc/server.js` v3.52.0, 239 modules wired
- 3 endpoints verified

## Audit

- 237/237 PASS

## Next: P3-CO candidates

`pcc_ent_ext3`, `pcc_uro_ext2`, `pcc_ophth_ext2`
