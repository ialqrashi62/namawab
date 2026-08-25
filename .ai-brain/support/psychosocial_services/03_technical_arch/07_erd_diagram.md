```mermaid
erDiagram
 social_cases }|--|| patients : belongs
 social_cases ||--o{ social_cases_audit : logs
```
