# Grand Engineering Handover: NamaMedical Enterprise Platform
## 1. System Architecture Map (The Master Flow)

### 1.1 High-Level Data Flow
`User Interface (React/Stitch)` $\rightarrow$ `API Gateway (Express/Node.js)` $\rightarrow$ `Security Layer (JWT/RLS)` $\rightarrow$ `Core Engines (Clinical/Finance)` $\rightarrow$ `Persistence Layer (PostgreSQL/PGVector)` $\rightarrow$ `RAG Intelligence (LangChain/OpenAI)`

### 1.2 Component Breakdown
- **Frontend (The Manifestation)**: 
    - Built with React and Ant Design (Stitch Google System).
    - Modularized by "Waves" (1-10), ensuring that only authorized facility types can access specific clinical modules.
- **Backend (The Engine)**:
    - **API Layer**: RESTful endpoints with strict `validation.js` and `route_schemas.js`.
    - **Security Layer**: `requireTenantScope` middleware ensures that no data leaks between hospitals (Tenant Isolation).
    - **Clinical Engines**: Specialized logic for 100+ departments (e.g., `ews_engine.js`, `finance_engine.js`).
- **Database (The Vault)**:
    - **Relational**: PostgreSQL 14+ with Row-Level Security (RLS) enabled on 150+ tables.
    - **Vector**: PGVector for storing high-dimensional embeddings of medical guidelines.
- **RAG Engine (The Brain)**:
    - **Ingestion**: PDF $\rightarrow$ Text $\rightarrow$ Recursive Character Splitting $\rightarrow$ OpenAI Embeddings $\rightarrow$ PGVector.
    - **Retrieval**: Semantic search based on clinical triggers $\rightarrow$ Contextual augmentation $\rightarrow$ LLM Generation $\rightarrow$ Citation.

---

## 2. Deployment Blueprint (DevOps)

### 2.1 Infrastructure Stack
- **Orchestration**: Kubernetes (K8s) for auto-scaling and self-healing.
- **Containerization**: Docker (Multi-stage builds to minimize image size).
- **Database**: Managed PostgreSQL (e.g., AWS RDS or Azure Database for PostgreSQL) with PGVector extension.
- **Caching**: Redis for session management and API response caching.
- **Storage**: Encrypted S3 buckets for DICOM images and PHI blobs (outside webroot).

### 2.2 CI/CD Pipeline (Zero-Downtime)
1. **Build Phase**: GitHub Actions $\rightarrow$ Linting $\rightarrow$ Unit Tests $\rightarrow$ Docker Image Build.
2. **Staging Phase**: Deploy to a "Blue" environment $\rightarrow$ Automated E2E tests (Playwright).
3. **Production Phase**: Canary Deployment $\rightarrow$ Traffic shift (10% $\rightarrow$ 50% $\rightarrow$ 100%) $\rightarrow$ Health check monitoring.
4. **Rollback**: Instant switch back to "Green" environment if error rates exceed 0.1%.

### 2.3 Scaling Strategy
- **Horizontal Scaling**: K8s Horizontal Pod Autoscaler (HPA) based on CPU/Memory usage.
- **Database Scaling**: Read-Replicas for heavy reporting queries; Connection pooling via `pg-pool`.
- **RAG Scaling**: Asynchronous embedding generation using a message queue (RabbitMQ/Kafka) to prevent API timeouts during large document uploads.

---

## 3. Security Hardening Report

### 3.1 Defense-in-Depth Audit
- **Tenant Isolation**: Verified. `requireTenantScope` is applied to every protected route. RLS is enforced at the DB level (`FORCE_RLS=150`).
- **Authentication**: JWT with short-lived access tokens and secure refresh tokens. MFA (TOTP) implemented for admin roles.
- **Encryption**: 
    - **At Rest**: AES-256 envelope encryption via `crypto_envelope.js` for PHI columns.
    - **In Transit**: TLS 1.3 enforced across all endpoints.
- **Compliance**: 
    - **HIPAA/PDPL**: PHI is isolated in the `phi_vault/` and encrypted.
    - **JCI/CBAHI**: Audit logs are hash-chained and immutable, ensuring a 7-year retention period.

---

## 4. Knowledge Ingestion Guide (Activating the Brain)

### Step-by-Step RAG Activation:
1. **Document Collection**: Gather medical PDFs, Guidelines (SSC, AHA, WHO), and Institutional Protocols.
2. **Preprocessing**: 
    - Convert PDFs to clean Markdown/Text.
    - Remove PII (Personally Identifiable Information) to maintain HIPAA compliance.
3. **Chunking**: Use `RecursiveCharacterTextSplitter` (Chunk size: 1000, Overlap: 200) to preserve clinical context.
4. **Embedding**: Pass chunks through `text-embedding-3-small` (OpenAI) to generate vectors.
5. **Upsert**: Store vectors in the `medical_knowledge_vectors` table with metadata (Source, Page, Section).
6. **Verification**: Run a "Golden Query" (e.g., "Sepsis MAP target") to ensure the RAG retrieves the correct guideline and provides a valid citation.

---

## 5. Operational Manual (For the CMO)

### Managing the 10 Waves:
- **Wave 1-4 (Core Clinical)**: Focus on ER, Cardiology, and ICU. Monitor "Golden Path" metrics (Time-to-Treatment).
- **Wave 5-6 (Critical & Rehab)**: Focus on Sepsis bundles and long-term recovery. Monitor "Patient Outcome" scores.
- **Wave 7-8 (Admin & Diagnostics)**: Focus on Revenue Cycle and AI-Radiology accuracy. Monitor "Billing Leakage" and "Diagnostic Lead Time".
- **Wave 9-10 (Surgery & Rare)**: Focus on Surgical Safety Checklists and Orphan Disease registries. Monitor "Surgical Complication Rates".

**Super-User Command**: Use the `Admin Dashboard` $\rightarrow$ `Resource Monitor` to reallocate beds and staff based on real-time AI predictions.
