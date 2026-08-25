```mermaid
erDiagram
 ent_visits }|--|| patients : belongs
 ent_visits ||--o{ ent_visits_audit : logs
```
