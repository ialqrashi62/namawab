# pcc-sdk (Java)

Java SDK for the NamaMedical PCC Sandbox catalog.

- 1322 modules
- 10035 unique functions
- Java 11+
- Uses java.net.http.HttpClient (built-in)

## Install

```xml
<dependency>
    <groupId>com.jumanasoft</groupId>
    <artifactId>pcc-sdk</artifactId>
    <version>3.316</version>
</dependency>
```

## Usage

```java
import com.jumanasoft.pcc.PccClient;

public class Main {
    public static void main(String[] args) throws Exception {
        PccClient client = new PccClient("http://localhost:3201");

        // Health
        System.out.println(client.health());

        // Catalog
        String cat = client.catalog();
        System.out.println("Catalog: " + cat);

        // Call
        String r = client.call("pcc-cardiology-ext102", "CardGenExt", "{\"hr\":80}");
        System.out.println("Result: " + r);

        // Record
        String req = "{\"tenant_id\":\"t1\",\"fn\":\"CardGenExt\",\"input\":{\"hr\":80}}";
        String rec = client.record("pcc-cardiology-ext102", req);
        System.out.println("Recorded: " + rec);
    }
}
```

Generated for PCC Catalog v3.316.0 on 2026-07-29T05:49:59.997Z