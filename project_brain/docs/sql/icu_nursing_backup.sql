--
-- PostgreSQL database dump
--

\restrict 3o9hJ2gbAHccmSaDURZLcRXPweWruXFye4tO04yuBflzcwAgb6i3N93ZhsIzFmL

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
-- Name: emar_administrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.emar_administrations (
    id integer NOT NULL,
    emar_order_id integer,
    patient_id integer,
    medication text DEFAULT ''::text,
    dose text DEFAULT ''::text,
    scheduled_time text DEFAULT ''::text,
    actual_time text DEFAULT ''::text,
    administered_by text DEFAULT ''::text,
    status text DEFAULT 'Given'::text,
    reason_not_given text DEFAULT ''::text,
    vital_signs text DEFAULT ''::text,
    notes text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id integer,
    facility_id integer
);


ALTER TABLE public.emar_administrations OWNER TO postgres;

--
-- Name: emar_administrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.emar_administrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.emar_administrations_id_seq OWNER TO postgres;

--
-- Name: emar_administrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.emar_administrations_id_seq OWNED BY public.emar_administrations.id;


--
-- Name: emar_orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.emar_orders (
    id integer NOT NULL,
    patient_id integer,
    patient_name text DEFAULT ''::text,
    admission_id integer,
    medication text DEFAULT ''::text,
    dose text DEFAULT ''::text,
    route text DEFAULT 'Oral'::text,
    frequency text DEFAULT 'TID'::text,
    start_date text DEFAULT ''::text,
    end_date text DEFAULT ''::text,
    prescriber text DEFAULT ''::text,
    status text DEFAULT 'Active'::text,
    notes text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id integer,
    facility_id integer
);


ALTER TABLE public.emar_orders OWNER TO postgres;

--
-- Name: emar_orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.emar_orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.emar_orders_id_seq OWNER TO postgres;

--
-- Name: emar_orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.emar_orders_id_seq OWNED BY public.emar_orders.id;


--
-- Name: icu_fluid_balance; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.icu_fluid_balance (
    id integer NOT NULL,
    admission_id integer,
    patient_id integer,
    balance_date text DEFAULT ''::text,
    shift text DEFAULT 'Day'::text,
    iv_fluids integer DEFAULT 0,
    oral_intake integer DEFAULT 0,
    blood_products integer DEFAULT 0,
    medications_iv integer DEFAULT 0,
    total_intake integer DEFAULT 0,
    urine integer DEFAULT 0,
    drains integer DEFAULT 0,
    ngt_output integer DEFAULT 0,
    stool integer DEFAULT 0,
    vomit integer DEFAULT 0,
    insensible integer DEFAULT 0,
    total_output integer DEFAULT 0,
    net_balance integer DEFAULT 0,
    recorded_by text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id integer,
    facility_id integer
);


ALTER TABLE public.icu_fluid_balance OWNER TO postgres;

--
-- Name: icu_fluid_balance_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.icu_fluid_balance_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.icu_fluid_balance_id_seq OWNER TO postgres;

--
-- Name: icu_fluid_balance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.icu_fluid_balance_id_seq OWNED BY public.icu_fluid_balance.id;


--
-- Name: icu_monitoring; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.icu_monitoring (
    id integer NOT NULL,
    admission_id integer,
    patient_id integer,
    monitor_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    hr integer DEFAULT 0,
    sbp integer DEFAULT 0,
    dbp integer DEFAULT 0,
    map integer DEFAULT 0,
    rr integer DEFAULT 0,
    spo2 integer DEFAULT 0,
    temp real DEFAULT 0,
    etco2 integer DEFAULT 0,
    cvp integer DEFAULT 0,
    fio2 integer DEFAULT 0,
    peep integer DEFAULT 0,
    urine_output integer DEFAULT 0,
    notes text DEFAULT ''::text,
    recorded_by text DEFAULT ''::text,
    tenant_id integer,
    facility_id integer
);


ALTER TABLE public.icu_monitoring OWNER TO postgres;

--
-- Name: icu_monitoring_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.icu_monitoring_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.icu_monitoring_id_seq OWNER TO postgres;

--
-- Name: icu_monitoring_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.icu_monitoring_id_seq OWNED BY public.icu_monitoring.id;


--
-- Name: icu_scores; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.icu_scores (
    id integer NOT NULL,
    admission_id integer,
    patient_id integer,
    score_date text DEFAULT ''::text,
    apache_ii integer DEFAULT 0,
    sofa integer DEFAULT 0,
    gcs integer DEFAULT 15,
    rass integer DEFAULT 0,
    cam_icu integer DEFAULT 0,
    braden integer DEFAULT 23,
    morse_fall integer DEFAULT 0,
    pain_score integer DEFAULT 0,
    calculated_by text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id integer,
    facility_id integer
);


ALTER TABLE public.icu_scores OWNER TO postgres;

--
-- Name: icu_scores_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.icu_scores_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.icu_scores_id_seq OWNER TO postgres;

--
-- Name: icu_scores_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.icu_scores_id_seq OWNED BY public.icu_scores.id;


--
-- Name: icu_ventilator; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.icu_ventilator (
    id integer NOT NULL,
    admission_id integer,
    patient_id integer,
    vent_mode text DEFAULT ''::text,
    fio2 integer DEFAULT 21,
    tidal_volume integer DEFAULT 0,
    respiratory_rate integer DEFAULT 0,
    peep integer DEFAULT 0,
    pip integer DEFAULT 0,
    ie_ratio text DEFAULT '1:2'::text,
    ps integer DEFAULT 0,
    started_at text DEFAULT ''::text,
    ended_at text DEFAULT ''::text,
    ett_size text DEFAULT ''::text,
    ett_position text DEFAULT ''::text,
    cuff_pressure integer DEFAULT 0,
    notes text DEFAULT ''::text,
    recorded_by text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id integer,
    facility_id integer
);


ALTER TABLE public.icu_ventilator OWNER TO postgres;

--
-- Name: icu_ventilator_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.icu_ventilator_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.icu_ventilator_id_seq OWNER TO postgres;

--
-- Name: icu_ventilator_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.icu_ventilator_id_seq OWNED BY public.icu_ventilator.id;


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
-- Name: nursing_care_plans; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.nursing_care_plans (
    id integer NOT NULL,
    patient_id integer,
    patient_name text DEFAULT ''::text,
    admission_id integer,
    diagnosis text DEFAULT ''::text,
    priority text DEFAULT 'Medium'::text,
    goals text DEFAULT ''::text,
    interventions text DEFAULT ''::text,
    expected_outcomes text DEFAULT ''::text,
    nurse text DEFAULT ''::text,
    status text DEFAULT 'Active'::text,
    review_date text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id integer,
    facility_id integer
);


ALTER TABLE public.nursing_care_plans OWNER TO postgres;

--
-- Name: nursing_care_plans_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.nursing_care_plans_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.nursing_care_plans_id_seq OWNER TO postgres;

--
-- Name: nursing_care_plans_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.nursing_care_plans_id_seq OWNED BY public.nursing_care_plans.id;


--
-- Name: nursing_vitals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.nursing_vitals (
    id integer NOT NULL,
    patient_id integer,
    patient_name text DEFAULT ''::text,
    bp text DEFAULT ''::text,
    temp real DEFAULT 0,
    weight real DEFAULT 0,
    pulse integer DEFAULT 0,
    o2_sat integer DEFAULT 0,
    notes text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    height real DEFAULT 0,
    respiratory_rate integer DEFAULT 0,
    blood_sugar integer DEFAULT 0,
    chronic_diseases text DEFAULT ''::text,
    current_medications text DEFAULT ''::text,
    allergies text DEFAULT ''::text,
    tenant_id integer,
    facility_id integer
);


ALTER TABLE public.nursing_vitals OWNER TO postgres;

--
-- Name: nursing_vitals_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.nursing_vitals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.nursing_vitals_id_seq OWNER TO postgres;

--
-- Name: nursing_vitals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.nursing_vitals_id_seq OWNED BY public.nursing_vitals.id;


--
-- Name: emar_administrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emar_administrations ALTER COLUMN id SET DEFAULT nextval('public.emar_administrations_id_seq'::regclass);


--
-- Name: emar_orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emar_orders ALTER COLUMN id SET DEFAULT nextval('public.emar_orders_id_seq'::regclass);


--
-- Name: icu_fluid_balance id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.icu_fluid_balance ALTER COLUMN id SET DEFAULT nextval('public.icu_fluid_balance_id_seq'::regclass);


--
-- Name: icu_monitoring id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.icu_monitoring ALTER COLUMN id SET DEFAULT nextval('public.icu_monitoring_id_seq'::regclass);


--
-- Name: icu_scores id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.icu_scores ALTER COLUMN id SET DEFAULT nextval('public.icu_scores_id_seq'::regclass);


--
-- Name: icu_ventilator id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.icu_ventilator ALTER COLUMN id SET DEFAULT nextval('public.icu_ventilator_id_seq'::regclass);


--
-- Name: nursing_assessments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nursing_assessments ALTER COLUMN id SET DEFAULT nextval('public.nursing_assessments_id_seq'::regclass);


--
-- Name: nursing_care_plans id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nursing_care_plans ALTER COLUMN id SET DEFAULT nextval('public.nursing_care_plans_id_seq'::regclass);


--
-- Name: nursing_vitals id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nursing_vitals ALTER COLUMN id SET DEFAULT nextval('public.nursing_vitals_id_seq'::regclass);


--
-- Data for Name: emar_administrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.emar_administrations (id, emar_order_id, patient_id, medication, dose, scheduled_time, actual_time, administered_by, status, reason_not_given, vital_signs, notes, created_at, tenant_id, facility_id) FROM stdin;
\.


--
-- Data for Name: emar_orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.emar_orders (id, patient_id, patient_name, admission_id, medication, dose, route, frequency, start_date, end_date, prescriber, status, notes, created_at, tenant_id, facility_id) FROM stdin;
\.


--
-- Data for Name: icu_fluid_balance; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.icu_fluid_balance (id, admission_id, patient_id, balance_date, shift, iv_fluids, oral_intake, blood_products, medications_iv, total_intake, urine, drains, ngt_output, stool, vomit, insensible, total_output, net_balance, recorded_by, created_at, tenant_id, facility_id) FROM stdin;
\.


--
-- Data for Name: icu_monitoring; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.icu_monitoring (id, admission_id, patient_id, monitor_time, hr, sbp, dbp, map, rr, spo2, temp, etco2, cvp, fio2, peep, urine_output, notes, recorded_by, tenant_id, facility_id) FROM stdin;
\.


--
-- Data for Name: icu_scores; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.icu_scores (id, admission_id, patient_id, score_date, apache_ii, sofa, gcs, rass, cam_icu, braden, morse_fall, pain_score, calculated_by, created_at, tenant_id, facility_id) FROM stdin;
\.


--
-- Data for Name: icu_ventilator; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.icu_ventilator (id, admission_id, patient_id, vent_mode, fio2, tidal_volume, respiratory_rate, peep, pip, ie_ratio, ps, started_at, ended_at, ett_size, ett_position, cuff_pressure, notes, recorded_by, created_at, tenant_id, facility_id) FROM stdin;
\.


--
-- Data for Name: nursing_assessments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.nursing_assessments (id, patient_id, patient_name, assessment_type, fall_risk_score, braden_score, pain_score, gcs_score, nurse, shift, notes, created_at) FROM stdin;
\.


--
-- Data for Name: nursing_care_plans; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.nursing_care_plans (id, patient_id, patient_name, admission_id, diagnosis, priority, goals, interventions, expected_outcomes, nurse, status, review_date, created_at, tenant_id, facility_id) FROM stdin;
\.


--
-- Data for Name: nursing_vitals; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.nursing_vitals (id, patient_id, patient_name, bp, temp, weight, pulse, o2_sat, notes, created_at, height, respiratory_rate, blood_sugar, chronic_diseases, current_medications, allergies, tenant_id, facility_id) FROM stdin;
\.


--
-- Name: emar_administrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.emar_administrations_id_seq', 1, false);


--
-- Name: emar_orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.emar_orders_id_seq', 1, false);


--
-- Name: icu_fluid_balance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.icu_fluid_balance_id_seq', 1, false);


--
-- Name: icu_monitoring_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.icu_monitoring_id_seq', 1, false);


--
-- Name: icu_scores_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.icu_scores_id_seq', 1, false);


--
-- Name: icu_ventilator_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.icu_ventilator_id_seq', 1, false);


--
-- Name: nursing_assessments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.nursing_assessments_id_seq', 1, false);


--
-- Name: nursing_care_plans_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.nursing_care_plans_id_seq', 1, false);


--
-- Name: nursing_vitals_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.nursing_vitals_id_seq', 1, false);


--
-- Name: emar_administrations emar_administrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emar_administrations
    ADD CONSTRAINT emar_administrations_pkey PRIMARY KEY (id);


--
-- Name: emar_orders emar_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emar_orders
    ADD CONSTRAINT emar_orders_pkey PRIMARY KEY (id);


--
-- Name: icu_fluid_balance icu_fluid_balance_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.icu_fluid_balance
    ADD CONSTRAINT icu_fluid_balance_pkey PRIMARY KEY (id);


--
-- Name: icu_monitoring icu_monitoring_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.icu_monitoring
    ADD CONSTRAINT icu_monitoring_pkey PRIMARY KEY (id);


--
-- Name: icu_scores icu_scores_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.icu_scores
    ADD CONSTRAINT icu_scores_pkey PRIMARY KEY (id);


--
-- Name: icu_ventilator icu_ventilator_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.icu_ventilator
    ADD CONSTRAINT icu_ventilator_pkey PRIMARY KEY (id);


--
-- Name: nursing_assessments nursing_assessments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nursing_assessments
    ADD CONSTRAINT nursing_assessments_pkey PRIMARY KEY (id);


--
-- Name: nursing_care_plans nursing_care_plans_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nursing_care_plans
    ADD CONSTRAINT nursing_care_plans_pkey PRIMARY KEY (id);


--
-- Name: nursing_vitals nursing_vitals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nursing_vitals
    ADD CONSTRAINT nursing_vitals_pkey PRIMARY KEY (id);


--
-- Name: idx_nursing_vitals_tenant_facility; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_nursing_vitals_tenant_facility ON public.nursing_vitals USING btree (tenant_id, facility_id, patient_id);


--
-- Name: nursing_vitals; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.nursing_vitals ENABLE ROW LEVEL SECURITY;

--
-- Name: nursing_vitals rls_nursing_vitals_tenant_isolation; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY rls_nursing_vitals_tenant_isolation ON public.nursing_vitals USING ((tenant_id = (NULLIF(current_setting('app.tenant_id'::text, true), ''::text))::integer)) WITH CHECK ((tenant_id = (NULLIF(current_setting('app.tenant_id'::text, true), ''::text))::integer));


--
-- Name: TABLE emar_administrations; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.emar_administrations TO test_rls_user;


--
-- Name: SEQUENCE emar_administrations_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.emar_administrations_id_seq TO test_rls_user;


--
-- Name: TABLE emar_orders; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.emar_orders TO test_rls_user;


--
-- Name: SEQUENCE emar_orders_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.emar_orders_id_seq TO test_rls_user;


--
-- Name: TABLE icu_fluid_balance; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.icu_fluid_balance TO test_rls_user;


--
-- Name: SEQUENCE icu_fluid_balance_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.icu_fluid_balance_id_seq TO test_rls_user;


--
-- Name: TABLE icu_monitoring; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.icu_monitoring TO test_rls_user;


--
-- Name: SEQUENCE icu_monitoring_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.icu_monitoring_id_seq TO test_rls_user;


--
-- Name: TABLE icu_scores; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.icu_scores TO test_rls_user;


--
-- Name: SEQUENCE icu_scores_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.icu_scores_id_seq TO test_rls_user;


--
-- Name: TABLE icu_ventilator; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.icu_ventilator TO test_rls_user;


--
-- Name: SEQUENCE icu_ventilator_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.icu_ventilator_id_seq TO test_rls_user;


--
-- Name: TABLE nursing_assessments; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.nursing_assessments TO test_rls_user;


--
-- Name: SEQUENCE nursing_assessments_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.nursing_assessments_id_seq TO test_rls_user;


--
-- Name: TABLE nursing_care_plans; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.nursing_care_plans TO test_rls_user;


--
-- Name: SEQUENCE nursing_care_plans_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.nursing_care_plans_id_seq TO test_rls_user;


--
-- Name: TABLE nursing_vitals; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.nursing_vitals TO test_rls_user;


--
-- Name: SEQUENCE nursing_vitals_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.nursing_vitals_id_seq TO test_rls_user;


--
-- PostgreSQL database dump complete
--

\unrestrict 3o9hJ2gbAHccmSaDURZLcRXPweWruXFye4tO04yuBflzcwAgb6i3N93ZhsIzFmL

