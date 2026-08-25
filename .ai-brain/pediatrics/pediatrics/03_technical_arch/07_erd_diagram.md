```mermaid
erDiagram
 peds_visits }|--|| patients : belongs
 peds_visits ||--o{ peds_visits_audit : logs
```
