```mermaid
erDiagram
 asset_records }|--|| patients : belongs
 asset_records ||--o{ asset_records_audit : logs
```
