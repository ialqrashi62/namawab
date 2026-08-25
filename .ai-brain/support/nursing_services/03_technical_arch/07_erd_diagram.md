```mermaid
erDiagram
 nursing_records }|--|| patients : belongs
 nursing_records ||--o{ nursing_records_audit : logs
```
