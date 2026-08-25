```mermaid
erDiagram
 oncology_cycles }|--|| patients : belongs
 oncology_cycles ||--o{ oncology_cycles_audit : logs
```
