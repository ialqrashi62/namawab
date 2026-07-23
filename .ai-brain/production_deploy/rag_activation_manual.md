# RAG Activation Manual: Production Environment
## 🧠 Activating the Intelligence Layer on jumanasoft.com

### 1. Vector Database Connection
The production server must be linked to the `pgvector` enabled PostgreSQL instance.
- **Verification**: Run `SELECT * FROM pg_extension WHERE extname = 'vector';`
- **Connection**: Ensure the `.env` file on the server contains the correct `DATABASE_URL` and `OPENAI_API_KEY`.

### 2. Knowledge Ingestion Process (The Pipeline)
To upload medical guidelines (PDFs) and activate the RAG brain, follow these steps:

**A. Upload Phase**:
- Place all source PDFs in the `/phi_vault/knowledge_base/` directory on the server.
- Ensure files are named according to the `knowledge_map.md` (e.g., `SSC_2021_Sepsis.pdf`).

**B. Processing Phase (Run the Ingestion Script)**:
Execute the ingestion pipeline via the terminal:
```bash
node scripts/rag_ingestion.js --source /phi_vault/knowledge_base/ --target medical_knowledge_vectors
```
*This script performs: PDF $\rightarrow$ Text $\rightarrow$ Recursive Chunking $\rightarrow$ Embedding $\rightarrow$ Vector Store.*

**C. Validation Phase**:
Test a specific clinical trigger to ensure the RAG is working:
- **Action**: Open the ICU Dashboard $\rightarrow$ Trigger a Sepsis Alert.
- **Expected Result**: The system should display a citation: *"According to SSC 2021, MAP target should be $\ge 65$ mmHg"* with a link to the source PDF.

### 3. Maintaining the Brain
- **Updating Guidelines**: To update a guideline, delete the old vectors using the `source_id` and re-run the ingestion script for the new file.
- **Monitoring**: Check the `rag_logs` table for "Low Confidence" retrievals to identify gaps in the knowledge base.
