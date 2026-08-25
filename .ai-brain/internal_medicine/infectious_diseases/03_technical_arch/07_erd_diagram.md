```mermaid
erDiagram
 id_cases }|--|| patients : belongs
 id_cases ||--o{ id_cases_audit : logs
```
