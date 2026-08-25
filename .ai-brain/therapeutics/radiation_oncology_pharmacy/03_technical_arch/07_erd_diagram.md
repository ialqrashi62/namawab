```mermaid
erDiagram
 therap_sessions }|--|| patients : belongs
 therap_sessions ||--o{ therap_sessions_audit : logs
```
