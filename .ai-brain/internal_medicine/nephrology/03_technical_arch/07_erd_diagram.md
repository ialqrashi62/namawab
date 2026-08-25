```mermaid
erDiagram
 nephrology_sessions }|--|| patients : belongs
 nephrology_sessions ||--o{ nephrology_sessions_audit : logs
```
