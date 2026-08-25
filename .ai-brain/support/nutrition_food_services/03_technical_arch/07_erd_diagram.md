```mermaid
erDiagram
 nutrition_orders }|--|| patients : belongs
 nutrition_orders ||--o{ nutrition_orders_audit : logs
```
