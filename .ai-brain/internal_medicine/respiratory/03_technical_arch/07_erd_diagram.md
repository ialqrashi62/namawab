```mermaid
erDiagram
 respiratory_visits }|--|| patients : belongs
 respiratory_visits ||--o{ respiratory_visits_audit : logs
```
