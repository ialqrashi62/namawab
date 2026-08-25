```mermaid
erDiagram
 rad_orders }|--|| patients : belongs
 rad_orders ||--o{ rad_orders_audit : logs
```
