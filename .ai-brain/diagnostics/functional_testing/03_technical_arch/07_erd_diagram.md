```mermaid
erDiagram
 func_tests }|--|| patients : belongs
 func_tests ||--o{ func_tests_audit : logs
```
