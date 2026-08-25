```mermaid
erDiagram
 derm_cases }|--|| patients : belongs
 derm_cases ||--o{ derm_cases_audit : logs
```
