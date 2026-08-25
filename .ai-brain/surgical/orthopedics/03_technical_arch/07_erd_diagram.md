```mermaid
erDiagram
 ortho_cases }|--|| patients : belongs
 ortho_cases ||--o{ ortho_cases_audit : logs
```
