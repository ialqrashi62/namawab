```mermaid
erDiagram
 lab_results }|--|| patients : belongs
 lab_results ||--o{ lab_results_audit : logs
```
