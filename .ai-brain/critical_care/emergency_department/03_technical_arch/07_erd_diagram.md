```mermaid
erDiagram
 er_encounters }|--|| patients : belongs
 er_encounters ||--o{ er_encounters_audit : logs
```
