--
-- PostgreSQL database dump
--

\restrict A0OPBHkEO0W0dXPbbZtU4gvpywRUccpXj7oCRcd1DJaVhMMwPxddBcs6h7SAScC

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
-- Name: beds id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beds ALTER COLUMN id SET DEFAULT nextval('public.beds_id_seq'::regclass);


--
-- Name: wards id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wards ALTER COLUMN id SET DEFAULT nextval('public.wards_id_seq'::regclass);


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
-- Name: beds_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.beds_id_seq', 95, true);


--
-- Name: wards_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.wards_id_seq', 8, true);


--
-- Name: beds beds_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beds
    ADD CONSTRAINT beds_pkey PRIMARY KEY (id);


--
-- Name: wards wards_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wards
    ADD CONSTRAINT wards_pkey PRIMARY KEY (id);


--
-- Name: TABLE beds; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.beds TO test_rls_user;


--
-- Name: SEQUENCE beds_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.beds_id_seq TO test_rls_user;


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

\unrestrict A0OPBHkEO0W0dXPbbZtU4gvpywRUccpXj7oCRcd1DJaVhMMwPxddBcs6h7SAScC

