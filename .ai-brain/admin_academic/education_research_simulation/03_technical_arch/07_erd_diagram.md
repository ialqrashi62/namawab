```mermaid
erDiagram
 research_records }|--|| patients : belongs
 research_records ||--o{ research_records_audit : logs
```
