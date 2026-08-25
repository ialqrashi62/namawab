```mermaid
erDiagram
 quality_records }|--|| patients : belongs
 quality_records ||--o{ quality_records_audit : logs
```
