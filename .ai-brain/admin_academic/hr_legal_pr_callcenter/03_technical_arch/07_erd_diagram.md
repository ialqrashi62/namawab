```mermaid
erDiagram
 hr_records }|--|| patients : belongs
 hr_records ||--o{ hr_records_audit : logs
```
