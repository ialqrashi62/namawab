# TIER5_IMAGING_EXT-101..106 SHIPPED (2026-08-05)

36 endpoints live (e767-e772) — radiology advanced.

| # | Module | Routes |
|---|---|---|
| 101 | US | /api/imus/{fast,dvt,echo,ob,msk,ceus} |
| 102 | CT | /api/imct/{trauma,pe,stroke,cardiac,perfusion,lowdose} |
| 103 | MRI | /api/immri/{dwi,contrast,msk,cardiac,fmri,spectro} |
| 104 | IR | /api/imir/{biopsy,drain,tips,embol,ablate,stent} |
| 105 | Nuc | /api/imnuc/{pet,spect,bone,thyroid,parath,sln} |
| 106 | Mammo | /api/immam/{birads,screen,dbt,usadj,mriadj,biopsy} |

**Smoke**: 36/36 PASS first try. Commits: 29287321 (inner) / d84ae5e0 (outer).

**Tables**: imaging_us, imaging_ct, imaging_mri, imaging_ir, imaging_nuc, imaging_mammo.

**Bug fix during deploy**: PowerShell glob `e7[7-9]_*.sql` did NOT match
`e770_tier5_imaging_ir_up.sql`, `e771_tier5_imaging_nuc_up.sql`,
`e772_tier5_imaging_mammo_up.sql` — needed explicit scp by filename.
