```mermaid
erDiagram
 gastro_procedures }|--|| patients : belongs
 gastro_procedures ||--o{ gastro_procedures_audit : logs
```
