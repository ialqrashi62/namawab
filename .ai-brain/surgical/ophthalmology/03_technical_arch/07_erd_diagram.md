```mermaid
erDiagram
 eye_visits }|--|| patients : belongs
 eye_visits ||--o{ eye_visits_audit : logs
```
