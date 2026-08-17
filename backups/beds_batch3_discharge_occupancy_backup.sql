--
-- PostgreSQL database dump
--

\restrict fcYQqvalSZgfdf8ooZocxPK1a4yoo92uKQTvvJeKRwWl7YGDLrTlOTem2yA7zag

-- Dumped from database version 16.14
-- Dumped by pg_dump version 16.14

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admissions (
    id integer NOT NULL,
    patient_id integer,
    patient_name text DEFAULT ''::text,
    admission_type text DEFAULT 'Regular'::text,
    admission_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    admitting_doctor text DEFAULT ''::text,
    attending_doctor text DEFAULT ''::text,
    department text DEFAULT ''::text,
    ward_id integer,
    bed_id integer,
    diagnosis text DEFAULT ''::text,
    icd10_code text DEFAULT ''::text,
    admission_orders text DEFAULT ''::text,
    diet_order text DEFAULT 'Regular'::text,
    activity_level text DEFAULT 'Bed Rest'::text,
    dvt_prophylaxis text DEFAULT ''::text,
    expected_los integer DEFAULT 3,
    insurance_auth text DEFAULT ''::text,
    status text DEFAULT 'Active'::text,
    discharge_date text DEFAULT ''::text,
    discharge_type text DEFAULT ''::text,
    discharge_summary text DEFAULT ''::text,
    discharge_instructions text DEFAULT ''::text,
    discharge_medications text DEFAULT ''::text,
    followup_date text DEFAULT ''::text,
    followup_doctor text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id integer,
    facility_id integer
);

ALTER TABLE ONLY public.admissions FORCE ROW LEVEL SECURITY;


ALTER TABLE public.admissions OWNER TO postgres;

--
-- Name: admissions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.admissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admissions_id_seq OWNER TO postgres;

--
-- Name: admissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.admissions_id_seq OWNED BY public.admissions.id;


--
-- Name: bed_transfers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.bed_transfers (
    id integer NOT NULL,
    admission_id integer,
    patient_id integer,
    from_ward integer,
    from_bed integer,
    to_ward integer,
    to_bed integer,
    transfer_reason text DEFAULT ''::text,
    transferred_by text DEFAULT ''::text,
    transfer_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id integer,
    branch_id integer
);

ALTER TABLE ONLY public.bed_transfers FORCE ROW LEVEL SECURITY;


ALTER TABLE public.bed_transfers OWNER TO postgres;

--
-- Name: bed_transfers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.bed_transfers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bed_transfers_id_seq OWNER TO postgres;

--
-- Name: bed_transfers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.bed_transfers_id_seq OWNED BY public.bed_transfers.id;


--
-- Name: beds; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.beds (
    id integer NOT NULL,
    ward_id integer,
    bed_number text DEFAULT ''::text,
    bed_type text DEFAULT 'Standard'::text,
    room_number text DEFAULT ''::text,
    status text DEFAULT 'Available'::text,
    current_patient_id integer DEFAULT 0,
    current_admission_id integer DEFAULT 0,
    isolation_type text DEFAULT ''::text,
    notes text DEFAULT ''::text,
    tenant_id integer,
    branch_id integer
);

ALTER TABLE ONLY public.beds FORCE ROW LEVEL SECURITY;


ALTER TABLE public.beds OWNER TO postgres;

--
-- Name: beds_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.beds_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.beds_id_seq OWNER TO postgres;

--
-- Name: beds_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.beds_id_seq OWNED BY public.beds.id;


--
-- Name: patients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.patients (
    id integer NOT NULL,
    file_number integer DEFAULT 0,
    name_ar text DEFAULT ''::text,
    name_en text DEFAULT ''::text,
    national_id text DEFAULT ''::text,
    phone text DEFAULT ''::text,
    department text DEFAULT ''::text,
    notes text DEFAULT ''::text,
    amount real DEFAULT 0,
    payment_method text DEFAULT ''::text,
    status text DEFAULT 'Waiting'::text,
    dob text DEFAULT ''::text,
    dob_hijri text DEFAULT ''::text,
    age integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    nationality text DEFAULT ''::text,
    blood_type text DEFAULT ''::text,
    gender text DEFAULT ''::text,
    tenant_id integer,
    facility_id integer
);


ALTER TABLE public.patients OWNER TO postgres;

--
-- Name: patients_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.patients_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.patients_id_seq OWNER TO postgres;

--
-- Name: patients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.patients_id_seq OWNED BY public.patients.id;


--
-- Name: wards; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.wards (
    id integer NOT NULL,
    ward_name text DEFAULT ''::text,
    ward_name_ar text DEFAULT ''::text,
    ward_type text DEFAULT 'General'::text,
    floor text DEFAULT ''::text,
    building text DEFAULT ''::text,
    total_beds integer DEFAULT 0,
    status text DEFAULT 'Active'::text,
    notes text DEFAULT ''::text,
    tenant_id integer,
    branch_id integer
);

ALTER TABLE ONLY public.wards FORCE ROW LEVEL SECURITY;


ALTER TABLE public.wards OWNER TO postgres;

--
-- Name: wards_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.wards_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.wards_id_seq OWNER TO postgres;

--
-- Name: wards_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.wards_id_seq OWNED BY public.wards.id;


--
-- Name: admissions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admissions ALTER COLUMN id SET DEFAULT nextval('public.admissions_id_seq'::regclass);


--
-- Name: bed_transfers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bed_transfers ALTER COLUMN id SET DEFAULT nextval('public.bed_transfers_id_seq'::regclass);


--
-- Name: beds id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beds ALTER COLUMN id SET DEFAULT nextval('public.beds_id_seq'::regclass);


--
-- Name: patients id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patients ALTER COLUMN id SET DEFAULT nextval('public.patients_id_seq'::regclass);


--
-- Name: wards id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wards ALTER COLUMN id SET DEFAULT nextval('public.wards_id_seq'::regclass);


--
-- Data for Name: admissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admissions (id, patient_id, patient_name, admission_type, admission_date, admitting_doctor, attending_doctor, department, ward_id, bed_id, diagnosis, icd10_code, admission_orders, diet_order, activity_level, dvt_prophylaxis, expected_los, insurance_auth, status, discharge_date, discharge_type, discharge_summary, discharge_instructions, discharge_medications, followup_date, followup_doctor, created_at, tenant_id, facility_id) FROM stdin;
\.


--
-- Data for Name: bed_transfers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.bed_transfers (id, admission_id, patient_id, from_ward, from_bed, to_ward, to_bed, transfer_reason, transferred_by, transfer_date, tenant_id, branch_id) FROM stdin;
\.


--
-- Data for Name: beds; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.beds (id, ward_id, bed_number, bed_type, room_number, status, current_patient_id, current_admission_id, isolation_type, notes, tenant_id, branch_id) FROM stdin;
1	1	1	Standard	1	Available	0	0			1	1
2	1	2	Standard	1	Available	0	0			1	1
3	1	3	Standard	2	Available	0	0			1	1
4	1	4	Standard	2	Available	0	0			1	1
5	1	5	Standard	3	Available	0	0			1	1
6	1	6	Standard	3	Available	0	0			1	1
7	1	7	Standard	4	Available	0	0			1	1
8	1	8	Standard	4	Available	0	0			1	1
9	1	9	Standard	5	Available	0	0			1	1
10	1	10	Standard	5	Available	0	0			1	1
11	1	11	Standard	6	Available	0	0			1	1
12	1	12	Standard	6	Available	0	0			1	1
13	1	13	Standard	7	Available	0	0			1	1
14	1	14	Standard	7	Available	0	0			1	1
15	1	15	Standard	8	Available	0	0			1	1
16	1	16	Standard	8	Available	0	0			1	1
17	1	17	Standard	9	Available	0	0			1	1
18	1	18	Standard	9	Available	0	0			1	1
19	1	19	Standard	10	Available	0	0			1	1
20	1	20	Standard	10	Available	0	0			1	1
21	2	1	Standard	1	Available	0	0			1	1
22	2	2	Standard	1	Available	0	0			1	1
23	2	3	Standard	2	Available	0	0			1	1
24	2	4	Standard	2	Available	0	0			1	1
25	2	5	Standard	3	Available	0	0			1	1
26	2	6	Standard	3	Available	0	0			1	1
27	2	7	Standard	4	Available	0	0			1	1
28	2	8	Standard	4	Available	0	0			1	1
29	2	9	Standard	5	Available	0	0			1	1
30	2	10	Standard	5	Available	0	0			1	1
31	2	11	Standard	6	Available	0	0			1	1
32	2	12	Standard	6	Available	0	0			1	1
33	2	13	Standard	7	Available	0	0			1	1
34	2	14	Standard	7	Available	0	0			1	1
35	2	15	Standard	8	Available	0	0			1	1
36	2	16	Standard	8	Available	0	0			1	1
37	2	17	Standard	9	Available	0	0			1	1
38	2	18	Standard	9	Available	0	0			1	1
39	2	19	Standard	10	Available	0	0			1	1
40	2	20	Standard	10	Available	0	0			1	1
41	3	1	Standard	1	Available	0	0			1	1
42	3	2	Standard	1	Available	0	0			1	1
43	3	3	Standard	2	Available	0	0			1	1
44	3	4	Standard	2	Available	0	0			1	1
45	3	5	Standard	3	Available	0	0			1	1
46	3	6	Standard	3	Available	0	0			1	1
47	3	7	Standard	4	Available	0	0			1	1
48	3	8	Standard	4	Available	0	0			1	1
49	3	9	Standard	5	Available	0	0			1	1
50	3	10	Standard	5	Available	0	0			1	1
51	3	11	Standard	6	Available	0	0			1	1
52	3	12	Standard	6	Available	0	0			1	1
53	3	13	Standard	7	Available	0	0			1	1
54	3	14	Standard	7	Available	0	0			1	1
55	3	15	Standard	8	Available	0	0			1	1
56	4	1	Standard	1	Available	0	0			1	1
57	4	2	Standard	1	Available	0	0			1	1
58	4	3	Standard	2	Available	0	0			1	1
59	4	4	Standard	2	Available	0	0			1	1
60	4	5	Standard	3	Available	0	0			1	1
61	4	6	Standard	3	Available	0	0			1	1
62	4	7	Standard	4	Available	0	0			1	1
63	4	8	Standard	4	Available	0	0			1	1
64	4	9	Standard	5	Available	0	0			1	1
65	4	10	Standard	5	Available	0	0			1	1
66	5	1	ICU	1	Available	0	0			1	1
67	5	2	ICU	1	Available	0	0			1	1
68	5	3	ICU	2	Available	0	0			1	1
69	5	4	ICU	2	Available	0	0			1	1
70	5	5	ICU	3	Available	0	0			1	1
71	5	6	ICU	3	Available	0	0			1	1
72	5	7	ICU	4	Available	0	0			1	1
73	5	8	ICU	4	Available	0	0			1	1
74	6	1	ICU	1	Available	0	0			1	1
75	6	2	ICU	1	Available	0	0			1	1
76	6	3	ICU	2	Available	0	0			1	1
77	6	4	ICU	2	Available	0	0			1	1
78	6	5	ICU	3	Available	0	0			1	1
79	6	6	ICU	3	Available	0	0			1	1
80	7	1	ICU	1	Available	0	0			1	1
81	7	2	ICU	1	Available	0	0			1	1
82	7	3	ICU	2	Available	0	0			1	1
83	7	4	ICU	2	Available	0	0			1	1
84	7	5	ICU	3	Available	0	0			1	1
85	7	6	ICU	3	Available	0	0			1	1
86	8	1	VIP	1	Available	0	0			1	1
87	8	2	VIP	1	Available	0	0			1	1
88	8	3	VIP	2	Available	0	0			1	1
89	8	4	VIP	2	Available	0	0			1	1
90	8	5	VIP	3	Available	0	0			1	1
91	8	6	VIP	3	Available	0	0			1	1
92	8	7	VIP	4	Available	0	0			1	1
93	8	8	VIP	4	Available	0	0			1	1
94	8	9	VIP	5	Available	0	0			1	1
95	8	10	VIP	5	Available	0	0			1	1
\.


--
-- Data for Name: patients; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.patients (id, file_number, name_ar, name_en, national_id, phone, department, notes, amount, payment_method, status, dob, dob_hijri, age, created_at, nationality, blood_type, gender, tenant_id, facility_id) FROM stdin;
1	1001	أحمد محمد	Ahmed Mohammed	1012345678	0551234567			0		With Doctor			0	2026-06-19 01:16:54.854589				1	1
2	1002	سارة عبدالرحمن	Sarah Abdulrahman	1098765432	0559876543			0		Waiting			0	2026-06-19 01:16:54.854589				1	1
3	1003	فيصل العتيبي	Faisal Al-Otaibi	1054321098	0553456789			0		Waiting			0	2026-06-19 01:16:54.854589				1	1
\.


--
-- Data for Name: wards; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.wards (id, ward_name, ward_name_ar, ward_type, floor, building, total_beds, status, notes, tenant_id, branch_id) FROM stdin;
1	Medical Ward	جناح الباطنة	Medical	2nd Floor		20	Active		1	1
2	Surgical Ward	جناح الجراحة	Surgical	3rd Floor		20	Active		1	1
3	Pediatric Ward	جناح الأطفال	Pediatric	4th Floor		15	Active		1	1
4	Maternity Ward	جناح الولادة	Maternity	4th Floor		10	Active		1	1
5	ICU	العناية المركزة	ICU	2nd Floor		8	Active		1	1
6	NICU	عناية الأطفال المركزة	NICU	4th Floor		6	Active		1	1
7	CCU	عناية القلب	CCU	2nd Floor		6	Active		1	1
8	VIP Ward	جناح كبار الشخصيات	VIP	5th Floor		10	Active		1	1
\.


--
-- Name: admissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admissions_id_seq', 1, false);


--
-- Name: bed_transfers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.bed_transfers_id_seq', 1, false);


--
-- Name: beds_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.beds_id_seq', 95, true);


--
-- Name: patients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.patients_id_seq', 23, true);


--
-- Name: wards_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.wards_id_seq', 9, true);


--
-- Name: admissions admissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admissions
    ADD CONSTRAINT admissions_pkey PRIMARY KEY (id);


--
-- Name: bed_transfers bed_transfers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bed_transfers
    ADD CONSTRAINT bed_transfers_pkey PRIMARY KEY (id);


--
-- Name: beds beds_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beds
    ADD CONSTRAINT beds_pkey PRIMARY KEY (id);


--
-- Name: patients patients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_pkey PRIMARY KEY (id);


--
-- Name: wards wards_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wards
    ADD CONSTRAINT wards_pkey PRIMARY KEY (id);


--
-- Name: idx_admissions_tenant_facility; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_admissions_tenant_facility ON public.admissions USING btree (tenant_id, facility_id);


--
-- Name: idx_beds_tenant_branch; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_beds_tenant_branch ON public.beds USING btree (tenant_id, branch_id);


--
-- Name: idx_wards_tenant_branch; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_wards_tenant_branch ON public.wards USING btree (tenant_id, branch_id);


--
-- Name: beds; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.beds ENABLE ROW LEVEL SECURITY;

--
-- Name: patients; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

--
-- Name: admissions rls_admissions_tenant_isolation; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY rls_admissions_tenant_isolation ON public.admissions USING ((tenant_id = (NULLIF(current_setting('app.tenant_id'::text, true), ''::text))::integer)) WITH CHECK (((tenant_id = (NULLIF(current_setting('app.tenant_id'::text, true), ''::text))::integer) AND ((patient_id IS NULL) OR (( SELECT patients.tenant_id
   FROM public.patients
  WHERE (patients.id = admissions.patient_id)) = tenant_id)) AND ((bed_id IS NULL) OR (( SELECT beds.tenant_id
   FROM public.beds
  WHERE (beds.id = admissions.bed_id)) = tenant_id))));


--
-- Name: bed_transfers rls_bed_transfers_tenant_isolation; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY rls_bed_transfers_tenant_isolation ON public.bed_transfers USING ((tenant_id = (NULLIF(current_setting('app.tenant_id'::text, true), ''::text))::integer)) WITH CHECK (((tenant_id = (NULLIF(current_setting('app.tenant_id'::text, true), ''::text))::integer) AND ((patient_id IS NULL) OR (( SELECT patients.tenant_id
   FROM public.patients
  WHERE (patients.id = bed_transfers.patient_id)) = tenant_id)) AND ((to_bed IS NULL) OR (( SELECT beds.tenant_id
   FROM public.beds
  WHERE (beds.id = bed_transfers.to_bed)) = tenant_id))));


--
-- Name: beds rls_beds_tenant_isolation; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY rls_beds_tenant_isolation ON public.beds USING ((tenant_id = (NULLIF(current_setting('app.tenant_id'::text, true), ''::text))::integer)) WITH CHECK ((tenant_id = (NULLIF(current_setting('app.tenant_id'::text, true), ''::text))::integer));


--
-- Name: patients rls_patients_tenant_isolation; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY rls_patients_tenant_isolation ON public.patients USING ((tenant_id = (NULLIF(current_setting('app.tenant_id'::text, true), ''::text))::integer)) WITH CHECK ((tenant_id = (NULLIF(current_setting('app.tenant_id'::text, true), ''::text))::integer));


--
-- Name: wards rls_wards_tenant_isolation; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY rls_wards_tenant_isolation ON public.wards USING ((tenant_id = (NULLIF(current_setting('app.tenant_id'::text, true), ''::text))::integer)) WITH CHECK ((tenant_id = (NULLIF(current_setting('app.tenant_id'::text, true), ''::text))::integer));


--
-- Name: wards; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.wards ENABLE ROW LEVEL SECURITY;

--
-- Name: TABLE admissions; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.admissions TO test_rls_user;


--
-- Name: SEQUENCE admissions_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.admissions_id_seq TO test_rls_user;


--
-- Name: TABLE bed_transfers; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.bed_transfers TO test_rls_user;


--
-- Name: SEQUENCE bed_transfers_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.bed_transfers_id_seq TO test_rls_user;


--
-- Name: TABLE beds; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.beds TO test_rls_user;


--
-- Name: SEQUENCE beds_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.beds_id_seq TO test_rls_user;


--
-- Name: TABLE patients; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.patients TO test_rls_user;


--
-- Name: SEQUENCE patients_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.patients_id_seq TO test_rls_user;


--
-- Name: TABLE wards; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.wards TO test_rls_user;


--
-- Name: SEQUENCE wards_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.wards_id_seq TO test_rls_user;


--
-- PostgreSQL database dump complete
--

\unrestrict fcYQqvalSZgfdf8ooZocxPK1a4yoo92uKQTvvJeKRwWl7YGDLrTlOTem2yA7zag

