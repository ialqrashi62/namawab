```mermaid
erDiagram
 integrative_sessions }|--|| patients : belongs
 integrative_sessions ||--o{ integrative_sessions_audit : logs
```
