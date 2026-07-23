# NEPH-001 — OpenAPI

```yaml
openapi: 3.1.0
info: {title: NamaMedical Nephrology API, version: 1.0.0}
security: [{bearerAuth: []}]
paths:
  /neph/encounters: {get: {}, post: {}}
  /neph/encounters/{id}/labs: {get: {}, post: {}}
  /neph/encounters/{id}/dialysis: {get: {}, post: {}}
  /neph/patients/{patientId}/transplant: {get: {}, post: {}}
  /neph/risk/egfr: {post: {}}
  /neph/risk/ckd: {post: {}}
  /neph/risk/aki: {post: {}}
  /neph/risk/rrt: {post: {}}
  /neph/risk/hyperkalemia: {post: {}}
components:
  securitySchemes:
    bearerAuth: {type: http, scheme: bearer, bearerFormat: JWT}
```
