```mermaid
erDiagram
 rehab_sessions }|--|| patients : belongs
 rehab_sessions ||--o{ rehab_sessions_audit : logs
```
