```mermaid
erDiagram
 cardiology_assessments }|--|| patients : belongs
 cardiology_assessments ||--o{ cardiology_assessments_audit : logs
```
