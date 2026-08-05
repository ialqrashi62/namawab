# PCC Postman Collection

Postman v2.1 collection for the NamaMedical PCC Sandbox.

- 1322 modules
- 10035 unique functions
- 5 sample modules included

## Import

1. Open Postman
2. File → Import → select `pcc-sandbox.postman_collection.json`
3. File → Import → select `pcc-sandbox.postman_environment.json`
4. Select "PCC Sandbox" environment (top-right)
5. Run any request

## Endpoints

- Health: GET /health
- Catalog: /api/v1/pcc-catalog/{modules,categories,module/:slug}
- Search: /api/v1/pcc-catalog/{search,lookup/:fn,stats}
- Diagnostics: /api/v1/pcc-diagnostics/{diagnostics,version}
- Modules: /api/v1/<slug>/{list,call/<fn>,record}

Generated for PCC Catalog v3.316.0 on 2026-07-29T05:50:40.667Z