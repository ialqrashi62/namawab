```mermaid
erDiagram
 rheum_visits }|--|| patients : belongs
 rheum_visits ||--o{ rheum_visits_audit : logs
```
