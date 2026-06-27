--
-- PostgreSQL database dump
--

\restrict ooAWetoIp4rSAwR0eihoAohhwNdnjwXaMZea4WQbPAXg27ILhRhp7pT3FmETxmE

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
-- Name: nursing_assessments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.nursing_assessments (
    id integer NOT NULL,
    patient_id integer,
    patient_name text DEFAULT ''::text,
    assessment_type text DEFAULT 'General'::text,
    fall_risk_score integer DEFAULT 0,
    braden_score integer DEFAULT 23,
    pain_score integer DEFAULT 0,
    gcs_score integer DEFAULT 15,
    nurse text DEFAULT ''::text,
    shift text DEFAULT 'Morning'::text,
    notes text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.nursing_assessments OWNER TO postgres;

--
-- Name: nursing_assessments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.nursing_assessments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.nursing_assessments_id_seq OWNER TO postgres;

--
-- Name: nursing_assessments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.nursing_assessments_id_seq OWNED BY public.nursing_assessments.id;


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
-- Name: nursing_assessments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nursing_assessments ALTER COLUMN id SET DEFAULT nextval('public.nursing_assessments_id_seq'::regclass);


--
-- Name: patients id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patients ALTER COLUMN id SET DEFAULT nextval('public.patients_id_seq'::regclass);


--
-- Data for Name: nursing_assessments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.nursing_assessments (id, patient_id, patient_name, assessment_type, fall_risk_score, braden_score, pain_score, gcs_score, nurse, shift, notes, created_at) FROM stdin;
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
-- Name: nursing_assessments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.nursing_assessments_id_seq', 1, false);


--
-- Name: patients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.patients_id_seq', 23, true);


--
-- Name: nursing_assessments nursing_assessments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nursing_assessments
    ADD CONSTRAINT nursing_assessments_pkey PRIMARY KEY (id);


--
-- Name: patients patients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_pkey PRIMARY KEY (id);


--
-- Name: patients; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

--
-- Name: patients rls_patients_tenant_isolation; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY rls_patients_tenant_isolation ON public.patients USING ((tenant_id = (NULLIF(current_setting('app.tenant_id'::text, true), ''::text))::integer)) WITH CHECK ((tenant_id = (NULLIF(current_setting('app.tenant_id'::text, true), ''::text))::integer));


--
-- Name: TABLE nursing_assessments; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.nursing_assessments TO test_rls_user;


--
-- Name: SEQUENCE nursing_assessments_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.nursing_assessments_id_seq TO test_rls_user;


--
-- Name: TABLE patients; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.patients TO test_rls_user;


--
-- Name: SEQUENCE patients_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.patients_id_seq TO test_rls_user;


--
-- PostgreSQL database dump complete
--

\unrestrict ooAWetoIp4rSAwR0eihoAohhwNdnjwXaMZea4WQbPAXg27ILhRhp7pT3FmETxmE

