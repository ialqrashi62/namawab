```mermaid
erDiagram
 icu_flowsheets }|--|| patients : belongs
 icu_flowsheets ||--o{ icu_flowsheets_audit : logs
```
