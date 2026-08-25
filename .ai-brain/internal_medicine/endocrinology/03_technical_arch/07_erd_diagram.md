```mermaid
erDiagram
 endo_visits }|--|| patients : belongs
 endo_visits ||--o{ endo_visits_audit : logs
```
