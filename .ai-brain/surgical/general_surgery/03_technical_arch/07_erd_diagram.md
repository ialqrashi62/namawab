```mermaid
erDiagram
 surg_or_cases }|--|| patients : belongs
 surg_or_cases ||--o{ surg_or_cases_audit : logs
```
