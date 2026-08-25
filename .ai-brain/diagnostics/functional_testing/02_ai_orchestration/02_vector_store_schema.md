# Vector Store
Table vec_func_tests (id uuid, chunk text, embedding vector(1536), tenant_id uuid, source_doc text).
Index ivfflat (embedding vector_cosine_ops). Filter: tenant_id = current_setting.
