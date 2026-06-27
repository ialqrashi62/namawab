--
-- PostgreSQL database dump
--

\restrict fTHWU88cK6iLSMWxbRO2PMgvdHUdiMAnHYmjB9VhhgNvoduGfaRuMxS38YJnTn0

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
-- Name: consent_forms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.consent_forms (
    id integer NOT NULL,
    patient_id integer,
    patient_name text DEFAULT ''::text,
    form_type text DEFAULT 'general'::text,
    form_title text DEFAULT ''::text,
    form_title_ar text DEFAULT ''::text,
    content text DEFAULT ''::text,
    doctor_name text DEFAULT ''::text,
    patient_signature text DEFAULT ''::text,
    witness_name text DEFAULT ''::text,
    witness_signature text DEFAULT ''::text,
    signed_at text DEFAULT ''::text,
    language text DEFAULT 'ar'::text,
    status text DEFAULT 'Pending'::text,
    surgery_id integer DEFAULT 0,
    notes text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id integer,
    facility_id integer
);


ALTER TABLE public.consent_forms OWNER TO postgres;

--
-- Name: consent_forms_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.consent_forms_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.consent_forms_id_seq OWNER TO postgres;

--
-- Name: consent_forms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.consent_forms_id_seq OWNED BY public.consent_forms.id;


--
-- Name: operating_rooms; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.operating_rooms (
    id integer NOT NULL,
    room_name text DEFAULT ''::text,
    room_name_ar text DEFAULT ''::text,
    location text DEFAULT ''::text,
    equipment text DEFAULT ''::text,
    status text DEFAULT 'Available'::text,
    notes text DEFAULT ''::text,
    tenant_id integer,
    branch_id integer
);


ALTER TABLE public.operating_rooms OWNER TO postgres;

--
-- Name: operating_rooms_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.operating_rooms_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.operating_rooms_id_seq OWNER TO postgres;

--
-- Name: operating_rooms_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.operating_rooms_id_seq OWNED BY public.operating_rooms.id;


--
-- Name: surgeries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.surgeries (
    id integer NOT NULL,
    patient_id integer,
    patient_name text DEFAULT ''::text,
    surgeon_id integer,
    surgeon_name text DEFAULT ''::text,
    anesthetist_id integer,
    anesthetist_name text DEFAULT ''::text,
    procedure_name text DEFAULT ''::text,
    procedure_name_ar text DEFAULT ''::text,
    surgery_type text DEFAULT 'Elective'::text,
    operating_room text DEFAULT ''::text,
    priority text DEFAULT 'Normal'::text,
    scheduled_date text DEFAULT ''::text,
    scheduled_time text DEFAULT ''::text,
    estimated_duration integer DEFAULT 60,
    actual_start text DEFAULT ''::text,
    actual_end text DEFAULT ''::text,
    status text DEFAULT 'Scheduled'::text,
    preop_status text DEFAULT 'Pending'::text,
    notes text DEFAULT ''::text,
    post_op_notes text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id integer,
    facility_id integer
);


ALTER TABLE public.surgeries OWNER TO postgres;

--
-- Name: surgeries_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.surgeries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.surgeries_id_seq OWNER TO postgres;

--
-- Name: surgeries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.surgeries_id_seq OWNED BY public.surgeries.id;


--
-- Name: surgery_anesthesia_records; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.surgery_anesthesia_records (
    id integer NOT NULL,
    surgery_id integer,
    patient_id integer,
    anesthetist_name text DEFAULT ''::text,
    asa_class text DEFAULT 'ASA I'::text,
    anesthesia_type text DEFAULT 'General'::text,
    airway_assessment text DEFAULT ''::text,
    mallampati_score text DEFAULT ''::text,
    premedication text DEFAULT ''::text,
    induction_agents text DEFAULT ''::text,
    maintenance_agents text DEFAULT ''::text,
    muscle_relaxants text DEFAULT ''::text,
    monitors_used text DEFAULT ''::text,
    iv_access text DEFAULT ''::text,
    fluid_given text DEFAULT ''::text,
    blood_loss_ml integer DEFAULT 0,
    complications text DEFAULT ''::text,
    recovery_notes text DEFAULT ''::text,
    notes text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id integer,
    facility_id integer
);


ALTER TABLE public.surgery_anesthesia_records OWNER TO postgres;

--
-- Name: surgery_anesthesia_records_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.surgery_anesthesia_records_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.surgery_anesthesia_records_id_seq OWNER TO postgres;

--
-- Name: surgery_anesthesia_records_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.surgery_anesthesia_records_id_seq OWNED BY public.surgery_anesthesia_records.id;


--
-- Name: surgery_preop_assessments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.surgery_preop_assessments (
    id integer NOT NULL,
    surgery_id integer,
    patient_id integer,
    npo_confirmed integer DEFAULT 0,
    allergies_reviewed integer DEFAULT 0,
    allergies_notes text DEFAULT ''::text,
    medications_reviewed integer DEFAULT 0,
    medications_notes text DEFAULT ''::text,
    labs_reviewed integer DEFAULT 0,
    labs_notes text DEFAULT ''::text,
    imaging_reviewed integer DEFAULT 0,
    imaging_notes text DEFAULT ''::text,
    blood_type_confirmed integer DEFAULT 0,
    blood_reserved integer DEFAULT 0,
    consent_signed integer DEFAULT 0,
    anesthesia_clearance integer DEFAULT 0,
    nursing_assessment integer DEFAULT 0,
    nursing_notes text DEFAULT ''::text,
    cardiac_clearance integer DEFAULT 0,
    cardiac_notes text DEFAULT ''::text,
    pulmonary_clearance integer DEFAULT 0,
    infection_screening integer DEFAULT 0,
    dvt_prophylaxis integer DEFAULT 0,
    overall_status text DEFAULT 'Incomplete'::text,
    assessed_by text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id integer,
    facility_id integer
);


ALTER TABLE public.surgery_preop_assessments OWNER TO postgres;

--
-- Name: surgery_preop_assessments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.surgery_preop_assessments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.surgery_preop_assessments_id_seq OWNER TO postgres;

--
-- Name: surgery_preop_assessments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.surgery_preop_assessments_id_seq OWNED BY public.surgery_preop_assessments.id;


--
-- Name: surgery_preop_tests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.surgery_preop_tests (
    id integer NOT NULL,
    surgery_id integer,
    patient_id integer,
    test_type text DEFAULT ''::text,
    test_name text DEFAULT ''::text,
    is_required integer DEFAULT 1,
    is_completed integer DEFAULT 0,
    result_summary text DEFAULT ''::text,
    order_id integer DEFAULT 0,
    notes text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id integer,
    facility_id integer
);


ALTER TABLE public.surgery_preop_tests OWNER TO postgres;

--
-- Name: surgery_preop_tests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.surgery_preop_tests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.surgery_preop_tests_id_seq OWNER TO postgres;

--
-- Name: surgery_preop_tests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.surgery_preop_tests_id_seq OWNED BY public.surgery_preop_tests.id;


--
-- Name: consent_forms id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consent_forms ALTER COLUMN id SET DEFAULT nextval('public.consent_forms_id_seq'::regclass);


--
-- Name: operating_rooms id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.operating_rooms ALTER COLUMN id SET DEFAULT nextval('public.operating_rooms_id_seq'::regclass);


--
-- Name: surgeries id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.surgeries ALTER COLUMN id SET DEFAULT nextval('public.surgeries_id_seq'::regclass);


--
-- Name: surgery_anesthesia_records id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.surgery_anesthesia_records ALTER COLUMN id SET DEFAULT nextval('public.surgery_anesthesia_records_id_seq'::regclass);


--
-- Name: surgery_preop_assessments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.surgery_preop_assessments ALTER COLUMN id SET DEFAULT nextval('public.surgery_preop_assessments_id_seq'::regclass);


--
-- Name: surgery_preop_tests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.surgery_preop_tests ALTER COLUMN id SET DEFAULT nextval('public.surgery_preop_tests_id_seq'::regclass);


--
-- Data for Name: consent_forms; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.consent_forms (id, patient_id, patient_name, form_type, form_title, form_title_ar, content, doctor_name, patient_signature, witness_name, witness_signature, signed_at, language, status, surgery_id, notes, created_at, tenant_id, facility_id) FROM stdin;
\.


--
-- Data for Name: operating_rooms; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.operating_rooms (id, room_name, room_name_ar, location, equipment, status, notes, tenant_id, branch_id) FROM stdin;
1	OR-1	غرفة عمليات 1	الطابق الثاني	General Surgery Equipment	Available		1	1
2	OR-2	غرفة عمليات 2	الطابق الثاني	Orthopedic Equipment	Available		1	1
3	OR-3	غرفة عمليات 3	الطابق الثالث	Cardiac Equipment	Available		1	1
4	Minor OR	غرفة عمليات صغرى	الطابق الأول	Minor Procedures Equipment	Available		1	1
\.


--
-- Data for Name: surgeries; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.surgeries (id, patient_id, patient_name, surgeon_id, surgeon_name, anesthetist_id, anesthetist_name, procedure_name, procedure_name_ar, surgery_type, operating_room, priority, scheduled_date, scheduled_time, estimated_duration, actual_start, actual_end, status, preop_status, notes, post_op_notes, created_at, tenant_id, facility_id) FROM stdin;
\.


--
-- Data for Name: surgery_anesthesia_records; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.surgery_anesthesia_records (id, surgery_id, patient_id, anesthetist_name, asa_class, anesthesia_type, airway_assessment, mallampati_score, premedication, induction_agents, maintenance_agents, muscle_relaxants, monitors_used, iv_access, fluid_given, blood_loss_ml, complications, recovery_notes, notes, created_at, tenant_id, facility_id) FROM stdin;
\.


--
-- Data for Name: surgery_preop_assessments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.surgery_preop_assessments (id, surgery_id, patient_id, npo_confirmed, allergies_reviewed, allergies_notes, medications_reviewed, medications_notes, labs_reviewed, labs_notes, imaging_reviewed, imaging_notes, blood_type_confirmed, blood_reserved, consent_signed, anesthesia_clearance, nursing_assessment, nursing_notes, cardiac_clearance, cardiac_notes, pulmonary_clearance, infection_screening, dvt_prophylaxis, overall_status, assessed_by, created_at, tenant_id, facility_id) FROM stdin;
\.


--
-- Data for Name: surgery_preop_tests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.surgery_preop_tests (id, surgery_id, patient_id, test_type, test_name, is_required, is_completed, result_summary, order_id, notes, created_at, tenant_id, facility_id) FROM stdin;
\.


--
-- Name: consent_forms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.consent_forms_id_seq', 1, false);


--
-- Name: operating_rooms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.operating_rooms_id_seq', 4, true);


--
-- Name: surgeries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.surgeries_id_seq', 1, false);


--
-- Name: surgery_anesthesia_records_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.surgery_anesthesia_records_id_seq', 1, false);


--
-- Name: surgery_preop_assessments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.surgery_preop_assessments_id_seq', 1, false);


--
-- Name: surgery_preop_tests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.surgery_preop_tests_id_seq', 1, false);


--
-- Name: consent_forms consent_forms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consent_forms
    ADD CONSTRAINT consent_forms_pkey PRIMARY KEY (id);


--
-- Name: operating_rooms operating_rooms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.operating_rooms
    ADD CONSTRAINT operating_rooms_pkey PRIMARY KEY (id);


--
-- Name: surgeries surgeries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.surgeries
    ADD CONSTRAINT surgeries_pkey PRIMARY KEY (id);


--
-- Name: surgery_anesthesia_records surgery_anesthesia_records_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.surgery_anesthesia_records
    ADD CONSTRAINT surgery_anesthesia_records_pkey PRIMARY KEY (id);


--
-- Name: surgery_preop_assessments surgery_preop_assessments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.surgery_preop_assessments
    ADD CONSTRAINT surgery_preop_assessments_pkey PRIMARY KEY (id);


--
-- Name: surgery_preop_tests surgery_preop_tests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.surgery_preop_tests
    ADD CONSTRAINT surgery_preop_tests_pkey PRIMARY KEY (id);


--
-- Name: idx_consent_forms_tenant_facility; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_consent_forms_tenant_facility ON public.consent_forms USING btree (tenant_id, facility_id);


--
-- Name: idx_surgeries_tenant_facility; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_surgeries_tenant_facility ON public.surgeries USING btree (tenant_id, facility_id);


--
-- Name: TABLE consent_forms; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.consent_forms TO test_rls_user;


--
-- Name: SEQUENCE consent_forms_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.consent_forms_id_seq TO test_rls_user;


--
-- Name: TABLE operating_rooms; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.operating_rooms TO test_rls_user;


--
-- Name: SEQUENCE operating_rooms_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.operating_rooms_id_seq TO test_rls_user;


--
-- Name: TABLE surgeries; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.surgeries TO test_rls_user;


--
-- Name: SEQUENCE surgeries_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.surgeries_id_seq TO test_rls_user;


--
-- Name: TABLE surgery_anesthesia_records; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.surgery_anesthesia_records TO test_rls_user;


--
-- Name: SEQUENCE surgery_anesthesia_records_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.surgery_anesthesia_records_id_seq TO test_rls_user;


--
-- Name: TABLE surgery_preop_assessments; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.surgery_preop_assessments TO test_rls_user;


--
-- Name: SEQUENCE surgery_preop_assessments_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.surgery_preop_assessments_id_seq TO test_rls_user;


--
-- Name: TABLE surgery_preop_tests; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.surgery_preop_tests TO test_rls_user;


--
-- Name: SEQUENCE surgery_preop_tests_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.surgery_preop_tests_id_seq TO test_rls_user;


--
-- PostgreSQL database dump complete
--

\unrestrict fTHWU88cK6iLSMWxbRO2PMgvdHUdiMAnHYmjB9VhhgNvoduGfaRuMxS38YJnTn0

