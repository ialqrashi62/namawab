```mermaid
erDiagram
 obgyn_encounters }|--|| patients : belongs
 obgyn_encounters ||--o{ obgyn_encounters_audit : logs
```
