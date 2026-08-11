# ERD — NamaMedical Multi-Tenant Core

> Visual representation of the 13 safety-rail-mandated core tables.
> Render with: https://www.plantuml.com/plantuml/uml/

```plantuml
@startuml nama_erd_core
!define Table(name,desc) class name as "**name**\n<size:10>desc</size>" << (T,#FFAAAA) >>

hide circles
skinparam linetype ortho

Table(tenants, "tenant_id PK\nname\nstatus\ncreated_at")
Table(users, "user_id PK\ntenant_id FK\nemail\nrole\nmfa_secret")
Table(patients, "patient_id PK\ntenant_id FK\nmrn\nname_enc\ndob_enc")
Table(encounters, "enc_id PK\ntenant_id FK\npatient_id FK\nprovider_id\nstatus")
Table(orders, "order_id PK\ntenant_id FK\npatient_id FK\nenc_id FK\ntype\nstatus")
Table(results, "result_id PK\ntenant_id FK\norder_id FK\nvalue\nunit")
Table(medications, "med_id PK\ntenant_id FK\npatient_id FK\ndrug\ndose\nroute")
Table(audit_log, "log_id PK\ntenant_id FK\nactor_id\naction\nprev_hash\ncurr_hash")
Table(invoices, "invoice_id PK\ntenant_id FK\npatient_id FK\ntotal\nvat\nstatus")
Table(claims, "claim_id PK\ntenant_id FK\ninvoice_id FK\nnphies_id\nstatus")
Table(phi_blobs, "blob_id PK\ntenant_id FK\npatient_id FK\nenvelope_ciphertext\nkek_id")
Table(sessions, "session_id PK\nuser_id FK\ntenant_id FK\nexpires_at")
Table(idempotency_keys, "key PK\ntenant_id FK\nroute\nresponse_hash\nexpires_at")

tenants ||--o{ users
tenants ||--o{ patients
tenants ||--o{ encounters
tenants ||--o{ orders
tenants ||--o{ results
tenants ||--o{ medications
tenants ||--o{ audit_log
tenants ||--o{ invoices
tenants ||--o{ claims
tenants ||--o{ phi_blobs
tenants ||--o{ sessions
tenants ||--o{ idempotency_keys

patients ||--o{ encounters
patients ||--o{ orders
patients ||--o{ medications
patients ||--o{ phi_blobs

encounters ||--o{ orders
orders ||--|| results
invoices ||--o{ claims

@enduml
```

## Defense-in-Depth Layers

| Layer | Mechanism | Failure Mode |
|---|---|---|
| **App middleware** | `requireTenantScope` on every protected route | Logs warning, returns 403 |
| **DB RLS** | `FORCE RLS` + `tenant_id = current_setting('app.tenant_id')` policy | DB rejects query |
| **Idempotency** | `idempotency_keys` table (4 money routes only) | Returns cached response |
| **Audit chain** | `audit_log.prev_hash → curr_hash` (SHA-256) | Tamper breaks verification |
| **PHI envelope** | `phi_blobs.envelope_ciphertext` + DEK wrapped by KEK | KEK rotation invalidates old DEKs |
