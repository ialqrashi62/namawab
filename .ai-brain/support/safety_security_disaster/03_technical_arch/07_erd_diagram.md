```mermaid
erDiagram
 incident_records }|--|| patients : belongs
 incident_records ||--o{ incident_records_audit : logs
```
