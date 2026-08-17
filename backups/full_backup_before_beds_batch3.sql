--
-- PostgreSQL database dump
--

\restrict yZz0CHAok1zTATX7KoKNVtkAnYdCyqaaYMPk6E7pJUWUfPB703LPMwt23vphsib

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
-- Name: admission_daily_rounds; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.admission_daily_rounds (
    id integer NOT NULL,
    admission_id integer,
    patient_id integer,
    round_date text DEFAULT ''::text,
    round_time text DEFAULT ''::text,
    doctor_name text DEFAULT ''::text,
    subjective text DEFAULT ''::text,
    objective text DEFAULT ''::text,
    assessment text DEFAULT ''::text,
    plan text DEFAULT ''::text,
    vitals_summary text DEFAULT ''::text,
    orders text DEFAULT ''::text,
    diet_changes text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id integer,
    facility_id integer
);


ALTER TABLE public.admission_daily_rounds OWNER TO postgres;

--
-- Name: admission_daily_rounds_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.admission_daily_rounds_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.admission_daily_rounds_id_seq OWNER TO postgres;

--
-- Name: admission_daily_rounds_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.admission_daily_rounds_id_seq OWNED BY public.admission_daily_rounds.id;


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
-- Name: appointments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.appointments (
    id integer NOT NULL,
    patient_id integer,
    patient_name text DEFAULT ''::text,
    doctor_name text DEFAULT ''::text,
    department text DEFAULT ''::text,
    appt_date text DEFAULT ''::text,
    appt_time text DEFAULT ''::text,
    notes text DEFAULT ''::text,
    status text DEFAULT 'Confirmed'::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id integer,
    branch_id integer
);


ALTER TABLE public.appointments OWNER TO postgres;

--
-- Name: appointments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.appointments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.appointments_id_seq OWNER TO postgres;

--
-- Name: appointments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.appointments_id_seq OWNED BY public.appointments.id;


--
-- Name: approvals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.approvals (
    id integer NOT NULL,
    patient_id integer,
    service_id integer,
    request_date text DEFAULT ''::text,
    status text DEFAULT 'Pending'::text,
    approval_number text DEFAULT ''::text,
    response_date text DEFAULT ''::text
);


ALTER TABLE public.approvals OWNER TO postgres;

--
-- Name: approvals_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.approvals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.approvals_id_seq OWNER TO postgres;

--
-- Name: approvals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.approvals_id_seq OWNED BY public.approvals.id;


--
-- Name: audit_trail; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.audit_trail (
    id integer NOT NULL,
    user_id integer,
    username text DEFAULT ''::text,
    action text DEFAULT ''::text,
    module text DEFAULT ''::text,
    record_id integer DEFAULT 0,
    old_values text DEFAULT ''::text,
    new_values text DEFAULT ''::text,
    ip_address text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id integer,
    user_name text DEFAULT ''::text,
    details text DEFAULT ''::text
);


ALTER TABLE public.audit_trail OWNER TO postgres;

--
-- Name: audit_trail_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.audit_trail_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.audit_trail_id_seq OWNER TO postgres;

--
-- Name: audit_trail_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.audit_trail_id_seq OWNED BY public.audit_trail.id;


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
-- Name: blood_bank_crossmatch; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.blood_bank_crossmatch (
    id integer NOT NULL,
    patient_id integer,
    patient_name text DEFAULT ''::text,
    patient_blood_type text DEFAULT ''::text,
    units_needed integer DEFAULT 1,
    unit_id integer DEFAULT 0,
    lab_technician text DEFAULT ''::text,
    result text DEFAULT 'Pending'::text,
    surgery_id integer DEFAULT 0,
    notes text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.blood_bank_crossmatch OWNER TO postgres;

--
-- Name: blood_bank_crossmatch_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.blood_bank_crossmatch_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.blood_bank_crossmatch_id_seq OWNER TO postgres;

--
-- Name: blood_bank_crossmatch_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.blood_bank_crossmatch_id_seq OWNED BY public.blood_bank_crossmatch.id;


--
-- Name: blood_bank_donors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.blood_bank_donors (
    id integer NOT NULL,
    donor_name text DEFAULT ''::text,
    donor_name_ar text DEFAULT ''::text,
    national_id text DEFAULT ''::text,
    phone text DEFAULT ''::text,
    blood_type text DEFAULT ''::text,
    rh_factor text DEFAULT '+'::text,
    age integer DEFAULT 0,
    gender text DEFAULT ''::text,
    last_donation_date text DEFAULT ''::text,
    is_eligible integer DEFAULT 1,
    medical_history text DEFAULT ''::text,
    notes text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.blood_bank_donors OWNER TO postgres;

--
-- Name: blood_bank_donors_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.blood_bank_donors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.blood_bank_donors_id_seq OWNER TO postgres;

--
-- Name: blood_bank_donors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.blood_bank_donors_id_seq OWNED BY public.blood_bank_donors.id;


--
-- Name: blood_bank_transfusions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.blood_bank_transfusions (
    id integer NOT NULL,
    patient_id integer,
    patient_name text DEFAULT ''::text,
    unit_id integer,
    bag_number text DEFAULT ''::text,
    blood_type text DEFAULT ''::text,
    component text DEFAULT ''::text,
    administered_by text DEFAULT ''::text,
    start_time text DEFAULT ''::text,
    end_time text DEFAULT ''::text,
    volume_ml integer DEFAULT 0,
    adverse_reaction integer DEFAULT 0,
    reaction_details text DEFAULT ''::text,
    vital_signs_before text DEFAULT ''::text,
    vital_signs_after text DEFAULT ''::text,
    notes text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.blood_bank_transfusions OWNER TO postgres;

--
-- Name: blood_bank_transfusions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.blood_bank_transfusions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.blood_bank_transfusions_id_seq OWNER TO postgres;

--
-- Name: blood_bank_transfusions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.blood_bank_transfusions_id_seq OWNED BY public.blood_bank_transfusions.id;


--
-- Name: blood_bank_units; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.blood_bank_units (
    id integer NOT NULL,
    bag_number text DEFAULT ''::text,
    blood_type text DEFAULT ''::text,
    rh_factor text DEFAULT '+'::text,
    component text DEFAULT 'Whole Blood'::text,
    donor_id integer DEFAULT 0,
    collection_date text DEFAULT ''::text,
    expiry_date text DEFAULT ''::text,
    volume_ml integer DEFAULT 450,
    status text DEFAULT 'Available'::text,
    storage_location text DEFAULT ''::text,
    notes text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.blood_bank_units OWNER TO postgres;

--
-- Name: blood_bank_units_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.blood_bank_units_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.blood_bank_units_id_seq OWNER TO postgres;

--
-- Name: blood_bank_units_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.blood_bank_units_id_seq OWNED BY public.blood_bank_units.id;


--
-- Name: branches; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.branches (
    id integer NOT NULL,
    facility_id integer NOT NULL,
    name character varying(255) NOT NULL,
    address text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.branches OWNER TO postgres;

--
-- Name: branches_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.branches_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.branches_id_seq OWNER TO postgres;

--
-- Name: branches_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.branches_id_seq OWNED BY public.branches.id;


--
-- Name: clinical_pharmacy_reviews; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.clinical_pharmacy_reviews (
    id integer NOT NULL,
    patient_id integer,
    patient_name text DEFAULT ''::text,
    prescription_id integer,
    review_type text DEFAULT 'Medication Review'::text,
    pharmacist text DEFAULT ''::text,
    findings text DEFAULT ''::text,
    recommendations text DEFAULT ''::text,
    interventions text DEFAULT ''::text,
    outcome text DEFAULT 'Pending'::text,
    severity text DEFAULT 'Low'::text,
    status text DEFAULT 'Open'::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.clinical_pharmacy_reviews OWNER TO postgres;

--
-- Name: clinical_pharmacy_reviews_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.clinical_pharmacy_reviews_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.clinical_pharmacy_reviews_id_seq OWNER TO postgres;

--
-- Name: clinical_pharmacy_reviews_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.clinical_pharmacy_reviews_id_seq OWNED BY public.clinical_pharmacy_reviews.id;


--
-- Name: cme_activities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cme_activities (
    id integer NOT NULL,
    title text DEFAULT ''::text,
    category text DEFAULT 'Conference'::text,
    provider text DEFAULT ''::text,
    credit_hours numeric(4,1) DEFAULT 0,
    activity_date text DEFAULT ''::text,
    location text DEFAULT ''::text,
    max_participants integer DEFAULT 50,
    registered integer DEFAULT 0,
    status text DEFAULT 'Upcoming'::text,
    description text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.cme_activities OWNER TO postgres;

--
-- Name: cme_activities_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cme_activities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cme_activities_id_seq OWNER TO postgres;

--
-- Name: cme_activities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cme_activities_id_seq OWNED BY public.cme_activities.id;


--
-- Name: cme_registrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cme_registrations (
    id integer NOT NULL,
    activity_id integer,
    employee_id integer,
    employee_name text DEFAULT ''::text,
    registration_date text DEFAULT ''::text,
    attendance_status text DEFAULT 'Registered'::text,
    certificate_issued integer DEFAULT 0,
    notes text DEFAULT ''::text
);


ALTER TABLE public.cme_registrations OWNER TO postgres;

--
-- Name: cme_registrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cme_registrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cme_registrations_id_seq OWNER TO postgres;

--
-- Name: cme_registrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cme_registrations_id_seq OWNED BY public.cme_registrations.id;


--
-- Name: company_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.company_settings (
    setting_key text NOT NULL,
    setting_value text DEFAULT ''::text,
    tenant_id integer
);


ALTER TABLE public.company_settings OWNER TO postgres;

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
-- Name: cosmetic_cases; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cosmetic_cases (
    id integer NOT NULL,
    patient_id integer,
    patient_name text DEFAULT ''::text,
    procedure_id integer,
    procedure_name text DEFAULT ''::text,
    surgeon text DEFAULT ''::text,
    assistant text DEFAULT ''::text,
    anesthetist text DEFAULT ''::text,
    surgery_date text DEFAULT ''::text,
    surgery_time text DEFAULT ''::text,
    duration_minutes integer DEFAULT 60,
    anesthesia_type text DEFAULT 'Local'::text,
    operating_room text DEFAULT ''::text,
    pre_op_notes text DEFAULT ''::text,
    operative_notes text DEFAULT ''::text,
    post_op_notes text DEFAULT ''::text,
    complications text DEFAULT ''::text,
    total_cost numeric(12,2) DEFAULT 0,
    payment_status text DEFAULT 'Pending'::text,
    status text DEFAULT 'Scheduled'::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id integer,
    facility_id integer
);


ALTER TABLE public.cosmetic_cases OWNER TO postgres;

--
-- Name: cosmetic_cases_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cosmetic_cases_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cosmetic_cases_id_seq OWNER TO postgres;

--
-- Name: cosmetic_cases_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cosmetic_cases_id_seq OWNED BY public.cosmetic_cases.id;


--
-- Name: cosmetic_consents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cosmetic_consents (
    id integer NOT NULL,
    case_id integer,
    patient_id integer,
    patient_name text DEFAULT ''::text,
    procedure_name text DEFAULT ''::text,
    consent_type text DEFAULT 'Surgery'::text,
    surgeon text DEFAULT ''::text,
    risks_explained text DEFAULT ''::text,
    alternatives_explained text DEFAULT ''::text,
    expected_results text DEFAULT ''::text,
    limitations text DEFAULT ''::text,
    patient_questions text DEFAULT ''::text,
    is_photography_consent integer DEFAULT 0,
    is_anesthesia_consent integer DEFAULT 0,
    is_blood_transfusion_consent integer DEFAULT 0,
    witness_name text DEFAULT ''::text,
    consent_date text DEFAULT ''::text,
    consent_time text DEFAULT ''::text,
    patient_signature text DEFAULT ''::text,
    witness_signature text DEFAULT ''::text,
    status text DEFAULT 'Pending'::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id integer,
    facility_id integer
);


ALTER TABLE public.cosmetic_consents OWNER TO postgres;

--
-- Name: cosmetic_consents_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cosmetic_consents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cosmetic_consents_id_seq OWNER TO postgres;

--
-- Name: cosmetic_consents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cosmetic_consents_id_seq OWNED BY public.cosmetic_consents.id;


--
-- Name: cosmetic_followups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cosmetic_followups (
    id integer NOT NULL,
    case_id integer,
    patient_id integer,
    patient_name text DEFAULT ''::text,
    followup_date text DEFAULT ''::text,
    days_post_op integer DEFAULT 0,
    healing_status text DEFAULT 'Good'::text,
    pain_level integer DEFAULT 0,
    swelling text DEFAULT 'Mild'::text,
    complications text DEFAULT ''::text,
    patient_satisfaction integer DEFAULT 0,
    surgeon_notes text DEFAULT ''::text,
    next_followup text DEFAULT ''::text,
    surgeon text DEFAULT ''::text,
    status text DEFAULT 'Completed'::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id integer,
    facility_id integer
);


ALTER TABLE public.cosmetic_followups OWNER TO postgres;

--
-- Name: cosmetic_followups_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cosmetic_followups_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cosmetic_followups_id_seq OWNER TO postgres;

--
-- Name: cosmetic_followups_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cosmetic_followups_id_seq OWNED BY public.cosmetic_followups.id;


--
-- Name: cosmetic_photos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cosmetic_photos (
    id integer NOT NULL,
    case_id integer,
    patient_id integer,
    photo_type text DEFAULT 'Before'::text,
    photo_angle text DEFAULT 'Front'::text,
    photo_date text DEFAULT ''::text,
    photo_path text DEFAULT ''::text,
    notes text DEFAULT ''::text,
    taken_by text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id integer,
    facility_id integer
);


ALTER TABLE public.cosmetic_photos OWNER TO postgres;

--
-- Name: cosmetic_photos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cosmetic_photos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cosmetic_photos_id_seq OWNER TO postgres;

--
-- Name: cosmetic_photos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cosmetic_photos_id_seq OWNED BY public.cosmetic_photos.id;


--
-- Name: cosmetic_procedures; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cosmetic_procedures (
    id integer NOT NULL,
    name_en text DEFAULT ''::text,
    name_ar text DEFAULT ''::text,
    category text DEFAULT 'Face'::text,
    description text DEFAULT ''::text,
    estimated_duration integer DEFAULT 60,
    anesthesia_type text DEFAULT 'Local'::text,
    average_cost numeric(12,2) DEFAULT 0,
    risks text DEFAULT ''::text,
    recovery_days integer DEFAULT 7,
    is_active integer DEFAULT 1
);


ALTER TABLE public.cosmetic_procedures OWNER TO postgres;

--
-- Name: cosmetic_procedures_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cosmetic_procedures_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cosmetic_procedures_id_seq OWNER TO postgres;

--
-- Name: cosmetic_procedures_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cosmetic_procedures_id_seq OWNED BY public.cosmetic_procedures.id;


--
-- Name: cssd_instrument_sets; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cssd_instrument_sets (
    id integer NOT NULL,
    set_name text DEFAULT ''::text,
    set_name_ar text DEFAULT ''::text,
    set_code text DEFAULT ''::text,
    category text DEFAULT ''::text,
    instrument_count integer DEFAULT 0,
    instruments_list text DEFAULT ''::text,
    department text DEFAULT ''::text,
    status text DEFAULT 'Available'::text,
    notes text DEFAULT ''::text
);


ALTER TABLE public.cssd_instrument_sets OWNER TO postgres;

--
-- Name: cssd_instrument_sets_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cssd_instrument_sets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cssd_instrument_sets_id_seq OWNER TO postgres;

--
-- Name: cssd_instrument_sets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cssd_instrument_sets_id_seq OWNED BY public.cssd_instrument_sets.id;


--
-- Name: cssd_load_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cssd_load_items (
    id integer NOT NULL,
    cycle_id integer,
    set_id integer,
    set_name text DEFAULT ''::text,
    barcode text DEFAULT ''::text,
    status text DEFAULT 'Processing'::text,
    used_in_surgery_id integer DEFAULT 0,
    used_date text DEFAULT ''::text,
    notes text DEFAULT ''::text
);


ALTER TABLE public.cssd_load_items OWNER TO postgres;

--
-- Name: cssd_load_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cssd_load_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cssd_load_items_id_seq OWNER TO postgres;

--
-- Name: cssd_load_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cssd_load_items_id_seq OWNED BY public.cssd_load_items.id;


--
-- Name: cssd_sterilization_cycles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.cssd_sterilization_cycles (
    id integer NOT NULL,
    cycle_number text DEFAULT ''::text,
    machine_name text DEFAULT ''::text,
    cycle_type text DEFAULT 'Steam Autoclave'::text,
    temperature real DEFAULT 0,
    pressure real DEFAULT 0,
    duration_minutes integer DEFAULT 0,
    start_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    end_time text DEFAULT ''::text,
    operator text DEFAULT ''::text,
    bi_test_result text DEFAULT 'Pending'::text,
    ci_result text DEFAULT ''::text,
    status text DEFAULT 'In Progress'::text,
    notes text DEFAULT ''::text
);


ALTER TABLE public.cssd_sterilization_cycles OWNER TO postgres;

--
-- Name: cssd_sterilization_cycles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.cssd_sterilization_cycles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.cssd_sterilization_cycles_id_seq OWNER TO postgres;

--
-- Name: cssd_sterilization_cycles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.cssd_sterilization_cycles_id_seq OWNED BY public.cssd_sterilization_cycles.id;


--
-- Name: daily_close; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.daily_close (
    id integer NOT NULL,
    close_date text DEFAULT ''::text,
    cashier text DEFAULT ''::text,
    total_cash numeric(12,2) DEFAULT 0,
    total_card numeric(12,2) DEFAULT 0,
    total_insurance numeric(12,2) DEFAULT 0,
    total_transactions integer DEFAULT 0,
    opening_balance numeric(12,2) DEFAULT 0,
    closing_balance numeric(12,2) DEFAULT 0,
    variance numeric(12,2) DEFAULT 0,
    notes text DEFAULT ''::text,
    status text DEFAULT 'Open'::text,
    closed_by text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.daily_close OWNER TO postgres;

--
-- Name: daily_close_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.daily_close_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.daily_close_id_seq OWNER TO postgres;

--
-- Name: daily_close_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.daily_close_id_seq OWNED BY public.daily_close.id;


--
-- Name: dental_records; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.dental_records (
    id integer NOT NULL,
    patient_id integer,
    tooth_number integer,
    condition text DEFAULT ''::text,
    treatment_done text DEFAULT ''::text,
    visit_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id integer,
    facility_id integer
);


ALTER TABLE public.dental_records OWNER TO postgres;

--
-- Name: dental_records_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.dental_records_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.dental_records_id_seq OWNER TO postgres;

--
-- Name: dental_records_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.dental_records_id_seq OWNED BY public.dental_records.id;


--
-- Name: departments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.departments (
    id integer NOT NULL,
    branch_id integer NOT NULL,
    name_ar character varying(255) NOT NULL,
    name_en character varying(255) NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.departments OWNER TO postgres;

--
-- Name: departments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.departments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.departments_id_seq OWNER TO postgres;

--
-- Name: departments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.departments_id_seq OWNED BY public.departments.id;


--
-- Name: diet_meals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.diet_meals (
    id integer NOT NULL,
    order_id integer,
    patient_id integer,
    meal_type text DEFAULT 'Lunch'::text,
    meal_date text DEFAULT ''::text,
    items text DEFAULT ''::text,
    calories integer DEFAULT 0,
    delivered integer DEFAULT 0,
    delivered_by text DEFAULT ''::text,
    consumed_percentage integer DEFAULT 0,
    notes text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.diet_meals OWNER TO postgres;

--
-- Name: diet_meals_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.diet_meals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.diet_meals_id_seq OWNER TO postgres;

--
-- Name: diet_meals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.diet_meals_id_seq OWNED BY public.diet_meals.id;


--
-- Name: diet_orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.diet_orders (
    id integer NOT NULL,
    admission_id integer,
    patient_id integer,
    patient_name text DEFAULT ''::text,
    diet_type text DEFAULT 'Regular'::text,
    diet_type_ar text DEFAULT 'عادي'::text,
    texture text DEFAULT 'Normal'::text,
    fluid text DEFAULT 'Normal'::text,
    allergies text DEFAULT ''::text,
    restrictions text DEFAULT ''::text,
    supplements text DEFAULT ''::text,
    ordered_by text DEFAULT ''::text,
    meal_preferences text DEFAULT ''::text,
    start_date text DEFAULT ''::text,
    end_date text DEFAULT ''::text,
    status text DEFAULT 'Active'::text,
    notes text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.diet_orders OWNER TO postgres;

--
-- Name: diet_orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.diet_orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.diet_orders_id_seq OWNER TO postgres;

--
-- Name: diet_orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.diet_orders_id_seq OWNED BY public.diet_orders.id;


--
-- Name: discount_rules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.discount_rules (
    id integer NOT NULL,
    rule_name text DEFAULT ''::text,
    discount_type text DEFAULT 'Percentage'::text,
    discount_value real DEFAULT 0,
    applies_to text DEFAULT 'All'::text,
    min_amount real DEFAULT 0,
    max_discount real DEFAULT 0,
    start_date text DEFAULT ''::text,
    end_date text DEFAULT ''::text,
    is_active integer DEFAULT 1
);


ALTER TABLE public.discount_rules OWNER TO postgres;

--
-- Name: discount_rules_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.discount_rules_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.discount_rules_id_seq OWNER TO postgres;

--
-- Name: discount_rules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.discount_rules_id_seq OWNED BY public.discount_rules.id;


--
-- Name: doctor_inventory_request_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.doctor_inventory_request_items (
    id integer NOT NULL,
    request_id integer,
    item_id integer,
    qty_requested integer DEFAULT 0,
    qty_approved integer DEFAULT 0,
    notes text DEFAULT ''::text,
    tenant_id integer
);


ALTER TABLE public.doctor_inventory_request_items OWNER TO postgres;

--
-- Name: doctor_inventory_request_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.doctor_inventory_request_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.doctor_inventory_request_items_id_seq OWNER TO postgres;

--
-- Name: doctor_inventory_request_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.doctor_inventory_request_items_id_seq OWNED BY public.doctor_inventory_request_items.id;


--
-- Name: doctor_inventory_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.doctor_inventory_requests (
    id integer NOT NULL,
    doctor_id integer,
    department text DEFAULT ''::text,
    request_date text DEFAULT ''::text,
    status text DEFAULT 'Pending'::text,
    approved_by text DEFAULT ''::text,
    notes text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id integer,
    branch_id integer
);


ALTER TABLE public.doctor_inventory_requests OWNER TO postgres;

--
-- Name: doctor_inventory_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.doctor_inventory_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.doctor_inventory_requests_id_seq OWNER TO postgres;

--
-- Name: doctor_inventory_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.doctor_inventory_requests_id_seq OWNED BY public.doctor_inventory_requests.id;


--
-- Name: drug_interactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.drug_interactions (
    id integer NOT NULL,
    drug_a text DEFAULT ''::text,
    drug_b text DEFAULT ''::text,
    interaction_type text DEFAULT ''::text,
    severity text DEFAULT 'Moderate'::text,
    description text DEFAULT ''::text,
    clinical_action text DEFAULT ''::text
);


ALTER TABLE public.drug_interactions OWNER TO postgres;

--
-- Name: drug_interactions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.drug_interactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.drug_interactions_id_seq OWNER TO postgres;

--
-- Name: drug_interactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.drug_interactions_id_seq OWNED BY public.drug_interactions.id;


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
-- Name: emergency_beds; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.emergency_beds (
    id integer NOT NULL,
    bed_name text DEFAULT ''::text,
    bed_name_ar text DEFAULT ''::text,
    zone text DEFAULT 'General'::text,
    zone_ar text DEFAULT ''::text,
    status text DEFAULT 'Available'::text,
    current_patient_id integer DEFAULT 0,
    notes text DEFAULT ''::text,
    tenant_id integer,
    branch_id integer
);


ALTER TABLE public.emergency_beds OWNER TO postgres;

--
-- Name: emergency_beds_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.emergency_beds_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.emergency_beds_id_seq OWNER TO postgres;

--
-- Name: emergency_beds_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.emergency_beds_id_seq OWNED BY public.emergency_beds.id;


--
-- Name: emergency_trauma_assessments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.emergency_trauma_assessments (
    id integer NOT NULL,
    visit_id integer,
    patient_id integer,
    airway text DEFAULT ''::text,
    breathing text DEFAULT ''::text,
    circulation text DEFAULT ''::text,
    disability text DEFAULT ''::text,
    exposure text DEFAULT ''::text,
    gcs_eye integer DEFAULT 4,
    gcs_verbal integer DEFAULT 5,
    gcs_motor integer DEFAULT 6,
    gcs_total integer DEFAULT 15,
    mechanism_of_injury text DEFAULT ''::text,
    trauma_team_activated integer DEFAULT 0,
    assessed_by text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id integer,
    facility_id integer
);


ALTER TABLE public.emergency_trauma_assessments OWNER TO postgres;

--
-- Name: emergency_trauma_assessments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.emergency_trauma_assessments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.emergency_trauma_assessments_id_seq OWNER TO postgres;

--
-- Name: emergency_trauma_assessments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.emergency_trauma_assessments_id_seq OWNED BY public.emergency_trauma_assessments.id;


--
-- Name: emergency_visits; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.emergency_visits (
    id integer NOT NULL,
    patient_id integer,
    patient_name text DEFAULT ''::text,
    arrival_mode text DEFAULT 'Walk-in'::text,
    arrival_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    chief_complaint text DEFAULT ''::text,
    chief_complaint_ar text DEFAULT ''::text,
    triage_level integer DEFAULT 3,
    triage_color text DEFAULT 'Yellow'::text,
    triage_nurse text DEFAULT ''::text,
    triage_vitals text DEFAULT ''::text,
    assigned_doctor text DEFAULT ''::text,
    assigned_bed text DEFAULT ''::text,
    disposition text DEFAULT 'Pending'::text,
    disposition_time text DEFAULT ''::text,
    acuity_notes text DEFAULT ''::text,
    discharge_time text DEFAULT ''::text,
    discharge_diagnosis text DEFAULT ''::text,
    discharge_instructions text DEFAULT ''::text,
    discharge_medications text DEFAULT ''::text,
    followup_date text DEFAULT ''::text,
    status text DEFAULT 'Active'::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id integer,
    facility_id integer
);


ALTER TABLE public.emergency_visits OWNER TO postgres;

--
-- Name: emergency_visits_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.emergency_visits_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.emergency_visits_id_seq OWNER TO postgres;

--
-- Name: emergency_visits_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.emergency_visits_id_seq OWNED BY public.emergency_visits.id;


--
-- Name: employee_exposures; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employee_exposures (
    id integer NOT NULL,
    employee_id integer,
    employee_name text DEFAULT ''::text,
    exposure_type text DEFAULT ''::text,
    exposure_date text DEFAULT ''::text,
    source_patient text DEFAULT ''::text,
    body_fluid text DEFAULT ''::text,
    ppe_worn text DEFAULT ''::text,
    action_taken text DEFAULT ''::text,
    followup_date text DEFAULT ''::text,
    result text DEFAULT 'Pending'::text,
    reported_by text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id integer
);


ALTER TABLE public.employee_exposures OWNER TO postgres;

--
-- Name: employee_exposures_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.employee_exposures_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.employee_exposures_id_seq OWNER TO postgres;

--
-- Name: employee_exposures_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.employee_exposures_id_seq OWNED BY public.employee_exposures.id;


--
-- Name: employees; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.employees (
    id integer NOT NULL,
    name text DEFAULT ''::text,
    name_ar text DEFAULT ''::text,
    name_en text DEFAULT ''::text,
    role text DEFAULT 'Staff'::text,
    department_ar text DEFAULT ''::text,
    department_en text DEFAULT ''::text,
    status text DEFAULT 'Active'::text,
    salary real DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    commission_type text DEFAULT 'percentage'::text,
    commission_value real DEFAULT 0
);


ALTER TABLE public.employees OWNER TO postgres;

--
-- Name: employees_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.employees_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.employees_id_seq OWNER TO postgres;

--
-- Name: employees_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.employees_id_seq OWNED BY public.employees.id;


--
-- Name: facilities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.facilities (
    id integer NOT NULL,
    tenant_id integer NOT NULL,
    name character varying(255) NOT NULL,
    tax_number character varying(100),
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.facilities OWNER TO postgres;

--
-- Name: facilities_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.facilities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.facilities_id_seq OWNER TO postgres;

--
-- Name: facilities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.facilities_id_seq OWNED BY public.facilities.id;


--
-- Name: finance_chart_of_accounts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.finance_chart_of_accounts (
    id integer NOT NULL,
    account_code text DEFAULT ''::text,
    account_name_ar text DEFAULT ''::text,
    account_name_en text DEFAULT ''::text,
    parent_id integer DEFAULT 0,
    account_level integer DEFAULT 1,
    account_type text DEFAULT ''::text,
    is_active integer DEFAULT 1
);


ALTER TABLE public.finance_chart_of_accounts OWNER TO postgres;

--
-- Name: finance_chart_of_accounts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.finance_chart_of_accounts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.finance_chart_of_accounts_id_seq OWNER TO postgres;

--
-- Name: finance_chart_of_accounts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.finance_chart_of_accounts_id_seq OWNED BY public.finance_chart_of_accounts.id;


--
-- Name: finance_cost_centers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.finance_cost_centers (
    id integer NOT NULL,
    center_name text DEFAULT ''::text,
    center_code text DEFAULT ''::text,
    clinic_id integer DEFAULT 0,
    is_active integer DEFAULT 1
);


ALTER TABLE public.finance_cost_centers OWNER TO postgres;

--
-- Name: finance_cost_centers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.finance_cost_centers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.finance_cost_centers_id_seq OWNER TO postgres;

--
-- Name: finance_cost_centers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.finance_cost_centers_id_seq OWNED BY public.finance_cost_centers.id;


--
-- Name: finance_doctor_commissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.finance_doctor_commissions (
    id integer NOT NULL,
    doctor_id integer,
    period text DEFAULT ''::text,
    total_revenue real DEFAULT 0,
    commission_rate real DEFAULT 0,
    commission_amount real DEFAULT 0,
    status text DEFAULT 'Pending'::text,
    tenant_id integer,
    facility_id integer
);


ALTER TABLE public.finance_doctor_commissions OWNER TO postgres;

--
-- Name: finance_doctor_commissions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.finance_doctor_commissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.finance_doctor_commissions_id_seq OWNER TO postgres;

--
-- Name: finance_doctor_commissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.finance_doctor_commissions_id_seq OWNED BY public.finance_doctor_commissions.id;


--
-- Name: finance_fiscal_years; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.finance_fiscal_years (
    id integer NOT NULL,
    year_name text DEFAULT ''::text,
    start_date text DEFAULT ''::text,
    end_date text DEFAULT ''::text,
    is_closed integer DEFAULT 0,
    closed_at text DEFAULT ''::text
);


ALTER TABLE public.finance_fiscal_years OWNER TO postgres;

--
-- Name: finance_fiscal_years_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.finance_fiscal_years_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.finance_fiscal_years_id_seq OWNER TO postgres;

--
-- Name: finance_fiscal_years_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.finance_fiscal_years_id_seq OWNED BY public.finance_fiscal_years.id;


--
-- Name: finance_journal_entries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.finance_journal_entries (
    id integer NOT NULL,
    entry_number text DEFAULT ''::text,
    entry_date text DEFAULT ''::text,
    description text DEFAULT ''::text,
    reference text DEFAULT ''::text,
    is_auto integer DEFAULT 0,
    fiscal_year_id integer,
    is_posted integer DEFAULT 0,
    created_by text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id integer,
    facility_id integer,
    branch_id integer
);


ALTER TABLE public.finance_journal_entries OWNER TO postgres;

--
-- Name: finance_journal_entries_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.finance_journal_entries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.finance_journal_entries_id_seq OWNER TO postgres;

--
-- Name: finance_journal_entries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.finance_journal_entries_id_seq OWNED BY public.finance_journal_entries.id;


--
-- Name: finance_journal_lines; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.finance_journal_lines (
    id integer NOT NULL,
    entry_id integer,
    account_id integer,
    debit real DEFAULT 0,
    credit real DEFAULT 0,
    cost_center_id integer DEFAULT 0,
    notes text DEFAULT ''::text,
    tenant_id integer,
    facility_id integer,
    branch_id integer
);


ALTER TABLE public.finance_journal_lines OWNER TO postgres;

--
-- Name: finance_journal_lines_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.finance_journal_lines_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.finance_journal_lines_id_seq OWNER TO postgres;

--
-- Name: finance_journal_lines_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.finance_journal_lines_id_seq OWNED BY public.finance_journal_lines.id;


--
-- Name: finance_tax_declarations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.finance_tax_declarations (
    id integer NOT NULL,
    period_start text DEFAULT ''::text,
    period_end text DEFAULT ''::text,
    total_sales real DEFAULT 0,
    total_vat real DEFAULT 0,
    status text DEFAULT 'Draft'::text,
    submitted_at text DEFAULT ''::text,
    tenant_id integer,
    facility_id integer,
    branch_id integer
);


ALTER TABLE public.finance_tax_declarations OWNER TO postgres;

--
-- Name: finance_tax_declarations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.finance_tax_declarations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.finance_tax_declarations_id_seq OWNER TO postgres;

--
-- Name: finance_tax_declarations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.finance_tax_declarations_id_seq OWNED BY public.finance_tax_declarations.id;


--
-- Name: finance_vouchers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.finance_vouchers (
    id integer NOT NULL,
    voucher_number text DEFAULT ''::text,
    voucher_type text DEFAULT ''::text,
    amount real DEFAULT 0,
    account_id integer,
    description text DEFAULT ''::text,
    payment_method text DEFAULT ''::text,
    reference text DEFAULT ''::text,
    voucher_date text DEFAULT ''::text,
    created_by text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id integer,
    facility_id integer,
    branch_id integer
);


ALTER TABLE public.finance_vouchers OWNER TO postgres;

--
-- Name: finance_vouchers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.finance_vouchers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.finance_vouchers_id_seq OWNER TO postgres;

--
-- Name: finance_vouchers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.finance_vouchers_id_seq OWNED BY public.finance_vouchers.id;


--
-- Name: form_templates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.form_templates (
    id integer NOT NULL,
    template_name text DEFAULT ''::text,
    department text DEFAULT ''::text,
    form_fields text DEFAULT ''::text,
    is_active integer DEFAULT 1,
    created_by text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.form_templates OWNER TO postgres;

--
-- Name: form_templates_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.form_templates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.form_templates_id_seq OWNER TO postgres;

--
-- Name: form_templates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.form_templates_id_seq OWNED BY public.form_templates.id;


--
-- Name: hand_hygiene_audits; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hand_hygiene_audits (
    id integer NOT NULL,
    audit_date text DEFAULT ''::text,
    auditor text DEFAULT ''::text,
    department text DEFAULT ''::text,
    moments_observed integer DEFAULT 0,
    moments_compliant integer DEFAULT 0,
    compliance_rate real DEFAULT 0,
    notes text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id integer
);


ALTER TABLE public.hand_hygiene_audits OWNER TO postgres;

--
-- Name: hand_hygiene_audits_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.hand_hygiene_audits_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hand_hygiene_audits_id_seq OWNER TO postgres;

--
-- Name: hand_hygiene_audits_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.hand_hygiene_audits_id_seq OWNED BY public.hand_hygiene_audits.id;


--
-- Name: hr_advances; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hr_advances (
    id integer NOT NULL,
    employee_id integer,
    amount real DEFAULT 0,
    request_date text DEFAULT ''::text,
    installments integer DEFAULT 1,
    remaining real DEFAULT 0,
    status text DEFAULT 'Pending'::text,
    notes text DEFAULT ''::text,
    tenant_id integer
);


ALTER TABLE public.hr_advances OWNER TO postgres;

--
-- Name: hr_advances_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.hr_advances_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hr_advances_id_seq OWNER TO postgres;

--
-- Name: hr_advances_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.hr_advances_id_seq OWNED BY public.hr_advances.id;


--
-- Name: hr_attendance; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hr_attendance (
    id integer NOT NULL,
    employee_id integer,
    attendance_date text DEFAULT ''::text,
    check_in text DEFAULT ''::text,
    check_out text DEFAULT ''::text,
    total_hours real DEFAULT 0,
    status text DEFAULT 'Present'::text,
    source text DEFAULT 'Manual'::text,
    tenant_id integer,
    branch_id integer
);


ALTER TABLE public.hr_attendance OWNER TO postgres;

--
-- Name: hr_attendance_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.hr_attendance_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hr_attendance_id_seq OWNER TO postgres;

--
-- Name: hr_attendance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.hr_attendance_id_seq OWNED BY public.hr_attendance.id;


--
-- Name: hr_employee_custody; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hr_employee_custody (
    id integer NOT NULL,
    employee_id integer,
    item_name text DEFAULT ''::text,
    handed_date text DEFAULT ''::text,
    returned_date text DEFAULT ''::text,
    status text DEFAULT 'Active'::text,
    notes text DEFAULT ''::text,
    tenant_id integer
);


ALTER TABLE public.hr_employee_custody OWNER TO postgres;

--
-- Name: hr_employee_custody_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.hr_employee_custody_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hr_employee_custody_id_seq OWNER TO postgres;

--
-- Name: hr_employee_custody_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.hr_employee_custody_id_seq OWNED BY public.hr_employee_custody.id;


--
-- Name: hr_employee_documents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hr_employee_documents (
    id integer NOT NULL,
    employee_id integer,
    doc_type text DEFAULT ''::text,
    doc_number text DEFAULT ''::text,
    issue_date text DEFAULT ''::text,
    expiry_date text DEFAULT ''::text,
    file_path text DEFAULT ''::text,
    alert_days integer DEFAULT 30,
    tenant_id integer
);


ALTER TABLE public.hr_employee_documents OWNER TO postgres;

--
-- Name: hr_employee_documents_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.hr_employee_documents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hr_employee_documents_id_seq OWNER TO postgres;

--
-- Name: hr_employee_documents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.hr_employee_documents_id_seq OWNED BY public.hr_employee_documents.id;


--
-- Name: hr_employees; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hr_employees (
    id integer NOT NULL,
    emp_number text DEFAULT ''::text,
    name_ar text DEFAULT ''::text,
    name_en text DEFAULT ''::text,
    national_id text DEFAULT ''::text,
    phone text DEFAULT ''::text,
    email text DEFAULT ''::text,
    department text DEFAULT ''::text,
    job_title text DEFAULT ''::text,
    hire_date text DEFAULT ''::text,
    contract_end text DEFAULT ''::text,
    basic_salary real DEFAULT 0,
    housing_allowance real DEFAULT 0,
    transport_allowance real DEFAULT 0,
    is_active integer DEFAULT 1,
    tenant_id integer,
    facility_id integer,
    branch_id integer
);


ALTER TABLE public.hr_employees OWNER TO postgres;

--
-- Name: hr_employees_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.hr_employees_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hr_employees_id_seq OWNER TO postgres;

--
-- Name: hr_employees_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.hr_employees_id_seq OWNED BY public.hr_employees.id;


--
-- Name: hr_leaves; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hr_leaves (
    id integer NOT NULL,
    employee_id integer,
    leave_type text DEFAULT ''::text,
    start_date text DEFAULT ''::text,
    end_date text DEFAULT ''::text,
    days integer DEFAULT 0,
    status text DEFAULT 'Pending'::text,
    approved_by text DEFAULT ''::text,
    notes text DEFAULT ''::text,
    tenant_id integer
);


ALTER TABLE public.hr_leaves OWNER TO postgres;

--
-- Name: hr_leaves_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.hr_leaves_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hr_leaves_id_seq OWNER TO postgres;

--
-- Name: hr_leaves_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.hr_leaves_id_seq OWNED BY public.hr_leaves.id;


--
-- Name: hr_salaries; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.hr_salaries (
    id integer NOT NULL,
    employee_id integer,
    month text DEFAULT ''::text,
    basic real DEFAULT 0,
    allowances real DEFAULT 0,
    deductions real DEFAULT 0,
    advances_deducted real DEFAULT 0,
    net_salary real DEFAULT 0,
    payment_date text DEFAULT ''::text,
    status text DEFAULT 'Pending'::text,
    tenant_id integer
);


ALTER TABLE public.hr_salaries OWNER TO postgres;

--
-- Name: hr_salaries_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.hr_salaries_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.hr_salaries_id_seq OWNER TO postgres;

--
-- Name: hr_salaries_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.hr_salaries_id_seq OWNED BY public.hr_salaries.id;


--
-- Name: icd10_codes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.icd10_codes (
    code text NOT NULL,
    description_en text DEFAULT ''::text,
    description_ar text DEFAULT ''::text
);


ALTER TABLE public.icd10_codes OWNER TO postgres;

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
-- Name: infection_outbreaks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.infection_outbreaks (
    id integer NOT NULL,
    outbreak_name text DEFAULT ''::text,
    organism text DEFAULT ''::text,
    start_date text DEFAULT ''::text,
    end_date text DEFAULT ''::text,
    affected_ward text DEFAULT ''::text,
    total_cases integer DEFAULT 0,
    investigation_notes text DEFAULT ''::text,
    control_measures text DEFAULT ''::text,
    status text DEFAULT 'Active'::text,
    reported_by text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id integer
);


ALTER TABLE public.infection_outbreaks OWNER TO postgres;

--
-- Name: infection_outbreaks_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.infection_outbreaks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.infection_outbreaks_id_seq OWNER TO postgres;

--
-- Name: infection_outbreaks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.infection_outbreaks_id_seq OWNED BY public.infection_outbreaks.id;


--
-- Name: infection_surveillance; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.infection_surveillance (
    id integer NOT NULL,
    patient_id integer,
    patient_name text DEFAULT ''::text,
    infection_type text DEFAULT ''::text,
    infection_site text DEFAULT ''::text,
    organism text DEFAULT ''::text,
    sensitivity text DEFAULT ''::text,
    detection_date text DEFAULT ''::text,
    hai_category text DEFAULT ''::text,
    device_related integer DEFAULT 0,
    device_type text DEFAULT ''::text,
    ward text DEFAULT ''::text,
    bed text DEFAULT ''::text,
    isolation_type text DEFAULT ''::text,
    outcome text DEFAULT ''::text,
    reported_by text DEFAULT ''::text,
    notes text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id integer
);


ALTER TABLE public.infection_surveillance OWNER TO postgres;

--
-- Name: infection_surveillance_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.infection_surveillance_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.infection_surveillance_id_seq OWNER TO postgres;

--
-- Name: infection_surveillance_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.infection_surveillance_id_seq OWNED BY public.infection_surveillance.id;


--
-- Name: insurance_claims; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.insurance_claims (
    id integer NOT NULL,
    patient_name text DEFAULT ''::text,
    insurance_company text DEFAULT ''::text,
    claim_amount real DEFAULT 0,
    status text DEFAULT 'Pending'::text,
    contract_id integer DEFAULT 0,
    policy_id integer DEFAULT 0,
    ucaf_dcaf_data text DEFAULT ''::text,
    waseel_status text DEFAULT 'Unsent'::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id integer,
    facility_id integer,
    branch_id integer
);


ALTER TABLE public.insurance_claims OWNER TO postgres;

--
-- Name: insurance_claims_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.insurance_claims_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.insurance_claims_id_seq OWNER TO postgres;

--
-- Name: insurance_claims_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.insurance_claims_id_seq OWNED BY public.insurance_claims.id;


--
-- Name: insurance_companies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.insurance_companies (
    id integer NOT NULL,
    name_ar text DEFAULT ''::text,
    name_en text DEFAULT ''::text,
    tpa_id integer DEFAULT 0,
    contact_info text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.insurance_companies OWNER TO postgres;

--
-- Name: insurance_companies_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.insurance_companies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.insurance_companies_id_seq OWNER TO postgres;

--
-- Name: insurance_companies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.insurance_companies_id_seq OWNED BY public.insurance_companies.id;


--
-- Name: insurance_contracts; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.insurance_contracts (
    id integer NOT NULL,
    company_id integer,
    contract_name text DEFAULT ''::text,
    valid_from text DEFAULT ''::text,
    valid_to text DEFAULT ''::text,
    discount_percentage real DEFAULT 0,
    file_path text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.insurance_contracts OWNER TO postgres;

--
-- Name: insurance_contracts_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.insurance_contracts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.insurance_contracts_id_seq OWNER TO postgres;

--
-- Name: insurance_contracts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.insurance_contracts_id_seq OWNED BY public.insurance_contracts.id;


--
-- Name: insurance_policies; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.insurance_policies (
    id integer NOT NULL,
    name text DEFAULT ''::text,
    class_type text DEFAULT ''::text,
    max_limit real DEFAULT 0,
    co_pay_percent real DEFAULT 0,
    co_pay_max real DEFAULT 0,
    dental_included integer DEFAULT 0,
    optical_included integer DEFAULT 0,
    maternity_included integer DEFAULT 0
);


ALTER TABLE public.insurance_policies OWNER TO postgres;

--
-- Name: insurance_policies_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.insurance_policies_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.insurance_policies_id_seq OWNER TO postgres;

--
-- Name: insurance_policies_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.insurance_policies_id_seq OWNED BY public.insurance_policies.id;


--
-- Name: integration_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.integration_settings (
    id integer NOT NULL,
    integration_name text DEFAULT ''::text,
    provider text DEFAULT ''::text,
    api_key text DEFAULT ''::text,
    api_secret text DEFAULT ''::text,
    endpoint_url text DEFAULT ''::text,
    is_enabled integer DEFAULT 0,
    config_json text DEFAULT ''::text,
    last_sync text DEFAULT ''::text,
    tenant_id integer
);


ALTER TABLE public.integration_settings OWNER TO postgres;

--
-- Name: integration_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.integration_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.integration_settings_id_seq OWNER TO postgres;

--
-- Name: integration_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.integration_settings_id_seq OWNED BY public.integration_settings.id;


--
-- Name: internal_messages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.internal_messages (
    id integer NOT NULL,
    sender_id integer,
    receiver_id integer,
    subject text DEFAULT ''::text,
    body text DEFAULT ''::text,
    is_read integer DEFAULT 0,
    priority text DEFAULT 'Normal'::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.internal_messages OWNER TO postgres;

--
-- Name: internal_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.internal_messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.internal_messages_id_seq OWNER TO postgres;

--
-- Name: internal_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.internal_messages_id_seq OWNED BY public.internal_messages.id;


--
-- Name: inventory_dept_request_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventory_dept_request_items (
    id integer NOT NULL,
    request_id integer,
    item_id integer,
    qty_requested integer DEFAULT 0,
    qty_approved integer DEFAULT 0,
    tenant_id integer,
    branch_id integer
);


ALTER TABLE public.inventory_dept_request_items OWNER TO postgres;

--
-- Name: inventory_dept_request_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inventory_dept_request_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inventory_dept_request_items_id_seq OWNER TO postgres;

--
-- Name: inventory_dept_request_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inventory_dept_request_items_id_seq OWNED BY public.inventory_dept_request_items.id;


--
-- Name: inventory_dept_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventory_dept_requests (
    id integer NOT NULL,
    department text DEFAULT ''::text,
    requested_by text DEFAULT ''::text,
    request_date text DEFAULT ''::text,
    status text DEFAULT 'Pending'::text,
    approved_by text DEFAULT ''::text,
    notes text DEFAULT ''::text,
    tenant_id integer,
    branch_id integer
);


ALTER TABLE public.inventory_dept_requests OWNER TO postgres;

--
-- Name: inventory_dept_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inventory_dept_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inventory_dept_requests_id_seq OWNER TO postgres;

--
-- Name: inventory_dept_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inventory_dept_requests_id_seq OWNED BY public.inventory_dept_requests.id;


--
-- Name: inventory_issue_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventory_issue_items (
    id integer NOT NULL,
    issue_id integer,
    item_id integer,
    qty integer DEFAULT 0,
    notes text DEFAULT ''::text,
    tenant_id integer,
    branch_id integer
);


ALTER TABLE public.inventory_issue_items OWNER TO postgres;

--
-- Name: inventory_issue_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inventory_issue_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inventory_issue_items_id_seq OWNER TO postgres;

--
-- Name: inventory_issue_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inventory_issue_items_id_seq OWNED BY public.inventory_issue_items.id;


--
-- Name: inventory_issue_to_dept; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventory_issue_to_dept (
    id integer NOT NULL,
    department text DEFAULT ''::text,
    issued_by text DEFAULT ''::text,
    issue_date text DEFAULT ''::text,
    status text DEFAULT 'Issued'::text,
    notes text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id integer,
    branch_id integer
);


ALTER TABLE public.inventory_issue_to_dept OWNER TO postgres;

--
-- Name: inventory_issue_to_dept_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inventory_issue_to_dept_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inventory_issue_to_dept_id_seq OWNER TO postgres;

--
-- Name: inventory_issue_to_dept_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inventory_issue_to_dept_id_seq OWNED BY public.inventory_issue_to_dept.id;


--
-- Name: inventory_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventory_items (
    id integer NOT NULL,
    item_name text DEFAULT ''::text,
    item_code text DEFAULT ''::text,
    barcode text DEFAULT ''::text,
    category text DEFAULT ''::text,
    unit text DEFAULT ''::text,
    cost_price real DEFAULT 0,
    stock_qty integer DEFAULT 0,
    min_qty integer DEFAULT 5,
    is_active integer DEFAULT 1,
    tenant_id integer,
    branch_id integer
);


ALTER TABLE public.inventory_items OWNER TO postgres;

--
-- Name: inventory_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inventory_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inventory_items_id_seq OWNER TO postgres;

--
-- Name: inventory_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inventory_items_id_seq OWNED BY public.inventory_items.id;


--
-- Name: inventory_opening_balances; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventory_opening_balances (
    id integer NOT NULL,
    item_id integer,
    qty integer DEFAULT 0,
    unit_cost real DEFAULT 0,
    balance_date text DEFAULT ''::text,
    notes text DEFAULT ''::text,
    tenant_id integer,
    branch_id integer
);


ALTER TABLE public.inventory_opening_balances OWNER TO postgres;

--
-- Name: inventory_opening_balances_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inventory_opening_balances_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inventory_opening_balances_id_seq OWNER TO postgres;

--
-- Name: inventory_opening_balances_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inventory_opening_balances_id_seq OWNED BY public.inventory_opening_balances.id;


--
-- Name: inventory_purchase_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventory_purchase_items (
    id integer NOT NULL,
    purchase_id integer,
    item_id integer,
    qty integer DEFAULT 0,
    unit_cost real DEFAULT 0,
    total_cost real DEFAULT 0,
    tenant_id integer,
    branch_id integer
);


ALTER TABLE public.inventory_purchase_items OWNER TO postgres;

--
-- Name: inventory_purchase_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inventory_purchase_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inventory_purchase_items_id_seq OWNER TO postgres;

--
-- Name: inventory_purchase_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inventory_purchase_items_id_seq OWNED BY public.inventory_purchase_items.id;


--
-- Name: inventory_purchases; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventory_purchases (
    id integer NOT NULL,
    supplier_id integer,
    purchase_date text DEFAULT ''::text,
    total_amount real DEFAULT 0,
    status text DEFAULT 'Received'::text,
    notes text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id integer,
    branch_id integer
);


ALTER TABLE public.inventory_purchases OWNER TO postgres;

--
-- Name: inventory_purchases_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inventory_purchases_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inventory_purchases_id_seq OWNER TO postgres;

--
-- Name: inventory_purchases_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inventory_purchases_id_seq OWNED BY public.inventory_purchases.id;


--
-- Name: inventory_stock_count; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.inventory_stock_count (
    id integer NOT NULL,
    item_id integer,
    counted_qty integer DEFAULT 0,
    system_qty integer DEFAULT 0,
    difference integer DEFAULT 0,
    count_date text DEFAULT ''::text,
    counted_by text DEFAULT ''::text,
    tenant_id integer,
    branch_id integer
);


ALTER TABLE public.inventory_stock_count OWNER TO postgres;

--
-- Name: inventory_stock_count_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.inventory_stock_count_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.inventory_stock_count_id_seq OWNER TO postgres;

--
-- Name: inventory_stock_count_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.inventory_stock_count_id_seq OWNED BY public.inventory_stock_count.id;


--
-- Name: invoices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.invoices (
    id integer NOT NULL,
    patient_name text DEFAULT ''::text,
    total real DEFAULT 0,
    paid integer DEFAULT 0,
    order_id integer DEFAULT 0,
    service_type text DEFAULT ''::text,
    invoice_number text DEFAULT ''::text,
    description text DEFAULT ''::text,
    amount real DEFAULT 0,
    vat_amount real DEFAULT 0,
    patient_id integer DEFAULT 0,
    payment_method text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id integer,
    facility_id integer
);


ALTER TABLE public.invoices OWNER TO postgres;

--
-- Name: invoices_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.invoices_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.invoices_id_seq OWNER TO postgres;

--
-- Name: invoices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.invoices_id_seq OWNED BY public.invoices.id;


--
-- Name: lab_radiology_orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lab_radiology_orders (
    id integer NOT NULL,
    patient_id integer,
    doctor_id integer,
    order_type text DEFAULT ''::text,
    description text DEFAULT ''::text,
    status text DEFAULT 'Requested'::text,
    sample_serial text DEFAULT ''::text,
    result_date text DEFAULT ''::text,
    sms_sent integer DEFAULT 0,
    results text DEFAULT ''::text,
    radiology_images_paths text DEFAULT ''::text,
    structured_report text DEFAULT ''::text,
    is_radiology integer DEFAULT 0,
    price real DEFAULT 0,
    approval_status text DEFAULT 'Pending Approval'::text,
    approved_by text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id integer,
    facility_id integer
);


ALTER TABLE public.lab_radiology_orders OWNER TO postgres;

--
-- Name: lab_radiology_orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lab_radiology_orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lab_radiology_orders_id_seq OWNER TO postgres;

--
-- Name: lab_radiology_orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lab_radiology_orders_id_seq OWNED BY public.lab_radiology_orders.id;


--
-- Name: lab_results; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lab_results (
    id integer NOT NULL,
    order_id integer,
    test_id integer,
    result_value text DEFAULT ''::text,
    is_abnormal integer DEFAULT 0,
    notes text DEFAULT ''::text,
    tenant_id integer,
    facility_id integer
);


ALTER TABLE public.lab_results OWNER TO postgres;

--
-- Name: lab_results_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lab_results_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lab_results_id_seq OWNER TO postgres;

--
-- Name: lab_results_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lab_results_id_seq OWNED BY public.lab_results.id;


--
-- Name: lab_samples; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lab_samples (
    id integer NOT NULL,
    order_id integer,
    sample_type text DEFAULT ''::text,
    barcode text DEFAULT ''::text,
    collection_date text DEFAULT ''::text,
    collected_by text DEFAULT ''::text,
    status text DEFAULT 'Collected'::text,
    storage_location text DEFAULT ''::text,
    notes text DEFAULT ''::text,
    tenant_id integer NOT NULL
);


ALTER TABLE public.lab_samples OWNER TO postgres;

--
-- Name: lab_samples_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lab_samples_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lab_samples_id_seq OWNER TO postgres;

--
-- Name: lab_samples_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lab_samples_id_seq OWNED BY public.lab_samples.id;


--
-- Name: lab_tests_catalog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.lab_tests_catalog (
    id integer NOT NULL,
    test_name text DEFAULT ''::text,
    category text DEFAULT ''::text,
    normal_range text DEFAULT ''::text,
    price real DEFAULT 0
);


ALTER TABLE public.lab_tests_catalog OWNER TO postgres;

--
-- Name: lab_tests_catalog_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.lab_tests_catalog_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.lab_tests_catalog_id_seq OWNER TO postgres;

--
-- Name: lab_tests_catalog_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.lab_tests_catalog_id_seq OWNED BY public.lab_tests_catalog.id;


--
-- Name: maintenance_equipment; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.maintenance_equipment (
    id integer NOT NULL,
    equipment_name text DEFAULT ''::text,
    equipment_name_ar text DEFAULT ''::text,
    equipment_code text DEFAULT ''::text,
    category text DEFAULT ''::text,
    manufacturer text DEFAULT ''::text,
    model text DEFAULT ''::text,
    serial_number text DEFAULT ''::text,
    department text DEFAULT ''::text,
    location text DEFAULT ''::text,
    purchase_date text DEFAULT ''::text,
    warranty_end text DEFAULT ''::text,
    last_calibration text DEFAULT ''::text,
    next_calibration text DEFAULT ''::text,
    last_pm text DEFAULT ''::text,
    next_pm text DEFAULT ''::text,
    status text DEFAULT 'Active'::text,
    notes text DEFAULT ''::text,
    tenant_id integer
);


ALTER TABLE public.maintenance_equipment OWNER TO postgres;

--
-- Name: maintenance_equipment_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.maintenance_equipment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.maintenance_equipment_id_seq OWNER TO postgres;

--
-- Name: maintenance_equipment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.maintenance_equipment_id_seq OWNED BY public.maintenance_equipment.id;


--
-- Name: maintenance_pm_schedules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.maintenance_pm_schedules (
    id integer NOT NULL,
    equipment_id integer,
    pm_type text DEFAULT ''::text,
    frequency text DEFAULT 'Monthly'::text,
    last_done text DEFAULT ''::text,
    next_due text DEFAULT ''::text,
    performed_by text DEFAULT ''::text,
    checklist text DEFAULT ''::text,
    status text DEFAULT 'Pending'::text,
    notes text DEFAULT ''::text,
    tenant_id integer
);


ALTER TABLE public.maintenance_pm_schedules OWNER TO postgres;

--
-- Name: maintenance_pm_schedules_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.maintenance_pm_schedules_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.maintenance_pm_schedules_id_seq OWNER TO postgres;

--
-- Name: maintenance_pm_schedules_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.maintenance_pm_schedules_id_seq OWNED BY public.maintenance_pm_schedules.id;


--
-- Name: maintenance_work_orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.maintenance_work_orders (
    id integer NOT NULL,
    wo_number text DEFAULT ''::text,
    request_type text DEFAULT 'Corrective'::text,
    priority text DEFAULT 'Normal'::text,
    department text DEFAULT ''::text,
    location text DEFAULT ''::text,
    equipment_id integer DEFAULT 0,
    description text DEFAULT ''::text,
    description_ar text DEFAULT ''::text,
    requested_by text DEFAULT ''::text,
    assigned_to text DEFAULT ''::text,
    scheduled_date text DEFAULT ''::text,
    completed_date text DEFAULT ''::text,
    cost real DEFAULT 0,
    status text DEFAULT 'Open'::text,
    resolution text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id integer,
    branch_id integer
);


ALTER TABLE public.maintenance_work_orders OWNER TO postgres;

--
-- Name: maintenance_work_orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.maintenance_work_orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.maintenance_work_orders_id_seq OWNER TO postgres;

--
-- Name: maintenance_work_orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.maintenance_work_orders_id_seq OWNED BY public.maintenance_work_orders.id;


--
-- Name: medical_certificates; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.medical_certificates (
    id integer NOT NULL,
    patient_id integer,
    patient_name text DEFAULT ''::text,
    doctor_id integer,
    doctor_name text DEFAULT ''::text,
    cert_type text DEFAULT 'sick_leave'::text,
    diagnosis text DEFAULT ''::text,
    notes text DEFAULT ''::text,
    start_date text DEFAULT ''::text,
    end_date text DEFAULT ''::text,
    days integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id integer,
    facility_id integer
);


ALTER TABLE public.medical_certificates OWNER TO postgres;

--
-- Name: medical_certificates_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.medical_certificates_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.medical_certificates_id_seq OWNER TO postgres;

--
-- Name: medical_certificates_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.medical_certificates_id_seq OWNED BY public.medical_certificates.id;


--
-- Name: medical_records; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.medical_records (
    id integer NOT NULL,
    patient_id integer,
    doctor_id integer,
    diagnosis text DEFAULT ''::text,
    symptoms text DEFAULT ''::text,
    icd10_codes text DEFAULT ''::text,
    notes text DEFAULT ''::text,
    visit_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id integer,
    facility_id integer
);


ALTER TABLE public.medical_records OWNER TO postgres;

--
-- Name: medical_records_coding; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.medical_records_coding (
    id integer NOT NULL,
    patient_id integer,
    visit_id integer,
    primary_diagnosis text DEFAULT ''::text,
    primary_icd10 text DEFAULT ''::text,
    secondary_diagnoses text DEFAULT ''::text,
    drg_code text DEFAULT ''::text,
    coder text DEFAULT ''::text,
    coding_date text DEFAULT ''::text,
    status text DEFAULT 'Pending'::text,
    notes text DEFAULT ''::text
);


ALTER TABLE public.medical_records_coding OWNER TO postgres;

--
-- Name: medical_records_coding_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.medical_records_coding_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.medical_records_coding_id_seq OWNER TO postgres;

--
-- Name: medical_records_coding_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.medical_records_coding_id_seq OWNED BY public.medical_records_coding.id;


--
-- Name: medical_records_files; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.medical_records_files (
    id integer NOT NULL,
    patient_id integer,
    file_number text DEFAULT ''::text,
    location text DEFAULT 'Archive'::text,
    shelf_number text DEFAULT ''::text,
    status text DEFAULT 'In Archive'::text,
    last_requested_by text DEFAULT ''::text,
    last_requested_at text DEFAULT ''::text,
    notes text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.medical_records_files OWNER TO postgres;

--
-- Name: medical_records_files_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.medical_records_files_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.medical_records_files_id_seq OWNER TO postgres;

--
-- Name: medical_records_files_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.medical_records_files_id_seq OWNED BY public.medical_records_files.id;


--
-- Name: medical_records_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.medical_records_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.medical_records_id_seq OWNER TO postgres;

--
-- Name: medical_records_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.medical_records_id_seq OWNED BY public.medical_records.id;


--
-- Name: medical_records_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.medical_records_requests (
    id integer NOT NULL,
    patient_id integer,
    file_number text DEFAULT ''::text,
    requested_by text DEFAULT ''::text,
    department text DEFAULT ''::text,
    purpose text DEFAULT 'Clinic Visit'::text,
    status text DEFAULT 'Pending'::text,
    requested_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    delivered_at text DEFAULT ''::text,
    returned_at text DEFAULT ''::text,
    notes text DEFAULT ''::text
);


ALTER TABLE public.medical_records_requests OWNER TO postgres;

--
-- Name: medical_records_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.medical_records_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.medical_records_requests_id_seq OWNER TO postgres;

--
-- Name: medical_records_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.medical_records_requests_id_seq OWNED BY public.medical_records_requests.id;


--
-- Name: medical_services; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.medical_services (
    id integer NOT NULL,
    name_en text DEFAULT ''::text,
    name_ar text DEFAULT ''::text,
    specialty text DEFAULT ''::text,
    category text DEFAULT ''::text,
    price real DEFAULT 0,
    is_active integer DEFAULT 1
);


ALTER TABLE public.medical_services OWNER TO postgres;

--
-- Name: medical_services_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.medical_services_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.medical_services_id_seq OWNER TO postgres;

--
-- Name: medical_services_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.medical_services_id_seq OWNED BY public.medical_services.id;


--
-- Name: medications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.medications (
    id integer NOT NULL,
    name text DEFAULT ''::text,
    active_ingredient text DEFAULT ''::text,
    stock_quantity integer DEFAULT 0,
    price real DEFAULT 0
);


ALTER TABLE public.medications OWNER TO postgres;

--
-- Name: medications_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.medications_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.medications_id_seq OWNER TO postgres;

--
-- Name: medications_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.medications_id_seq OWNED BY public.medications.id;


--
-- Name: mortuary_cases; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mortuary_cases (
    id integer NOT NULL,
    patient_id integer,
    deceased_name text DEFAULT ''::text,
    date_of_death text DEFAULT ''::text,
    time_of_death text DEFAULT ''::text,
    cause_of_death text DEFAULT ''::text,
    icd_code text DEFAULT ''::text,
    attending_physician text DEFAULT ''::text,
    next_of_kin text DEFAULT ''::text,
    next_of_kin_phone text DEFAULT ''::text,
    autopsy_required integer DEFAULT 0,
    body_location text DEFAULT ''::text,
    release_status text DEFAULT 'Pending'::text,
    released_to text DEFAULT ''::text,
    released_date text DEFAULT ''::text,
    death_certificate_number text DEFAULT ''::text,
    notes text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id integer,
    facility_id integer
);


ALTER TABLE public.mortuary_cases OWNER TO postgres;

--
-- Name: mortuary_cases_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mortuary_cases_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.mortuary_cases_id_seq OWNER TO postgres;

--
-- Name: mortuary_cases_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mortuary_cases_id_seq OWNED BY public.mortuary_cases.id;


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
-- Name: nutrition_assessments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.nutrition_assessments (
    id integer NOT NULL,
    patient_id integer,
    patient_name text DEFAULT ''::text,
    assessment_date text DEFAULT ''::text,
    height_cm real DEFAULT 0,
    weight_kg real DEFAULT 0,
    bmi real DEFAULT 0,
    bmi_category text DEFAULT ''::text,
    ideal_body_weight real DEFAULT 0,
    caloric_needs integer DEFAULT 0,
    protein_needs real DEFAULT 0,
    screening_score integer DEFAULT 0,
    malnutrition_risk text DEFAULT 'Low'::text,
    plan text DEFAULT ''::text,
    assessed_by text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.nutrition_assessments OWNER TO postgres;

--
-- Name: nutrition_assessments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.nutrition_assessments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.nutrition_assessments_id_seq OWNER TO postgres;

--
-- Name: nutrition_assessments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.nutrition_assessments_id_seq OWNED BY public.nutrition_assessments.id;


--
-- Name: online_bookings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.online_bookings (
    id integer NOT NULL,
    patient_name text DEFAULT ''::text,
    phone text DEFAULT ''::text,
    email text DEFAULT ''::text,
    department text DEFAULT ''::text,
    doctor_name text DEFAULT ''::text,
    preferred_date text DEFAULT ''::text,
    preferred_time text DEFAULT ''::text,
    status text DEFAULT 'Pending'::text,
    source text DEFAULT 'Online'::text,
    notes text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id integer
);


ALTER TABLE public.online_bookings OWNER TO postgres;

--
-- Name: online_bookings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.online_bookings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.online_bookings_id_seq OWNER TO postgres;

--
-- Name: online_bookings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.online_bookings_id_seq OWNED BY public.online_bookings.id;


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
-- Name: package_sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.package_sessions (
    id integer NOT NULL,
    package_id integer,
    patient_id integer,
    session_number integer DEFAULT 0,
    session_date text DEFAULT ''::text,
    status text DEFAULT 'Pending'::text,
    notes text DEFAULT ''::text,
    performed_by text DEFAULT ''::text
);


ALTER TABLE public.package_sessions OWNER TO postgres;

--
-- Name: package_sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.package_sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.package_sessions_id_seq OWNER TO postgres;

--
-- Name: package_sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.package_sessions_id_seq OWNED BY public.package_sessions.id;


--
-- Name: packages; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.packages (
    id integer NOT NULL,
    package_name_ar text DEFAULT ''::text,
    package_name_en text DEFAULT ''::text,
    department text DEFAULT ''::text,
    total_sessions integer DEFAULT 1,
    price real DEFAULT 0,
    is_active integer DEFAULT 1,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.packages OWNER TO postgres;

--
-- Name: packages_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.packages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.packages_id_seq OWNER TO postgres;

--
-- Name: packages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.packages_id_seq OWNED BY public.packages.id;


--
-- Name: pathology_cases; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pathology_cases (
    id integer NOT NULL,
    patient_id integer,
    patient_name text DEFAULT ''::text,
    specimen_type text DEFAULT ''::text,
    collection_date text DEFAULT ''::text,
    received_date text DEFAULT ''::text,
    pathologist text DEFAULT ''::text,
    gross_description text DEFAULT ''::text,
    microscopic_findings text DEFAULT ''::text,
    diagnosis text DEFAULT ''::text,
    icd_code text DEFAULT ''::text,
    stage text DEFAULT ''::text,
    grade text DEFAULT ''::text,
    status text DEFAULT 'Received'::text,
    report_date text DEFAULT ''::text,
    notes text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id integer,
    facility_id integer
);


ALTER TABLE public.pathology_cases OWNER TO postgres;

--
-- Name: pathology_cases_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pathology_cases_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pathology_cases_id_seq OWNER TO postgres;

--
-- Name: pathology_cases_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pathology_cases_id_seq OWNED BY public.pathology_cases.id;


--
-- Name: patient_drug_education; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.patient_drug_education (
    id integer NOT NULL,
    patient_id integer,
    patient_name text DEFAULT ''::text,
    medication text DEFAULT ''::text,
    instructions text DEFAULT ''::text,
    side_effects text DEFAULT ''::text,
    precautions text DEFAULT ''::text,
    educated_by text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.patient_drug_education OWNER TO postgres;

--
-- Name: patient_drug_education_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.patient_drug_education_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.patient_drug_education_id_seq OWNER TO postgres;

--
-- Name: patient_drug_education_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.patient_drug_education_id_seq OWNED BY public.patient_drug_education.id;


--
-- Name: patient_referrals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.patient_referrals (
    id integer NOT NULL,
    patient_id integer,
    patient_name text DEFAULT ''::text,
    from_doctor_id integer,
    from_doctor text DEFAULT ''::text,
    to_department text DEFAULT ''::text,
    to_doctor text DEFAULT ''::text,
    reason text DEFAULT ''::text,
    urgency text DEFAULT 'Normal'::text,
    status text DEFAULT 'Pending'::text,
    notes text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id integer,
    facility_id integer
);


ALTER TABLE public.patient_referrals OWNER TO postgres;

--
-- Name: patient_referrals_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.patient_referrals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.patient_referrals_id_seq OWNER TO postgres;

--
-- Name: patient_referrals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.patient_referrals_id_seq OWNED BY public.patient_referrals.id;


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
-- Name: pharmacy_drug_catalog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pharmacy_drug_catalog (
    id integer NOT NULL,
    drug_name text DEFAULT ''::text,
    active_ingredient text DEFAULT ''::text,
    barcode text DEFAULT ''::text,
    category text DEFAULT ''::text,
    unit text DEFAULT ''::text,
    selling_price real DEFAULT 0,
    cost_price real DEFAULT 0,
    stock_qty integer DEFAULT 0,
    min_qty integer DEFAULT 5,
    expiry_date text DEFAULT ''::text,
    is_active integer DEFAULT 1,
    tenant_id integer,
    branch_id integer
);


ALTER TABLE public.pharmacy_drug_catalog OWNER TO postgres;

--
-- Name: pharmacy_drug_catalog_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pharmacy_drug_catalog_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pharmacy_drug_catalog_id_seq OWNER TO postgres;

--
-- Name: pharmacy_drug_catalog_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pharmacy_drug_catalog_id_seq OWNED BY public.pharmacy_drug_catalog.id;


--
-- Name: pharmacy_opening_balances; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pharmacy_opening_balances (
    id integer NOT NULL,
    drug_id integer,
    qty integer DEFAULT 0,
    unit_cost real DEFAULT 0,
    expiry_date text DEFAULT ''::text,
    batch_number text DEFAULT ''::text,
    entry_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id integer,
    branch_id integer
);


ALTER TABLE public.pharmacy_opening_balances OWNER TO postgres;

--
-- Name: pharmacy_opening_balances_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pharmacy_opening_balances_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pharmacy_opening_balances_id_seq OWNER TO postgres;

--
-- Name: pharmacy_opening_balances_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pharmacy_opening_balances_id_seq OWNED BY public.pharmacy_opening_balances.id;


--
-- Name: pharmacy_prescriptions_queue; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pharmacy_prescriptions_queue (
    id integer NOT NULL,
    patient_id integer,
    doctor_id integer,
    clinic_name text DEFAULT ''::text,
    prescription_text text DEFAULT ''::text,
    status text DEFAULT 'Pending'::text,
    dispensed_by text DEFAULT ''::text,
    dispensed_at timestamp without time zone,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id integer,
    branch_id integer,
    doctor text DEFAULT ''::text
);


ALTER TABLE public.pharmacy_prescriptions_queue OWNER TO postgres;

--
-- Name: pharmacy_prescriptions_queue_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pharmacy_prescriptions_queue_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pharmacy_prescriptions_queue_id_seq OWNER TO postgres;

--
-- Name: pharmacy_prescriptions_queue_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pharmacy_prescriptions_queue_id_seq OWNED BY public.pharmacy_prescriptions_queue.id;


--
-- Name: pharmacy_purchase_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pharmacy_purchase_items (
    id integer NOT NULL,
    purchase_id integer,
    drug_id integer,
    qty integer DEFAULT 0,
    unit_cost real DEFAULT 0,
    bonus_qty integer DEFAULT 0,
    discount real DEFAULT 0,
    expiry_date text DEFAULT ''::text,
    batch_number text DEFAULT ''::text,
    tenant_id integer
);


ALTER TABLE public.pharmacy_purchase_items OWNER TO postgres;

--
-- Name: pharmacy_purchase_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pharmacy_purchase_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pharmacy_purchase_items_id_seq OWNER TO postgres;

--
-- Name: pharmacy_purchase_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pharmacy_purchase_items_id_seq OWNED BY public.pharmacy_purchase_items.id;


--
-- Name: pharmacy_purchase_orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pharmacy_purchase_orders (
    id integer NOT NULL,
    supplier_id integer,
    order_date text DEFAULT ''::text,
    total_amount real DEFAULT 0,
    discount real DEFAULT 0,
    bonus_value real DEFAULT 0,
    status text DEFAULT 'Draft'::text,
    notes text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id integer,
    branch_id integer
);


ALTER TABLE public.pharmacy_purchase_orders OWNER TO postgres;

--
-- Name: pharmacy_purchase_orders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pharmacy_purchase_orders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pharmacy_purchase_orders_id_seq OWNER TO postgres;

--
-- Name: pharmacy_purchase_orders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pharmacy_purchase_orders_id_seq OWNED BY public.pharmacy_purchase_orders.id;


--
-- Name: pharmacy_sale_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pharmacy_sale_items (
    id integer NOT NULL,
    sale_id integer,
    drug_id integer,
    qty integer DEFAULT 0,
    unit_price real DEFAULT 0,
    total_price real DEFAULT 0,
    bonus_qty integer DEFAULT 0,
    discount real DEFAULT 0,
    tenant_id integer
);


ALTER TABLE public.pharmacy_sale_items OWNER TO postgres;

--
-- Name: pharmacy_sale_items_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pharmacy_sale_items_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pharmacy_sale_items_id_seq OWNER TO postgres;

--
-- Name: pharmacy_sale_items_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pharmacy_sale_items_id_seq OWNED BY public.pharmacy_sale_items.id;


--
-- Name: pharmacy_sales; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pharmacy_sales (
    id integer NOT NULL,
    patient_id integer,
    sale_type text DEFAULT ''::text,
    total_amount real DEFAULT 0,
    discount real DEFAULT 0,
    insurance_coverage real DEFAULT 0,
    patient_share real DEFAULT 0,
    payment_method text DEFAULT ''::text,
    cashier text DEFAULT ''::text,
    invoice_number text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id integer,
    branch_id integer
);


ALTER TABLE public.pharmacy_sales OWNER TO postgres;

--
-- Name: pharmacy_sales_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pharmacy_sales_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pharmacy_sales_id_seq OWNER TO postgres;

--
-- Name: pharmacy_sales_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pharmacy_sales_id_seq OWNED BY public.pharmacy_sales.id;


--
-- Name: pharmacy_suppliers; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.pharmacy_suppliers (
    id integer NOT NULL,
    company_name text DEFAULT ''::text,
    contact_person text DEFAULT ''::text,
    phone text DEFAULT ''::text,
    email text DEFAULT ''::text,
    address text DEFAULT ''::text,
    tax_number text DEFAULT ''::text,
    notes text DEFAULT ''::text,
    tenant_id integer
);


ALTER TABLE public.pharmacy_suppliers OWNER TO postgres;

--
-- Name: pharmacy_suppliers_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.pharmacy_suppliers_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.pharmacy_suppliers_id_seq OWNER TO postgres;

--
-- Name: pharmacy_suppliers_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.pharmacy_suppliers_id_seq OWNED BY public.pharmacy_suppliers.id;


--
-- Name: portal_appointments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.portal_appointments (
    id integer NOT NULL,
    patient_id integer,
    portal_user_id integer,
    department text DEFAULT ''::text,
    preferred_date text DEFAULT ''::text,
    preferred_time text DEFAULT ''::text,
    reason text DEFAULT ''::text,
    status text DEFAULT 'Requested'::text,
    notes text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id integer
);


ALTER TABLE public.portal_appointments OWNER TO postgres;

--
-- Name: portal_appointments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.portal_appointments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.portal_appointments_id_seq OWNER TO postgres;

--
-- Name: portal_appointments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.portal_appointments_id_seq OWNED BY public.portal_appointments.id;


--
-- Name: portal_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.portal_users (
    id integer NOT NULL,
    patient_id integer,
    username text DEFAULT ''::text,
    password_hash text DEFAULT ''::text,
    email text DEFAULT ''::text,
    phone text DEFAULT ''::text,
    is_active integer DEFAULT 1,
    last_login text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.portal_users OWNER TO postgres;

--
-- Name: portal_users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.portal_users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.portal_users_id_seq OWNER TO postgres;

--
-- Name: portal_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.portal_users_id_seq OWNED BY public.portal_users.id;


--
-- Name: prescriptions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.prescriptions (
    id integer NOT NULL,
    patient_id integer,
    doctor_id integer,
    medication_id integer,
    dosage text DEFAULT ''::text,
    duration text DEFAULT ''::text,
    status text DEFAULT 'Pending'::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id integer,
    facility_id integer
);


ALTER TABLE public.prescriptions OWNER TO postgres;

--
-- Name: prescriptions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.prescriptions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.prescriptions_id_seq OWNER TO postgres;

--
-- Name: prescriptions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.prescriptions_id_seq OWNED BY public.prescriptions.id;


--
-- Name: quality_incidents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.quality_incidents (
    id integer NOT NULL,
    incident_type text DEFAULT ''::text,
    severity text DEFAULT 'Minor'::text,
    incident_date text DEFAULT ''::text,
    incident_time text DEFAULT ''::text,
    department text DEFAULT ''::text,
    location text DEFAULT ''::text,
    patient_id integer DEFAULT 0,
    patient_name text DEFAULT ''::text,
    description text DEFAULT ''::text,
    immediate_action text DEFAULT ''::text,
    reported_by text DEFAULT ''::text,
    assigned_to text DEFAULT ''::text,
    root_cause text DEFAULT ''::text,
    corrective_action text DEFAULT ''::text,
    preventive_action text DEFAULT ''::text,
    status text DEFAULT 'Open'::text,
    closed_date text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id integer
);


ALTER TABLE public.quality_incidents OWNER TO postgres;

--
-- Name: quality_incidents_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.quality_incidents_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.quality_incidents_id_seq OWNER TO postgres;

--
-- Name: quality_incidents_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.quality_incidents_id_seq OWNED BY public.quality_incidents.id;


--
-- Name: quality_kpis; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.quality_kpis (
    id integer NOT NULL,
    kpi_name text DEFAULT ''::text,
    kpi_name_ar text DEFAULT ''::text,
    category text DEFAULT ''::text,
    target_value real DEFAULT 0,
    actual_value real DEFAULT 0,
    unit text DEFAULT '%'::text,
    period text DEFAULT ''::text,
    department text DEFAULT ''::text,
    status text DEFAULT 'On Track'::text,
    notes text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id integer
);


ALTER TABLE public.quality_kpis OWNER TO postgres;

--
-- Name: quality_kpis_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.quality_kpis_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.quality_kpis_id_seq OWNER TO postgres;

--
-- Name: quality_kpis_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.quality_kpis_id_seq OWNED BY public.quality_kpis.id;


--
-- Name: quality_patient_satisfaction; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.quality_patient_satisfaction (
    id integer NOT NULL,
    patient_id integer DEFAULT 0,
    patient_name text DEFAULT ''::text,
    department text DEFAULT ''::text,
    survey_date text DEFAULT ''::text,
    overall_rating integer DEFAULT 0,
    cleanliness integer DEFAULT 0,
    staff_courtesy integer DEFAULT 0,
    wait_time integer DEFAULT 0,
    communication integer DEFAULT 0,
    pain_management integer DEFAULT 0,
    food_quality integer DEFAULT 0,
    comments text DEFAULT ''::text,
    would_recommend integer DEFAULT 0,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id integer
);


ALTER TABLE public.quality_patient_satisfaction OWNER TO postgres;

--
-- Name: quality_patient_satisfaction_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.quality_patient_satisfaction_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.quality_patient_satisfaction_id_seq OWNER TO postgres;

--
-- Name: quality_patient_satisfaction_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.quality_patient_satisfaction_id_seq OWNED BY public.quality_patient_satisfaction.id;


--
-- Name: queue_advertisements; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.queue_advertisements (
    id integer NOT NULL,
    title text DEFAULT ''::text,
    image_path text DEFAULT ''::text,
    display_order integer DEFAULT 0,
    duration_seconds integer DEFAULT 10,
    is_active integer DEFAULT 1,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id integer
);


ALTER TABLE public.queue_advertisements OWNER TO postgres;

--
-- Name: queue_advertisements_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.queue_advertisements_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.queue_advertisements_id_seq OWNER TO postgres;

--
-- Name: queue_advertisements_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.queue_advertisements_id_seq OWNED BY public.queue_advertisements.id;


--
-- Name: radiology_catalog; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.radiology_catalog (
    id integer NOT NULL,
    modality text DEFAULT ''::text,
    exact_name text DEFAULT ''::text,
    default_template text DEFAULT ''::text,
    price real DEFAULT 0
);


ALTER TABLE public.radiology_catalog OWNER TO postgres;

--
-- Name: radiology_catalog_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.radiology_catalog_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.radiology_catalog_id_seq OWNER TO postgres;

--
-- Name: radiology_catalog_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.radiology_catalog_id_seq OWNED BY public.radiology_catalog.id;


--
-- Name: rehab_assessments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rehab_assessments (
    id integer NOT NULL,
    rehab_patient_id integer,
    patient_id integer,
    assessment_type text DEFAULT ''::text,
    rom_scores text DEFAULT ''::text,
    strength_scores text DEFAULT ''::text,
    functional_scores text DEFAULT ''::text,
    balance_scores text DEFAULT ''::text,
    pain_level integer DEFAULT 0,
    assessor text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.rehab_assessments OWNER TO postgres;

--
-- Name: rehab_assessments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rehab_assessments_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rehab_assessments_id_seq OWNER TO postgres;

--
-- Name: rehab_assessments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rehab_assessments_id_seq OWNED BY public.rehab_assessments.id;


--
-- Name: rehab_goals; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rehab_goals (
    id integer NOT NULL,
    rehab_patient_id integer,
    goal_description text DEFAULT ''::text,
    target_date text DEFAULT ''::text,
    progress integer DEFAULT 0,
    status text DEFAULT 'In Progress'::text,
    notes text DEFAULT ''::text
);


ALTER TABLE public.rehab_goals OWNER TO postgres;

--
-- Name: rehab_goals_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rehab_goals_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rehab_goals_id_seq OWNER TO postgres;

--
-- Name: rehab_goals_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rehab_goals_id_seq OWNED BY public.rehab_goals.id;


--
-- Name: rehab_patients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rehab_patients (
    id integer NOT NULL,
    patient_id integer,
    patient_name text DEFAULT ''::text,
    diagnosis text DEFAULT ''::text,
    referral_source text DEFAULT ''::text,
    therapist text DEFAULT ''::text,
    therapy_type text DEFAULT 'Physical Therapy'::text,
    start_date text DEFAULT ''::text,
    target_end_date text DEFAULT ''::text,
    status text DEFAULT 'Active'::text,
    notes text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.rehab_patients OWNER TO postgres;

--
-- Name: rehab_patients_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rehab_patients_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rehab_patients_id_seq OWNER TO postgres;

--
-- Name: rehab_patients_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rehab_patients_id_seq OWNED BY public.rehab_patients.id;


--
-- Name: rehab_sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rehab_sessions (
    id integer NOT NULL,
    rehab_patient_id integer,
    patient_id integer,
    session_date text DEFAULT ''::text,
    session_number integer DEFAULT 1,
    therapist text DEFAULT ''::text,
    session_type text DEFAULT 'Individual'::text,
    exercises text DEFAULT ''::text,
    duration_minutes integer DEFAULT 30,
    pain_before integer DEFAULT 0,
    pain_after integer DEFAULT 0,
    progress_notes text DEFAULT ''::text,
    status text DEFAULT 'Completed'::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.rehab_sessions OWNER TO postgres;

--
-- Name: rehab_sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.rehab_sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.rehab_sessions_id_seq OWNER TO postgres;

--
-- Name: rehab_sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.rehab_sessions_id_seq OWNED BY public.rehab_sessions.id;


--
-- Name: social_work_cases; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.social_work_cases (
    id integer NOT NULL,
    patient_id integer,
    patient_name text DEFAULT ''::text,
    case_type text DEFAULT 'General'::text,
    social_worker text DEFAULT ''::text,
    assessment text DEFAULT ''::text,
    plan text DEFAULT ''::text,
    interventions text DEFAULT ''::text,
    referrals text DEFAULT ''::text,
    status text DEFAULT 'Open'::text,
    priority text DEFAULT 'Medium'::text,
    follow_up_date text DEFAULT ''::text,
    notes text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id integer,
    facility_id integer
);


ALTER TABLE public.social_work_cases OWNER TO postgres;

--
-- Name: social_work_cases_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.social_work_cases_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.social_work_cases_id_seq OWNER TO postgres;

--
-- Name: social_work_cases_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.social_work_cases_id_seq OWNED BY public.social_work_cases.id;


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
-- Name: system_users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.system_users (
    id integer NOT NULL,
    username text NOT NULL,
    password_hash text DEFAULT ''::text,
    display_name text DEFAULT ''::text,
    role text DEFAULT 'Reception'::text,
    speciality text DEFAULT ''::text,
    permissions text DEFAULT ''::text,
    commission_type text DEFAULT 'percentage'::text,
    commission_value real DEFAULT 0,
    is_active integer DEFAULT 1,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    last_ip text DEFAULT ''::text
);


ALTER TABLE public.system_users OWNER TO postgres;

--
-- Name: system_users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.system_users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.system_users_id_seq OWNER TO postgres;

--
-- Name: system_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.system_users_id_seq OWNED BY public.system_users.id;


--
-- Name: telemedicine_sessions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.telemedicine_sessions (
    id integer NOT NULL,
    patient_id integer,
    patient_name text DEFAULT ''::text,
    doctor text DEFAULT ''::text,
    speciality text DEFAULT ''::text,
    session_type text DEFAULT 'Video'::text,
    scheduled_date text DEFAULT ''::text,
    scheduled_time text DEFAULT ''::text,
    duration_minutes integer DEFAULT 15,
    meeting_link text DEFAULT ''::text,
    diagnosis text DEFAULT ''::text,
    prescription text DEFAULT ''::text,
    status text DEFAULT 'Scheduled'::text,
    notes text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id integer,
    facility_id integer
);


ALTER TABLE public.telemedicine_sessions OWNER TO postgres;

--
-- Name: telemedicine_sessions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.telemedicine_sessions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.telemedicine_sessions_id_seq OWNER TO postgres;

--
-- Name: telemedicine_sessions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.telemedicine_sessions_id_seq OWNED BY public.telemedicine_sessions.id;


--
-- Name: tenant_lab_test_overrides; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tenant_lab_test_overrides (
    id integer NOT NULL,
    tenant_id integer NOT NULL,
    test_id integer NOT NULL,
    custom_price real NOT NULL,
    is_active integer DEFAULT 1,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE ONLY public.tenant_lab_test_overrides FORCE ROW LEVEL SECURITY;


ALTER TABLE public.tenant_lab_test_overrides OWNER TO postgres;

--
-- Name: tenant_lab_test_overrides_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tenant_lab_test_overrides_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tenant_lab_test_overrides_id_seq OWNER TO postgres;

--
-- Name: tenant_lab_test_overrides_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tenant_lab_test_overrides_id_seq OWNED BY public.tenant_lab_test_overrides.id;


--
-- Name: tenant_radiology_overrides; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tenant_radiology_overrides (
    id integer NOT NULL,
    tenant_id integer NOT NULL,
    radiology_id integer NOT NULL,
    custom_price real NOT NULL,
    custom_template text,
    is_active integer DEFAULT 1,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE ONLY public.tenant_radiology_overrides FORCE ROW LEVEL SECURITY;


ALTER TABLE public.tenant_radiology_overrides OWNER TO postgres;

--
-- Name: tenant_radiology_overrides_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tenant_radiology_overrides_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tenant_radiology_overrides_id_seq OWNER TO postgres;

--
-- Name: tenant_radiology_overrides_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tenant_radiology_overrides_id_seq OWNED BY public.tenant_radiology_overrides.id;


--
-- Name: tenant_service_overrides; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tenant_service_overrides (
    id integer NOT NULL,
    tenant_id integer NOT NULL,
    service_id integer NOT NULL,
    custom_price real NOT NULL,
    is_active integer DEFAULT 1,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

ALTER TABLE ONLY public.tenant_service_overrides FORCE ROW LEVEL SECURITY;


ALTER TABLE public.tenant_service_overrides OWNER TO postgres;

--
-- Name: tenant_service_overrides_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tenant_service_overrides_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tenant_service_overrides_id_seq OWNER TO postgres;

--
-- Name: tenant_service_overrides_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tenant_service_overrides_id_seq OWNED BY public.tenant_service_overrides.id;


--
-- Name: tenant_settings; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tenant_settings (
    id integer NOT NULL,
    tenant_id integer NOT NULL,
    setting_key character varying(100) NOT NULL,
    setting_value text NOT NULL
);


ALTER TABLE public.tenant_settings OWNER TO postgres;

--
-- Name: tenant_settings_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tenant_settings_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tenant_settings_id_seq OWNER TO postgres;

--
-- Name: tenant_settings_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tenant_settings_id_seq OWNED BY public.tenant_settings.id;


--
-- Name: tenants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tenants (
    id integer NOT NULL,
    name character varying(200) NOT NULL,
    subdomain character varying(100) NOT NULL,
    status character varying(50) DEFAULT 'active'::character varying,
    plan_type character varying(50) DEFAULT 'standard'::character varying,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.tenants OWNER TO postgres;

--
-- Name: tenants_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tenants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tenants_id_seq OWNER TO postgres;

--
-- Name: tenants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tenants_id_seq OWNED BY public.tenants.id;


--
-- Name: transport_requests; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transport_requests (
    id integer NOT NULL,
    patient_id integer,
    patient_name text DEFAULT ''::text,
    from_location text DEFAULT ''::text,
    to_location text DEFAULT ''::text,
    transport_type text DEFAULT 'Wheelchair'::text,
    priority text DEFAULT 'Routine'::text,
    requested_by text DEFAULT ''::text,
    assigned_porter text DEFAULT ''::text,
    request_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    pickup_time text DEFAULT ''::text,
    dropoff_time text DEFAULT ''::text,
    special_needs text DEFAULT ''::text,
    status text DEFAULT 'Pending'::text,
    notes text DEFAULT ''::text,
    tenant_id integer,
    branch_id integer
);


ALTER TABLE public.transport_requests OWNER TO postgres;

--
-- Name: transport_requests_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.transport_requests_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transport_requests_id_seq OWNER TO postgres;

--
-- Name: transport_requests_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.transport_requests_id_seq OWNED BY public.transport_requests.id;


--
-- Name: user_facilities; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_facilities (
    id integer NOT NULL,
    user_id integer NOT NULL,
    facility_id integer NOT NULL,
    branch_id integer NOT NULL,
    is_primary boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.user_facilities OWNER TO postgres;

--
-- Name: user_facilities_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_facilities_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_facilities_id_seq OWNER TO postgres;

--
-- Name: user_facilities_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_facilities_id_seq OWNED BY public.user_facilities.id;


--
-- Name: user_permissions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_permissions (
    id integer NOT NULL,
    user_id integer,
    module_name text DEFAULT ''::text,
    can_view integer DEFAULT 0,
    can_add integer DEFAULT 0,
    can_edit integer DEFAULT 0,
    can_delete integer DEFAULT 0,
    can_print integer DEFAULT 0
);


ALTER TABLE public.user_permissions OWNER TO postgres;

--
-- Name: user_permissions_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_permissions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_permissions_id_seq OWNER TO postgres;

--
-- Name: user_permissions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_permissions_id_seq OWNED BY public.user_permissions.id;


--
-- Name: user_tenants; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_tenants (
    id integer NOT NULL,
    user_id integer NOT NULL,
    tenant_id integer NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.user_tenants OWNER TO postgres;

--
-- Name: user_tenants_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_tenants_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_tenants_id_seq OWNER TO postgres;

--
-- Name: user_tenants_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.user_tenants_id_seq OWNED BY public.user_tenants.id;


--
-- Name: waiting_queue; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.waiting_queue (
    id integer NOT NULL,
    patient_id integer,
    patient_name text DEFAULT ''::text,
    doctor text DEFAULT ''::text,
    department text DEFAULT ''::text,
    status text DEFAULT 'Waiting'::text,
    check_in_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id integer,
    branch_id integer
);


ALTER TABLE public.waiting_queue OWNER TO postgres;

--
-- Name: waiting_queue_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.waiting_queue_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.waiting_queue_id_seq OWNER TO postgres;

--
-- Name: waiting_queue_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.waiting_queue_id_seq OWNED BY public.waiting_queue.id;


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
-- Name: zatca_invoices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.zatca_invoices (
    id integer NOT NULL,
    invoice_id integer,
    invoice_number text DEFAULT ''::text,
    invoice_type text DEFAULT 'Standard'::text,
    seller_name text DEFAULT ''::text,
    seller_vat text DEFAULT ''::text,
    buyer_name text DEFAULT ''::text,
    buyer_vat text DEFAULT ''::text,
    total_before_vat numeric(12,2) DEFAULT 0,
    vat_amount numeric(12,2) DEFAULT 0,
    total_with_vat numeric(12,2) DEFAULT 0,
    qr_code text DEFAULT ''::text,
    xml_hash text DEFAULT ''::text,
    submission_status text DEFAULT 'Pending'::text,
    submission_date text DEFAULT ''::text,
    zatca_response text DEFAULT ''::text,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    tenant_id integer,
    facility_id integer,
    branch_id integer
);


ALTER TABLE public.zatca_invoices OWNER TO postgres;

--
-- Name: zatca_invoices_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.zatca_invoices_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.zatca_invoices_id_seq OWNER TO postgres;

--
-- Name: zatca_invoices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.zatca_invoices_id_seq OWNED BY public.zatca_invoices.id;


--
-- Name: admission_daily_rounds id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admission_daily_rounds ALTER COLUMN id SET DEFAULT nextval('public.admission_daily_rounds_id_seq'::regclass);


--
-- Name: admissions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admissions ALTER COLUMN id SET DEFAULT nextval('public.admissions_id_seq'::regclass);


--
-- Name: appointments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments ALTER COLUMN id SET DEFAULT nextval('public.appointments_id_seq'::regclass);


--
-- Name: approvals id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.approvals ALTER COLUMN id SET DEFAULT nextval('public.approvals_id_seq'::regclass);


--
-- Name: audit_trail id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_trail ALTER COLUMN id SET DEFAULT nextval('public.audit_trail_id_seq'::regclass);


--
-- Name: bed_transfers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.bed_transfers ALTER COLUMN id SET DEFAULT nextval('public.bed_transfers_id_seq'::regclass);


--
-- Name: beds id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.beds ALTER COLUMN id SET DEFAULT nextval('public.beds_id_seq'::regclass);


--
-- Name: blood_bank_crossmatch id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blood_bank_crossmatch ALTER COLUMN id SET DEFAULT nextval('public.blood_bank_crossmatch_id_seq'::regclass);


--
-- Name: blood_bank_donors id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blood_bank_donors ALTER COLUMN id SET DEFAULT nextval('public.blood_bank_donors_id_seq'::regclass);


--
-- Name: blood_bank_transfusions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blood_bank_transfusions ALTER COLUMN id SET DEFAULT nextval('public.blood_bank_transfusions_id_seq'::regclass);


--
-- Name: blood_bank_units id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blood_bank_units ALTER COLUMN id SET DEFAULT nextval('public.blood_bank_units_id_seq'::regclass);


--
-- Name: branches id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.branches ALTER COLUMN id SET DEFAULT nextval('public.branches_id_seq'::regclass);


--
-- Name: clinical_pharmacy_reviews id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinical_pharmacy_reviews ALTER COLUMN id SET DEFAULT nextval('public.clinical_pharmacy_reviews_id_seq'::regclass);


--
-- Name: cme_activities id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cme_activities ALTER COLUMN id SET DEFAULT nextval('public.cme_activities_id_seq'::regclass);


--
-- Name: cme_registrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cme_registrations ALTER COLUMN id SET DEFAULT nextval('public.cme_registrations_id_seq'::regclass);


--
-- Name: consent_forms id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consent_forms ALTER COLUMN id SET DEFAULT nextval('public.consent_forms_id_seq'::regclass);


--
-- Name: cosmetic_cases id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cosmetic_cases ALTER COLUMN id SET DEFAULT nextval('public.cosmetic_cases_id_seq'::regclass);


--
-- Name: cosmetic_consents id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cosmetic_consents ALTER COLUMN id SET DEFAULT nextval('public.cosmetic_consents_id_seq'::regclass);


--
-- Name: cosmetic_followups id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cosmetic_followups ALTER COLUMN id SET DEFAULT nextval('public.cosmetic_followups_id_seq'::regclass);


--
-- Name: cosmetic_photos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cosmetic_photos ALTER COLUMN id SET DEFAULT nextval('public.cosmetic_photos_id_seq'::regclass);


--
-- Name: cosmetic_procedures id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cosmetic_procedures ALTER COLUMN id SET DEFAULT nextval('public.cosmetic_procedures_id_seq'::regclass);


--
-- Name: cssd_instrument_sets id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cssd_instrument_sets ALTER COLUMN id SET DEFAULT nextval('public.cssd_instrument_sets_id_seq'::regclass);


--
-- Name: cssd_load_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cssd_load_items ALTER COLUMN id SET DEFAULT nextval('public.cssd_load_items_id_seq'::regclass);


--
-- Name: cssd_sterilization_cycles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cssd_sterilization_cycles ALTER COLUMN id SET DEFAULT nextval('public.cssd_sterilization_cycles_id_seq'::regclass);


--
-- Name: daily_close id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.daily_close ALTER COLUMN id SET DEFAULT nextval('public.daily_close_id_seq'::regclass);


--
-- Name: dental_records id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dental_records ALTER COLUMN id SET DEFAULT nextval('public.dental_records_id_seq'::regclass);


--
-- Name: departments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments ALTER COLUMN id SET DEFAULT nextval('public.departments_id_seq'::regclass);


--
-- Name: diet_meals id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diet_meals ALTER COLUMN id SET DEFAULT nextval('public.diet_meals_id_seq'::regclass);


--
-- Name: diet_orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diet_orders ALTER COLUMN id SET DEFAULT nextval('public.diet_orders_id_seq'::regclass);


--
-- Name: discount_rules id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.discount_rules ALTER COLUMN id SET DEFAULT nextval('public.discount_rules_id_seq'::regclass);


--
-- Name: doctor_inventory_request_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctor_inventory_request_items ALTER COLUMN id SET DEFAULT nextval('public.doctor_inventory_request_items_id_seq'::regclass);


--
-- Name: doctor_inventory_requests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctor_inventory_requests ALTER COLUMN id SET DEFAULT nextval('public.doctor_inventory_requests_id_seq'::regclass);


--
-- Name: drug_interactions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drug_interactions ALTER COLUMN id SET DEFAULT nextval('public.drug_interactions_id_seq'::regclass);


--
-- Name: emar_administrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emar_administrations ALTER COLUMN id SET DEFAULT nextval('public.emar_administrations_id_seq'::regclass);


--
-- Name: emar_orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emar_orders ALTER COLUMN id SET DEFAULT nextval('public.emar_orders_id_seq'::regclass);


--
-- Name: emergency_beds id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emergency_beds ALTER COLUMN id SET DEFAULT nextval('public.emergency_beds_id_seq'::regclass);


--
-- Name: emergency_trauma_assessments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emergency_trauma_assessments ALTER COLUMN id SET DEFAULT nextval('public.emergency_trauma_assessments_id_seq'::regclass);


--
-- Name: emergency_visits id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emergency_visits ALTER COLUMN id SET DEFAULT nextval('public.emergency_visits_id_seq'::regclass);


--
-- Name: employee_exposures id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_exposures ALTER COLUMN id SET DEFAULT nextval('public.employee_exposures_id_seq'::regclass);


--
-- Name: employees id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees ALTER COLUMN id SET DEFAULT nextval('public.employees_id_seq'::regclass);


--
-- Name: facilities id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.facilities ALTER COLUMN id SET DEFAULT nextval('public.facilities_id_seq'::regclass);


--
-- Name: finance_chart_of_accounts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.finance_chart_of_accounts ALTER COLUMN id SET DEFAULT nextval('public.finance_chart_of_accounts_id_seq'::regclass);


--
-- Name: finance_cost_centers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.finance_cost_centers ALTER COLUMN id SET DEFAULT nextval('public.finance_cost_centers_id_seq'::regclass);


--
-- Name: finance_doctor_commissions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.finance_doctor_commissions ALTER COLUMN id SET DEFAULT nextval('public.finance_doctor_commissions_id_seq'::regclass);


--
-- Name: finance_fiscal_years id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.finance_fiscal_years ALTER COLUMN id SET DEFAULT nextval('public.finance_fiscal_years_id_seq'::regclass);


--
-- Name: finance_journal_entries id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.finance_journal_entries ALTER COLUMN id SET DEFAULT nextval('public.finance_journal_entries_id_seq'::regclass);


--
-- Name: finance_journal_lines id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.finance_journal_lines ALTER COLUMN id SET DEFAULT nextval('public.finance_journal_lines_id_seq'::regclass);


--
-- Name: finance_tax_declarations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.finance_tax_declarations ALTER COLUMN id SET DEFAULT nextval('public.finance_tax_declarations_id_seq'::regclass);


--
-- Name: finance_vouchers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.finance_vouchers ALTER COLUMN id SET DEFAULT nextval('public.finance_vouchers_id_seq'::regclass);


--
-- Name: form_templates id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.form_templates ALTER COLUMN id SET DEFAULT nextval('public.form_templates_id_seq'::regclass);


--
-- Name: hand_hygiene_audits id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hand_hygiene_audits ALTER COLUMN id SET DEFAULT nextval('public.hand_hygiene_audits_id_seq'::regclass);


--
-- Name: hr_advances id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hr_advances ALTER COLUMN id SET DEFAULT nextval('public.hr_advances_id_seq'::regclass);


--
-- Name: hr_attendance id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hr_attendance ALTER COLUMN id SET DEFAULT nextval('public.hr_attendance_id_seq'::regclass);


--
-- Name: hr_employee_custody id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hr_employee_custody ALTER COLUMN id SET DEFAULT nextval('public.hr_employee_custody_id_seq'::regclass);


--
-- Name: hr_employee_documents id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hr_employee_documents ALTER COLUMN id SET DEFAULT nextval('public.hr_employee_documents_id_seq'::regclass);


--
-- Name: hr_employees id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hr_employees ALTER COLUMN id SET DEFAULT nextval('public.hr_employees_id_seq'::regclass);


--
-- Name: hr_leaves id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hr_leaves ALTER COLUMN id SET DEFAULT nextval('public.hr_leaves_id_seq'::regclass);


--
-- Name: hr_salaries id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hr_salaries ALTER COLUMN id SET DEFAULT nextval('public.hr_salaries_id_seq'::regclass);


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
-- Name: infection_outbreaks id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.infection_outbreaks ALTER COLUMN id SET DEFAULT nextval('public.infection_outbreaks_id_seq'::regclass);


--
-- Name: infection_surveillance id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.infection_surveillance ALTER COLUMN id SET DEFAULT nextval('public.infection_surveillance_id_seq'::regclass);


--
-- Name: insurance_claims id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.insurance_claims ALTER COLUMN id SET DEFAULT nextval('public.insurance_claims_id_seq'::regclass);


--
-- Name: insurance_companies id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.insurance_companies ALTER COLUMN id SET DEFAULT nextval('public.insurance_companies_id_seq'::regclass);


--
-- Name: insurance_contracts id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.insurance_contracts ALTER COLUMN id SET DEFAULT nextval('public.insurance_contracts_id_seq'::regclass);


--
-- Name: insurance_policies id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.insurance_policies ALTER COLUMN id SET DEFAULT nextval('public.insurance_policies_id_seq'::regclass);


--
-- Name: integration_settings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.integration_settings ALTER COLUMN id SET DEFAULT nextval('public.integration_settings_id_seq'::regclass);


--
-- Name: internal_messages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.internal_messages ALTER COLUMN id SET DEFAULT nextval('public.internal_messages_id_seq'::regclass);


--
-- Name: inventory_dept_request_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_dept_request_items ALTER COLUMN id SET DEFAULT nextval('public.inventory_dept_request_items_id_seq'::regclass);


--
-- Name: inventory_dept_requests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_dept_requests ALTER COLUMN id SET DEFAULT nextval('public.inventory_dept_requests_id_seq'::regclass);


--
-- Name: inventory_issue_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_issue_items ALTER COLUMN id SET DEFAULT nextval('public.inventory_issue_items_id_seq'::regclass);


--
-- Name: inventory_issue_to_dept id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_issue_to_dept ALTER COLUMN id SET DEFAULT nextval('public.inventory_issue_to_dept_id_seq'::regclass);


--
-- Name: inventory_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_items ALTER COLUMN id SET DEFAULT nextval('public.inventory_items_id_seq'::regclass);


--
-- Name: inventory_opening_balances id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_opening_balances ALTER COLUMN id SET DEFAULT nextval('public.inventory_opening_balances_id_seq'::regclass);


--
-- Name: inventory_purchase_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_purchase_items ALTER COLUMN id SET DEFAULT nextval('public.inventory_purchase_items_id_seq'::regclass);


--
-- Name: inventory_purchases id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_purchases ALTER COLUMN id SET DEFAULT nextval('public.inventory_purchases_id_seq'::regclass);


--
-- Name: inventory_stock_count id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_stock_count ALTER COLUMN id SET DEFAULT nextval('public.inventory_stock_count_id_seq'::regclass);


--
-- Name: invoices id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices ALTER COLUMN id SET DEFAULT nextval('public.invoices_id_seq'::regclass);


--
-- Name: lab_radiology_orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lab_radiology_orders ALTER COLUMN id SET DEFAULT nextval('public.lab_radiology_orders_id_seq'::regclass);


--
-- Name: lab_results id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lab_results ALTER COLUMN id SET DEFAULT nextval('public.lab_results_id_seq'::regclass);


--
-- Name: lab_samples id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lab_samples ALTER COLUMN id SET DEFAULT nextval('public.lab_samples_id_seq'::regclass);


--
-- Name: lab_tests_catalog id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lab_tests_catalog ALTER COLUMN id SET DEFAULT nextval('public.lab_tests_catalog_id_seq'::regclass);


--
-- Name: maintenance_equipment id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenance_equipment ALTER COLUMN id SET DEFAULT nextval('public.maintenance_equipment_id_seq'::regclass);


--
-- Name: maintenance_pm_schedules id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenance_pm_schedules ALTER COLUMN id SET DEFAULT nextval('public.maintenance_pm_schedules_id_seq'::regclass);


--
-- Name: maintenance_work_orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenance_work_orders ALTER COLUMN id SET DEFAULT nextval('public.maintenance_work_orders_id_seq'::regclass);


--
-- Name: medical_certificates id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medical_certificates ALTER COLUMN id SET DEFAULT nextval('public.medical_certificates_id_seq'::regclass);


--
-- Name: medical_records id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medical_records ALTER COLUMN id SET DEFAULT nextval('public.medical_records_id_seq'::regclass);


--
-- Name: medical_records_coding id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medical_records_coding ALTER COLUMN id SET DEFAULT nextval('public.medical_records_coding_id_seq'::regclass);


--
-- Name: medical_records_files id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medical_records_files ALTER COLUMN id SET DEFAULT nextval('public.medical_records_files_id_seq'::regclass);


--
-- Name: medical_records_requests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medical_records_requests ALTER COLUMN id SET DEFAULT nextval('public.medical_records_requests_id_seq'::regclass);


--
-- Name: medical_services id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medical_services ALTER COLUMN id SET DEFAULT nextval('public.medical_services_id_seq'::regclass);


--
-- Name: medications id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medications ALTER COLUMN id SET DEFAULT nextval('public.medications_id_seq'::regclass);


--
-- Name: mortuary_cases id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mortuary_cases ALTER COLUMN id SET DEFAULT nextval('public.mortuary_cases_id_seq'::regclass);


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
-- Name: nutrition_assessments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nutrition_assessments ALTER COLUMN id SET DEFAULT nextval('public.nutrition_assessments_id_seq'::regclass);


--
-- Name: online_bookings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.online_bookings ALTER COLUMN id SET DEFAULT nextval('public.online_bookings_id_seq'::regclass);


--
-- Name: operating_rooms id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.operating_rooms ALTER COLUMN id SET DEFAULT nextval('public.operating_rooms_id_seq'::regclass);


--
-- Name: package_sessions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.package_sessions ALTER COLUMN id SET DEFAULT nextval('public.package_sessions_id_seq'::regclass);


--
-- Name: packages id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.packages ALTER COLUMN id SET DEFAULT nextval('public.packages_id_seq'::regclass);


--
-- Name: pathology_cases id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pathology_cases ALTER COLUMN id SET DEFAULT nextval('public.pathology_cases_id_seq'::regclass);


--
-- Name: patient_drug_education id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patient_drug_education ALTER COLUMN id SET DEFAULT nextval('public.patient_drug_education_id_seq'::regclass);


--
-- Name: patient_referrals id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patient_referrals ALTER COLUMN id SET DEFAULT nextval('public.patient_referrals_id_seq'::regclass);


--
-- Name: patients id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patients ALTER COLUMN id SET DEFAULT nextval('public.patients_id_seq'::regclass);


--
-- Name: pharmacy_drug_catalog id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacy_drug_catalog ALTER COLUMN id SET DEFAULT nextval('public.pharmacy_drug_catalog_id_seq'::regclass);


--
-- Name: pharmacy_opening_balances id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacy_opening_balances ALTER COLUMN id SET DEFAULT nextval('public.pharmacy_opening_balances_id_seq'::regclass);


--
-- Name: pharmacy_prescriptions_queue id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacy_prescriptions_queue ALTER COLUMN id SET DEFAULT nextval('public.pharmacy_prescriptions_queue_id_seq'::regclass);


--
-- Name: pharmacy_purchase_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacy_purchase_items ALTER COLUMN id SET DEFAULT nextval('public.pharmacy_purchase_items_id_seq'::regclass);


--
-- Name: pharmacy_purchase_orders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacy_purchase_orders ALTER COLUMN id SET DEFAULT nextval('public.pharmacy_purchase_orders_id_seq'::regclass);


--
-- Name: pharmacy_sale_items id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacy_sale_items ALTER COLUMN id SET DEFAULT nextval('public.pharmacy_sale_items_id_seq'::regclass);


--
-- Name: pharmacy_sales id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacy_sales ALTER COLUMN id SET DEFAULT nextval('public.pharmacy_sales_id_seq'::regclass);


--
-- Name: pharmacy_suppliers id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacy_suppliers ALTER COLUMN id SET DEFAULT nextval('public.pharmacy_suppliers_id_seq'::regclass);


--
-- Name: portal_appointments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portal_appointments ALTER COLUMN id SET DEFAULT nextval('public.portal_appointments_id_seq'::regclass);


--
-- Name: portal_users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portal_users ALTER COLUMN id SET DEFAULT nextval('public.portal_users_id_seq'::regclass);


--
-- Name: prescriptions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescriptions ALTER COLUMN id SET DEFAULT nextval('public.prescriptions_id_seq'::regclass);


--
-- Name: quality_incidents id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quality_incidents ALTER COLUMN id SET DEFAULT nextval('public.quality_incidents_id_seq'::regclass);


--
-- Name: quality_kpis id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quality_kpis ALTER COLUMN id SET DEFAULT nextval('public.quality_kpis_id_seq'::regclass);


--
-- Name: quality_patient_satisfaction id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quality_patient_satisfaction ALTER COLUMN id SET DEFAULT nextval('public.quality_patient_satisfaction_id_seq'::regclass);


--
-- Name: queue_advertisements id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.queue_advertisements ALTER COLUMN id SET DEFAULT nextval('public.queue_advertisements_id_seq'::regclass);


--
-- Name: radiology_catalog id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.radiology_catalog ALTER COLUMN id SET DEFAULT nextval('public.radiology_catalog_id_seq'::regclass);


--
-- Name: rehab_assessments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rehab_assessments ALTER COLUMN id SET DEFAULT nextval('public.rehab_assessments_id_seq'::regclass);


--
-- Name: rehab_goals id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rehab_goals ALTER COLUMN id SET DEFAULT nextval('public.rehab_goals_id_seq'::regclass);


--
-- Name: rehab_patients id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rehab_patients ALTER COLUMN id SET DEFAULT nextval('public.rehab_patients_id_seq'::regclass);


--
-- Name: rehab_sessions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rehab_sessions ALTER COLUMN id SET DEFAULT nextval('public.rehab_sessions_id_seq'::regclass);


--
-- Name: social_work_cases id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.social_work_cases ALTER COLUMN id SET DEFAULT nextval('public.social_work_cases_id_seq'::regclass);


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
-- Name: system_users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_users ALTER COLUMN id SET DEFAULT nextval('public.system_users_id_seq'::regclass);


--
-- Name: telemedicine_sessions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.telemedicine_sessions ALTER COLUMN id SET DEFAULT nextval('public.telemedicine_sessions_id_seq'::regclass);


--
-- Name: tenant_lab_test_overrides id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenant_lab_test_overrides ALTER COLUMN id SET DEFAULT nextval('public.tenant_lab_test_overrides_id_seq'::regclass);


--
-- Name: tenant_radiology_overrides id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenant_radiology_overrides ALTER COLUMN id SET DEFAULT nextval('public.tenant_radiology_overrides_id_seq'::regclass);


--
-- Name: tenant_service_overrides id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenant_service_overrides ALTER COLUMN id SET DEFAULT nextval('public.tenant_service_overrides_id_seq'::regclass);


--
-- Name: tenant_settings id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenant_settings ALTER COLUMN id SET DEFAULT nextval('public.tenant_settings_id_seq'::regclass);


--
-- Name: tenants id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenants ALTER COLUMN id SET DEFAULT nextval('public.tenants_id_seq'::regclass);


--
-- Name: transport_requests id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transport_requests ALTER COLUMN id SET DEFAULT nextval('public.transport_requests_id_seq'::regclass);


--
-- Name: user_facilities id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_facilities ALTER COLUMN id SET DEFAULT nextval('public.user_facilities_id_seq'::regclass);


--
-- Name: user_permissions id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_permissions ALTER COLUMN id SET DEFAULT nextval('public.user_permissions_id_seq'::regclass);


--
-- Name: user_tenants id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_tenants ALTER COLUMN id SET DEFAULT nextval('public.user_tenants_id_seq'::regclass);


--
-- Name: waiting_queue id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.waiting_queue ALTER COLUMN id SET DEFAULT nextval('public.waiting_queue_id_seq'::regclass);


--
-- Name: wards id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wards ALTER COLUMN id SET DEFAULT nextval('public.wards_id_seq'::regclass);


--
-- Name: zatca_invoices id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zatca_invoices ALTER COLUMN id SET DEFAULT nextval('public.zatca_invoices_id_seq'::regclass);


--
-- Data for Name: admission_daily_rounds; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admission_daily_rounds (id, admission_id, patient_id, round_date, round_time, doctor_name, subjective, objective, assessment, plan, vitals_summary, orders, diet_changes, created_at, tenant_id, facility_id) FROM stdin;
\.


--
-- Data for Name: admissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.admissions (id, patient_id, patient_name, admission_type, admission_date, admitting_doctor, attending_doctor, department, ward_id, bed_id, diagnosis, icd10_code, admission_orders, diet_order, activity_level, dvt_prophylaxis, expected_los, insurance_auth, status, discharge_date, discharge_type, discharge_summary, discharge_instructions, discharge_medications, followup_date, followup_doctor, created_at, tenant_id, facility_id) FROM stdin;
\.


--
-- Data for Name: appointments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.appointments (id, patient_id, patient_name, doctor_name, department, appt_date, appt_time, notes, status, created_at, tenant_id, branch_id) FROM stdin;
\.


--
-- Data for Name: approvals; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.approvals (id, patient_id, service_id, request_date, status, approval_number, response_date) FROM stdin;
\.


--
-- Data for Name: audit_trail; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.audit_trail (id, user_id, username, action, module, record_id, old_values, new_values, ip_address, created_at, tenant_id, user_name, details) FROM stdin;
1	1	المدير العام	LOGIN	Auth	0		User logged in as Admin	::1	2026-06-19 02:10:03.0168	1		
2	1	المدير العام	LOGIN	Auth	0		User logged in as Admin	::1	2026-06-19 02:10:24.380491	1		
3	1	المدير العام	LOGIN	Auth	0		User logged in as Admin	::1	2026-06-19 02:18:48.938681	1		
4	1	المدير العام	LOGIN	Auth	0		User logged in as Admin	::1	2026-06-19 02:26:28.419873	1		
5	1	المدير العام	LOGIN	Auth	0		User logged in as Admin	::1	2026-06-19 02:46:08.417295	1		
6	1	المدير العام	LOGIN	Auth	0		User logged in as Admin	::1	2026-06-19 02:53:35.257821	1		
7	1	المدير العام	LOGIN	Auth	0		User logged in as Admin	::1	2026-06-19 03:10:21.141244	1		
8	1	المدير العام	LOGIN	Auth	0		User logged in as Admin	::1	2026-06-19 03:16:41.987644	1		
9	1	المدير العام	LOGIN	Auth	0		User logged in as Admin	::1	2026-06-19 03:20:21.796781	1		
10	1	المدير العام	LOGIN	Auth	0		User logged in as Admin	::1	2026-06-19 03:23:42.033084	1		
11	1	المدير العام	LOGIN	Auth	0		User logged in as Admin	::1	2026-06-19 03:28:52.011345	1		
12	1	المدير العام	LOGIN	Auth	0		User logged in as Admin	::1	2026-06-19 03:31:33.560535	1		
13	1	المدير العام	LOGIN	Auth	0		User logged in as Admin	::1	2026-06-19 03:38:28.064076	1		
14	1	المدير العام	LOGIN	Auth	0		User logged in as Admin	::1	2026-06-19 03:42:15.119518	1		
15	1	المدير العام	LOGIN	Auth	0		User logged in as Admin	::1	2026-06-19 03:48:51.798466	1		
16	1	المدير العام	LOGIN	Auth	0		User logged in as Admin	::1	2026-06-19 03:53:08.692367	1		
17	1	المدير العام	LOGIN	Auth	0		User logged in as Admin	::1	2026-06-19 04:06:51.025186	1		
18	1	المدير العام	LOGIN	Auth	0		User logged in as Admin	::1	2026-06-19 04:10:05.361069	1		
19	1	المدير العام	LOGIN	Auth	0		User logged in as Admin	::1	2026-06-19 04:15:40.632146	1		
20	1	المدير العام	LOGIN	Auth	0		User logged in as Admin	::1	2026-06-19 04:20:47.555926	1		
21	1	المدير العام	LOGIN	Auth	0		User logged in as Admin	::1	2026-06-19 05:41:54.259788	1		
22	1	المدير العام	LOGIN	Auth	0		User logged in as Admin	::1	2026-06-19 05:47:05.774606	1		
23	1	المدير العام	LOGIN	Auth	0		User logged in as Admin	::1	2026-06-19 06:04:13.564464	\N		
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
-- Data for Name: blood_bank_crossmatch; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.blood_bank_crossmatch (id, patient_id, patient_name, patient_blood_type, units_needed, unit_id, lab_technician, result, surgery_id, notes, created_at) FROM stdin;
\.


--
-- Data for Name: blood_bank_donors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.blood_bank_donors (id, donor_name, donor_name_ar, national_id, phone, blood_type, rh_factor, age, gender, last_donation_date, is_eligible, medical_history, notes, created_at) FROM stdin;
\.


--
-- Data for Name: blood_bank_transfusions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.blood_bank_transfusions (id, patient_id, patient_name, unit_id, bag_number, blood_type, component, administered_by, start_time, end_time, volume_ml, adverse_reaction, reaction_details, vital_signs_before, vital_signs_after, notes, created_at) FROM stdin;
\.


--
-- Data for Name: blood_bank_units; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.blood_bank_units (id, bag_number, blood_type, rh_factor, component, donor_id, collection_date, expiry_date, volume_ml, status, storage_location, notes, created_at) FROM stdin;
\.


--
-- Data for Name: branches; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.branches (id, facility_id, name, address, created_at) FROM stdin;
1	1	Main Branch	Riyadh, Saudi Arabia	2026-06-19 01:16:54.795292
\.


--
-- Data for Name: clinical_pharmacy_reviews; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.clinical_pharmacy_reviews (id, patient_id, patient_name, prescription_id, review_type, pharmacist, findings, recommendations, interventions, outcome, severity, status, created_at) FROM stdin;
\.


--
-- Data for Name: cme_activities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cme_activities (id, title, category, provider, credit_hours, activity_date, location, max_participants, registered, status, description, created_at) FROM stdin;
\.


--
-- Data for Name: cme_registrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cme_registrations (id, activity_id, employee_id, employee_name, registration_date, attendance_status, certificate_issued, notes) FROM stdin;
\.


--
-- Data for Name: company_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.company_settings (setting_key, setting_value, tenant_id) FROM stdin;
company_name_ar		1
company_name_en		1
tax_number		1
address		1
phone		1
logo_path		1
theme		1
sample_data_inserted	1	1
\.


--
-- Data for Name: consent_forms; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.consent_forms (id, patient_id, patient_name, form_type, form_title, form_title_ar, content, doctor_name, patient_signature, witness_name, witness_signature, signed_at, language, status, surgery_id, notes, created_at, tenant_id, facility_id) FROM stdin;
\.


--
-- Data for Name: cosmetic_cases; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cosmetic_cases (id, patient_id, patient_name, procedure_id, procedure_name, surgeon, assistant, anesthetist, surgery_date, surgery_time, duration_minutes, anesthesia_type, operating_room, pre_op_notes, operative_notes, post_op_notes, complications, total_cost, payment_status, status, created_at, tenant_id, facility_id) FROM stdin;
\.


--
-- Data for Name: cosmetic_consents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cosmetic_consents (id, case_id, patient_id, patient_name, procedure_name, consent_type, surgeon, risks_explained, alternatives_explained, expected_results, limitations, patient_questions, is_photography_consent, is_anesthesia_consent, is_blood_transfusion_consent, witness_name, consent_date, consent_time, patient_signature, witness_signature, status, created_at, tenant_id, facility_id) FROM stdin;
\.


--
-- Data for Name: cosmetic_followups; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cosmetic_followups (id, case_id, patient_id, patient_name, followup_date, days_post_op, healing_status, pain_level, swelling, complications, patient_satisfaction, surgeon_notes, next_followup, surgeon, status, created_at, tenant_id, facility_id) FROM stdin;
\.


--
-- Data for Name: cosmetic_photos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cosmetic_photos (id, case_id, patient_id, photo_type, photo_angle, photo_date, photo_path, notes, taken_by, created_at, tenant_id, facility_id) FROM stdin;
\.


--
-- Data for Name: cosmetic_procedures; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cosmetic_procedures (id, name_en, name_ar, category, description, estimated_duration, anesthesia_type, average_cost, risks, recovery_days, is_active) FROM stdin;
1	Rhinoplasty	تجميل الأنف	Face	Reshaping of the nose for aesthetic or functional purposes	120	General	15000.00	Bleeding, infection, asymmetry, breathing difficulties, numbness	14	1
2	Blepharoplasty	شد الجفون	Face	Upper and/or lower eyelid surgery to remove excess skin and fat	90	Local	8000.00	Dry eyes, blurred vision, asymmetry, scarring	10	1
3	Facelift (Rhytidectomy)	شد الوجه	Face	Lifting and tightening facial tissues to reduce sagging	180	General	25000.00	Hematoma, nerve injury, scarring, hair loss near incisions	21	1
4	Otoplasty	تجميل الأذن	Face	Reshaping or repositioning of the ears	90	Local	7000.00	Asymmetry, infection, overcorrection, scarring	7	1
5	Lip Augmentation	تكبير الشفاه	Face	Enhancement of lip volume using fillers or implants	30	Local	3000.00	Swelling, bruising, asymmetry, allergic reaction	3	1
6	Botox Injection	حقن البوتوكس	Non-Surgical	Wrinkle relaxation using botulinum toxin	15	None	1500.00	Bruising, headache, drooping, temporary weakness	0	1
7	Dermal Fillers	حقن الفيلر	Non-Surgical	Volume restoration using hyaluronic acid fillers	30	Local	2500.00	Swelling, bruising, lumps, vascular occlusion	2	1
8	Chemical Peel	التقشير الكيميائي	Non-Surgical	Chemical solution applied to improve skin texture	45	None	1000.00	Redness, peeling, pigmentation changes, scarring	5	1
9	Breast Augmentation	تكبير الثدي	Body	Enlargement using implants or fat transfer	120	General	20000.00	Capsular contracture, implant rupture, asymmetry, infection	14	1
10	Liposuction	شفط الدهون	Body	Removal of excess fat deposits from specific body areas	120	General	12000.00	Contour irregularities, fluid accumulation, numbness	14	1
11	Abdominoplasty	شد البطن	Body	Removal of excess skin and fat from the abdomen	180	General	18000.00	Seroma, wound healing issues, scarring, numbness	21	1
12	Laser Hair Removal	إزالة الشعر بالليزر	Laser	Permanent hair reduction using laser technology	30	None	500.00	Burns, pigmentation changes, paradoxical growth	0	1
13	Laser Skin Resurfacing	تقشير البشرة بالليزر	Laser	Laser treatment to improve skin texture and reduce wrinkles	60	Local	3000.00	Redness, swelling, infection, pigmentation changes	7	1
14	Hair Transplant (FUE)	زراعة الشعر	Hair	Follicular unit extraction for hair restoration	360	Local	15000.00	Infection, scarring, graft failure, temporary shock loss	14	1
15	PRP Therapy	علاج البلازما	Non-Surgical	Platelet-rich plasma injections for skin rejuvenation	30	None	1500.00	Bruising, swelling, infection, minimal pain	1	1
16	Rhinoplasty	تجميل الأنف	Face	Reshaping of the nose for aesthetic or functional purposes	120	General	15000.00	Bleeding, infection, asymmetry, breathing difficulties, numbness	14	1
17	Blepharoplasty	شد الجفون	Face	Upper and/or lower eyelid surgery to remove excess skin and fat	90	Local	8000.00	Dry eyes, blurred vision, asymmetry, scarring	10	1
18	Facelift (Rhytidectomy)	شد الوجه	Face	Lifting and tightening facial tissues to reduce sagging	180	General	25000.00	Hematoma, nerve injury, scarring, hair loss near incisions	21	1
19	Otoplasty	تجميل الأذن	Face	Reshaping or repositioning of the ears	90	Local	7000.00	Asymmetry, infection, overcorrection, scarring	7	1
20	Lip Augmentation	تكبير الشفاه	Face	Enhancement of lip volume using fillers or implants	30	Local	3000.00	Swelling, bruising, asymmetry, allergic reaction	3	1
21	Botox Injection	حقن البوتوكس	Non-Surgical	Wrinkle relaxation using botulinum toxin	15	None	1500.00	Bruising, headache, drooping, temporary weakness	0	1
22	Dermal Fillers	حقن الفيلر	Non-Surgical	Volume restoration using hyaluronic acid fillers	30	Local	2500.00	Swelling, bruising, lumps, vascular occlusion	2	1
23	Chemical Peel	التقشير الكيميائي	Non-Surgical	Chemical solution applied to improve skin texture	45	None	1000.00	Redness, peeling, pigmentation changes, scarring	5	1
24	Breast Augmentation	تكبير الثدي	Body	Enlargement using implants or fat transfer	120	General	20000.00	Capsular contracture, implant rupture, asymmetry, infection	14	1
25	Liposuction	شفط الدهون	Body	Removal of excess fat deposits from specific body areas	120	General	12000.00	Contour irregularities, fluid accumulation, numbness	14	1
26	Abdominoplasty	شد البطن	Body	Removal of excess skin and fat from the abdomen	180	General	18000.00	Seroma, wound healing issues, scarring, numbness	21	1
27	Laser Hair Removal	إزالة الشعر بالليزر	Laser	Permanent hair reduction using laser technology	30	None	500.00	Burns, pigmentation changes, paradoxical growth	0	1
28	Laser Skin Resurfacing	تقشير البشرة بالليزر	Laser	Laser treatment to improve skin texture and reduce wrinkles	60	Local	3000.00	Redness, swelling, infection, pigmentation changes	7	1
29	Hair Transplant (FUE)	زراعة الشعر	Hair	Follicular unit extraction for hair restoration	360	Local	15000.00	Infection, scarring, graft failure, temporary shock loss	14	1
30	PRP Therapy	علاج البلازما	Non-Surgical	Platelet-rich plasma injections for skin rejuvenation	30	None	1500.00	Bruising, swelling, infection, minimal pain	1	1
31	Rhinoplasty	تجميل الأنف	Face	Reshaping of the nose for aesthetic or functional purposes	120	General	15000.00	Bleeding, infection, asymmetry, breathing difficulties, numbness	14	1
32	Blepharoplasty	شد الجفون	Face	Upper and/or lower eyelid surgery to remove excess skin and fat	90	Local	8000.00	Dry eyes, blurred vision, asymmetry, scarring	10	1
33	Facelift (Rhytidectomy)	شد الوجه	Face	Lifting and tightening facial tissues to reduce sagging	180	General	25000.00	Hematoma, nerve injury, scarring, hair loss near incisions	21	1
34	Otoplasty	تجميل الأذن	Face	Reshaping or repositioning of the ears	90	Local	7000.00	Asymmetry, infection, overcorrection, scarring	7	1
35	Lip Augmentation	تكبير الشفاه	Face	Enhancement of lip volume using fillers or implants	30	Local	3000.00	Swelling, bruising, asymmetry, allergic reaction	3	1
36	Botox Injection	حقن البوتوكس	Non-Surgical	Wrinkle relaxation using botulinum toxin	15	None	1500.00	Bruising, headache, drooping, temporary weakness	0	1
37	Dermal Fillers	حقن الفيلر	Non-Surgical	Volume restoration using hyaluronic acid fillers	30	Local	2500.00	Swelling, bruising, lumps, vascular occlusion	2	1
38	Chemical Peel	التقشير الكيميائي	Non-Surgical	Chemical solution applied to improve skin texture	45	None	1000.00	Redness, peeling, pigmentation changes, scarring	5	1
39	Breast Augmentation	تكبير الثدي	Body	Enlargement using implants or fat transfer	120	General	20000.00	Capsular contracture, implant rupture, asymmetry, infection	14	1
40	Liposuction	شفط الدهون	Body	Removal of excess fat deposits from specific body areas	120	General	12000.00	Contour irregularities, fluid accumulation, numbness	14	1
41	Abdominoplasty	شد البطن	Body	Removal of excess skin and fat from the abdomen	180	General	18000.00	Seroma, wound healing issues, scarring, numbness	21	1
42	Laser Hair Removal	إزالة الشعر بالليزر	Laser	Permanent hair reduction using laser technology	30	None	500.00	Burns, pigmentation changes, paradoxical growth	0	1
43	Laser Skin Resurfacing	تقشير البشرة بالليزر	Laser	Laser treatment to improve skin texture and reduce wrinkles	60	Local	3000.00	Redness, swelling, infection, pigmentation changes	7	1
44	Hair Transplant (FUE)	زراعة الشعر	Hair	Follicular unit extraction for hair restoration	360	Local	15000.00	Infection, scarring, graft failure, temporary shock loss	14	1
45	PRP Therapy	علاج البلازما	Non-Surgical	Platelet-rich plasma injections for skin rejuvenation	30	None	1500.00	Bruising, swelling, infection, minimal pain	1	1
46	Rhinoplasty	تجميل الأنف	Face	Reshaping of the nose for aesthetic or functional purposes	120	General	15000.00	Bleeding, infection, asymmetry, breathing difficulties, numbness	14	1
47	Blepharoplasty	شد الجفون	Face	Upper and/or lower eyelid surgery to remove excess skin and fat	90	Local	8000.00	Dry eyes, blurred vision, asymmetry, scarring	10	1
48	Facelift (Rhytidectomy)	شد الوجه	Face	Lifting and tightening facial tissues to reduce sagging	180	General	25000.00	Hematoma, nerve injury, scarring, hair loss near incisions	21	1
49	Otoplasty	تجميل الأذن	Face	Reshaping or repositioning of the ears	90	Local	7000.00	Asymmetry, infection, overcorrection, scarring	7	1
50	Lip Augmentation	تكبير الشفاه	Face	Enhancement of lip volume using fillers or implants	30	Local	3000.00	Swelling, bruising, asymmetry, allergic reaction	3	1
51	Botox Injection	حقن البوتوكس	Non-Surgical	Wrinkle relaxation using botulinum toxin	15	None	1500.00	Bruising, headache, drooping, temporary weakness	0	1
52	Dermal Fillers	حقن الفيلر	Non-Surgical	Volume restoration using hyaluronic acid fillers	30	Local	2500.00	Swelling, bruising, lumps, vascular occlusion	2	1
53	Chemical Peel	التقشير الكيميائي	Non-Surgical	Chemical solution applied to improve skin texture	45	None	1000.00	Redness, peeling, pigmentation changes, scarring	5	1
54	Breast Augmentation	تكبير الثدي	Body	Enlargement using implants or fat transfer	120	General	20000.00	Capsular contracture, implant rupture, asymmetry, infection	14	1
55	Liposuction	شفط الدهون	Body	Removal of excess fat deposits from specific body areas	120	General	12000.00	Contour irregularities, fluid accumulation, numbness	14	1
56	Abdominoplasty	شد البطن	Body	Removal of excess skin and fat from the abdomen	180	General	18000.00	Seroma, wound healing issues, scarring, numbness	21	1
57	Laser Hair Removal	إزالة الشعر بالليزر	Laser	Permanent hair reduction using laser technology	30	None	500.00	Burns, pigmentation changes, paradoxical growth	0	1
58	Laser Skin Resurfacing	تقشير البشرة بالليزر	Laser	Laser treatment to improve skin texture and reduce wrinkles	60	Local	3000.00	Redness, swelling, infection, pigmentation changes	7	1
59	Hair Transplant (FUE)	زراعة الشعر	Hair	Follicular unit extraction for hair restoration	360	Local	15000.00	Infection, scarring, graft failure, temporary shock loss	14	1
60	PRP Therapy	علاج البلازما	Non-Surgical	Platelet-rich plasma injections for skin rejuvenation	30	None	1500.00	Bruising, swelling, infection, minimal pain	1	1
61	Rhinoplasty	تجميل الأنف	Face	Reshaping of the nose for aesthetic or functional purposes	120	General	15000.00	Bleeding, infection, asymmetry, breathing difficulties, numbness	14	1
62	Blepharoplasty	شد الجفون	Face	Upper and/or lower eyelid surgery to remove excess skin and fat	90	Local	8000.00	Dry eyes, blurred vision, asymmetry, scarring	10	1
63	Facelift (Rhytidectomy)	شد الوجه	Face	Lifting and tightening facial tissues to reduce sagging	180	General	25000.00	Hematoma, nerve injury, scarring, hair loss near incisions	21	1
64	Otoplasty	تجميل الأذن	Face	Reshaping or repositioning of the ears	90	Local	7000.00	Asymmetry, infection, overcorrection, scarring	7	1
65	Lip Augmentation	تكبير الشفاه	Face	Enhancement of lip volume using fillers or implants	30	Local	3000.00	Swelling, bruising, asymmetry, allergic reaction	3	1
66	Botox Injection	حقن البوتوكس	Non-Surgical	Wrinkle relaxation using botulinum toxin	15	None	1500.00	Bruising, headache, drooping, temporary weakness	0	1
67	Dermal Fillers	حقن الفيلر	Non-Surgical	Volume restoration using hyaluronic acid fillers	30	Local	2500.00	Swelling, bruising, lumps, vascular occlusion	2	1
68	Chemical Peel	التقشير الكيميائي	Non-Surgical	Chemical solution applied to improve skin texture	45	None	1000.00	Redness, peeling, pigmentation changes, scarring	5	1
69	Breast Augmentation	تكبير الثدي	Body	Enlargement using implants or fat transfer	120	General	20000.00	Capsular contracture, implant rupture, asymmetry, infection	14	1
70	Liposuction	شفط الدهون	Body	Removal of excess fat deposits from specific body areas	120	General	12000.00	Contour irregularities, fluid accumulation, numbness	14	1
71	Abdominoplasty	شد البطن	Body	Removal of excess skin and fat from the abdomen	180	General	18000.00	Seroma, wound healing issues, scarring, numbness	21	1
72	Laser Hair Removal	إزالة الشعر بالليزر	Laser	Permanent hair reduction using laser technology	30	None	500.00	Burns, pigmentation changes, paradoxical growth	0	1
73	Laser Skin Resurfacing	تقشير البشرة بالليزر	Laser	Laser treatment to improve skin texture and reduce wrinkles	60	Local	3000.00	Redness, swelling, infection, pigmentation changes	7	1
74	Hair Transplant (FUE)	زراعة الشعر	Hair	Follicular unit extraction for hair restoration	360	Local	15000.00	Infection, scarring, graft failure, temporary shock loss	14	1
75	PRP Therapy	علاج البلازما	Non-Surgical	Platelet-rich plasma injections for skin rejuvenation	30	None	1500.00	Bruising, swelling, infection, minimal pain	1	1
76	Rhinoplasty	تجميل الأنف	Face	Reshaping of the nose for aesthetic or functional purposes	120	General	15000.00	Bleeding, infection, asymmetry, breathing difficulties, numbness	14	1
77	Blepharoplasty	شد الجفون	Face	Upper and/or lower eyelid surgery to remove excess skin and fat	90	Local	8000.00	Dry eyes, blurred vision, asymmetry, scarring	10	1
78	Facelift (Rhytidectomy)	شد الوجه	Face	Lifting and tightening facial tissues to reduce sagging	180	General	25000.00	Hematoma, nerve injury, scarring, hair loss near incisions	21	1
79	Otoplasty	تجميل الأذن	Face	Reshaping or repositioning of the ears	90	Local	7000.00	Asymmetry, infection, overcorrection, scarring	7	1
80	Lip Augmentation	تكبير الشفاه	Face	Enhancement of lip volume using fillers or implants	30	Local	3000.00	Swelling, bruising, asymmetry, allergic reaction	3	1
81	Botox Injection	حقن البوتوكس	Non-Surgical	Wrinkle relaxation using botulinum toxin	15	None	1500.00	Bruising, headache, drooping, temporary weakness	0	1
82	Dermal Fillers	حقن الفيلر	Non-Surgical	Volume restoration using hyaluronic acid fillers	30	Local	2500.00	Swelling, bruising, lumps, vascular occlusion	2	1
83	Chemical Peel	التقشير الكيميائي	Non-Surgical	Chemical solution applied to improve skin texture	45	None	1000.00	Redness, peeling, pigmentation changes, scarring	5	1
84	Breast Augmentation	تكبير الثدي	Body	Enlargement using implants or fat transfer	120	General	20000.00	Capsular contracture, implant rupture, asymmetry, infection	14	1
85	Liposuction	شفط الدهون	Body	Removal of excess fat deposits from specific body areas	120	General	12000.00	Contour irregularities, fluid accumulation, numbness	14	1
86	Abdominoplasty	شد البطن	Body	Removal of excess skin and fat from the abdomen	180	General	18000.00	Seroma, wound healing issues, scarring, numbness	21	1
87	Laser Hair Removal	إزالة الشعر بالليزر	Laser	Permanent hair reduction using laser technology	30	None	500.00	Burns, pigmentation changes, paradoxical growth	0	1
88	Laser Skin Resurfacing	تقشير البشرة بالليزر	Laser	Laser treatment to improve skin texture and reduce wrinkles	60	Local	3000.00	Redness, swelling, infection, pigmentation changes	7	1
89	Hair Transplant (FUE)	زراعة الشعر	Hair	Follicular unit extraction for hair restoration	360	Local	15000.00	Infection, scarring, graft failure, temporary shock loss	14	1
90	PRP Therapy	علاج البلازما	Non-Surgical	Platelet-rich plasma injections for skin rejuvenation	30	None	1500.00	Bruising, swelling, infection, minimal pain	1	1
91	Rhinoplasty	تجميل الأنف	Face	Reshaping of the nose for aesthetic or functional purposes	120	General	15000.00	Bleeding, infection, asymmetry, breathing difficulties, numbness	14	1
92	Blepharoplasty	شد الجفون	Face	Upper and/or lower eyelid surgery to remove excess skin and fat	90	Local	8000.00	Dry eyes, blurred vision, asymmetry, scarring	10	1
93	Facelift (Rhytidectomy)	شد الوجه	Face	Lifting and tightening facial tissues to reduce sagging	180	General	25000.00	Hematoma, nerve injury, scarring, hair loss near incisions	21	1
94	Otoplasty	تجميل الأذن	Face	Reshaping or repositioning of the ears	90	Local	7000.00	Asymmetry, infection, overcorrection, scarring	7	1
95	Lip Augmentation	تكبير الشفاه	Face	Enhancement of lip volume using fillers or implants	30	Local	3000.00	Swelling, bruising, asymmetry, allergic reaction	3	1
96	Botox Injection	حقن البوتوكس	Non-Surgical	Wrinkle relaxation using botulinum toxin	15	None	1500.00	Bruising, headache, drooping, temporary weakness	0	1
97	Dermal Fillers	حقن الفيلر	Non-Surgical	Volume restoration using hyaluronic acid fillers	30	Local	2500.00	Swelling, bruising, lumps, vascular occlusion	2	1
98	Chemical Peel	التقشير الكيميائي	Non-Surgical	Chemical solution applied to improve skin texture	45	None	1000.00	Redness, peeling, pigmentation changes, scarring	5	1
99	Breast Augmentation	تكبير الثدي	Body	Enlargement using implants or fat transfer	120	General	20000.00	Capsular contracture, implant rupture, asymmetry, infection	14	1
100	Liposuction	شفط الدهون	Body	Removal of excess fat deposits from specific body areas	120	General	12000.00	Contour irregularities, fluid accumulation, numbness	14	1
101	Abdominoplasty	شد البطن	Body	Removal of excess skin and fat from the abdomen	180	General	18000.00	Seroma, wound healing issues, scarring, numbness	21	1
102	Laser Hair Removal	إزالة الشعر بالليزر	Laser	Permanent hair reduction using laser technology	30	None	500.00	Burns, pigmentation changes, paradoxical growth	0	1
103	Laser Skin Resurfacing	تقشير البشرة بالليزر	Laser	Laser treatment to improve skin texture and reduce wrinkles	60	Local	3000.00	Redness, swelling, infection, pigmentation changes	7	1
104	Hair Transplant (FUE)	زراعة الشعر	Hair	Follicular unit extraction for hair restoration	360	Local	15000.00	Infection, scarring, graft failure, temporary shock loss	14	1
105	PRP Therapy	علاج البلازما	Non-Surgical	Platelet-rich plasma injections for skin rejuvenation	30	None	1500.00	Bruising, swelling, infection, minimal pain	1	1
106	Rhinoplasty	تجميل الأنف	Face	Reshaping of the nose for aesthetic or functional purposes	120	General	15000.00	Bleeding, infection, asymmetry, breathing difficulties, numbness	14	1
107	Blepharoplasty	شد الجفون	Face	Upper and/or lower eyelid surgery to remove excess skin and fat	90	Local	8000.00	Dry eyes, blurred vision, asymmetry, scarring	10	1
108	Facelift (Rhytidectomy)	شد الوجه	Face	Lifting and tightening facial tissues to reduce sagging	180	General	25000.00	Hematoma, nerve injury, scarring, hair loss near incisions	21	1
109	Otoplasty	تجميل الأذن	Face	Reshaping or repositioning of the ears	90	Local	7000.00	Asymmetry, infection, overcorrection, scarring	7	1
110	Lip Augmentation	تكبير الشفاه	Face	Enhancement of lip volume using fillers or implants	30	Local	3000.00	Swelling, bruising, asymmetry, allergic reaction	3	1
111	Botox Injection	حقن البوتوكس	Non-Surgical	Wrinkle relaxation using botulinum toxin	15	None	1500.00	Bruising, headache, drooping, temporary weakness	0	1
112	Dermal Fillers	حقن الفيلر	Non-Surgical	Volume restoration using hyaluronic acid fillers	30	Local	2500.00	Swelling, bruising, lumps, vascular occlusion	2	1
113	Chemical Peel	التقشير الكيميائي	Non-Surgical	Chemical solution applied to improve skin texture	45	None	1000.00	Redness, peeling, pigmentation changes, scarring	5	1
114	Breast Augmentation	تكبير الثدي	Body	Enlargement using implants or fat transfer	120	General	20000.00	Capsular contracture, implant rupture, asymmetry, infection	14	1
115	Liposuction	شفط الدهون	Body	Removal of excess fat deposits from specific body areas	120	General	12000.00	Contour irregularities, fluid accumulation, numbness	14	1
116	Abdominoplasty	شد البطن	Body	Removal of excess skin and fat from the abdomen	180	General	18000.00	Seroma, wound healing issues, scarring, numbness	21	1
117	Laser Hair Removal	إزالة الشعر بالليزر	Laser	Permanent hair reduction using laser technology	30	None	500.00	Burns, pigmentation changes, paradoxical growth	0	1
118	Laser Skin Resurfacing	تقشير البشرة بالليزر	Laser	Laser treatment to improve skin texture and reduce wrinkles	60	Local	3000.00	Redness, swelling, infection, pigmentation changes	7	1
119	Hair Transplant (FUE)	زراعة الشعر	Hair	Follicular unit extraction for hair restoration	360	Local	15000.00	Infection, scarring, graft failure, temporary shock loss	14	1
120	PRP Therapy	علاج البلازما	Non-Surgical	Platelet-rich plasma injections for skin rejuvenation	30	None	1500.00	Bruising, swelling, infection, minimal pain	1	1
121	Rhinoplasty	تجميل الأنف	Face	Reshaping of the nose for aesthetic or functional purposes	120	General	15000.00	Bleeding, infection, asymmetry, breathing difficulties, numbness	14	1
122	Blepharoplasty	شد الجفون	Face	Upper and/or lower eyelid surgery to remove excess skin and fat	90	Local	8000.00	Dry eyes, blurred vision, asymmetry, scarring	10	1
123	Facelift (Rhytidectomy)	شد الوجه	Face	Lifting and tightening facial tissues to reduce sagging	180	General	25000.00	Hematoma, nerve injury, scarring, hair loss near incisions	21	1
124	Otoplasty	تجميل الأذن	Face	Reshaping or repositioning of the ears	90	Local	7000.00	Asymmetry, infection, overcorrection, scarring	7	1
125	Lip Augmentation	تكبير الشفاه	Face	Enhancement of lip volume using fillers or implants	30	Local	3000.00	Swelling, bruising, asymmetry, allergic reaction	3	1
126	Botox Injection	حقن البوتوكس	Non-Surgical	Wrinkle relaxation using botulinum toxin	15	None	1500.00	Bruising, headache, drooping, temporary weakness	0	1
127	Dermal Fillers	حقن الفيلر	Non-Surgical	Volume restoration using hyaluronic acid fillers	30	Local	2500.00	Swelling, bruising, lumps, vascular occlusion	2	1
128	Chemical Peel	التقشير الكيميائي	Non-Surgical	Chemical solution applied to improve skin texture	45	None	1000.00	Redness, peeling, pigmentation changes, scarring	5	1
129	Breast Augmentation	تكبير الثدي	Body	Enlargement using implants or fat transfer	120	General	20000.00	Capsular contracture, implant rupture, asymmetry, infection	14	1
130	Liposuction	شفط الدهون	Body	Removal of excess fat deposits from specific body areas	120	General	12000.00	Contour irregularities, fluid accumulation, numbness	14	1
131	Abdominoplasty	شد البطن	Body	Removal of excess skin and fat from the abdomen	180	General	18000.00	Seroma, wound healing issues, scarring, numbness	21	1
132	Laser Hair Removal	إزالة الشعر بالليزر	Laser	Permanent hair reduction using laser technology	30	None	500.00	Burns, pigmentation changes, paradoxical growth	0	1
133	Laser Skin Resurfacing	تقشير البشرة بالليزر	Laser	Laser treatment to improve skin texture and reduce wrinkles	60	Local	3000.00	Redness, swelling, infection, pigmentation changes	7	1
134	Hair Transplant (FUE)	زراعة الشعر	Hair	Follicular unit extraction for hair restoration	360	Local	15000.00	Infection, scarring, graft failure, temporary shock loss	14	1
135	PRP Therapy	علاج البلازما	Non-Surgical	Platelet-rich plasma injections for skin rejuvenation	30	None	1500.00	Bruising, swelling, infection, minimal pain	1	1
136	Rhinoplasty	تجميل الأنف	Face	Reshaping of the nose for aesthetic or functional purposes	120	General	15000.00	Bleeding, infection, asymmetry, breathing difficulties, numbness	14	1
137	Blepharoplasty	شد الجفون	Face	Upper and/or lower eyelid surgery to remove excess skin and fat	90	Local	8000.00	Dry eyes, blurred vision, asymmetry, scarring	10	1
138	Facelift (Rhytidectomy)	شد الوجه	Face	Lifting and tightening facial tissues to reduce sagging	180	General	25000.00	Hematoma, nerve injury, scarring, hair loss near incisions	21	1
139	Otoplasty	تجميل الأذن	Face	Reshaping or repositioning of the ears	90	Local	7000.00	Asymmetry, infection, overcorrection, scarring	7	1
140	Lip Augmentation	تكبير الشفاه	Face	Enhancement of lip volume using fillers or implants	30	Local	3000.00	Swelling, bruising, asymmetry, allergic reaction	3	1
141	Botox Injection	حقن البوتوكس	Non-Surgical	Wrinkle relaxation using botulinum toxin	15	None	1500.00	Bruising, headache, drooping, temporary weakness	0	1
142	Dermal Fillers	حقن الفيلر	Non-Surgical	Volume restoration using hyaluronic acid fillers	30	Local	2500.00	Swelling, bruising, lumps, vascular occlusion	2	1
143	Chemical Peel	التقشير الكيميائي	Non-Surgical	Chemical solution applied to improve skin texture	45	None	1000.00	Redness, peeling, pigmentation changes, scarring	5	1
144	Breast Augmentation	تكبير الثدي	Body	Enlargement using implants or fat transfer	120	General	20000.00	Capsular contracture, implant rupture, asymmetry, infection	14	1
145	Liposuction	شفط الدهون	Body	Removal of excess fat deposits from specific body areas	120	General	12000.00	Contour irregularities, fluid accumulation, numbness	14	1
146	Abdominoplasty	شد البطن	Body	Removal of excess skin and fat from the abdomen	180	General	18000.00	Seroma, wound healing issues, scarring, numbness	21	1
147	Laser Hair Removal	إزالة الشعر بالليزر	Laser	Permanent hair reduction using laser technology	30	None	500.00	Burns, pigmentation changes, paradoxical growth	0	1
148	Laser Skin Resurfacing	تقشير البشرة بالليزر	Laser	Laser treatment to improve skin texture and reduce wrinkles	60	Local	3000.00	Redness, swelling, infection, pigmentation changes	7	1
149	Hair Transplant (FUE)	زراعة الشعر	Hair	Follicular unit extraction for hair restoration	360	Local	15000.00	Infection, scarring, graft failure, temporary shock loss	14	1
150	PRP Therapy	علاج البلازما	Non-Surgical	Platelet-rich plasma injections for skin rejuvenation	30	None	1500.00	Bruising, swelling, infection, minimal pain	1	1
151	Rhinoplasty	تجميل الأنف	Face	Reshaping of the nose for aesthetic or functional purposes	120	General	15000.00	Bleeding, infection, asymmetry, breathing difficulties, numbness	14	1
152	Blepharoplasty	شد الجفون	Face	Upper and/or lower eyelid surgery to remove excess skin and fat	90	Local	8000.00	Dry eyes, blurred vision, asymmetry, scarring	10	1
153	Facelift (Rhytidectomy)	شد الوجه	Face	Lifting and tightening facial tissues to reduce sagging	180	General	25000.00	Hematoma, nerve injury, scarring, hair loss near incisions	21	1
154	Otoplasty	تجميل الأذن	Face	Reshaping or repositioning of the ears	90	Local	7000.00	Asymmetry, infection, overcorrection, scarring	7	1
155	Lip Augmentation	تكبير الشفاه	Face	Enhancement of lip volume using fillers or implants	30	Local	3000.00	Swelling, bruising, asymmetry, allergic reaction	3	1
156	Botox Injection	حقن البوتوكس	Non-Surgical	Wrinkle relaxation using botulinum toxin	15	None	1500.00	Bruising, headache, drooping, temporary weakness	0	1
157	Dermal Fillers	حقن الفيلر	Non-Surgical	Volume restoration using hyaluronic acid fillers	30	Local	2500.00	Swelling, bruising, lumps, vascular occlusion	2	1
158	Chemical Peel	التقشير الكيميائي	Non-Surgical	Chemical solution applied to improve skin texture	45	None	1000.00	Redness, peeling, pigmentation changes, scarring	5	1
159	Breast Augmentation	تكبير الثدي	Body	Enlargement using implants or fat transfer	120	General	20000.00	Capsular contracture, implant rupture, asymmetry, infection	14	1
160	Liposuction	شفط الدهون	Body	Removal of excess fat deposits from specific body areas	120	General	12000.00	Contour irregularities, fluid accumulation, numbness	14	1
161	Abdominoplasty	شد البطن	Body	Removal of excess skin and fat from the abdomen	180	General	18000.00	Seroma, wound healing issues, scarring, numbness	21	1
162	Laser Hair Removal	إزالة الشعر بالليزر	Laser	Permanent hair reduction using laser technology	30	None	500.00	Burns, pigmentation changes, paradoxical growth	0	1
163	Laser Skin Resurfacing	تقشير البشرة بالليزر	Laser	Laser treatment to improve skin texture and reduce wrinkles	60	Local	3000.00	Redness, swelling, infection, pigmentation changes	7	1
164	Hair Transplant (FUE)	زراعة الشعر	Hair	Follicular unit extraction for hair restoration	360	Local	15000.00	Infection, scarring, graft failure, temporary shock loss	14	1
165	PRP Therapy	علاج البلازما	Non-Surgical	Platelet-rich plasma injections for skin rejuvenation	30	None	1500.00	Bruising, swelling, infection, minimal pain	1	1
166	Rhinoplasty	تجميل الأنف	Face	Reshaping of the nose for aesthetic or functional purposes	120	General	15000.00	Bleeding, infection, asymmetry, breathing difficulties, numbness	14	1
167	Blepharoplasty	شد الجفون	Face	Upper and/or lower eyelid surgery to remove excess skin and fat	90	Local	8000.00	Dry eyes, blurred vision, asymmetry, scarring	10	1
168	Facelift (Rhytidectomy)	شد الوجه	Face	Lifting and tightening facial tissues to reduce sagging	180	General	25000.00	Hematoma, nerve injury, scarring, hair loss near incisions	21	1
169	Otoplasty	تجميل الأذن	Face	Reshaping or repositioning of the ears	90	Local	7000.00	Asymmetry, infection, overcorrection, scarring	7	1
170	Lip Augmentation	تكبير الشفاه	Face	Enhancement of lip volume using fillers or implants	30	Local	3000.00	Swelling, bruising, asymmetry, allergic reaction	3	1
171	Botox Injection	حقن البوتوكس	Non-Surgical	Wrinkle relaxation using botulinum toxin	15	None	1500.00	Bruising, headache, drooping, temporary weakness	0	1
172	Dermal Fillers	حقن الفيلر	Non-Surgical	Volume restoration using hyaluronic acid fillers	30	Local	2500.00	Swelling, bruising, lumps, vascular occlusion	2	1
173	Chemical Peel	التقشير الكيميائي	Non-Surgical	Chemical solution applied to improve skin texture	45	None	1000.00	Redness, peeling, pigmentation changes, scarring	5	1
174	Breast Augmentation	تكبير الثدي	Body	Enlargement using implants or fat transfer	120	General	20000.00	Capsular contracture, implant rupture, asymmetry, infection	14	1
175	Liposuction	شفط الدهون	Body	Removal of excess fat deposits from specific body areas	120	General	12000.00	Contour irregularities, fluid accumulation, numbness	14	1
176	Abdominoplasty	شد البطن	Body	Removal of excess skin and fat from the abdomen	180	General	18000.00	Seroma, wound healing issues, scarring, numbness	21	1
177	Laser Hair Removal	إزالة الشعر بالليزر	Laser	Permanent hair reduction using laser technology	30	None	500.00	Burns, pigmentation changes, paradoxical growth	0	1
178	Laser Skin Resurfacing	تقشير البشرة بالليزر	Laser	Laser treatment to improve skin texture and reduce wrinkles	60	Local	3000.00	Redness, swelling, infection, pigmentation changes	7	1
179	Hair Transplant (FUE)	زراعة الشعر	Hair	Follicular unit extraction for hair restoration	360	Local	15000.00	Infection, scarring, graft failure, temporary shock loss	14	1
180	PRP Therapy	علاج البلازما	Non-Surgical	Platelet-rich plasma injections for skin rejuvenation	30	None	1500.00	Bruising, swelling, infection, minimal pain	1	1
181	Rhinoplasty	تجميل الأنف	Face	Reshaping of the nose for aesthetic or functional purposes	120	General	15000.00	Bleeding, infection, asymmetry, breathing difficulties, numbness	14	1
182	Blepharoplasty	شد الجفون	Face	Upper and/or lower eyelid surgery to remove excess skin and fat	90	Local	8000.00	Dry eyes, blurred vision, asymmetry, scarring	10	1
183	Facelift (Rhytidectomy)	شد الوجه	Face	Lifting and tightening facial tissues to reduce sagging	180	General	25000.00	Hematoma, nerve injury, scarring, hair loss near incisions	21	1
184	Otoplasty	تجميل الأذن	Face	Reshaping or repositioning of the ears	90	Local	7000.00	Asymmetry, infection, overcorrection, scarring	7	1
185	Lip Augmentation	تكبير الشفاه	Face	Enhancement of lip volume using fillers or implants	30	Local	3000.00	Swelling, bruising, asymmetry, allergic reaction	3	1
186	Botox Injection	حقن البوتوكس	Non-Surgical	Wrinkle relaxation using botulinum toxin	15	None	1500.00	Bruising, headache, drooping, temporary weakness	0	1
187	Dermal Fillers	حقن الفيلر	Non-Surgical	Volume restoration using hyaluronic acid fillers	30	Local	2500.00	Swelling, bruising, lumps, vascular occlusion	2	1
188	Chemical Peel	التقشير الكيميائي	Non-Surgical	Chemical solution applied to improve skin texture	45	None	1000.00	Redness, peeling, pigmentation changes, scarring	5	1
189	Breast Augmentation	تكبير الثدي	Body	Enlargement using implants or fat transfer	120	General	20000.00	Capsular contracture, implant rupture, asymmetry, infection	14	1
190	Liposuction	شفط الدهون	Body	Removal of excess fat deposits from specific body areas	120	General	12000.00	Contour irregularities, fluid accumulation, numbness	14	1
191	Abdominoplasty	شد البطن	Body	Removal of excess skin and fat from the abdomen	180	General	18000.00	Seroma, wound healing issues, scarring, numbness	21	1
192	Laser Hair Removal	إزالة الشعر بالليزر	Laser	Permanent hair reduction using laser technology	30	None	500.00	Burns, pigmentation changes, paradoxical growth	0	1
193	Laser Skin Resurfacing	تقشير البشرة بالليزر	Laser	Laser treatment to improve skin texture and reduce wrinkles	60	Local	3000.00	Redness, swelling, infection, pigmentation changes	7	1
194	Hair Transplant (FUE)	زراعة الشعر	Hair	Follicular unit extraction for hair restoration	360	Local	15000.00	Infection, scarring, graft failure, temporary shock loss	14	1
195	PRP Therapy	علاج البلازما	Non-Surgical	Platelet-rich plasma injections for skin rejuvenation	30	None	1500.00	Bruising, swelling, infection, minimal pain	1	1
196	Rhinoplasty	تجميل الأنف	Face	Reshaping of the nose for aesthetic or functional purposes	120	General	15000.00	Bleeding, infection, asymmetry, breathing difficulties, numbness	14	1
197	Blepharoplasty	شد الجفون	Face	Upper and/or lower eyelid surgery to remove excess skin and fat	90	Local	8000.00	Dry eyes, blurred vision, asymmetry, scarring	10	1
198	Facelift (Rhytidectomy)	شد الوجه	Face	Lifting and tightening facial tissues to reduce sagging	180	General	25000.00	Hematoma, nerve injury, scarring, hair loss near incisions	21	1
199	Otoplasty	تجميل الأذن	Face	Reshaping or repositioning of the ears	90	Local	7000.00	Asymmetry, infection, overcorrection, scarring	7	1
200	Lip Augmentation	تكبير الشفاه	Face	Enhancement of lip volume using fillers or implants	30	Local	3000.00	Swelling, bruising, asymmetry, allergic reaction	3	1
201	Botox Injection	حقن البوتوكس	Non-Surgical	Wrinkle relaxation using botulinum toxin	15	None	1500.00	Bruising, headache, drooping, temporary weakness	0	1
202	Dermal Fillers	حقن الفيلر	Non-Surgical	Volume restoration using hyaluronic acid fillers	30	Local	2500.00	Swelling, bruising, lumps, vascular occlusion	2	1
203	Chemical Peel	التقشير الكيميائي	Non-Surgical	Chemical solution applied to improve skin texture	45	None	1000.00	Redness, peeling, pigmentation changes, scarring	5	1
204	Breast Augmentation	تكبير الثدي	Body	Enlargement using implants or fat transfer	120	General	20000.00	Capsular contracture, implant rupture, asymmetry, infection	14	1
205	Liposuction	شفط الدهون	Body	Removal of excess fat deposits from specific body areas	120	General	12000.00	Contour irregularities, fluid accumulation, numbness	14	1
206	Abdominoplasty	شد البطن	Body	Removal of excess skin and fat from the abdomen	180	General	18000.00	Seroma, wound healing issues, scarring, numbness	21	1
207	Laser Hair Removal	إزالة الشعر بالليزر	Laser	Permanent hair reduction using laser technology	30	None	500.00	Burns, pigmentation changes, paradoxical growth	0	1
208	Laser Skin Resurfacing	تقشير البشرة بالليزر	Laser	Laser treatment to improve skin texture and reduce wrinkles	60	Local	3000.00	Redness, swelling, infection, pigmentation changes	7	1
209	Hair Transplant (FUE)	زراعة الشعر	Hair	Follicular unit extraction for hair restoration	360	Local	15000.00	Infection, scarring, graft failure, temporary shock loss	14	1
210	PRP Therapy	علاج البلازما	Non-Surgical	Platelet-rich plasma injections for skin rejuvenation	30	None	1500.00	Bruising, swelling, infection, minimal pain	1	1
211	Rhinoplasty	تجميل الأنف	Face	Reshaping of the nose for aesthetic or functional purposes	120	General	15000.00	Bleeding, infection, asymmetry, breathing difficulties, numbness	14	1
212	Blepharoplasty	شد الجفون	Face	Upper and/or lower eyelid surgery to remove excess skin and fat	90	Local	8000.00	Dry eyes, blurred vision, asymmetry, scarring	10	1
213	Facelift (Rhytidectomy)	شد الوجه	Face	Lifting and tightening facial tissues to reduce sagging	180	General	25000.00	Hematoma, nerve injury, scarring, hair loss near incisions	21	1
214	Otoplasty	تجميل الأذن	Face	Reshaping or repositioning of the ears	90	Local	7000.00	Asymmetry, infection, overcorrection, scarring	7	1
215	Lip Augmentation	تكبير الشفاه	Face	Enhancement of lip volume using fillers or implants	30	Local	3000.00	Swelling, bruising, asymmetry, allergic reaction	3	1
216	Botox Injection	حقن البوتوكس	Non-Surgical	Wrinkle relaxation using botulinum toxin	15	None	1500.00	Bruising, headache, drooping, temporary weakness	0	1
217	Dermal Fillers	حقن الفيلر	Non-Surgical	Volume restoration using hyaluronic acid fillers	30	Local	2500.00	Swelling, bruising, lumps, vascular occlusion	2	1
218	Chemical Peel	التقشير الكيميائي	Non-Surgical	Chemical solution applied to improve skin texture	45	None	1000.00	Redness, peeling, pigmentation changes, scarring	5	1
219	Breast Augmentation	تكبير الثدي	Body	Enlargement using implants or fat transfer	120	General	20000.00	Capsular contracture, implant rupture, asymmetry, infection	14	1
220	Liposuction	شفط الدهون	Body	Removal of excess fat deposits from specific body areas	120	General	12000.00	Contour irregularities, fluid accumulation, numbness	14	1
221	Abdominoplasty	شد البطن	Body	Removal of excess skin and fat from the abdomen	180	General	18000.00	Seroma, wound healing issues, scarring, numbness	21	1
222	Laser Hair Removal	إزالة الشعر بالليزر	Laser	Permanent hair reduction using laser technology	30	None	500.00	Burns, pigmentation changes, paradoxical growth	0	1
223	Laser Skin Resurfacing	تقشير البشرة بالليزر	Laser	Laser treatment to improve skin texture and reduce wrinkles	60	Local	3000.00	Redness, swelling, infection, pigmentation changes	7	1
224	Hair Transplant (FUE)	زراعة الشعر	Hair	Follicular unit extraction for hair restoration	360	Local	15000.00	Infection, scarring, graft failure, temporary shock loss	14	1
225	PRP Therapy	علاج البلازما	Non-Surgical	Platelet-rich plasma injections for skin rejuvenation	30	None	1500.00	Bruising, swelling, infection, minimal pain	1	1
226	Rhinoplasty	تجميل الأنف	Face	Reshaping of the nose for aesthetic or functional purposes	120	General	15000.00	Bleeding, infection, asymmetry, breathing difficulties, numbness	14	1
227	Blepharoplasty	شد الجفون	Face	Upper and/or lower eyelid surgery to remove excess skin and fat	90	Local	8000.00	Dry eyes, blurred vision, asymmetry, scarring	10	1
228	Facelift (Rhytidectomy)	شد الوجه	Face	Lifting and tightening facial tissues to reduce sagging	180	General	25000.00	Hematoma, nerve injury, scarring, hair loss near incisions	21	1
229	Otoplasty	تجميل الأذن	Face	Reshaping or repositioning of the ears	90	Local	7000.00	Asymmetry, infection, overcorrection, scarring	7	1
230	Lip Augmentation	تكبير الشفاه	Face	Enhancement of lip volume using fillers or implants	30	Local	3000.00	Swelling, bruising, asymmetry, allergic reaction	3	1
231	Botox Injection	حقن البوتوكس	Non-Surgical	Wrinkle relaxation using botulinum toxin	15	None	1500.00	Bruising, headache, drooping, temporary weakness	0	1
232	Dermal Fillers	حقن الفيلر	Non-Surgical	Volume restoration using hyaluronic acid fillers	30	Local	2500.00	Swelling, bruising, lumps, vascular occlusion	2	1
233	Chemical Peel	التقشير الكيميائي	Non-Surgical	Chemical solution applied to improve skin texture	45	None	1000.00	Redness, peeling, pigmentation changes, scarring	5	1
234	Breast Augmentation	تكبير الثدي	Body	Enlargement using implants or fat transfer	120	General	20000.00	Capsular contracture, implant rupture, asymmetry, infection	14	1
235	Liposuction	شفط الدهون	Body	Removal of excess fat deposits from specific body areas	120	General	12000.00	Contour irregularities, fluid accumulation, numbness	14	1
236	Abdominoplasty	شد البطن	Body	Removal of excess skin and fat from the abdomen	180	General	18000.00	Seroma, wound healing issues, scarring, numbness	21	1
237	Laser Hair Removal	إزالة الشعر بالليزر	Laser	Permanent hair reduction using laser technology	30	None	500.00	Burns, pigmentation changes, paradoxical growth	0	1
238	Laser Skin Resurfacing	تقشير البشرة بالليزر	Laser	Laser treatment to improve skin texture and reduce wrinkles	60	Local	3000.00	Redness, swelling, infection, pigmentation changes	7	1
239	Hair Transplant (FUE)	زراعة الشعر	Hair	Follicular unit extraction for hair restoration	360	Local	15000.00	Infection, scarring, graft failure, temporary shock loss	14	1
240	PRP Therapy	علاج البلازما	Non-Surgical	Platelet-rich plasma injections for skin rejuvenation	30	None	1500.00	Bruising, swelling, infection, minimal pain	1	1
241	Rhinoplasty	تجميل الأنف	Face	Reshaping of the nose for aesthetic or functional purposes	120	General	15000.00	Bleeding, infection, asymmetry, breathing difficulties, numbness	14	1
242	Blepharoplasty	شد الجفون	Face	Upper and/or lower eyelid surgery to remove excess skin and fat	90	Local	8000.00	Dry eyes, blurred vision, asymmetry, scarring	10	1
243	Facelift (Rhytidectomy)	شد الوجه	Face	Lifting and tightening facial tissues to reduce sagging	180	General	25000.00	Hematoma, nerve injury, scarring, hair loss near incisions	21	1
244	Otoplasty	تجميل الأذن	Face	Reshaping or repositioning of the ears	90	Local	7000.00	Asymmetry, infection, overcorrection, scarring	7	1
245	Lip Augmentation	تكبير الشفاه	Face	Enhancement of lip volume using fillers or implants	30	Local	3000.00	Swelling, bruising, asymmetry, allergic reaction	3	1
246	Botox Injection	حقن البوتوكس	Non-Surgical	Wrinkle relaxation using botulinum toxin	15	None	1500.00	Bruising, headache, drooping, temporary weakness	0	1
247	Dermal Fillers	حقن الفيلر	Non-Surgical	Volume restoration using hyaluronic acid fillers	30	Local	2500.00	Swelling, bruising, lumps, vascular occlusion	2	1
248	Chemical Peel	التقشير الكيميائي	Non-Surgical	Chemical solution applied to improve skin texture	45	None	1000.00	Redness, peeling, pigmentation changes, scarring	5	1
249	Breast Augmentation	تكبير الثدي	Body	Enlargement using implants or fat transfer	120	General	20000.00	Capsular contracture, implant rupture, asymmetry, infection	14	1
250	Liposuction	شفط الدهون	Body	Removal of excess fat deposits from specific body areas	120	General	12000.00	Contour irregularities, fluid accumulation, numbness	14	1
251	Abdominoplasty	شد البطن	Body	Removal of excess skin and fat from the abdomen	180	General	18000.00	Seroma, wound healing issues, scarring, numbness	21	1
252	Laser Hair Removal	إزالة الشعر بالليزر	Laser	Permanent hair reduction using laser technology	30	None	500.00	Burns, pigmentation changes, paradoxical growth	0	1
253	Laser Skin Resurfacing	تقشير البشرة بالليزر	Laser	Laser treatment to improve skin texture and reduce wrinkles	60	Local	3000.00	Redness, swelling, infection, pigmentation changes	7	1
254	Hair Transplant (FUE)	زراعة الشعر	Hair	Follicular unit extraction for hair restoration	360	Local	15000.00	Infection, scarring, graft failure, temporary shock loss	14	1
255	PRP Therapy	علاج البلازما	Non-Surgical	Platelet-rich plasma injections for skin rejuvenation	30	None	1500.00	Bruising, swelling, infection, minimal pain	1	1
256	Rhinoplasty	تجميل الأنف	Face	Reshaping of the nose for aesthetic or functional purposes	120	General	15000.00	Bleeding, infection, asymmetry, breathing difficulties, numbness	14	1
257	Blepharoplasty	شد الجفون	Face	Upper and/or lower eyelid surgery to remove excess skin and fat	90	Local	8000.00	Dry eyes, blurred vision, asymmetry, scarring	10	1
258	Facelift (Rhytidectomy)	شد الوجه	Face	Lifting and tightening facial tissues to reduce sagging	180	General	25000.00	Hematoma, nerve injury, scarring, hair loss near incisions	21	1
259	Otoplasty	تجميل الأذن	Face	Reshaping or repositioning of the ears	90	Local	7000.00	Asymmetry, infection, overcorrection, scarring	7	1
260	Lip Augmentation	تكبير الشفاه	Face	Enhancement of lip volume using fillers or implants	30	Local	3000.00	Swelling, bruising, asymmetry, allergic reaction	3	1
261	Botox Injection	حقن البوتوكس	Non-Surgical	Wrinkle relaxation using botulinum toxin	15	None	1500.00	Bruising, headache, drooping, temporary weakness	0	1
262	Dermal Fillers	حقن الفيلر	Non-Surgical	Volume restoration using hyaluronic acid fillers	30	Local	2500.00	Swelling, bruising, lumps, vascular occlusion	2	1
263	Chemical Peel	التقشير الكيميائي	Non-Surgical	Chemical solution applied to improve skin texture	45	None	1000.00	Redness, peeling, pigmentation changes, scarring	5	1
264	Breast Augmentation	تكبير الثدي	Body	Enlargement using implants or fat transfer	120	General	20000.00	Capsular contracture, implant rupture, asymmetry, infection	14	1
265	Liposuction	شفط الدهون	Body	Removal of excess fat deposits from specific body areas	120	General	12000.00	Contour irregularities, fluid accumulation, numbness	14	1
266	Abdominoplasty	شد البطن	Body	Removal of excess skin and fat from the abdomen	180	General	18000.00	Seroma, wound healing issues, scarring, numbness	21	1
267	Laser Hair Removal	إزالة الشعر بالليزر	Laser	Permanent hair reduction using laser technology	30	None	500.00	Burns, pigmentation changes, paradoxical growth	0	1
268	Laser Skin Resurfacing	تقشير البشرة بالليزر	Laser	Laser treatment to improve skin texture and reduce wrinkles	60	Local	3000.00	Redness, swelling, infection, pigmentation changes	7	1
269	Hair Transplant (FUE)	زراعة الشعر	Hair	Follicular unit extraction for hair restoration	360	Local	15000.00	Infection, scarring, graft failure, temporary shock loss	14	1
270	PRP Therapy	علاج البلازما	Non-Surgical	Platelet-rich plasma injections for skin rejuvenation	30	None	1500.00	Bruising, swelling, infection, minimal pain	1	1
271	Rhinoplasty	تجميل الأنف	Face	Reshaping of the nose for aesthetic or functional purposes	120	General	15000.00	Bleeding, infection, asymmetry, breathing difficulties, numbness	14	1
272	Blepharoplasty	شد الجفون	Face	Upper and/or lower eyelid surgery to remove excess skin and fat	90	Local	8000.00	Dry eyes, blurred vision, asymmetry, scarring	10	1
273	Facelift (Rhytidectomy)	شد الوجه	Face	Lifting and tightening facial tissues to reduce sagging	180	General	25000.00	Hematoma, nerve injury, scarring, hair loss near incisions	21	1
274	Otoplasty	تجميل الأذن	Face	Reshaping or repositioning of the ears	90	Local	7000.00	Asymmetry, infection, overcorrection, scarring	7	1
275	Lip Augmentation	تكبير الشفاه	Face	Enhancement of lip volume using fillers or implants	30	Local	3000.00	Swelling, bruising, asymmetry, allergic reaction	3	1
276	Botox Injection	حقن البوتوكس	Non-Surgical	Wrinkle relaxation using botulinum toxin	15	None	1500.00	Bruising, headache, drooping, temporary weakness	0	1
277	Dermal Fillers	حقن الفيلر	Non-Surgical	Volume restoration using hyaluronic acid fillers	30	Local	2500.00	Swelling, bruising, lumps, vascular occlusion	2	1
278	Chemical Peel	التقشير الكيميائي	Non-Surgical	Chemical solution applied to improve skin texture	45	None	1000.00	Redness, peeling, pigmentation changes, scarring	5	1
279	Breast Augmentation	تكبير الثدي	Body	Enlargement using implants or fat transfer	120	General	20000.00	Capsular contracture, implant rupture, asymmetry, infection	14	1
280	Liposuction	شفط الدهون	Body	Removal of excess fat deposits from specific body areas	120	General	12000.00	Contour irregularities, fluid accumulation, numbness	14	1
281	Abdominoplasty	شد البطن	Body	Removal of excess skin and fat from the abdomen	180	General	18000.00	Seroma, wound healing issues, scarring, numbness	21	1
282	Laser Hair Removal	إزالة الشعر بالليزر	Laser	Permanent hair reduction using laser technology	30	None	500.00	Burns, pigmentation changes, paradoxical growth	0	1
283	Laser Skin Resurfacing	تقشير البشرة بالليزر	Laser	Laser treatment to improve skin texture and reduce wrinkles	60	Local	3000.00	Redness, swelling, infection, pigmentation changes	7	1
284	Hair Transplant (FUE)	زراعة الشعر	Hair	Follicular unit extraction for hair restoration	360	Local	15000.00	Infection, scarring, graft failure, temporary shock loss	14	1
285	PRP Therapy	علاج البلازما	Non-Surgical	Platelet-rich plasma injections for skin rejuvenation	30	None	1500.00	Bruising, swelling, infection, minimal pain	1	1
286	Rhinoplasty	تجميل الأنف	Face	Reshaping of the nose for aesthetic or functional purposes	120	General	15000.00	Bleeding, infection, asymmetry, breathing difficulties, numbness	14	1
287	Blepharoplasty	شد الجفون	Face	Upper and/or lower eyelid surgery to remove excess skin and fat	90	Local	8000.00	Dry eyes, blurred vision, asymmetry, scarring	10	1
288	Facelift (Rhytidectomy)	شد الوجه	Face	Lifting and tightening facial tissues to reduce sagging	180	General	25000.00	Hematoma, nerve injury, scarring, hair loss near incisions	21	1
289	Otoplasty	تجميل الأذن	Face	Reshaping or repositioning of the ears	90	Local	7000.00	Asymmetry, infection, overcorrection, scarring	7	1
290	Lip Augmentation	تكبير الشفاه	Face	Enhancement of lip volume using fillers or implants	30	Local	3000.00	Swelling, bruising, asymmetry, allergic reaction	3	1
291	Botox Injection	حقن البوتوكس	Non-Surgical	Wrinkle relaxation using botulinum toxin	15	None	1500.00	Bruising, headache, drooping, temporary weakness	0	1
292	Dermal Fillers	حقن الفيلر	Non-Surgical	Volume restoration using hyaluronic acid fillers	30	Local	2500.00	Swelling, bruising, lumps, vascular occlusion	2	1
293	Chemical Peel	التقشير الكيميائي	Non-Surgical	Chemical solution applied to improve skin texture	45	None	1000.00	Redness, peeling, pigmentation changes, scarring	5	1
294	Breast Augmentation	تكبير الثدي	Body	Enlargement using implants or fat transfer	120	General	20000.00	Capsular contracture, implant rupture, asymmetry, infection	14	1
295	Liposuction	شفط الدهون	Body	Removal of excess fat deposits from specific body areas	120	General	12000.00	Contour irregularities, fluid accumulation, numbness	14	1
296	Abdominoplasty	شد البطن	Body	Removal of excess skin and fat from the abdomen	180	General	18000.00	Seroma, wound healing issues, scarring, numbness	21	1
297	Laser Hair Removal	إزالة الشعر بالليزر	Laser	Permanent hair reduction using laser technology	30	None	500.00	Burns, pigmentation changes, paradoxical growth	0	1
298	Laser Skin Resurfacing	تقشير البشرة بالليزر	Laser	Laser treatment to improve skin texture and reduce wrinkles	60	Local	3000.00	Redness, swelling, infection, pigmentation changes	7	1
299	Hair Transplant (FUE)	زراعة الشعر	Hair	Follicular unit extraction for hair restoration	360	Local	15000.00	Infection, scarring, graft failure, temporary shock loss	14	1
300	PRP Therapy	علاج البلازما	Non-Surgical	Platelet-rich plasma injections for skin rejuvenation	30	None	1500.00	Bruising, swelling, infection, minimal pain	1	1
301	Rhinoplasty	تجميل الأنف	Face	Reshaping of the nose for aesthetic or functional purposes	120	General	15000.00	Bleeding, infection, asymmetry, breathing difficulties, numbness	14	1
302	Blepharoplasty	شد الجفون	Face	Upper and/or lower eyelid surgery to remove excess skin and fat	90	Local	8000.00	Dry eyes, blurred vision, asymmetry, scarring	10	1
303	Facelift (Rhytidectomy)	شد الوجه	Face	Lifting and tightening facial tissues to reduce sagging	180	General	25000.00	Hematoma, nerve injury, scarring, hair loss near incisions	21	1
304	Otoplasty	تجميل الأذن	Face	Reshaping or repositioning of the ears	90	Local	7000.00	Asymmetry, infection, overcorrection, scarring	7	1
305	Lip Augmentation	تكبير الشفاه	Face	Enhancement of lip volume using fillers or implants	30	Local	3000.00	Swelling, bruising, asymmetry, allergic reaction	3	1
306	Botox Injection	حقن البوتوكس	Non-Surgical	Wrinkle relaxation using botulinum toxin	15	None	1500.00	Bruising, headache, drooping, temporary weakness	0	1
307	Dermal Fillers	حقن الفيلر	Non-Surgical	Volume restoration using hyaluronic acid fillers	30	Local	2500.00	Swelling, bruising, lumps, vascular occlusion	2	1
308	Chemical Peel	التقشير الكيميائي	Non-Surgical	Chemical solution applied to improve skin texture	45	None	1000.00	Redness, peeling, pigmentation changes, scarring	5	1
309	Breast Augmentation	تكبير الثدي	Body	Enlargement using implants or fat transfer	120	General	20000.00	Capsular contracture, implant rupture, asymmetry, infection	14	1
310	Liposuction	شفط الدهون	Body	Removal of excess fat deposits from specific body areas	120	General	12000.00	Contour irregularities, fluid accumulation, numbness	14	1
311	Abdominoplasty	شد البطن	Body	Removal of excess skin and fat from the abdomen	180	General	18000.00	Seroma, wound healing issues, scarring, numbness	21	1
312	Laser Hair Removal	إزالة الشعر بالليزر	Laser	Permanent hair reduction using laser technology	30	None	500.00	Burns, pigmentation changes, paradoxical growth	0	1
313	Laser Skin Resurfacing	تقشير البشرة بالليزر	Laser	Laser treatment to improve skin texture and reduce wrinkles	60	Local	3000.00	Redness, swelling, infection, pigmentation changes	7	1
314	Hair Transplant (FUE)	زراعة الشعر	Hair	Follicular unit extraction for hair restoration	360	Local	15000.00	Infection, scarring, graft failure, temporary shock loss	14	1
315	PRP Therapy	علاج البلازما	Non-Surgical	Platelet-rich plasma injections for skin rejuvenation	30	None	1500.00	Bruising, swelling, infection, minimal pain	1	1
316	Rhinoplasty	تجميل الأنف	Face	Reshaping of the nose for aesthetic or functional purposes	120	General	15000.00	Bleeding, infection, asymmetry, breathing difficulties, numbness	14	1
317	Blepharoplasty	شد الجفون	Face	Upper and/or lower eyelid surgery to remove excess skin and fat	90	Local	8000.00	Dry eyes, blurred vision, asymmetry, scarring	10	1
318	Facelift (Rhytidectomy)	شد الوجه	Face	Lifting and tightening facial tissues to reduce sagging	180	General	25000.00	Hematoma, nerve injury, scarring, hair loss near incisions	21	1
319	Otoplasty	تجميل الأذن	Face	Reshaping or repositioning of the ears	90	Local	7000.00	Asymmetry, infection, overcorrection, scarring	7	1
320	Lip Augmentation	تكبير الشفاه	Face	Enhancement of lip volume using fillers or implants	30	Local	3000.00	Swelling, bruising, asymmetry, allergic reaction	3	1
321	Botox Injection	حقن البوتوكس	Non-Surgical	Wrinkle relaxation using botulinum toxin	15	None	1500.00	Bruising, headache, drooping, temporary weakness	0	1
322	Dermal Fillers	حقن الفيلر	Non-Surgical	Volume restoration using hyaluronic acid fillers	30	Local	2500.00	Swelling, bruising, lumps, vascular occlusion	2	1
323	Chemical Peel	التقشير الكيميائي	Non-Surgical	Chemical solution applied to improve skin texture	45	None	1000.00	Redness, peeling, pigmentation changes, scarring	5	1
324	Breast Augmentation	تكبير الثدي	Body	Enlargement using implants or fat transfer	120	General	20000.00	Capsular contracture, implant rupture, asymmetry, infection	14	1
325	Liposuction	شفط الدهون	Body	Removal of excess fat deposits from specific body areas	120	General	12000.00	Contour irregularities, fluid accumulation, numbness	14	1
326	Abdominoplasty	شد البطن	Body	Removal of excess skin and fat from the abdomen	180	General	18000.00	Seroma, wound healing issues, scarring, numbness	21	1
327	Laser Hair Removal	إزالة الشعر بالليزر	Laser	Permanent hair reduction using laser technology	30	None	500.00	Burns, pigmentation changes, paradoxical growth	0	1
328	Laser Skin Resurfacing	تقشير البشرة بالليزر	Laser	Laser treatment to improve skin texture and reduce wrinkles	60	Local	3000.00	Redness, swelling, infection, pigmentation changes	7	1
329	Hair Transplant (FUE)	زراعة الشعر	Hair	Follicular unit extraction for hair restoration	360	Local	15000.00	Infection, scarring, graft failure, temporary shock loss	14	1
330	PRP Therapy	علاج البلازما	Non-Surgical	Platelet-rich plasma injections for skin rejuvenation	30	None	1500.00	Bruising, swelling, infection, minimal pain	1	1
331	Rhinoplasty	تجميل الأنف	Face	Reshaping of the nose for aesthetic or functional purposes	120	General	15000.00	Bleeding, infection, asymmetry, breathing difficulties, numbness	14	1
332	Blepharoplasty	شد الجفون	Face	Upper and/or lower eyelid surgery to remove excess skin and fat	90	Local	8000.00	Dry eyes, blurred vision, asymmetry, scarring	10	1
333	Facelift (Rhytidectomy)	شد الوجه	Face	Lifting and tightening facial tissues to reduce sagging	180	General	25000.00	Hematoma, nerve injury, scarring, hair loss near incisions	21	1
334	Otoplasty	تجميل الأذن	Face	Reshaping or repositioning of the ears	90	Local	7000.00	Asymmetry, infection, overcorrection, scarring	7	1
335	Lip Augmentation	تكبير الشفاه	Face	Enhancement of lip volume using fillers or implants	30	Local	3000.00	Swelling, bruising, asymmetry, allergic reaction	3	1
336	Botox Injection	حقن البوتوكس	Non-Surgical	Wrinkle relaxation using botulinum toxin	15	None	1500.00	Bruising, headache, drooping, temporary weakness	0	1
337	Dermal Fillers	حقن الفيلر	Non-Surgical	Volume restoration using hyaluronic acid fillers	30	Local	2500.00	Swelling, bruising, lumps, vascular occlusion	2	1
338	Chemical Peel	التقشير الكيميائي	Non-Surgical	Chemical solution applied to improve skin texture	45	None	1000.00	Redness, peeling, pigmentation changes, scarring	5	1
339	Breast Augmentation	تكبير الثدي	Body	Enlargement using implants or fat transfer	120	General	20000.00	Capsular contracture, implant rupture, asymmetry, infection	14	1
340	Liposuction	شفط الدهون	Body	Removal of excess fat deposits from specific body areas	120	General	12000.00	Contour irregularities, fluid accumulation, numbness	14	1
341	Abdominoplasty	شد البطن	Body	Removal of excess skin and fat from the abdomen	180	General	18000.00	Seroma, wound healing issues, scarring, numbness	21	1
342	Laser Hair Removal	إزالة الشعر بالليزر	Laser	Permanent hair reduction using laser technology	30	None	500.00	Burns, pigmentation changes, paradoxical growth	0	1
343	Laser Skin Resurfacing	تقشير البشرة بالليزر	Laser	Laser treatment to improve skin texture and reduce wrinkles	60	Local	3000.00	Redness, swelling, infection, pigmentation changes	7	1
344	Hair Transplant (FUE)	زراعة الشعر	Hair	Follicular unit extraction for hair restoration	360	Local	15000.00	Infection, scarring, graft failure, temporary shock loss	14	1
345	PRP Therapy	علاج البلازما	Non-Surgical	Platelet-rich plasma injections for skin rejuvenation	30	None	1500.00	Bruising, swelling, infection, minimal pain	1	1
346	Rhinoplasty	تجميل الأنف	Face	Reshaping of the nose for aesthetic or functional purposes	120	General	15000.00	Bleeding, infection, asymmetry, breathing difficulties, numbness	14	1
347	Blepharoplasty	شد الجفون	Face	Upper and/or lower eyelid surgery to remove excess skin and fat	90	Local	8000.00	Dry eyes, blurred vision, asymmetry, scarring	10	1
348	Facelift (Rhytidectomy)	شد الوجه	Face	Lifting and tightening facial tissues to reduce sagging	180	General	25000.00	Hematoma, nerve injury, scarring, hair loss near incisions	21	1
349	Otoplasty	تجميل الأذن	Face	Reshaping or repositioning of the ears	90	Local	7000.00	Asymmetry, infection, overcorrection, scarring	7	1
350	Lip Augmentation	تكبير الشفاه	Face	Enhancement of lip volume using fillers or implants	30	Local	3000.00	Swelling, bruising, asymmetry, allergic reaction	3	1
351	Botox Injection	حقن البوتوكس	Non-Surgical	Wrinkle relaxation using botulinum toxin	15	None	1500.00	Bruising, headache, drooping, temporary weakness	0	1
352	Dermal Fillers	حقن الفيلر	Non-Surgical	Volume restoration using hyaluronic acid fillers	30	Local	2500.00	Swelling, bruising, lumps, vascular occlusion	2	1
353	Chemical Peel	التقشير الكيميائي	Non-Surgical	Chemical solution applied to improve skin texture	45	None	1000.00	Redness, peeling, pigmentation changes, scarring	5	1
354	Breast Augmentation	تكبير الثدي	Body	Enlargement using implants or fat transfer	120	General	20000.00	Capsular contracture, implant rupture, asymmetry, infection	14	1
355	Liposuction	شفط الدهون	Body	Removal of excess fat deposits from specific body areas	120	General	12000.00	Contour irregularities, fluid accumulation, numbness	14	1
356	Abdominoplasty	شد البطن	Body	Removal of excess skin and fat from the abdomen	180	General	18000.00	Seroma, wound healing issues, scarring, numbness	21	1
357	Laser Hair Removal	إزالة الشعر بالليزر	Laser	Permanent hair reduction using laser technology	30	None	500.00	Burns, pigmentation changes, paradoxical growth	0	1
358	Laser Skin Resurfacing	تقشير البشرة بالليزر	Laser	Laser treatment to improve skin texture and reduce wrinkles	60	Local	3000.00	Redness, swelling, infection, pigmentation changes	7	1
359	Hair Transplant (FUE)	زراعة الشعر	Hair	Follicular unit extraction for hair restoration	360	Local	15000.00	Infection, scarring, graft failure, temporary shock loss	14	1
360	PRP Therapy	علاج البلازما	Non-Surgical	Platelet-rich plasma injections for skin rejuvenation	30	None	1500.00	Bruising, swelling, infection, minimal pain	1	1
361	Rhinoplasty	تجميل الأنف	Face	Reshaping of the nose for aesthetic or functional purposes	120	General	15000.00	Bleeding, infection, asymmetry, breathing difficulties, numbness	14	1
362	Blepharoplasty	شد الجفون	Face	Upper and/or lower eyelid surgery to remove excess skin and fat	90	Local	8000.00	Dry eyes, blurred vision, asymmetry, scarring	10	1
363	Facelift (Rhytidectomy)	شد الوجه	Face	Lifting and tightening facial tissues to reduce sagging	180	General	25000.00	Hematoma, nerve injury, scarring, hair loss near incisions	21	1
364	Otoplasty	تجميل الأذن	Face	Reshaping or repositioning of the ears	90	Local	7000.00	Asymmetry, infection, overcorrection, scarring	7	1
365	Lip Augmentation	تكبير الشفاه	Face	Enhancement of lip volume using fillers or implants	30	Local	3000.00	Swelling, bruising, asymmetry, allergic reaction	3	1
366	Botox Injection	حقن البوتوكس	Non-Surgical	Wrinkle relaxation using botulinum toxin	15	None	1500.00	Bruising, headache, drooping, temporary weakness	0	1
367	Dermal Fillers	حقن الفيلر	Non-Surgical	Volume restoration using hyaluronic acid fillers	30	Local	2500.00	Swelling, bruising, lumps, vascular occlusion	2	1
368	Chemical Peel	التقشير الكيميائي	Non-Surgical	Chemical solution applied to improve skin texture	45	None	1000.00	Redness, peeling, pigmentation changes, scarring	5	1
369	Breast Augmentation	تكبير الثدي	Body	Enlargement using implants or fat transfer	120	General	20000.00	Capsular contracture, implant rupture, asymmetry, infection	14	1
370	Liposuction	شفط الدهون	Body	Removal of excess fat deposits from specific body areas	120	General	12000.00	Contour irregularities, fluid accumulation, numbness	14	1
371	Abdominoplasty	شد البطن	Body	Removal of excess skin and fat from the abdomen	180	General	18000.00	Seroma, wound healing issues, scarring, numbness	21	1
372	Laser Hair Removal	إزالة الشعر بالليزر	Laser	Permanent hair reduction using laser technology	30	None	500.00	Burns, pigmentation changes, paradoxical growth	0	1
373	Laser Skin Resurfacing	تقشير البشرة بالليزر	Laser	Laser treatment to improve skin texture and reduce wrinkles	60	Local	3000.00	Redness, swelling, infection, pigmentation changes	7	1
374	Hair Transplant (FUE)	زراعة الشعر	Hair	Follicular unit extraction for hair restoration	360	Local	15000.00	Infection, scarring, graft failure, temporary shock loss	14	1
375	PRP Therapy	علاج البلازما	Non-Surgical	Platelet-rich plasma injections for skin rejuvenation	30	None	1500.00	Bruising, swelling, infection, minimal pain	1	1
\.


--
-- Data for Name: cssd_instrument_sets; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cssd_instrument_sets (id, set_name, set_name_ar, set_code, category, instrument_count, instruments_list, department, status, notes) FROM stdin;
\.


--
-- Data for Name: cssd_load_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cssd_load_items (id, cycle_id, set_id, set_name, barcode, status, used_in_surgery_id, used_date, notes) FROM stdin;
\.


--
-- Data for Name: cssd_sterilization_cycles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.cssd_sterilization_cycles (id, cycle_number, machine_name, cycle_type, temperature, pressure, duration_minutes, start_time, end_time, operator, bi_test_result, ci_result, status, notes) FROM stdin;
\.


--
-- Data for Name: daily_close; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.daily_close (id, close_date, cashier, total_cash, total_card, total_insurance, total_transactions, opening_balance, closing_balance, variance, notes, status, closed_by, created_at) FROM stdin;
\.


--
-- Data for Name: dental_records; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.dental_records (id, patient_id, tooth_number, condition, treatment_done, visit_date, tenant_id, facility_id) FROM stdin;
\.


--
-- Data for Name: departments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.departments (id, branch_id, name_ar, name_en, is_active, created_at) FROM stdin;
\.


--
-- Data for Name: diet_meals; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.diet_meals (id, order_id, patient_id, meal_type, meal_date, items, calories, delivered, delivered_by, consumed_percentage, notes, created_at) FROM stdin;
\.


--
-- Data for Name: diet_orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.diet_orders (id, admission_id, patient_id, patient_name, diet_type, diet_type_ar, texture, fluid, allergies, restrictions, supplements, ordered_by, meal_preferences, start_date, end_date, status, notes, created_at) FROM stdin;
\.


--
-- Data for Name: discount_rules; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.discount_rules (id, rule_name, discount_type, discount_value, applies_to, min_amount, max_discount, start_date, end_date, is_active) FROM stdin;
\.


--
-- Data for Name: doctor_inventory_request_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.doctor_inventory_request_items (id, request_id, item_id, qty_requested, qty_approved, notes, tenant_id) FROM stdin;
\.


--
-- Data for Name: doctor_inventory_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.doctor_inventory_requests (id, doctor_id, department, request_date, status, approved_by, notes, created_at, tenant_id, branch_id) FROM stdin;
\.


--
-- Data for Name: drug_interactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.drug_interactions (id, drug_a, drug_b, interaction_type, severity, description, clinical_action) FROM stdin;
\.


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
-- Data for Name: emergency_beds; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.emergency_beds (id, bed_name, bed_name_ar, zone, zone_ar, status, current_patient_id, notes, tenant_id, branch_id) FROM stdin;
1	ER-1	طوارئ-1	Resuscitation	الإنعاش	Available	0		1	1
2	ER-2	طوارئ-2	Resuscitation	الإنعاش	Available	0		1	1
3	ER-3	طوارئ-3	Critical	الحرجة	Available	0		1	1
4	ER-4	طوارئ-4	Critical	الحرجة	Available	0		1	1
5	ER-5	طوارئ-5	Acute	الحادة	Available	0		1	1
6	ER-6	طوارئ-6	Acute	الحادة	Available	0		1	1
7	ER-7	طوارئ-7	Observation	المراقبة	Available	0		1	1
8	ER-8	طوارئ-8	Observation	المراقبة	Available	0		1	1
\.


--
-- Data for Name: emergency_trauma_assessments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.emergency_trauma_assessments (id, visit_id, patient_id, airway, breathing, circulation, disability, exposure, gcs_eye, gcs_verbal, gcs_motor, gcs_total, mechanism_of_injury, trauma_team_activated, assessed_by, created_at, tenant_id, facility_id) FROM stdin;
\.


--
-- Data for Name: emergency_visits; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.emergency_visits (id, patient_id, patient_name, arrival_mode, arrival_time, chief_complaint, chief_complaint_ar, triage_level, triage_color, triage_nurse, triage_vitals, assigned_doctor, assigned_bed, disposition, disposition_time, acuity_notes, discharge_time, discharge_diagnosis, discharge_instructions, discharge_medications, followup_date, status, created_at, tenant_id, facility_id) FROM stdin;
\.


--
-- Data for Name: employee_exposures; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employee_exposures (id, employee_id, employee_name, exposure_type, exposure_date, source_patient, body_fluid, ppe_worn, action_taken, followup_date, result, reported_by, created_at, tenant_id) FROM stdin;
\.


--
-- Data for Name: employees; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.employees (id, name, name_ar, name_en, role, department_ar, department_en, status, salary, created_at, commission_type, commission_value) FROM stdin;
1	Dr. Khaled Marwan	د. خالد مروان	Dr. Khaled Marwan	Doctor	القسم الطبي	Medical Dept.	Active	25000	2026-06-19 01:16:54.85507	percentage	0
2	Sarah Al-Ahmad	سارة الأحمد	Sarah Al-Ahmad	Nurse	التمريض	Nursing	Active	12000	2026-06-19 01:16:54.85507	percentage	0
3	Omar Saleh	عمر صالح	Omar Saleh	Admin	تقنية المعلومات	IT Dept.	On Leave	9500	2026-06-19 01:16:54.85507	percentage	0
\.


--
-- Data for Name: facilities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.facilities (id, tenant_id, name, tax_number, created_at) FROM stdin;
1	1	Default Medical Facility	300000000000003	2026-06-19 01:16:54.793974
\.


--
-- Data for Name: finance_chart_of_accounts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.finance_chart_of_accounts (id, account_code, account_name_ar, account_name_en, parent_id, account_level, account_type, is_active) FROM stdin;
\.


--
-- Data for Name: finance_cost_centers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.finance_cost_centers (id, center_name, center_code, clinic_id, is_active) FROM stdin;
\.


--
-- Data for Name: finance_doctor_commissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.finance_doctor_commissions (id, doctor_id, period, total_revenue, commission_rate, commission_amount, status, tenant_id, facility_id) FROM stdin;
\.


--
-- Data for Name: finance_fiscal_years; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.finance_fiscal_years (id, year_name, start_date, end_date, is_closed, closed_at) FROM stdin;
\.


--
-- Data for Name: finance_journal_entries; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.finance_journal_entries (id, entry_number, entry_date, description, reference, is_auto, fiscal_year_id, is_posted, created_by, created_at, tenant_id, facility_id, branch_id) FROM stdin;
\.


--
-- Data for Name: finance_journal_lines; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.finance_journal_lines (id, entry_id, account_id, debit, credit, cost_center_id, notes, tenant_id, facility_id, branch_id) FROM stdin;
\.


--
-- Data for Name: finance_tax_declarations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.finance_tax_declarations (id, period_start, period_end, total_sales, total_vat, status, submitted_at, tenant_id, facility_id, branch_id) FROM stdin;
\.


--
-- Data for Name: finance_vouchers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.finance_vouchers (id, voucher_number, voucher_type, amount, account_id, description, payment_method, reference, voucher_date, created_by, created_at, tenant_id, facility_id, branch_id) FROM stdin;
\.


--
-- Data for Name: form_templates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.form_templates (id, template_name, department, form_fields, is_active, created_by, created_at) FROM stdin;
\.


--
-- Data for Name: hand_hygiene_audits; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hand_hygiene_audits (id, audit_date, auditor, department, moments_observed, moments_compliant, compliance_rate, notes, created_at, tenant_id) FROM stdin;
\.


--
-- Data for Name: hr_advances; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hr_advances (id, employee_id, amount, request_date, installments, remaining, status, notes, tenant_id) FROM stdin;
\.


--
-- Data for Name: hr_attendance; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hr_attendance (id, employee_id, attendance_date, check_in, check_out, total_hours, status, source, tenant_id, branch_id) FROM stdin;
\.


--
-- Data for Name: hr_employee_custody; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hr_employee_custody (id, employee_id, item_name, handed_date, returned_date, status, notes, tenant_id) FROM stdin;
\.


--
-- Data for Name: hr_employee_documents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hr_employee_documents (id, employee_id, doc_type, doc_number, issue_date, expiry_date, file_path, alert_days, tenant_id) FROM stdin;
\.


--
-- Data for Name: hr_employees; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hr_employees (id, emp_number, name_ar, name_en, national_id, phone, email, department, job_title, hire_date, contract_end, basic_salary, housing_allowance, transport_allowance, is_active, tenant_id, facility_id, branch_id) FROM stdin;
\.


--
-- Data for Name: hr_leaves; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hr_leaves (id, employee_id, leave_type, start_date, end_date, days, status, approved_by, notes, tenant_id) FROM stdin;
\.


--
-- Data for Name: hr_salaries; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.hr_salaries (id, employee_id, month, basic, allowances, deductions, advances_deducted, net_salary, payment_date, status, tenant_id) FROM stdin;
\.


--
-- Data for Name: icd10_codes; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.icd10_codes (code, description_en, description_ar) FROM stdin;
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
-- Data for Name: infection_outbreaks; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.infection_outbreaks (id, outbreak_name, organism, start_date, end_date, affected_ward, total_cases, investigation_notes, control_measures, status, reported_by, created_at, tenant_id) FROM stdin;
\.


--
-- Data for Name: infection_surveillance; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.infection_surveillance (id, patient_id, patient_name, infection_type, infection_site, organism, sensitivity, detection_date, hai_category, device_related, device_type, ward, bed, isolation_type, outcome, reported_by, notes, created_at, tenant_id) FROM stdin;
\.


--
-- Data for Name: insurance_claims; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.insurance_claims (id, patient_name, insurance_company, claim_amount, status, contract_id, policy_id, ucaf_dcaf_data, waseel_status, created_at, tenant_id, facility_id, branch_id) FROM stdin;
1	Ahmed Mohammed	Bupa Arabia	2500	Approved	0	0		Unsent	2026-06-19 01:16:54.856227	1	1	1
2	Yasser Khaled	Tawuniya	4200	Pending	0	0		Unsent	2026-06-19 01:16:54.856227	1	1	1
3	Sarah Ali	MedGulf	1800	Rejected	0	0		Unsent	2026-06-19 01:16:54.856227	1	1	1
\.


--
-- Data for Name: insurance_companies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.insurance_companies (id, name_ar, name_en, tpa_id, contact_info, created_at) FROM stdin;
\.


--
-- Data for Name: insurance_contracts; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.insurance_contracts (id, company_id, contract_name, valid_from, valid_to, discount_percentage, file_path, created_at) FROM stdin;
\.


--
-- Data for Name: insurance_policies; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.insurance_policies (id, name, class_type, max_limit, co_pay_percent, co_pay_max, dental_included, optical_included, maternity_included) FROM stdin;
\.


--
-- Data for Name: integration_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.integration_settings (id, integration_name, provider, api_key, api_secret, endpoint_url, is_enabled, config_json, last_sync, tenant_id) FROM stdin;
\.


--
-- Data for Name: internal_messages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.internal_messages (id, sender_id, receiver_id, subject, body, is_read, priority, created_at) FROM stdin;
\.


--
-- Data for Name: inventory_dept_request_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventory_dept_request_items (id, request_id, item_id, qty_requested, qty_approved, tenant_id, branch_id) FROM stdin;
\.


--
-- Data for Name: inventory_dept_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventory_dept_requests (id, department, requested_by, request_date, status, approved_by, notes, tenant_id, branch_id) FROM stdin;
\.


--
-- Data for Name: inventory_issue_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventory_issue_items (id, issue_id, item_id, qty, notes, tenant_id, branch_id) FROM stdin;
\.


--
-- Data for Name: inventory_issue_to_dept; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventory_issue_to_dept (id, department, issued_by, issue_date, status, notes, created_at, tenant_id, branch_id) FROM stdin;
\.


--
-- Data for Name: inventory_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventory_items (id, item_name, item_code, barcode, category, unit, cost_price, stock_qty, min_qty, is_active, tenant_id, branch_id) FROM stdin;
\.


--
-- Data for Name: inventory_opening_balances; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventory_opening_balances (id, item_id, qty, unit_cost, balance_date, notes, tenant_id, branch_id) FROM stdin;
\.


--
-- Data for Name: inventory_purchase_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventory_purchase_items (id, purchase_id, item_id, qty, unit_cost, total_cost, tenant_id, branch_id) FROM stdin;
\.


--
-- Data for Name: inventory_purchases; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventory_purchases (id, supplier_id, purchase_date, total_amount, status, notes, created_at, tenant_id, branch_id) FROM stdin;
\.


--
-- Data for Name: inventory_stock_count; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.inventory_stock_count (id, item_id, counted_qty, system_qty, difference, count_date, counted_by, tenant_id, branch_id) FROM stdin;
\.


--
-- Data for Name: invoices; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.invoices (id, patient_name, total, paid, order_id, service_type, invoice_number, description, amount, vat_amount, patient_id, payment_method, created_at, tenant_id, facility_id) FROM stdin;
1	Ahmed Mohammed	575	1	0				0	0	0		2026-06-19 01:16:54.855829	1	1
2	Yasser Khaled	1240	0	0				0	0	0		2026-06-19 01:16:54.855829	1	1
3	Sarah Ali	890.5	1	0				0	0	0		2026-06-19 01:16:54.855829	1	1
\.


--
-- Data for Name: lab_radiology_orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lab_radiology_orders (id, patient_id, doctor_id, order_type, description, status, sample_serial, result_date, sms_sent, results, radiology_images_paths, structured_report, is_radiology, price, approval_status, approved_by, created_at, tenant_id, facility_id) FROM stdin;
\.


--
-- Data for Name: lab_results; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lab_results (id, order_id, test_id, result_value, is_abnormal, notes, tenant_id, facility_id) FROM stdin;
\.


--
-- Data for Name: lab_samples; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lab_samples (id, order_id, sample_type, barcode, collection_date, collected_by, status, storage_location, notes, tenant_id) FROM stdin;
\.


--
-- Data for Name: lab_tests_catalog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.lab_tests_catalog (id, test_name, category, normal_range, price) FROM stdin;
1	CBC - Complete Blood Count	Hematology	See components	100
2	WBC - White Blood Cell Count	Hematology	4.5-11.0 x10^9/L	50
3	RBC - Red Blood Cell Count	Hematology	M:4.7-6.1 F:4.2-5.4 x10^12/L	50
4	Hemoglobin (Hgb)	Hematology	M:13.5-17.5 F:12.0-16.0 g/dL	50
5	Hematocrit (Hct)	Hematology	M:38.3-48.6% F:35.5-44.9%	50
6	MCV - Mean Corpuscular Volume	Hematology	80-100 fL	40
7	MCH - Mean Corpuscular Hemoglobin	Hematology	27-33 pg	40
8	MCHC	Hematology	31.5-35.7 g/dL	40
9	RDW - Red Cell Distribution Width	Hematology	11.5-14.5%	40
10	Platelet Count	Hematology	150-400 x10^9/L	50
11	MPV - Mean Platelet Volume	Hematology	7.5-11.5 fL	40
12	ESR - Erythrocyte Sedimentation Rate	Hematology	M:0-15 F:0-20 mm/hr	60
13	Reticulocyte Count	Hematology	0.5-2.5%	80
14	Peripheral Blood Smear	Hematology	Normal morphology	120
15	Hemoglobin Electrophoresis	Hematology	HbA >95%	200
16	G6PD	Hematology	4.6-13.5 U/g Hb	150
17	Sickle Cell Screen	Hematology	Negative	100
18	Direct Coombs Test (DAT)	Hematology	Negative	100
19	Indirect Coombs Test (IAT)	Hematology	Negative	100
20	Haptoglobin	Hematology	30-200 mg/dL	120
21	CD4 Count (Flow Cytometry)	Hematology	500-1500 cells/uL	250
22	CD8 Count (Flow Cytometry)	Hematology	150-1000 cells/uL	250
23	PT - Prothrombin Time	Coagulation	11.0-13.5 seconds	80
24	INR	Coagulation	0.8-1.1	80
25	aPTT	Coagulation	25-35 seconds	80
26	D-Dimer	Coagulation	<0.50 mg/L FEU	120
27	Fibrinogen	Coagulation	200-400 mg/dL	100
28	Thrombin Time	Coagulation	14-19 seconds	100
29	Bleeding Time	Coagulation	2-7 minutes	60
30	Factor V Leiden Mutation	Coagulation	Not detected	300
31	Protein C Activity	Coagulation	70-140%	250
32	Protein S Activity	Coagulation	60-140%	250
33	Antithrombin III	Coagulation	80-120%	200
34	Lupus Anticoagulant	Coagulation	Negative	200
35	von Willebrand Factor Antigen	Coagulation	50-150%	250
36	Glucose, Fasting	Chemistry	70-100 mg/dL	50
37	Glucose, Random	Chemistry	70-140 mg/dL	50
38	Glucose, 2-Hour Postprandial	Chemistry	<140 mg/dL	60
39	Oral Glucose Tolerance Test (OGTT)	Chemistry	<140 mg/dL at 2hr	120
40	BUN - Blood Urea Nitrogen	Chemistry	7-20 mg/dL	50
41	Creatinine, Serum	Chemistry	M:0.7-1.3 F:0.6-1.1 mg/dL	50
42	eGFR	Chemistry	>60 mL/min/1.73m2	50
43	Uric Acid	Chemistry	M:3.4-7.0 F:2.4-6.0 mg/dL	60
44	Total Protein, Serum	Chemistry	6.0-8.3 g/dL	50
45	Albumin, Serum	Chemistry	3.5-5.5 g/dL	50
46	Globulin	Chemistry	2.0-3.5 g/dL	50
47	BMP - Basic Metabolic Panel	Chemistry	See components	150
48	CMP - Comprehensive Metabolic Panel	Chemistry	See components	200
49	Ammonia Level	Chemistry	15-45 mcg/dL	100
50	Lactate (Lactic Acid)	Chemistry	0.5-2.2 mmol/L	80
51	LDH - Lactate Dehydrogenase	Chemistry	140-280 U/L	70
52	CPK - Creatine Phosphokinase	Chemistry	M:39-308 F:26-192 U/L	80
53	Amylase	Chemistry	28-100 U/L	80
54	Lipase	Chemistry	0-160 U/L	80
55	ALT (SGPT)	Liver Function	7-56 U/L	60
56	AST (SGOT)	Liver Function	10-40 U/L	60
57	ALP - Alkaline Phosphatase	Liver Function	44-147 U/L	60
58	GGT	Liver Function	M:9-48 F:9-36 U/L	60
59	Total Bilirubin	Liver Function	0.1-1.2 mg/dL	60
60	Direct Bilirubin	Liver Function	0.0-0.3 mg/dL	60
61	Indirect Bilirubin	Liver Function	0.1-0.9 mg/dL	50
62	LFT - Liver Function Panel	Liver Function	See components	150
63	Alpha-Fetoprotein (Liver)	Liver Function	<10 ng/mL	150
64	Total Cholesterol	Lipid Panel	<200 mg/dL	60
65	LDL Cholesterol	Lipid Panel	<100 mg/dL optimal	60
66	HDL Cholesterol	Lipid Panel	M:>40 F:>50 mg/dL	60
67	Triglycerides	Lipid Panel	<150 mg/dL	60
68	VLDL Cholesterol	Lipid Panel	5-40 mg/dL	60
69	Lipid Panel (Complete)	Lipid Panel	See components	120
70	Apolipoprotein B	Lipid Panel	<90 mg/dL	150
71	Lipoprotein(a)	Lipid Panel	<30 mg/dL	180
72	Sodium (Na)	Electrolytes	136-145 mEq/L	50
73	Potassium (K)	Electrolytes	3.5-5.0 mEq/L	50
74	Chloride (Cl)	Electrolytes	98-106 mEq/L	50
75	CO2 (Bicarbonate)	Electrolytes	22-29 mEq/L	50
76	Calcium, Total	Electrolytes	8.6-10.2 mg/dL	50
77	Calcium, Ionized	Electrolytes	4.5-5.6 mg/dL	80
78	Phosphorus	Electrolytes	2.5-4.5 mg/dL	50
79	Magnesium	Electrolytes	1.7-2.2 mg/dL	60
80	Zinc, Serum	Electrolytes	60-120 mcg/dL	100
81	Copper, Serum	Electrolytes	70-140 mcg/dL	100
82	TSH	Endocrinology	0.27-4.20 mIU/L	100
83	Free T4	Endocrinology	0.93-1.70 ng/dL	100
84	Free T3	Endocrinology	2.0-4.4 pg/mL	100
85	Total T4	Endocrinology	4.5-12.0 mcg/dL	80
86	Total T3	Endocrinology	80-200 ng/dL	80
87	Anti-TPO	Endocrinology	<35 IU/mL	120
88	Anti-Thyroglobulin Antibody	Endocrinology	<40 IU/mL	120
89	HbA1c	Endocrinology	4.0-5.6%	100
90	Fasting Insulin	Endocrinology	2.6-24.9 mIU/L	120
91	C-Peptide	Endocrinology	1.1-4.4 ng/mL	150
92	Cortisol, Morning	Endocrinology	6.2-19.4 mcg/dL	120
93	ACTH	Endocrinology	7.2-63.3 pg/mL	180
94	Aldosterone	Endocrinology	<21 ng/dL upright	180
95	PTH - Parathyroid Hormone	Endocrinology	15-65 pg/mL	150
96	Growth Hormone	Endocrinology	M:<5 F:<10 ng/mL	180
97	IGF-1	Endocrinology	Age-dependent	180
98	Prolactin	Endocrinology	M:4-15 F:4-23 ng/mL	120
99	DHEA-S	Endocrinology	Age/sex-dependent	120
100	Metanephrines, Plasma	Endocrinology	<0.90 nmol/L	250
101	CRP	Immunology	<3.0 mg/L	80
102	hs-CRP	Immunology	<1.0 mg/L low risk	100
103	RF - Rheumatoid Factor	Immunology	<14 IU/mL	80
104	Anti-CCP Antibodies	Immunology	<20 U/mL	150
105	ANA - Antinuclear Antibody	Immunology	Negative (<1:40)	120
106	Anti-dsDNA	Immunology	<30 IU/mL	150
107	ENA Panel	Immunology	Negative	250
108	Complement C3	Immunology	90-180 mg/dL	100
109	Complement C4	Immunology	10-40 mg/dL	100
110	IgG	Immunology	700-1600 mg/dL	100
111	IgA	Immunology	70-400 mg/dL	100
112	IgM	Immunology	40-230 mg/dL	100
113	IgE, Total	Immunology	<100 IU/mL	120
114	ANCA	Immunology	Negative	200
115	ASO	Immunology	<200 IU/mL	80
116	SPEP	Immunology	See pattern	200
117	Blood Culture, Aerobic	Microbiology	No growth	150
118	Blood Culture, Anaerobic	Microbiology	No growth	150
119	Urine Culture & Sensitivity	Microbiology	<10,000 CFU/mL	120
120	Wound Culture & Sensitivity	Microbiology	See report	120
121	Throat Culture	Microbiology	Normal flora	100
122	Sputum Culture	Microbiology	See report	120
123	Stool Culture	Microbiology	No pathogen	120
124	CSF Culture	Microbiology	No growth	150
125	Fungal Culture	Microbiology	No growth	150
126	AFB Culture (TB)	Microbiology	No growth	200
127	AFB Smear	Microbiology	Negative	80
128	Gram Stain	Microbiology	See report	60
129	H. pylori Antigen, Stool	Microbiology	Negative	120
130	H. pylori Antibody	Microbiology	Negative	100
131	H. pylori Breath Test	Microbiology	Negative	150
132	C. difficile Toxin	Microbiology	Negative	150
133	MRSA Screen	Microbiology	Not detected	150
134	Urinalysis, Complete	Urinalysis	See components	60
135	Urine Dipstick	Urinalysis	See components	40
136	Urine Microscopy	Urinalysis	See report	50
137	Urine Albumin/Creatinine Ratio	Urinalysis	<30 mg/g	100
138	24-Hour Urine Protein	Urinalysis	<150 mg/24hr	100
139	24-Hour Creatinine Clearance	Urinalysis	M:97-137 F:88-128 mL/min	120
140	Urine Drug Screen	Urinalysis	Negative	150
141	Urine Drug Screen Panel	Toxicology	Negative	200
142	Acetaminophen Level	Toxicology	10-30 mcg/mL	100
143	Ethanol Level	Toxicology	0 mg/dL	80
144	Digoxin Level	Toxicology	0.8-2.0 ng/mL	120
145	Lithium Level	Toxicology	0.6-1.2 mEq/L	100
146	Vancomycin Trough	Toxicology	15-20 mcg/mL	150
147	Tacrolimus Level	Toxicology	5-15 ng/mL	200
148	Lead Level, Blood	Toxicology	<5 mcg/dL	150
149	PSA	Tumor Markers	<4.0 ng/mL	120
150	AFP - Alpha-Fetoprotein	Tumor Markers	<10 ng/mL	150
151	CEA	Tumor Markers	<3.0 ng/mL	150
152	CA-125	Tumor Markers	<35 U/mL	150
153	CA 19-9	Tumor Markers	<37 U/mL	150
154	CA 15-3	Tumor Markers	<30 U/mL	150
155	Beta-hCG (Tumor Marker)	Tumor Markers	<5 mIU/mL	120
156	NSE	Tumor Markers	<16.3 ng/mL	180
157	Chromogranin A	Tumor Markers	<93 ng/mL	200
158	Calcitonin	Tumor Markers	M:<8.4 F:<5.0 pg/mL	200
159	Blood Group & Rh Type	Blood Bank	A/B/AB/O, Rh+/-	50
160	Antibody Screen	Blood Bank	Negative	80
161	Crossmatch	Blood Bank	Compatible	100
162	Direct Antiglobulin Test	Blood Bank	Negative	80
163	Cold Agglutinins	Blood Bank	<1:64	120
164	Vitamin D, 25-Hydroxy	Vitamins	30-100 ng/mL	120
165	Vitamin B12	Vitamins	200-900 pg/mL	100
166	Folate, Serum	Vitamins	>3.0 ng/mL	80
167	Iron, Serum	Vitamins	M:60-170 F:40-150 mcg/dL	60
168	TIBC	Vitamins	250-400 mcg/dL	60
169	Transferrin Saturation	Vitamins	20-50%	60
170	Ferritin	Vitamins	M:12-300 F:12-150 ng/mL	80
171	Vitamin A	Vitamins	30-65 mcg/dL	150
172	Vitamin C	Vitamins	0.2-2.0 mg/dL	120
173	Vitamin E	Vitamins	5.5-17.0 mg/L	150
174	Vitamin B1 (Thiamine)	Vitamins	70-180 nmol/L	150
175	Vitamin B6	Vitamins	5-50 mcg/L	150
176	Troponin I	Cardiac Markers	<0.04 ng/mL	120
177	Troponin T, High Sensitivity	Cardiac Markers	<14 ng/L	150
178	BNP	Cardiac Markers	<100 pg/mL	150
179	NT-proBNP	Cardiac Markers	<125 pg/mL	180
180	CK-MB	Cardiac Markers	<5.0 ng/mL	100
181	Myoglobin	Cardiac Markers	<90 ng/mL	100
182	Homocysteine	Cardiac Markers	5-15 umol/L	120
183	Total IgE	Allergy	<100 IU/mL	100
184	Specific IgE - Dust Mite	Allergy	<0.35 kU/L	120
185	Specific IgE - Cat Dander	Allergy	<0.35 kU/L	120
186	Specific IgE - Grass Pollen	Allergy	<0.35 kU/L	120
187	Specific IgE - Milk	Allergy	<0.35 kU/L	120
188	Specific IgE - Egg White	Allergy	<0.35 kU/L	120
189	Specific IgE - Peanut	Allergy	<0.35 kU/L	120
190	Specific IgE - Wheat	Allergy	<0.35 kU/L	120
191	Food Allergy Panel (Top 8)	Allergy	See components	400
192	Inhalant Allergy Panel	Allergy	See components	400
193	Stool Analysis, Complete	Stool Analysis	See components	80
194	Stool Occult Blood (FOBT)	Stool Analysis	Negative	50
195	FIT - Fecal Immunochemical	Stool Analysis	Negative	80
196	Stool Ova & Parasites	Stool Analysis	No parasites	80
197	Fecal Calprotectin	Stool Analysis	<50 mcg/g	200
198	Fecal Elastase	Stool Analysis	>200 mcg/g	180
199	COVID-19 PCR	Molecular	Not detected	200
200	COVID-19 Rapid Antigen	Molecular	Negative	100
201	Influenza A/B PCR	Molecular	Not detected	200
202	RSV PCR	Molecular	Not detected	200
203	Respiratory Pathogen Panel	Molecular	See components	500
204	TB QuantiFERON (IGRA)	Molecular	Negative	250
205	Hepatitis B PCR (HBV DNA)	Molecular	Not detected	300
206	Hepatitis C PCR (HCV RNA)	Molecular	Not detected	300
207	HIV-1 RNA Viral Load	Molecular	Not detected	350
208	CMV PCR	Molecular	Not detected	250
209	EBV PCR	Molecular	Not detected	250
210	HPV DNA Test	Molecular	Not detected	200
211	CSF Analysis	Body Fluids	See components	200
212	CSF Protein	Body Fluids	15-45 mg/dL	80
213	CSF Glucose	Body Fluids	40-70 mg/dL	60
214	CSF Cell Count	Body Fluids	0-5 WBC/uL	80
215	Pleural Fluid Analysis	Body Fluids	See components	200
216	Synovial Fluid Analysis	Body Fluids	See components	200
217	Ascitic Fluid Analysis	Body Fluids	See components	200
218	Estradiol (E2)	Reproductive Hormones	Phase-dependent	120
219	Progesterone	Reproductive Hormones	Phase-dependent	120
220	Testosterone, Total	Reproductive Hormones	M:264-916 ng/dL	120
221	Testosterone, Free	Reproductive Hormones	M:8.7-25.1 pg/mL	150
222	FSH	Reproductive Hormones	Phase/sex-dependent	120
223	LH	Reproductive Hormones	Phase/sex-dependent	120
224	AMH	Reproductive Hormones	Age-dependent	200
225	Beta-hCG (Pregnancy)	Reproductive Hormones	<5 mIU/mL non-pregnant	100
226	SHBG	Reproductive Hormones	M:10-57 F:18-114 nmol/L	150
227	HBsAg	Infectious Disease	Negative	80
228	HBsAb	Infectious Disease	>10 mIU/mL immune	80
229	HBcAb	Infectious Disease	Negative	80
230	HCV Ab	Infectious Disease	Negative	80
231	HIV 1/2 Ag/Ab Combo	Infectious Disease	Non-reactive	100
232	RPR/VDRL (Syphilis)	Infectious Disease	Non-reactive	60
233	FTA-ABS	Infectious Disease	Non-reactive	100
234	Rubella IgG	Infectious Disease	>10 IU/mL immune	80
235	Rubella IgM	Infectious Disease	Negative	80
236	CMV IgG	Infectious Disease	See interpretation	80
237	CMV IgM	Infectious Disease	Negative	80
238	Toxoplasma IgG	Infectious Disease	See interpretation	80
239	Toxoplasma IgM	Infectious Disease	Negative	80
240	EBV Panel	Infectious Disease	See interpretation	200
241	Brucella Agglutination	Infectious Disease	<1:80	80
242	Widal Test (Typhoid)	Infectious Disease	<1:80	60
243	Dengue NS1 Antigen	Infectious Disease	Negative	120
244	Malaria Smear	Infectious Disease	No parasites seen	80
245	Malaria Rapid Test	Infectious Disease	Negative	80
246	Mono Spot Test	Infectious Disease	Negative	60
247	Varicella-Zoster IgG	Infectious Disease	See interpretation	80
248	Measles IgG	Infectious Disease	See interpretation	80
249	Anti-tTG IgA (Celiac)	Autoimmune	<20 U/mL	150
250	Anti-Endomysial Ab	Autoimmune	Negative	200
251	Anti-GBM Antibodies	Autoimmune	<20 U/mL	200
252	Anti-Smooth Muscle Ab	Autoimmune	<1:40	150
253	Anti-Mitochondrial Ab	Autoimmune	Negative	150
254	HLA-B27	Autoimmune	Negative/Positive	200
255	Anti-Jo-1 Antibodies	Autoimmune	Negative	150
256	Anti-Scl-70 Antibodies	Autoimmune	Negative	150
257	ABG - Arterial Blood Gas	Blood Gas	See components	100
258	pH, Arterial	Blood Gas	7.35-7.45	50
259	pCO2, Arterial	Blood Gas	35-45 mmHg	50
260	pO2, Arterial	Blood Gas	80-100 mmHg	50
261	HCO3, Arterial	Blood Gas	22-26 mEq/L	50
262	O2 Saturation, Arterial	Blood Gas	95-100%	40
263	VBG - Venous Blood Gas	Blood Gas	See components	80
264	Karyotype Analysis	Genetics	Normal 46,XX or 46,XY	500
265	FISH (Fluorescence In Situ Hybridization)	Genetics	See report	600
266	BRCA1/BRCA2 Gene Test	Genetics	No mutation detected	1200
267	Cystic Fibrosis Gene Panel	Genetics	No mutation detected	800
268	Hemoglobin S Gene Test	Genetics	Not detected	400
269	Thalassemia Gene Panel	Genetics	Not detected	600
270	Fragile X Syndrome Test	Genetics	Normal CGG repeats	500
271	Prader-Willi/Angelman Syndrome	Genetics	Normal methylation	600
272	Spinal Muscular Atrophy (SMA) Test	Genetics	Normal SMN1 copies	500
273	Prenatal Cell-Free DNA (NIPT)	Genetics	Low risk	1500
274	Newborn Screening Panel	Genetics	Normal	300
275	Pharmacogenomics Panel	Genetics	See report	800
276	Chromosomal Microarray	Genetics	Normal	1000
277	Whole Exome Sequencing	Genetics	See report	3000
278	Lynch Syndrome Panel (MLH1/MSH2/MSH6/PMS2)	Genetics	No mutation	1000
279	Factor V Leiden Gene Test	Genetics	Not detected	300
280	Prothrombin G20210A Mutation	Genetics	Not detected	300
281	MTHFR Gene Mutation	Genetics	Not detected	250
282	JAK2 V617F Mutation	Genetics	Not detected	400
283	BCR-ABL Quantitative (CML)	Genetics	Not detected	600
284	EGFR Mutation (Lung Cancer)	Genetics	Not detected	500
285	BRAF V600E Mutation	Genetics	Not detected	500
286	HER2/neu Gene Amplification	Genetics	Not amplified	500
287	Microsatellite Instability (MSI)	Genetics	Stable	400
288	PDL1 Expression	Genetics	See report	400
289	Next-Gen Sequencing - Tumor Panel	Genetics	See report	2500
290	FMR1 Gene Analysis	Genetics	Normal	500
291	Duchenne/Becker Muscular Dystrophy	Genetics	Not detected	600
292	Hereditary Breast/Ovarian Cancer Panel	Genetics	No mutation	1500
293	Familial Hypercholesterolemia Panel	Genetics	No mutation	800
294	Skin Biopsy Pathology	Dermatology	See report	300
295	Fungal Scrape (KOH Preparation)	Dermatology	Negative	60
296	Nail Clipping Fungal Culture	Dermatology	No growth	100
297	Woods Lamp Examination	Dermatology	Normal fluorescence	50
298	Patch Test (Contact Allergy)	Dermatology	See results	300
299	Tzanck Smear	Dermatology	No multinucleated giant cells	80
300	Direct Immunofluorescence (DIF) - Skin	Dermatology	Negative	400
301	Scabies Scraping	Dermatology	Negative	60
302	GBS Culture (Group B Strep)	Microbiology	Negative	100
303	Chlamydia PCR	Microbiology	Not detected	200
304	Gonorrhea PCR	Microbiology	Not detected	200
305	Chlamydia/Gonorrhea Combo PCR	Microbiology	Not detected	250
306	Trichomonas PCR	Microbiology	Not detected	150
307	BV (Bacterial Vaginosis) Panel	Microbiology	Negative	150
308	Mycoplasma Culture	Microbiology	No growth	150
309	Ureaplasma Culture	Microbiology	No growth	150
310	Legionella Urinary Antigen	Microbiology	Negative	150
311	Strep A Rapid Test	Microbiology	Negative	50
312	Cryptococcal Antigen	Microbiology	Negative	150
313	Aspergillus Galactomannan	Microbiology	Negative	200
314	Beta-D-Glucan	Microbiology	<60 pg/mL	250
315	Parasite Blood Smear (Thick/Thin)	Microbiology	No parasites	80
316	Pinworm Test (Scotch Tape)	Microbiology	Negative	50
317	Giardia Antigen	Microbiology	Negative	100
318	Clostridium botulinum Toxin	Microbiology	Not detected	300
319	Norovirus PCR	Microbiology	Not detected	200
320	Rotavirus Antigen	Microbiology	Negative	100
321	Adenovirus Antigen	Microbiology	Negative	100
322	Insulin Antibodies	Endocrinology	Negative	200
323	Anti-GAD65 Antibodies	Endocrinology	<5 U/mL	200
324	IA-2 Antibodies	Endocrinology	Negative	200
325	Fructosamine	Endocrinology	200-285 umol/L	100
326	1,25-Dihydroxy Vitamin D	Endocrinology	18-72 pg/mL	200
327	Catecholamines, Plasma	Endocrinology	See ranges	250
328	24-Hour Urine Catecholamines	Endocrinology	See ranges	250
329	24-Hour Urine 5-HIAA	Endocrinology	2-8 mg/24hr	200
330	24-Hour Urine Cortisol	Endocrinology	10-100 mcg/24hr	180
331	Renin Activity, Plasma	Endocrinology	0.5-3.5 ng/mL/hr	200
332	Aldosterone/Renin Ratio	Endocrinology	<30	250
333	17-OH Progesterone	Endocrinology	Age/sex-dependent	150
334	Androstenedione	Endocrinology	Age/sex-dependent	150
335	Sex Hormone Binding Globulin (SHBG)	Endocrinology	M:10-57 F:18-114 nmol/L	150
336	Insulin-like Growth Factor Binding Protein 3	Endocrinology	Age-dependent	200
337	Serotonin, Serum	Endocrinology	50-200 ng/mL	180
338	Cryoglobulins	Immunology	Negative	200
339	Beta-2 Microglobulin	Immunology	<2.0 mg/L	150
340	Serum Free Light Chains	Immunology	Kappa:3.3-19.4 Lambda:5.7-26.3	250
341	Immunofixation Electrophoresis (IFE)	Immunology	No monoclonal protein	300
342	IgG Subclasses	Immunology	See ranges	300
343	Mannose-Binding Lectin	Immunology	>100 ng/mL	200
344	CH50 (Total Complement)	Immunology	60-144 CAE Units	150
345	Anti-Cardiolipin Antibodies (IgG/IgM)	Immunology	<20 GPL/MPL	200
346	Anti-Beta2 Glycoprotein I	Immunology	<20 U/mL	200
347	Tissue Transglutaminase IgA	Immunology	<20 U/mL	150
348	Deamidated Gliadin Peptide	Immunology	<20 U/mL	150
349	Procalcitonin	Chemistry	<0.1 ng/mL	200
350	Presepsin	Chemistry	<317 pg/mL	250
351	Ceruloplasmin	Chemistry	20-35 mg/dL	120
352	Copper, 24-Hour Urine	Chemistry	<40 mcg/24hr	150
353	Alpha-1 Antitrypsin	Chemistry	100-200 mg/dL	150
354	Angiotensin Converting Enzyme (ACE)	Chemistry	8-52 U/L	150
355	Osmolality, Serum	Chemistry	275-295 mOsm/kg	80
356	Osmolality, Urine	Chemistry	300-900 mOsm/kg	80
357	Specific Gravity, Urine	Chemistry	1.005-1.030	30
358	Cystatin C	Chemistry	0.55-1.15 mg/L	200
359	Bile Acids, Total	Chemistry	<10 umol/L	150
360	Galactose-1-Phosphate	Chemistry	<1 mg/dL	200
361	Pyruvate	Chemistry	0.3-0.9 mg/dL	100
362	Organic Acids, Urine	Chemistry	Normal pattern	400
363	Amino Acids, Plasma Panel	Chemistry	Normal pattern	400
364	Carnitine Profile	Chemistry	Normal pattern	300
365	Acylcarnitine Profile	Chemistry	Normal pattern	350
366	Biotinidase Activity	Chemistry	>5.0 nmol/min/mL	200
367	Sweat Chloride Test	Chemistry	<30 mmol/L normal	150
368	Rapid Strep A Test	Point of Care	Negative	40
369	Rapid Flu A/B Test	Point of Care	Negative	60
370	Rapid RSV Test	Point of Care	Negative	60
371	Urine Pregnancy Test (hCG)	Point of Care	Negative	30
372	Rapid HIV Test	Point of Care	Non-reactive	50
373	Rapid Dengue IgG/IgM	Point of Care	Negative	80
374	Blood Glucose (Fingerstick)	Point of Care	70-140 mg/dL	20
375	Hemoglobin A1c (Point of Care)	Point of Care	<5.7%	50
376	INR (Point of Care)	Point of Care	0.8-1.1	40
377	Troponin I (Point of Care)	Point of Care	<0.04 ng/mL	80
378	CRP (Point of Care)	Point of Care	<3 mg/L	40
379	D-Dimer (Point of Care)	Point of Care	<0.5 mg/L	80
380	Procalcitonin (Point of Care)	Point of Care	<0.1 ng/mL	100
381	Lactate (Point of Care)	Point of Care	<2.2 mmol/L	50
382	Osmotic Fragility Test	Hematology	Normal	150
383	Platelet Function Assay (PFA-100)	Hematology	Col/EPI <165s Col/ADP <120s	200
384	Bone Marrow Biopsy/Aspirate	Hematology	See report	500
385	Flow Cytometry - Leukemia Panel	Hematology	See report	500
386	Hemoglobin HPLC	Hematology	Normal pattern	200
387	Heinz Body Preparation	Hematology	Negative	80
388	Ham Test (Acidified Serum)	Hematology	Negative	150
389	Sugar Water Test	Hematology	Negative	80
390	Methemoglobin Level	Hematology	<1.5%	100
391	Carboxyhemoglobin	Hematology	<3% non-smoker	100
392	RBC Folate	Hematology	>280 ng/mL	120
393	Immature Platelet Fraction	Hematology	1.1-6.1%	100
394	Thromboelastography (TEG)	Hematology	See report	300
395	Phenytoin Level	Therapeutic Drug Monitoring	10-20 mcg/mL	120
396	Carbamazepine Level	Therapeutic Drug Monitoring	4-12 mcg/mL	120
397	Valproic Acid Level	Therapeutic Drug Monitoring	50-125 mcg/mL	120
398	Phenobarbital Level	Therapeutic Drug Monitoring	15-40 mcg/mL	120
399	Lamotrigine Level	Therapeutic Drug Monitoring	2.5-15 mcg/mL	150
400	Levetiracetam Level	Therapeutic Drug Monitoring	12-46 mcg/mL	150
401	Gentamicin Level (Peak/Trough)	Therapeutic Drug Monitoring	Peak:5-10 Trough:<2	150
402	Amikacin Level	Therapeutic Drug Monitoring	Peak:20-30 Trough:<8	150
403	Cyclosporine Level	Therapeutic Drug Monitoring	100-400 ng/mL	200
404	Sirolimus Level	Therapeutic Drug Monitoring	4-12 ng/mL	200
405	Mycophenolate Level	Therapeutic Drug Monitoring	1-3.5 mg/L	200
406	Theophylline Level	Therapeutic Drug Monitoring	10-20 mcg/mL	120
407	Methotrexate Level	Therapeutic Drug Monitoring	Time-dependent	200
408	Salicylate Level	Therapeutic Drug Monitoring	15-30 mg/dL	80
409	HE4 (Ovarian)	Tumor Markers	<140 pmol/L premenopausal	200
410	ROMA Index	Tumor Markers	See interpretation	250
411	Thyroglobulin	Tumor Markers	<40 ng/mL	150
412	SCC Antigen	Tumor Markers	<2.0 ng/mL	150
413	CYFRA 21-1	Tumor Markers	<3.3 ng/mL	150
414	S-100 Protein	Tumor Markers	<0.12 mcg/L	200
415	Lactate Dehydrogenase (LDH) Isoenzymes	Tumor Markers	See pattern	200
416	Free PSA / Total PSA Ratio	Tumor Markers	>25% low risk	150
417	PCA3 Urine Test	Tumor Markers	<25 normal	400
418	Pepsinogen I/II	Tumor Markers	PGI/PGII >3	200
419	Specific IgE - Cockroach	Allergy	<0.35 kU/L	120
420	Specific IgE - Dog Dander	Allergy	<0.35 kU/L	120
421	Specific IgE - Mold Mix	Allergy	<0.35 kU/L	120
422	Specific IgE - Tree Pollen Mix	Allergy	<0.35 kU/L	120
423	Specific IgE - Weed Pollen	Allergy	<0.35 kU/L	120
424	Specific IgE - Latex	Allergy	<0.35 kU/L	120
425	Specific IgE - Fish	Allergy	<0.35 kU/L	120
426	Specific IgE - Shellfish	Allergy	<0.35 kU/L	120
427	Specific IgE - Soy	Allergy	<0.35 kU/L	120
428	Specific IgE - Sesame	Allergy	<0.35 kU/L	120
429	Specific IgE - Bee Venom	Allergy	<0.35 kU/L	120
430	Specific IgE - Wasp Venom	Allergy	<0.35 kU/L	120
431	Comprehensive Food Panel (20+ items)	Allergy	See components	600
432	Comprehensive Inhalant Panel (20+ items)	Allergy	See components	600
433	Drug Allergy - Penicillin IgE	Allergy	<0.35 kU/L	120
434	Drug Allergy - Cephalosporin IgE	Allergy	<0.35 kU/L	120
435	Tryptase (Mast Cell Activation)	Allergy	<11.4 ng/mL	200
436	Eosinophil Cationic Protein	Allergy	<24 mcg/L	150
437	Hepatitis A IgM	Infectious Disease	Negative	80
438	Hepatitis A Total Antibody	Infectious Disease	See interpretation	80
439	Hepatitis B e-Antigen	Infectious Disease	Negative	80
440	Hepatitis B e-Antibody	Infectious Disease	See interpretation	80
441	Hepatitis D Antibody	Infectious Disease	Negative	100
442	Hepatitis E IgM	Infectious Disease	Negative	100
443	Herpes Simplex IgG Type 1	Infectious Disease	See interpretation	100
444	Herpes Simplex IgG Type 2	Infectious Disease	See interpretation	100
445	Herpes Simplex PCR	Infectious Disease	Not detected	200
446	Parvovirus B19 IgM	Infectious Disease	Negative	120
447	Leishmania Antibody	Infectious Disease	Negative	150
448	Schistosoma Antibody	Infectious Disease	Negative	100
449	Echinococcus Antibody	Infectious Disease	Negative	120
450	Lyme Disease Antibody (IgG/IgM)	Infectious Disease	Negative	200
451	Q Fever Antibody	Infectious Disease	Negative	150
452	Rickettsial Antibody Panel	Infectious Disease	Negative	200
453	Chikungunya Antibody	Infectious Disease	Negative	150
454	Zika Virus IgM	Infectious Disease	Negative	200
455	HTLV I/II Antibody	Infectious Disease	Non-reactive	150
\.


--
-- Data for Name: maintenance_equipment; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.maintenance_equipment (id, equipment_name, equipment_name_ar, equipment_code, category, manufacturer, model, serial_number, department, location, purchase_date, warranty_end, last_calibration, next_calibration, last_pm, next_pm, status, notes, tenant_id) FROM stdin;
\.


--
-- Data for Name: maintenance_pm_schedules; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.maintenance_pm_schedules (id, equipment_id, pm_type, frequency, last_done, next_due, performed_by, checklist, status, notes, tenant_id) FROM stdin;
\.


--
-- Data for Name: maintenance_work_orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.maintenance_work_orders (id, wo_number, request_type, priority, department, location, equipment_id, description, description_ar, requested_by, assigned_to, scheduled_date, completed_date, cost, status, resolution, created_at, tenant_id, branch_id) FROM stdin;
\.


--
-- Data for Name: medical_certificates; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.medical_certificates (id, patient_id, patient_name, doctor_id, doctor_name, cert_type, diagnosis, notes, start_date, end_date, days, created_at, tenant_id, facility_id) FROM stdin;
\.


--
-- Data for Name: medical_records; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.medical_records (id, patient_id, doctor_id, diagnosis, symptoms, icd10_codes, notes, visit_date, tenant_id, facility_id) FROM stdin;
\.


--
-- Data for Name: medical_records_coding; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.medical_records_coding (id, patient_id, visit_id, primary_diagnosis, primary_icd10, secondary_diagnoses, drg_code, coder, coding_date, status, notes) FROM stdin;
\.


--
-- Data for Name: medical_records_files; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.medical_records_files (id, patient_id, file_number, location, shelf_number, status, last_requested_by, last_requested_at, notes, created_at) FROM stdin;
\.


--
-- Data for Name: medical_records_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.medical_records_requests (id, patient_id, file_number, requested_by, department, purpose, status, requested_at, delivered_at, returned_at, notes) FROM stdin;
\.


--
-- Data for Name: medical_services; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.medical_services (id, name_en, name_ar, specialty, category, price, is_active) FROM stdin;
1	General Consultation	استشارة عامة	General Practice	Consultation	150	1
2	Follow-up Visit	زيارة متابعة	General Practice	Consultation	100	1
3	Comprehensive Checkup	فحص شامل	General Practice	Consultation	300	1
4	Pre-employment Medical	فحص ما قبل التوظيف	General Practice	Consultation	250	1
5	Wound Dressing	تغيير ضماد	General Practice	Procedure	80	1
6	Wound Suturing	خياطة جرح	General Practice	Procedure	200	1
7	Abscess Drainage	تصريف خراج	General Practice	Procedure	300	1
8	Foreign Body Removal	إزالة جسم غريب	General Practice	Procedure	250	1
9	Cauterization	كي	General Practice	Procedure	200	1
10	IV Fluid Administration	إعطاء محاليل وريدية	General Practice	Procedure	150	1
11	IM/SC Injection	حقن عضلي / تحت الجلد	General Practice	Procedure	50	1
12	Nebulization	جلسة تبخير	General Practice	Procedure	80	1
13	ECG	تخطيط قلب	General Practice	Diagnostic	100	1
14	Blood Pressure Monitoring	متابعة ضغط الدم	General Practice	Diagnostic	50	1
15	Blood Sugar Test (POCT)	فحص سكر سريع	General Practice	Diagnostic	30	1
16	Medical Report	تقرير طبي	General Practice	Service	100	1
17	Sick Leave Certificate	إجازة مرضية	General Practice	Service	50	1
18	Fitness Certificate	شهادة لياقة	General Practice	Service	100	1
19	Vaccination - Adult	تطعيم بالغين	General Practice	Procedure	150	1
20	Allergy Test (Skin Prick)	فحص حساسية جلدي	General Practice	Diagnostic	200	1
21	Dental Consultation	استشارة أسنان	Dentistry	Consultation	150	1
22	Dental Follow-up	متابعة أسنان	Dentistry	Consultation	80	1
23	Dental X-Ray (Periapical)	أشعة سن	Dentistry	Diagnostic	80	1
24	Panoramic X-Ray (OPG)	أشعة بانوراما	Dentistry	Diagnostic	150	1
25	Dental Cleaning (Scaling)	تنظيف أسنان	Dentistry	Procedure	200	1
26	Dental Polishing	تلميع أسنان	Dentistry	Procedure	100	1
27	Simple Tooth Extraction	خلع سن بسيط	Dentistry	Procedure	200	1
28	Surgical Tooth Extraction	خلع سن جراحي	Dentistry	Procedure	500	1
29	Wisdom Tooth Extraction	خلع ضرس عقل	Dentistry	Procedure	600	1
30	Composite Filling (1 surface)	حشوة ضوئية سطح واحد	Dentistry	Procedure	200	1
31	Composite Filling (2 surfaces)	حشوة ضوئية سطحين	Dentistry	Procedure	300	1
32	Composite Filling (3 surfaces)	حشوة ضوئية ثلاث أسطح	Dentistry	Procedure	400	1
33	Amalgam Filling	حشوة أملغم	Dentistry	Procedure	150	1
34	Temporary Filling	حشوة مؤقتة	Dentistry	Procedure	100	1
35	Root Canal - Anterior	علاج عصب أمامي	Dentistry	Procedure	800	1
36	Root Canal - Premolar	علاج عصب ضاحك	Dentistry	Procedure	1000	1
37	Root Canal - Molar	علاج عصب ضرس	Dentistry	Procedure	1200	1
38	Root Canal Re-treatment	إعادة علاج عصب	Dentistry	Procedure	1500	1
39	Post & Core	دعامة ولب	Dentistry	Procedure	500	1
40	PFM Crown	تاج خزف معدني	Dentistry	Procedure	800	1
41	Zirconia Crown	تاج زركونيا	Dentistry	Procedure	1200	1
42	E-Max Crown	تاج إيماكس	Dentistry	Procedure	1400	1
43	Temporary Crown	تاج مؤقت	Dentistry	Procedure	200	1
44	Dental Bridge (per unit)	جسر أسنان (للوحدة)	Dentistry	Procedure	800	1
45	Porcelain Veneer	قشرة خزفية	Dentistry	Procedure	1500	1
46	Composite Veneer	قشرة ضوئية	Dentistry	Procedure	600	1
47	Complete Denture (Upper)	طقم أسنان كامل علوي	Dentistry	Procedure	2000	1
48	Complete Denture (Lower)	طقم أسنان كامل سفلي	Dentistry	Procedure	2000	1
49	Partial Denture (Acrylic)	طقم جزئي أكريليك	Dentistry	Procedure	1200	1
50	Partial Denture (Metal Frame)	طقم جزئي معدني	Dentistry	Procedure	2500	1
51	Dental Implant (Single)	زراعة سن واحد	Dentistry	Procedure	4000	1
52	Implant Abutment	دعامة زرعة	Dentistry	Procedure	1500	1
53	Implant Crown	تاج على زرعة	Dentistry	Procedure	1500	1
54	Gingivectomy	قص لثة	Dentistry	Procedure	400	1
55	Gum Treatment (Curettage)	علاج لثة (كحت)	Dentistry	Procedure	300	1
56	Frenectomy	قطع لجام	Dentistry	Procedure	400	1
57	Teeth Whitening (Office)	تبييض أسنان عيادي	Dentistry	Procedure	1000	1
58	Teeth Whitening (Home Kit)	تبييض أسنان منزلي	Dentistry	Procedure	500	1
59	Fluoride Application	تطبيق فلورايد	Dentistry	Procedure	100	1
60	Sealant (per tooth)	مانع تسوس (للسن)	Dentistry	Procedure	100	1
61	Orthodontic Consultation	استشارة تقويم	Dentistry	Consultation	200	1
62	Metal Braces (Full)	تقويم معدني كامل	Dentistry	Procedure	8000	1
63	Ceramic Braces (Full)	تقويم خزفي كامل	Dentistry	Procedure	10000	1
64	Clear Aligners (Invisalign)	تقويم شفاف	Dentistry	Procedure	15000	1
65	Retainer	مثبت تقويم	Dentistry	Procedure	500	1
66	Space Maintainer	حافظ مسافة	Dentistry	Procedure	400	1
67	Pulpotomy (Pediatric)	بتر لب (أطفال)	Dentistry	Procedure	300	1
68	Stainless Steel Crown (Pediatric)	تاج معدني أطفال	Dentistry	Procedure	400	1
69	Night Guard	واقي ليلي	Dentistry	Procedure	600	1
70	Sport Guard	واقي رياضي	Dentistry	Procedure	400	1
71	TMJ Treatment	علاج مفصل الفك	Dentistry	Procedure	500	1
72	Incision & Drainage (Dental)	شق وتصريف سني	Dentistry	Procedure	300	1
73	Internal Medicine Consultation	استشارة باطنية	Internal Medicine	Consultation	200	1
74	Follow-up Visit	زيارة متابعة باطنية	Internal Medicine	Consultation	150	1
75	Diabetes Management	إدارة السكري	Internal Medicine	Consultation	200	1
76	Hypertension Management	إدارة ضغط الدم	Internal Medicine	Consultation	200	1
77	Thyroid Assessment	تقييم الغدة الدرقية	Internal Medicine	Consultation	200	1
78	Liver Disease Management	إدارة أمراض الكبد	Internal Medicine	Consultation	250	1
79	Kidney Disease Management	إدارة أمراض الكلى	Internal Medicine	Consultation	250	1
80	Rheumatology Consultation	استشارة روماتيزم	Internal Medicine	Consultation	250	1
81	Holter Monitor Setup	تركيب هولتر	Internal Medicine	Diagnostic	300	1
82	Spirometry	فحص وظائف الرئة	Internal Medicine	Diagnostic	200	1
83	Pleural Tap (Thoracentesis)	بزل صدري	Internal Medicine	Procedure	500	1
84	Ascitic Tap (Paracentesis)	بزل بطني	Internal Medicine	Procedure	500	1
85	Joint Aspiration	بزل مفصل	Internal Medicine	Procedure	400	1
86	Bone Marrow Biopsy	خزعة نخاع عظم	Internal Medicine	Procedure	800	1
87	Cardiology Consultation	استشارة قلب	Cardiology	Consultation	300	1
88	Cardiology Follow-up	متابعة قلب	Cardiology	Consultation	200	1
89	ECG (12-Lead)	تخطيط قلب كهربائي	Cardiology	Diagnostic	100	1
90	Echocardiography	إيكو قلب	Cardiology	Diagnostic	500	1
91	Stress ECG (Treadmill)	تخطيط قلب بالمجهود	Cardiology	Diagnostic	400	1
92	Holter Monitor (24h)	هولتر 24 ساعة	Cardiology	Diagnostic	400	1
93	Ambulatory BP Monitor (24h)	مراقبة ضغط متنقل	Cardiology	Diagnostic	300	1
94	Cardiac Catheterization	قسطرة قلبية	Cardiology	Procedure	5000	1
95	Pacemaker Check	فحص منظم ضربات	Cardiology	Diagnostic	300	1
96	Dermatology Consultation	استشارة جلدية	Dermatology	Consultation	200	1
97	Dermatology Follow-up	متابعة جلدية	Dermatology	Consultation	150	1
98	Skin Biopsy	خزعة جلد	Dermatology	Procedure	400	1
99	Cryotherapy	علاج بالتبريد	Dermatology	Procedure	300	1
100	Electrocautery	كي كهربائي	Dermatology	Procedure	300	1
101	Mole Removal	إزالة شامة	Dermatology	Procedure	500	1
102	Wart Removal	إزالة ثؤلول	Dermatology	Procedure	300	1
103	Skin Tag Removal	إزالة زوائد جلدية	Dermatology	Procedure	200	1
104	Acne Treatment	علاج حب الشباب	Dermatology	Procedure	300	1
105	Chemical Peeling	تقشير كيميائي	Dermatology	Procedure	500	1
106	Laser Treatment	علاج بالليزر	Dermatology	Procedure	800	1
107	Laser Hair Removal (Session)	إزالة شعر بالليزر	Dermatology	Procedure	500	1
108	PRP Injection (Skin/Hair)	حقن بلازما	Dermatology	Procedure	800	1
109	Botox Injection	حقن بوتوكس	Dermatology	Procedure	1200	1
110	Filler Injection	حقن فيلر	Dermatology	Procedure	1500	1
111	Mesotherapy	ميزوثيرابي	Dermatology	Procedure	600	1
112	Vitiligo Treatment	علاج بهاق	Dermatology	Procedure	400	1
113	Psoriasis Treatment	علاج صدفية	Dermatology	Procedure	400	1
114	Eczema Treatment	علاج إكزيما	Dermatology	Procedure	300	1
115	Fungal Infection Treatment	علاج فطريات	Dermatology	Procedure	200	1
116	Patch Test (Allergy)	فحص رقعة حساسية	Dermatology	Diagnostic	300	1
117	Wood Lamp Examination	فحص مصباح وود	Dermatology	Diagnostic	100	1
118	Dermoscopy	فحص ديرموسكوبي	Dermatology	Diagnostic	150	1
119	Ophthalmology Consultation	استشارة عيون	Ophthalmology	Consultation	200	1
120	Ophthalmology Follow-up	متابعة عيون	Ophthalmology	Consultation	150	1
121	Comprehensive Eye Exam	فحص عيون شامل	Ophthalmology	Diagnostic	300	1
122	Refraction Test	فحص نظر	Ophthalmology	Diagnostic	100	1
123	Tonometry (IOP)	قياس ضغط العين	Ophthalmology	Diagnostic	100	1
124	Visual Field Test	فحص مجال الرؤية	Ophthalmology	Diagnostic	200	1
125	Fundoscopy	فحص قاع العين	Ophthalmology	Diagnostic	150	1
126	OCT Scan	تصوير مقطعي للعين	Ophthalmology	Diagnostic	300	1
127	Fluorescein Angiography	تصوير أوعية العين	Ophthalmology	Diagnostic	400	1
128	Slit Lamp Examination	فحص المصباح الشقي	Ophthalmology	Diagnostic	100	1
129	Contact Lens Fitting	تركيب عدسات لاصقة	Ophthalmology	Service	200	1
130	Foreign Body Removal (Eye)	إزالة جسم غريب من العين	Ophthalmology	Procedure	200	1
131	Chalazion Excision	استئصال كالزيون	Ophthalmology	Procedure	500	1
132	Pterygium Surgery	جراحة ظفرة	Ophthalmology	Procedure	2000	1
133	Cataract Surgery (Phaco)	عملية ساد (فاكو)	Ophthalmology	Procedure	5000	1
134	LASIK Consultation	استشارة ليزك	Ophthalmology	Consultation	300	1
135	LASIK Surgery	عملية ليزك	Ophthalmology	Procedure	8000	1
136	Intravitreal Injection	حقن داخل العين	Ophthalmology	Procedure	2000	1
137	Glaucoma Screening	فحص الجلوكوما	Ophthalmology	Diagnostic	200	1
138	Diabetic Eye Screening	فحص عيون لمرضى السكري	Ophthalmology	Diagnostic	250	1
139	Lacrimal Duct Probing	تسليك قناة دمعية	Ophthalmology	Procedure	800	1
140	Eyelid Surgery	جراحة جفن	Ophthalmology	Procedure	3000	1
141	ENT Consultation	استشارة أنف وأذن وحنجرة	ENT	Consultation	200	1
142	ENT Follow-up	متابعة أنف وأذن	ENT	Consultation	150	1
143	Audiometry	فحص سمع	ENT	Diagnostic	200	1
144	Tympanometry	قياس طبلة الأذن	ENT	Diagnostic	150	1
145	Nasal Endoscopy	منظار أنف	ENT	Diagnostic	300	1
146	Laryngoscopy	منظار حنجرة	ENT	Diagnostic	400	1
147	Ear Wax Removal (Irrigation)	تنظيف شمع الأذن	ENT	Procedure	150	1
148	Ear Wax Removal (Micro-suction)	إزالة شمع بالشفط	ENT	Procedure	200	1
149	Foreign Body Removal (Ear)	إزالة جسم غريب من الأذن	ENT	Procedure	200	1
150	Foreign Body Removal (Nose)	إزالة جسم غريب من الأنف	ENT	Procedure	200	1
151	Nasal Cauterization	كي أنفي	ENT	Procedure	250	1
152	Anterior Nasal Packing	حشو أنفي أمامي	ENT	Procedure	200	1
153	Tonsillectomy	استئصال اللوزتين	ENT	Procedure	3000	1
154	Adenoidectomy	استئصال اللحمية	ENT	Procedure	2500	1
155	Septoplasty	تعديل الحاجز الأنفي	ENT	Procedure	5000	1
156	Turbinate Reduction	تصغير القرنيات	ENT	Procedure	3000	1
157	Myringotomy with Tube	أنبوب طبلة	ENT	Procedure	2000	1
158	Tympanoplasty	ترقيع طبلة	ENT	Procedure	5000	1
159	Hearing Aid Fitting	تركيب سماعة	ENT	Service	500	1
160	Speech Therapy Session	جلسة علاج نطق	ENT	Therapy	200	1
161	Vertigo Assessment	تقييم الدوار	ENT	Diagnostic	250	1
162	Sleep Study Referral	إحالة دراسة نوم	ENT	Service	200	1
163	Orthopedics Consultation	استشارة عظام	Orthopedics	Consultation	200	1
164	Orthopedics Follow-up	متابعة عظام	Orthopedics	Consultation	150	1
165	Cast Application	تجبير	Orthopedics	Procedure	300	1
166	Cast Removal	إزالة جبس	Orthopedics	Procedure	100	1
167	Splint Application	تجبير مؤقت	Orthopedics	Procedure	200	1
168	Fracture Reduction (Closed)	رد كسر مغلق	Orthopedics	Procedure	800	1
169	Joint Injection	حقن مفصل	Orthopedics	Procedure	400	1
170	Trigger Point Injection	حقن نقطة الزناد	Orthopedics	Procedure	300	1
171	PRP Injection (Joint)	حقن بلازما للمفاصل	Orthopedics	Procedure	1000	1
172	Knee Aspiration	بزل ركبة	Orthopedics	Procedure	400	1
173	Carpal Tunnel Release	تحرير نفق الرسغ	Orthopedics	Procedure	3000	1
174	Trigger Finger Release	تحرير إصبع زنادي	Orthopedics	Procedure	2000	1
175	ACL Reconstruction	إعادة بناء رباط صليبي	Orthopedics	Procedure	15000	1
176	Meniscus Surgery	جراحة غضروف	Orthopedics	Procedure	8000	1
177	Hip Replacement	استبدال مفصل ورك	Orthopedics	Procedure	30000	1
178	Knee Replacement	استبدال مفصل ركبة	Orthopedics	Procedure	25000	1
179	Arthroscopy	منظار مفصل	Orthopedics	Procedure	5000	1
180	Physical Therapy Session	جلسة علاج طبيعي	Orthopedics	Therapy	200	1
181	TENS Therapy	علاج كهربائي	Orthopedics	Therapy	150	1
182	Ultrasound Therapy	علاج بالموجات	Orthopedics	Therapy	150	1
183	Spinal Injection	حقن العمود الفقري	Orthopedics	Procedure	1500	1
184	Bone Density Test (Referral)	إحالة فحص كثافة عظم	Orthopedics	Service	100	1
185	OB/GYN Consultation	استشارة نساء وولادة	Obstetrics	Consultation	200	1
186	OB/GYN Follow-up	متابعة نساء	Obstetrics	Consultation	150	1
187	Prenatal Visit	زيارة حمل	Obstetrics	Consultation	200	1
188	Postpartum Visit	زيارة ما بعد الولادة	Obstetrics	Consultation	200	1
189	Pap Smear	مسحة عنق الرحم	Obstetrics	Diagnostic	150	1
190	Obstetric Ultrasound	سونار حمل	Obstetrics	Diagnostic	250	1
191	Fetal Heart Monitoring (NST)	مراقبة نبض الجنين	Obstetrics	Diagnostic	200	1
192	Colposcopy	منظار عنق الرحم	Obstetrics	Diagnostic	400	1
193	IUD Insertion	تركيب لولب	Obstetrics	Procedure	500	1
194	IUD Removal	إزالة لولب	Obstetrics	Procedure	300	1
195	Contraceptive Implant	غرسة منع حمل	Obstetrics	Procedure	800	1
196	Hormonal Injection (Contraceptive)	حقنة منع حمل	Obstetrics	Procedure	150	1
197	Cervical Biopsy	خزعة عنق الرحم	Obstetrics	Procedure	500	1
198	Endometrial Biopsy	خزعة بطانة الرحم	Obstetrics	Procedure	600	1
199	Hysteroscopy	منظار رحمي	Obstetrics	Procedure	3000	1
200	D&C (Dilation & Curettage)	كحت رحم	Obstetrics	Procedure	2000	1
201	Cesarean Section	عملية قيصرية	Obstetrics	Procedure	8000	1
202	Normal Delivery	ولادة طبيعية	Obstetrics	Procedure	5000	1
203	Episiotomy Repair	خياطة شق عجاني	Obstetrics	Procedure	500	1
204	Breast Examination	فحص ثدي	Obstetrics	Diagnostic	150	1
205	Fertility Consultation	استشارة خصوبة	Obstetrics	Consultation	300	1
206	Ovulation Induction	تحفيز تبويض	Obstetrics	Procedure	500	1
207	Polycystic Ovary Treatment	علاج تكيس المبايض	Obstetrics	Consultation	250	1
208	Pediatric Consultation	استشارة أطفال	Pediatrics	Consultation	150	1
209	Pediatric Follow-up	متابعة أطفال	Pediatrics	Consultation	100	1
210	Well-Baby Visit	زيارة طفل سليم	Pediatrics	Consultation	150	1
211	Newborn Examination	فحص حديث ولادة	Pediatrics	Consultation	200	1
212	Vaccination (Standard)	تطعيم أساسي	Pediatrics	Procedure	100	1
213	Vaccination (Optional)	تطعيم اختياري	Pediatrics	Procedure	150	1
214	Growth Assessment	تقييم نمو	Pediatrics	Diagnostic	100	1
215	Developmental Screening	فحص تطور	Pediatrics	Diagnostic	150	1
216	Pediatric Nebulization	تبخير أطفال	Pediatrics	Procedure	80	1
217	Pediatric IV Fluid	محاليل وريدية أطفال	Pediatrics	Procedure	150	1
218	Circumcision	ختان	Pediatrics	Procedure	1000	1
219	Tongue Tie Release	قطع لجام اللسان	Pediatrics	Procedure	500	1
220	Allergy Testing (Pediatric)	فحص حساسية أطفال	Pediatrics	Diagnostic	300	1
221	Hearing Screening (Newborn)	فحص سمع حديثي الولادة	Pediatrics	Diagnostic	200	1
222	Jaundice Screening	فحص يرقان	Pediatrics	Diagnostic	100	1
223	Neurology Consultation	استشارة أعصاب	Neurology	Consultation	300	1
224	Neurology Follow-up	متابعة أعصاب	Neurology	Consultation	200	1
225	EEG (Electroencephalogram)	تخطيط دماغ	Neurology	Diagnostic	400	1
226	EMG / NCS	تخطيط عضلات وأعصاب	Neurology	Diagnostic	500	1
227	Lumbar Puncture	بزل قطني	Neurology	Procedure	800	1
228	Botox for Migraine	بوتوكس للصداع النصفي	Neurology	Procedure	1500	1
229	Nerve Block	حصار عصبي	Neurology	Procedure	600	1
230	Epilepsy Management	إدارة الصرع	Neurology	Consultation	250	1
231	Stroke Assessment	تقييم سكتة دماغية	Neurology	Diagnostic	400	1
232	Memory Assessment	تقييم ذاكرة	Neurology	Diagnostic	300	1
233	Headache Clinic	عيادة صداع	Neurology	Consultation	250	1
234	Psychiatry Consultation	استشارة نفسية	Psychiatry	Consultation	300	1
235	Psychiatry Follow-up	متابعة نفسية	Psychiatry	Consultation	200	1
236	Psychological Assessment	تقييم نفسي	Psychiatry	Diagnostic	500	1
237	Cognitive Behavioral Therapy	علاج سلوكي معرفي	Psychiatry	Therapy	300	1
238	Psychotherapy Session	جلسة علاج نفسي	Psychiatry	Therapy	300	1
239	Couple/Family Therapy	علاج أسري	Psychiatry	Therapy	400	1
240	ADHD Assessment	تقييم فرط الحركة	Psychiatry	Diagnostic	400	1
241	Addiction Counseling	استشارة إدمان	Psychiatry	Therapy	300	1
242	Psychiatric Report	تقرير نفسي	Psychiatry	Service	200	1
243	Urology Consultation	استشارة مسالك بولية	Urology	Consultation	200	1
244	Urology Follow-up	متابعة مسالك	Urology	Consultation	150	1
245	Cystoscopy	منظار مثانة	Urology	Diagnostic	1500	1
246	Urodynamic Study	دراسة ديناميكية بولية	Urology	Diagnostic	800	1
247	Prostate Exam (DRE)	فحص بروستاتا	Urology	Diagnostic	150	1
248	Urethral Dilation	توسيع إحليل	Urology	Procedure	500	1
249	Catheter Insertion/Removal	تركيب/إزالة قسطرة	Urology	Procedure	200	1
250	Circumcision (Adult)	ختان بالغين	Urology	Procedure	1500	1
251	Vasectomy	ربط قنوات منوية	Urology	Procedure	3000	1
252	ESWL (Kidney Stone)	تفتيت حصوات	Urology	Procedure	3000	1
253	Kidney Stone Management	إدارة حصوات الكلى	Urology	Consultation	250	1
254	Endocrinology Consultation	استشارة غدد صماء	Endocrinology	Consultation	250	1
255	Endocrinology Follow-up	متابعة غدد	Endocrinology	Consultation	200	1
256	Diabetes Education	تثقيف سكري	Endocrinology	Service	150	1
257	Insulin Pump Assessment	تقييم مضخة أنسولين	Endocrinology	Diagnostic	400	1
258	Thyroid Nodule FNA	خزعة عقدة درقية	Endocrinology	Procedure	800	1
259	Continuous Glucose Monitor	جهاز سكر مستمر	Endocrinology	Service	500	1
260	Growth Hormone Assessment	تقييم هرمون نمو	Endocrinology	Diagnostic	300	1
261	Osteoporosis Management	إدارة هشاشة العظام	Endocrinology	Consultation	200	1
262	Adrenal Assessment	تقييم غدة كظرية	Endocrinology	Diagnostic	300	1
263	Pituitary Assessment	تقييم غدة نخامية	Endocrinology	Diagnostic	300	1
264	GI Consultation	استشارة جهاز هضمي	Gastroenterology	Consultation	250	1
265	GI Follow-up	متابعة جهاز هضمي	Gastroenterology	Consultation	180	1
266	Upper GI Endoscopy (OGD)	منظار معدة علوي	Gastroenterology	Procedure	2000	1
267	Colonoscopy	منظار قولون	Gastroenterology	Procedure	2500	1
268	Liver Biopsy	خزعة كبد	Gastroenterology	Procedure	1500	1
269	H. Pylori Breath Test	فحص نفس جرثومة المعدة	Gastroenterology	Diagnostic	200	1
270	FibroScan	فايبروسكان كبد	Gastroenterology	Diagnostic	500	1
271	Hemorrhoid Treatment	علاج بواسير	Gastroenterology	Procedure	1000	1
272	Polypectomy	استئصال سليلة	Gastroenterology	Procedure	1500	1
273	PEG Tube Insertion	تركيب أنبوب تغذية	Gastroenterology	Procedure	3000	1
274	IBS Management	إدارة القولون العصبي	Gastroenterology	Consultation	200	1
275	Celiac Disease Screening	فحص حساسية القمح	Gastroenterology	Diagnostic	250	1
276	Pulmonology Consultation	استشارة صدرية	Pulmonology	Consultation	250	1
277	Pulmonology Follow-up	متابعة صدرية	Pulmonology	Consultation	180	1
278	Spirometry (PFT)	فحص وظائف رئة	Pulmonology	Diagnostic	200	1
279	Bronchoscopy	منظار قصبي	Pulmonology	Procedure	2500	1
280	Chest Tube Insertion	تركيب أنبوب صدري	Pulmonology	Procedure	1500	1
281	Pleural Biopsy	خزعة جنبية	Pulmonology	Procedure	1000	1
282	Asthma Management	إدارة ربو	Pulmonology	Consultation	200	1
283	COPD Management	إدارة انسداد رئوي	Pulmonology	Consultation	200	1
284	Sleep Study Interpretation	تفسير دراسة نوم	Pulmonology	Diagnostic	400	1
285	Oxygen Therapy Assessment	تقييم علاج أكسجين	Pulmonology	Diagnostic	200	1
286	Nephrology Consultation	استشارة كلى	Nephrology	Consultation	250	1
287	Nephrology Follow-up	متابعة كلى	Nephrology	Consultation	180	1
288	Dialysis Access Assessment	تقييم وصول غسيل	Nephrology	Diagnostic	300	1
289	Kidney Biopsy	خزعة كلى	Nephrology	Procedure	2000	1
290	Dialysis Session	جلسة غسيل كلى	Nephrology	Procedure	1000	1
291	Peritoneal Dialysis Setup	إعداد غسيل بريتوني	Nephrology	Procedure	1500	1
292	Electrolyte Management	إدارة الأملاح	Nephrology	Consultation	200	1
293	Surgery Consultation	استشارة جراحة	Surgery	Consultation	200	1
294	Surgery Follow-up	متابعة جراحة	Surgery	Consultation	150	1
295	Minor Surgery	جراحة صغرى	Surgery	Procedure	1000	1
296	Lipoma Excision	استئصال ورم دهني	Surgery	Procedure	1500	1
297	Sebaceous Cyst Excision	استئصال كيس دهني	Surgery	Procedure	1000	1
298	Hernia Repair	إصلاح فتق	Surgery	Procedure	5000	1
299	Appendectomy	استئصال زائدة	Surgery	Procedure	5000	1
300	Cholecystectomy (Lap)	استئصال مرارة بالمنظار	Surgery	Procedure	8000	1
301	Hemorrhoidectomy	استئصال بواسير	Surgery	Procedure	3000	1
302	Anal Fissure Surgery	جراحة شرخ شرجي	Surgery	Procedure	2000	1
303	Pilonidal Sinus Surgery	جراحة كيس شعري	Surgery	Procedure	3000	1
304	Breast Lump Excision	استئصال كتلة ثدي	Surgery	Procedure	3000	1
305	Thyroidectomy	استئصال غدة درقية	Surgery	Procedure	8000	1
306	Wound Debridement	تنظيف جرح جراحي	Surgery	Procedure	500	1
307	Drain Insertion/Removal	تركيب/إزالة درنقة	Surgery	Procedure	300	1
308	Skin Graft	ترقيع جلد	Surgery	Procedure	4000	1
309	Varicose Vein Surgery	جراحة دوالي	Surgery	Procedure	5000	1
310	Oncology Consultation	استشارة أورام	Oncology	Consultation	400	1
311	Oncology Follow-up	متابعة أورام	Oncology	Consultation	300	1
312	Chemotherapy Session	جلسة كيماوي	Oncology	Procedure	3000	1
313	Tumor Marker Review	مراجعة دلالات أورام	Oncology	Diagnostic	200	1
314	Port-a-Cath Care	رعاية منفذ وريدي	Oncology	Procedure	300	1
315	Bone Marrow Aspirate	شفط نخاع عظم	Oncology	Procedure	1000	1
316	Cancer Screening Package	حزمة فحص سرطان	Oncology	Diagnostic	500	1
317	Physiotherapy Assessment	تقييم علاج طبيعي	Physiotherapy	Consultation	200	1
318	Physiotherapy Session	جلسة علاج طبيعي	Physiotherapy	Therapy	200	1
319	Manual Therapy	علاج يدوي	Physiotherapy	Therapy	200	1
320	Hydrotherapy	علاج مائي	Physiotherapy	Therapy	250	1
321	Post-Surgical Rehab	تأهيل بعد جراحة	Physiotherapy	Therapy	250	1
322	Sports Injury Rehab	تأهيل إصابات رياضية	Physiotherapy	Therapy	250	1
323	Back Pain Program	برنامج آلام الظهر	Physiotherapy	Therapy	200	1
324	Neck Pain Program	برنامج آلام الرقبة	Physiotherapy	Therapy	200	1
325	Stroke Rehabilitation	تأهيل سكتة دماغية	Physiotherapy	Therapy	300	1
326	Nutrition Consultation	استشارة تغذية	Nutrition	Consultation	200	1
327	Nutrition Follow-up	متابعة تغذية	Nutrition	Consultation	150	1
328	Weight Management Program	برنامج إدارة وزن	Nutrition	Service	300	1
329	Diabetes Diet Program	برنامج غذائي للسكري	Nutrition	Service	250	1
330	Sports Nutrition Plan	تغذية رياضية	Nutrition	Service	250	1
331	Body Composition Analysis	تحليل تركيب الجسم	Nutrition	Diagnostic	100	1
332	Emergency Consultation	استشارة طوارئ	Emergency	Consultation	300	1
333	Resuscitation	إنعاش	Emergency	Procedure	1000	1
334	Fracture Splinting	تجبير كسور طوارئ	Emergency	Procedure	300	1
335	Laceration Repair	خياطة جرح طوارئ	Emergency	Procedure	300	1
336	Burn Dressing	ضماد حروق	Emergency	Procedure	200	1
337	Poisoning Management	إدارة تسمم	Emergency	Procedure	500	1
338	Snake/Insect Bite Treatment	علاج لدغات	Emergency	Procedure	300	1
\.


--
-- Data for Name: medications; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.medications (id, name, active_ingredient, stock_quantity, price) FROM stdin;
\.


--
-- Data for Name: mortuary_cases; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.mortuary_cases (id, patient_id, deceased_name, date_of_death, time_of_death, cause_of_death, icd_code, attending_physician, next_of_kin, next_of_kin_phone, autopsy_required, body_location, release_status, released_to, released_date, death_certificate_number, notes, created_at, tenant_id, facility_id) FROM stdin;
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
-- Data for Name: nutrition_assessments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.nutrition_assessments (id, patient_id, patient_name, assessment_date, height_cm, weight_kg, bmi, bmi_category, ideal_body_weight, caloric_needs, protein_needs, screening_score, malnutrition_risk, plan, assessed_by, created_at) FROM stdin;
\.


--
-- Data for Name: online_bookings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.online_bookings (id, patient_name, phone, email, department, doctor_name, preferred_date, preferred_time, status, source, notes, created_at, tenant_id) FROM stdin;
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
-- Data for Name: package_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.package_sessions (id, package_id, patient_id, session_number, session_date, status, notes, performed_by) FROM stdin;
\.


--
-- Data for Name: packages; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.packages (id, package_name_ar, package_name_en, department, total_sessions, price, is_active, created_at) FROM stdin;
\.


--
-- Data for Name: pathology_cases; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pathology_cases (id, patient_id, patient_name, specimen_type, collection_date, received_date, pathologist, gross_description, microscopic_findings, diagnosis, icd_code, stage, grade, status, report_date, notes, created_at, tenant_id, facility_id) FROM stdin;
\.


--
-- Data for Name: patient_drug_education; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.patient_drug_education (id, patient_id, patient_name, medication, instructions, side_effects, precautions, educated_by, created_at) FROM stdin;
\.


--
-- Data for Name: patient_referrals; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.patient_referrals (id, patient_id, patient_name, from_doctor_id, from_doctor, to_department, to_doctor, reason, urgency, status, notes, created_at, tenant_id, facility_id) FROM stdin;
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
-- Data for Name: pharmacy_drug_catalog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pharmacy_drug_catalog (id, drug_name, active_ingredient, barcode, category, unit, selling_price, cost_price, stock_qty, min_qty, expiry_date, is_active, tenant_id, branch_id) FROM stdin;
1	Panadol 500mg (Paracetamol)			Analgesic		8	0	200	5		1	1	1
2	Fevadol 500mg (Paracetamol)			Analgesic		6	0	200	5		1	1	1
3	Brufen 400mg (Ibuprofen)			NSAID		14	0	150	5		1	1	1
4	Brufen 600mg (Ibuprofen)			NSAID		20	0	100	5		1	1	1
5	Profenal 400mg (Ibuprofen)			NSAID		15	0	120	5		1	1	1
6	Voltaren 50mg (Diclofenac)			NSAID		19	0	130	5		1	1	1
7	Voltaren Emulgel 1% 100gm			NSAID		26	0	80	5		1	1	1
8	Cataflam 50mg (Diclofenac Potassium)			NSAID		18	0	100	5		1	1	1
9	Catafast 50mg Sachet 9pcs			NSAID		18	0	90	5		1	1	1
10	Rapidus 50mg (Diclofenac Potassium)			NSAID		29	0	80	5		1	1	1
11	Ponstan-Forte 500mg (Mefenamic Acid)			NSAID		15	0	90	5		1	1	1
12	Aspirin Protect 100mg			Blood Thinner		10	0	200	5		1	1	1
13	Jusprin 81mg (Aspirin)			Blood Thinner		8	0	250	5		1	1	1
14	Roxonin 60mg			NSAID		30	0	60	5		1	1	1
15	Advil Liquid Caps 200mg			NSAID		27	0	70	5		1	1	1
16	Panadol Extra Tablet 24pcs			Pain Relief		8	0	150	5		1	1	1
17	Panadol Night 20 Caplets			Pain Relief		12	0	100	5		1	1	1
18	Panadol Advance 24 Tablets			Pain Relief		6	0	200	5		1	1	1
19	Panadol Actifast 20 Tablets			Pain Relief		9	0	120	5		1	1	1
20	Panadol Extend 24 Tablets			Pain Relief		16	0	100	5		1	1	1
21	Panadol Cold & Flu Night 24 Caplets			Cough & Cold		12	0	100	5		1	1	1
22	Panadol Cold & Flu Sinus 24 Caplets			Cough & Cold		14	0	100	5		1	1	1
23	Panadol Cold & Flu All In One 24s			Cough & Cold		27	0	80	5		1	1	1
24	Solpadeine Soluble Tablet 20pcs			Pain Relief		13	0	80	5		1	1	1
25	Solpadeine Capsule 20pcs			Pain Relief		13	0	80	5		1	1	1
26	Adol Paracetamol 500mg 24 Caplets			Pain Relief		5	0	200	5		1	1	1
27	Adol-Extra Caplet 24pcs			Pain Relief		6	0	150	5		1	1	1
28	Fevadol-Extra Tablet 20pcs			Pain Relief		6	0	150	5		1	1	1
29	Fevadol-Plus Tablet 20pcs			Pain Relief		10	0	120	5		1	1	1
30	Salonpas Patches Small 20pcs			Pain Relief		13	0	100	5		1	1	1
31	Salonpas Patches Large 2pcs			Pain Relief		11	0	100	5		1	1	1
32	Relaxon Capsule 30pcs			Pain Relief		28	0	60	5		1	1	1
33	Reparil 20mg Tablet 40pcs			Pain Relief		21	0	70	5		1	1	1
34	Nexium 40mg (Esomeprazole)			PPI / Antacid		65	0	80	5		1	1	1
35	Pariet 20mg (Rabeprazole)			PPI / Antacid		55	0	70	5		1	1	1
36	Gaviscon Advance (Sodium Alginate)			Antacid		22	0	100	5		1	1	1
37	Ezora 40mg Esomeprazole 28 Caps			PPI / Antacid		66	0	60	5		1	1	1
38	Augmentin 1g (Amoxicillin/Clavulanate)			Antibiotic		45	0	100	5		1	1	1
39	Klavox 1g (Amoxicillin/Clavulanate)			Antibiotic		40	0	100	5		1	1	1
40	Amoxil 500mg (Amoxicillin)			Antibiotic		15	0	200	5		1	1	1
41	Suprax 400mg (Cefixime)			Antibiotic		55	0	80	5		1	1	1
42	Zinnat 500mg (Cefuroxime)			Antibiotic		50	0	80	5		1	1	1
43	Zithromax 500mg (Azithromycin)			Antibiotic		35	0	100	5		1	1	1
44	Ciprofloxacin 500mg			Antibiotic		20	0	120	5		1	1	1
45	Tavanic 500mg (Levofloxacin)			Antibiotic		65	0	60	5		1	1	1
46	Flagyl 500mg (Metronidazole)			Antiprotozoal		12	0	150	5		1	1	1
47	Lipitor 20mg (Atorvastatin)			Cholesterol		45	0	80	5		1	1	1
48	Crestor 10mg (Rosuvastatin)			Cholesterol		55	0	80	5		1	1	1
49	Glucophage 500mg (Metformin)			Diabetes		15	0	200	5		1	1	1
50	Diamicron MR 60mg (Gliclazide)			Diabetes		35	0	100	5		1	1	1
51	Januvia 100mg (Sitagliptin)			Diabetes		95	0	60	5		1	1	1
52	Amaryl 2mg (Glimepiride)			Diabetes		25	0	100	5		1	1	1
53	Concor 5mg (Bisoprolol)			Blood Pressure		30	0	100	5		1	1	1
54	Diovan 160mg (Valsartan)			Blood Pressure		55	0	80	5		1	1	1
55	Exforge 5/160mg (Amlodipine/Valsartan)			Blood Pressure		65	0	60	5		1	1	1
56	Micardis 80mg (Telmisartan)			Blood Pressure		55	0	80	5		1	1	1
57	Amlor 5mg (Amlodipine)			Blood Pressure		20	0	120	5		1	1	1
58	Lasix 40mg (Furosemide)			Diuretic		8	0	200	5		1	1	1
59	Zyrtec 10mg (Cetirizine)			Antihistamine		15	0	150	5		1	1	1
60	Clarinex 5mg (Desloratadine)			Antihistamine		20	0	120	5		1	1	1
61	Aerius 5mg (Desloratadine)			Antihistamine		25	0	100	5		1	1	1
62	Telfast 120mg (Fexofenadine)			Antihistamine		22	0	120	5		1	1	1
63	Singulair 10mg (Montelukast)			Asthma		40	0	80	5		1	1	1
64	Symbicort 160/4.5 (Budesonide/Formoterol)			Asthma Inhaler		95	0	50	5		1	1	1
65	Ventolin Evohaler 100mcg (Salbutamol)			Asthma Inhaler		18	0	150	5		1	1	1
66	Eltroxin 50mcg (Thyroxine)			Thyroid		12	0	200	5		1	1	1
67	Cortiment 9mg (Budesonide)			Corticosteroid		60	0	50	5		1	1	1
68	Predo 5mg (Prednisolone)			Corticosteroid		10	0	150	5		1	1	1
69	Rinza (Paracetamol/Pseudoephedrine)			Cold & Flu		15	0	100	5		1	1	1
70	Fludrex Tablet 24pcs			Cold & Flu		12	0	120	5		1	1	1
71	Prof Cold & Flu Caplet 20pcs			Cold & Flu		12	0	100	5		1	1	1
72	Flutab Tablet 30pcs			Cold & Flu		15	0	100	5		1	1	1
73	Flutab-Sinus Tablet 20pcs			Cold & Flu		9	0	100	5		1	1	1
74	Beatswell Probiotic 60 Capsules			Digestive Care		29	0	50	5		1	1	1
75	Bio Gaia Protectis Baby Drops 5ml			Digestive Care		64	0	40	5		1	1	1
76	Beatswell Multivitamins for Adults 60 Gummies			Vitamins & Supplements		49	0	60	5		1	1	1
77	Beatswell Kids Multivitamins 60 Gummies			Vitamins & Supplements		37	0	70	5		1	1	1
78	Sanotact Multivitamin 20 Effervescent			Vitamins & Supplements		25	0	80	5		1	1	1
79	Voltaren 100mg Suppository 5pcs			NSAID		18	0	60	5		1	1	1
80	Voltaren 50mg Suppository 10pcs			NSAID		20	0	60	5		1	1	1
81	Procto Glyvenol Cream 30gm			Hemorrhoids		35	0	50	5		1	1	1
82	Disprin 81mg Tablet 100pcs			Blood Thinner		25	0	80	5		1	1	1
83	Panadrex Paracetamol 500mg 48 Tablets			Pain Relief		9	0	100	5		1	1	1
84	Divido 75mg Capsule 20pcs			NSAID		31	0	60	5		1	1	1
85	Rofenac 50mg Tablet 20pcs			NSAID		20	0	80	5		1	1	1
86	Rofenac-D 50mg Dispersable 20pcs			NSAID		30	0	70	5		1	1	1
87	Emifenac 50mg Tablet 20pcs			NSAID		23	0	80	5		1	1	1
88	Sapofen 400mg Tablet 30pcs			NSAID		14	0	90	5		1	1	1
89	Sapofen 600mg Tablet 30pcs			NSAID		17	0	80	5		1	1	1
90	Fast Flam 50mg Tablet 20pcs			NSAID		27	0	70	5		1	1	1
\.


--
-- Data for Name: pharmacy_opening_balances; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pharmacy_opening_balances (id, drug_id, qty, unit_cost, expiry_date, batch_number, entry_date, tenant_id, branch_id) FROM stdin;
\.


--
-- Data for Name: pharmacy_prescriptions_queue; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pharmacy_prescriptions_queue (id, patient_id, doctor_id, clinic_name, prescription_text, status, dispensed_by, dispensed_at, created_at, tenant_id, branch_id, doctor) FROM stdin;
\.


--
-- Data for Name: pharmacy_purchase_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pharmacy_purchase_items (id, purchase_id, drug_id, qty, unit_cost, bonus_qty, discount, expiry_date, batch_number, tenant_id) FROM stdin;
\.


--
-- Data for Name: pharmacy_purchase_orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pharmacy_purchase_orders (id, supplier_id, order_date, total_amount, discount, bonus_value, status, notes, created_at, tenant_id, branch_id) FROM stdin;
\.


--
-- Data for Name: pharmacy_sale_items; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pharmacy_sale_items (id, sale_id, drug_id, qty, unit_price, total_price, bonus_qty, discount, tenant_id) FROM stdin;
\.


--
-- Data for Name: pharmacy_sales; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pharmacy_sales (id, patient_id, sale_type, total_amount, discount, insurance_coverage, patient_share, payment_method, cashier, invoice_number, created_at, tenant_id, branch_id) FROM stdin;
\.


--
-- Data for Name: pharmacy_suppliers; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.pharmacy_suppliers (id, company_name, contact_person, phone, email, address, tax_number, notes, tenant_id) FROM stdin;
\.


--
-- Data for Name: portal_appointments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.portal_appointments (id, patient_id, portal_user_id, department, preferred_date, preferred_time, reason, status, notes, created_at, tenant_id) FROM stdin;
\.


--
-- Data for Name: portal_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.portal_users (id, patient_id, username, password_hash, email, phone, is_active, last_login, created_at) FROM stdin;
\.


--
-- Data for Name: prescriptions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.prescriptions (id, patient_id, doctor_id, medication_id, dosage, duration, status, created_at, tenant_id, facility_id) FROM stdin;
\.


--
-- Data for Name: quality_incidents; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.quality_incidents (id, incident_type, severity, incident_date, incident_time, department, location, patient_id, patient_name, description, immediate_action, reported_by, assigned_to, root_cause, corrective_action, preventive_action, status, closed_date, created_at, tenant_id) FROM stdin;
\.


--
-- Data for Name: quality_kpis; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.quality_kpis (id, kpi_name, kpi_name_ar, category, target_value, actual_value, unit, period, department, status, notes, created_at, tenant_id) FROM stdin;
\.


--
-- Data for Name: quality_patient_satisfaction; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.quality_patient_satisfaction (id, patient_id, patient_name, department, survey_date, overall_rating, cleanliness, staff_courtesy, wait_time, communication, pain_management, food_quality, comments, would_recommend, created_at, tenant_id) FROM stdin;
\.


--
-- Data for Name: queue_advertisements; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.queue_advertisements (id, title, image_path, display_order, duration_seconds, is_active, created_at, tenant_id) FROM stdin;
\.


--
-- Data for Name: radiology_catalog; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.radiology_catalog (id, modality, exact_name, default_template, price) FROM stdin;
1	X-Ray	X-Ray Chest (PA)		100
2	X-Ray	X-Ray Chest (Lateral)		100
3	X-Ray	X-Ray Abdomen (KUB)		100
4	X-Ray	X-Ray Abdomen (Erect)		100
5	X-Ray	X-Ray Cervical Spine (AP/Lat)		120
6	X-Ray	X-Ray Thoracic Spine		120
7	X-Ray	X-Ray Lumbar Spine (AP/Lat)		120
8	X-Ray	X-Ray Lumbosacral Spine		120
9	X-Ray	X-Ray Pelvis (AP)		100
10	X-Ray	X-Ray Hip (AP/Lat)		100
11	X-Ray	X-Ray Shoulder		100
12	X-Ray	X-Ray Elbow		100
13	X-Ray	X-Ray Wrist		100
14	X-Ray	X-Ray Hand		100
15	X-Ray	X-Ray Fingers		80
16	X-Ray	X-Ray Knee (AP/Lat)		100
17	X-Ray	X-Ray Ankle		100
18	X-Ray	X-Ray Foot		100
19	X-Ray	X-Ray Toes		80
20	X-Ray	X-Ray Skull (AP/Lat)		120
21	X-Ray	X-Ray Facial Bones		120
22	X-Ray	X-Ray Nasal Bones		100
23	X-Ray	X-Ray Sinuses (Waters View)		100
24	X-Ray	X-Ray Mandible		100
25	X-Ray	X-Ray Panoramic (OPG)		150
26	X-Ray	X-Ray Clavicle		100
27	X-Ray	X-Ray Ribs		100
28	X-Ray	X-Ray Sacrum/Coccyx		100
29	X-Ray	X-Ray Both Knees (Standing)		150
30	X-Ray	X-Ray Scapula		100
31	X-Ray	X-Ray Forearm		100
32	X-Ray	X-Ray Humerus		100
33	X-Ray	X-Ray Femur		100
34	X-Ray	X-Ray Tibia/Fibula		100
35	CT	CT Brain (Non-contrast)		500
36	CT	CT Brain (With Contrast)		700
37	CT	CT Brain (With & Without Contrast)		800
38	CT	CT Orbits		500
39	CT	CT Sinuses		400
40	CT	CT Temporal Bones		500
41	CT	CT Neck		500
42	CT	CT Chest (Non-contrast)		500
43	CT	CT Chest (With Contrast)		700
44	CT	CT Chest High Resolution (HRCT)		600
45	CT	CT Abdomen (Non-contrast)		500
46	CT	CT Abdomen (With Contrast)		700
47	CT	CT Pelvis		500
48	CT	CT Abdomen & Pelvis (With Contrast)		800
49	CT	CT KUB (Renal Stone Protocol)		500
50	CT	CT Cervical Spine		500
51	CT	CT Thoracic Spine		500
52	CT	CT Lumbar Spine		500
53	CT	CT Angiography - Brain (CTA)		900
54	CT	CT Angiography - Neck		900
55	CT	CT Angiography - Chest (PE Protocol)		900
56	CT	CT Angiography - Abdominal Aorta		900
57	CT	CT Angiography - Lower Limbs		900
58	CT	CT Angiography - Coronary (CCTA)		1200
59	CT	CT Angiography - Renal		900
60	CT	CT Enterography		800
61	CT	CT Colonography (Virtual Colonoscopy)		800
62	CT	CT Urography		700
63	CT	CT Guided Biopsy		1000
64	CT	CT 3D Reconstruction		400
65	MRI	MRI Brain (Non-contrast)		800
66	MRI	MRI Brain (With Contrast)		1000
67	MRI	MRI Brain & MRA (Angiography)		1200
68	MRI	MRI Orbits		800
69	MRI	MRI Internal Auditory Canal (IAC)		800
70	MRI	MRI Pituitary		800
71	MRI	MRI Temporomandibular Joint (TMJ)		800
72	MRI	MRI Neck		800
73	MRI	MRI Cervical Spine		800
74	MRI	MRI Thoracic Spine		800
75	MRI	MRI Lumbar Spine		800
76	MRI	MRI Whole Spine		1500
77	MRI	MRI Sacroiliac Joints		800
78	MRI	MRI Shoulder		800
79	MRI	MRI Elbow		800
80	MRI	MRI Wrist		800
81	MRI	MRI Hand		800
82	MRI	MRI Hip		800
83	MRI	MRI Knee		800
84	MRI	MRI Ankle		800
85	MRI	MRI Foot		800
86	MRI	MRI Abdomen		900
87	MRI	MRI Pelvis		900
88	MRI	MRI Liver (Hepatocyte-specific)		1000
89	MRI	MRI MRCP (Biliary)		1000
90	MRI	MRI Prostate (Multiparametric)		1200
91	MRI	MRI Breast (Bilateral)		1200
92	MRI	MRI Cardiac (CMR)		1500
93	MRI	MRI Enterography		1000
94	MRI	MRI Fetal		1000
95	MRI	MRI Brachial Plexus		800
96	MRI	MRA - Head (Intracranial)		1000
97	MRI	MRA - Neck (Carotid)		1000
98	MRI	MRA - Abdominal		1000
99	MRI	MRA - Lower Limbs		1000
100	MRI	MRV - Brain (Venography)		1000
101	Ultrasound	US Abdomen (Complete)		200
102	Ultrasound	US Abdomen (Limited)		150
103	Ultrasound	US Pelvis (Transabdominal)		200
104	Ultrasound	US Pelvis (Transvaginal)		250
105	Ultrasound	US Thyroid		200
106	Ultrasound	US Breast (Bilateral)		250
107	Ultrasound	US Breast (Unilateral)		200
108	Ultrasound	US Obstetric (1st Trimester)		200
109	Ultrasound	US Obstetric (2nd/3rd Trimester)		250
110	Ultrasound	US Obstetric (Growth Scan)		300
111	Ultrasound	US Obstetric (Anomaly Scan - Level II)		400
112	Ultrasound	US Renal		200
113	Ultrasound	US Bladder (Pre/Post Void)		200
114	Ultrasound	US Scrotal		200
115	Ultrasound	US Soft Tissue		150
116	Ultrasound	US Musculoskeletal		200
117	Ultrasound	US Joint		200
118	Ultrasound	US Neonatal Brain (Cranial)		250
119	Ultrasound	US Hip (Infant)		200
120	Ultrasound	US Guided Biopsy		500
121	Ultrasound	US Guided Aspiration		400
122	Ultrasound	Doppler - Carotid		300
123	Ultrasound	Doppler - Lower Limb Arterial		300
124	Ultrasound	Doppler - Lower Limb Venous (DVT)		300
125	Ultrasound	Doppler - Upper Limb		300
126	Ultrasound	Doppler - Renal		300
127	Ultrasound	Doppler - Portal Vein/Hepatic		300
128	Ultrasound	Doppler - Testicular		250
129	Ultrasound	Doppler - Fetal		300
130	Ultrasound	US Elastography (Liver)		350
131	Mammography	Mammography (Screening - Bilateral)		400
132	Mammography	Mammography (Diagnostic)		450
133	Mammography	Tomosynthesis (3D Mammography)		500
134	Mammography	Mammography with Spot Compression		450
135	Mammography	Stereotactic Breast Biopsy		1000
136	DEXA	DEXA Bone Densitometry (Spine & Hip)		350
137	DEXA	DEXA Forearm		250
138	DEXA	DEXA Whole Body Composition		400
139	Echo	Echocardiography (TTE - Transthoracic)		400
140	Echo	Echocardiography (TEE - Transesophageal)		800
141	Echo	Stress Echocardiography		600
142	Echo	Fetal Echocardiography		500
143	Fluoroscopy	Barium Swallow		300
144	Fluoroscopy	Barium Meal		350
145	Fluoroscopy	Barium Enema		400
146	Fluoroscopy	Small Bowel Follow Through		350
147	Fluoroscopy	Voiding Cystourethrogram (VCUG)		350
148	Fluoroscopy	Hysterosalpingography (HSG)		500
149	Fluoroscopy	IVP/IVU (Intravenous Pyelogram)		400
150	Fluoroscopy	Fistulography		400
151	Fluoroscopy	Arthrography		500
152	Nuclear Medicine	Bone Scan (Whole Body)		600
153	Nuclear Medicine	Thyroid Scan & Uptake		500
154	Nuclear Medicine	Renal Scan (DTPA/MAG3)		500
155	Nuclear Medicine	DMSA Renal Scan		500
156	Nuclear Medicine	Cardiac Perfusion Scan (SPECT)		1000
157	Nuclear Medicine	Lung Perfusion/Ventilation Scan (V/Q)		600
158	Nuclear Medicine	Hepatobiliary Scan (HIDA)		600
159	Nuclear Medicine	GI Bleeding Scan		600
160	Nuclear Medicine	Gastric Emptying Study		500
161	Nuclear Medicine	Parathyroid Scan (Sestamibi)		600
162	Nuclear Medicine	Sentinel Lymph Node Scan		600
163	Nuclear Medicine	Gallium Scan		700
164	PET/CT	PET/CT (FDG - Whole Body)		3000
165	PET/CT	PET/CT (Brain)		2500
166	PET/CT	PET/CT (Cardiac)		2500
167	Interventional	Angiography (Diagnostic)		2000
168	Interventional	Angioplasty		5000
169	Interventional	Image-Guided Drainage		1500
170	Interventional	Embolization		5000
171	Interventional	Port-a-Cath Insertion		3000
172	Interventional	PICC Line Insertion		1500
173	Interventional	Nephrostomy		2000
174	Interventional	Biliary Drainage (PTBD)		3000
175	Interventional	Vertebroplasty		5000
176	Interventional	Radiofrequency Ablation (RFA)		5000
177	Interventional	TIPS Procedure		8000
178	Interventional	Uterine Fibroid Embolization		6000
179	X-Ray	X-Ray Sternum		100
180	X-Ray	X-Ray Acromioclavicular Joint		100
181	X-Ray	X-Ray Whole Spine (Scoliosis)		200
182	X-Ray	X-Ray Bone Age (Left Hand)		150
183	X-Ray	X-Ray Soft Tissue Neck (Lateral)		100
184	X-Ray	X-Ray Mastoid (Towne View)		120
185	X-Ray	X-Ray Orbit		120
186	X-Ray	X-Ray Zygomatic Arch		100
187	X-Ray	X-Ray TMJ		120
188	X-Ray	X-Ray Both Hips (Frog Leg)		150
189	X-Ray	X-Ray Leg Length (Scanogram)		200
190	X-Ray	X-Ray Chest (AP Portable)		100
191	X-Ray	X-Ray Chest (Decubitus)		120
192	X-Ray	X-Ray Abdomen (Supine & Erect)		150
193	X-Ray	X-Ray Calcaneus		80
194	X-Ray	X-Ray Patella		80
195	CT	CT Maxillofacial		500
196	CT	CT Jaw (Dental CT / Cone Beam)		400
197	CT	CT Chest/Abdomen/Pelvis (Triple Phase)		1000
198	CT	CT Liver (Triple Phase)		800
199	CT	CT Pancreas Protocol		700
200	CT	CT Adrenal Protocol		600
201	CT	CT Shoulder		500
202	CT	CT Hip		500
203	CT	CT Knee		500
204	CT	CT Ankle/Foot		500
205	CT	CT Wrist/Hand		500
206	CT	CT Elbow		500
207	CT	CT Calcium Scoring (Heart)		500
208	CT	CT Perfusion - Brain (Stroke)		1000
209	CT	CT Aortography		900
210	CT	CT Whole Body (Trauma Protocol)		1200
211	CT	CT Cisternography		800
212	MRI	MRI Plexus (Lumbosacral)		800
213	MRI	MRI Peripheral Nerve		800
214	MRI	MRI Rectal		900
215	MRI	MRI Pancreas		900
216	MRI	MRI Adrenal		800
217	MRI	MRI Arthrogram - Shoulder		1200
218	MRI	MRI Arthrogram - Hip		1200
219	MRI	MRI Arthrogram - Wrist		1200
220	MRI	MRI Diffusion Tensor Imaging (DTI)		1200
221	MRI	MRI Spectroscopy (Brain)		1500
222	MRI	MRI Functional (fMRI)		1500
223	MRI	MRI Small Bowel		900
224	MRI	MRI Defecography		800
225	MRI	MRI Spleen		800
226	MRI	MRI Whole Body (Screening)		2000
227	MRI	MRA - Renal		1000
228	MRI	MRA - Upper Limbs		1000
229	MRI	MRA - Aorta		1200
230	Ultrasound	US Appendix		200
231	Ultrasound	US Gallbladder		150
232	Ultrasound	US Liver		150
233	Ultrasound	US Spleen		150
234	Ultrasound	US Pancreas		200
235	Ultrasound	US Lymph Nodes		200
236	Ultrasound	US Salivary Glands		200
237	Ultrasound	US Parathyroid		200
238	Ultrasound	US Chest Wall		150
239	Ultrasound	US Penile Doppler		350
240	Ultrasound	US Transfontanelle		250
241	Ultrasound	US Pyloric Stenosis		200
242	Ultrasound	US Umbilical Doppler		300
243	Ultrasound	US Uterine Artery Doppler		300
244	Ultrasound	US Middle Cerebral Artery Doppler		300
245	Ultrasound	US Biophysical Profile (BPP)		300
246	Ultrasound	US Cervical Length		200
247	Ultrasound	US Nuchal Translucency		300
248	Ultrasound	US 4D/3D Obstetric		400
249	Ultrasound	US Endoanal/Endorectal		400
250	Ultrasound	US Guided Thyroid FNA		500
251	Ultrasound	US Guided Breast FNA		500
252	Ultrasound	US Guided Liver Biopsy		600
253	Ultrasound	US Guided Renal Biopsy		600
254	Ultrasound	Doppler - AV Fistula Mapping		350
255	Ultrasound	Doppler - Abdominal Aorta		300
256	Ultrasound	Doppler - Transcranial (TCD)		400
257	Mammography	Mammography with CAD (Computer-Aided)		500
258	Mammography	Breast MRI Guided Biopsy		1500
259	Mammography	Galactography		400
260	Mammography	Ductography		400
261	DEXA	DEXA Body Fat Analysis		300
262	DEXA	DEXA Pediatric		300
263	DEXA	DEXA Vertebral Fracture Assessment		350
264	Echo	Dobutamine Stress Echo		700
265	Echo	Contrast Echocardiography		600
266	Echo	3D Echocardiography		600
267	Echo	Strain Echocardiography		500
268	Nuclear Medicine	WBC Labeled Scan (Infection)		700
269	Nuclear Medicine	Octreotide Scan (Neuroendocrine)		800
270	Nuclear Medicine	MIBG Scan		800
271	Nuclear Medicine	Meckel Scan		500
272	Nuclear Medicine	Lymphoscintigraphy		600
273	Nuclear Medicine	Brain Perfusion SPECT		800
274	Nuclear Medicine	DaTSCAN (Dopamine Transport)		1500
275	Nuclear Medicine	I-131 Whole Body Scan		700
276	Nuclear Medicine	I-131 Therapy (Thyroid)		2000
277	Nuclear Medicine	Ra-223 Therapy (Bone Mets)		5000
278	Nuclear Medicine	Lu-177 PSMA Therapy		8000
279	Nuclear Medicine	Cisternography (CSF Leak)		700
280	Nuclear Medicine	Salivary Gland Scintigraphy		500
281	PET/CT	PET/CT (PSMA - Prostate)		3500
282	PET/CT	PET/CT (Ga-68 DOTATATE - NET)		3500
283	PET/CT	PET/CT (Amyloid Brain)		3000
284	PET/CT	PET/CT (F-18 NaF Bone)		2500
285	PET/CT	PET/MRI		4000
286	Interventional	Transjugular Liver Biopsy		3000
287	Interventional	Carotid Stenting		8000
288	Interventional	Dialysis Access Creation		3000
289	Interventional	Thrombolysis (IR)		5000
290	Interventional	IVC Filter Placement		4000
291	Interventional	IVC Filter Retrieval		3000
292	Interventional	Thoracentesis (IR-guided)		1000
293	Interventional	Paracentesis (IR-guided)		1000
294	Interventional	Joint Injection (IR-guided)		800
295	Interventional	Epidural Injection (IR-guided)		1500
296	Interventional	Facet Joint Injection		1500
297	Interventional	Nerve Block (IR-guided)		1200
298	Interventional	Kyphoplasty		6000
299	Interventional	Cryoablation		5000
300	Interventional	Microwave Ablation		5000
301	Interventional	Chemoembolization (TACE)		8000
302	Interventional	Radioembolization (Y-90)		10000
303	Interventional	Sclerotherapy		2000
304	Interventional	Varicocele Embolization		4000
305	Interventional	Pelvic Congestion Embolization		5000
\.


--
-- Data for Name: rehab_assessments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rehab_assessments (id, rehab_patient_id, patient_id, assessment_type, rom_scores, strength_scores, functional_scores, balance_scores, pain_level, assessor, created_at) FROM stdin;
\.


--
-- Data for Name: rehab_goals; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rehab_goals (id, rehab_patient_id, goal_description, target_date, progress, status, notes) FROM stdin;
\.


--
-- Data for Name: rehab_patients; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rehab_patients (id, patient_id, patient_name, diagnosis, referral_source, therapist, therapy_type, start_date, target_end_date, status, notes, created_at) FROM stdin;
\.


--
-- Data for Name: rehab_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.rehab_sessions (id, rehab_patient_id, patient_id, session_date, session_number, therapist, session_type, exercises, duration_minutes, pain_before, pain_after, progress_notes, status, created_at) FROM stdin;
\.


--
-- Data for Name: social_work_cases; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.social_work_cases (id, patient_id, patient_name, case_type, social_worker, assessment, plan, interventions, referrals, status, priority, follow_up_date, notes, created_at, tenant_id, facility_id) FROM stdin;
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
-- Data for Name: system_users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.system_users (id, username, password_hash, display_name, role, speciality, permissions, commission_type, commission_value, is_active, created_at, last_ip) FROM stdin;
1	admin	$2b$12$RGXj..JVoLyk1sSE2T1L1e2sbPbQ9WaNxudwsLD/5fQm9loKrnQ9K	المدير العام	Admin			percentage	0	1	2026-06-19 01:16:54.796675	::1
\.


--
-- Data for Name: telemedicine_sessions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.telemedicine_sessions (id, patient_id, patient_name, doctor, speciality, session_type, scheduled_date, scheduled_time, duration_minutes, meeting_link, diagnosis, prescription, status, notes, created_at, tenant_id, facility_id) FROM stdin;
\.


--
-- Data for Name: tenant_lab_test_overrides; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tenant_lab_test_overrides (id, tenant_id, test_id, custom_price, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: tenant_radiology_overrides; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tenant_radiology_overrides (id, tenant_id, radiology_id, custom_price, custom_template, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: tenant_service_overrides; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tenant_service_overrides (id, tenant_id, service_id, custom_price, is_active, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: tenant_settings; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tenant_settings (id, tenant_id, setting_key, setting_value) FROM stdin;
\.


--
-- Data for Name: tenants; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.tenants (id, name, subdomain, status, plan_type, created_at) FROM stdin;
1	Nama Medical Default Tenant	default	active	standard	2026-06-19 01:16:54.792609
2	Tenant B	tenant-b	active	standard	2026-06-19 05:23:28.370103
\.


--
-- Data for Name: transport_requests; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transport_requests (id, patient_id, patient_name, from_location, to_location, transport_type, priority, requested_by, assigned_porter, request_time, pickup_time, dropoff_time, special_needs, status, notes, tenant_id, branch_id) FROM stdin;
\.


--
-- Data for Name: user_facilities; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_facilities (id, user_id, facility_id, branch_id, is_primary, created_at) FROM stdin;
1	1	1	1	t	2026-06-19 01:16:54.798869
\.


--
-- Data for Name: user_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_permissions (id, user_id, module_name, can_view, can_add, can_edit, can_delete, can_print) FROM stdin;
\.


--
-- Data for Name: user_tenants; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.user_tenants (id, user_id, tenant_id, is_active, created_at) FROM stdin;
1	1	1	t	2026-06-19 01:16:54.797561
\.


--
-- Data for Name: waiting_queue; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.waiting_queue (id, patient_id, patient_name, doctor, department, status, check_in_time, tenant_id, branch_id) FROM stdin;
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
-- Data for Name: zatca_invoices; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.zatca_invoices (id, invoice_id, invoice_number, invoice_type, seller_name, seller_vat, buyer_name, buyer_vat, total_before_vat, vat_amount, total_with_vat, qr_code, xml_hash, submission_status, submission_date, zatca_response, created_at, tenant_id, facility_id, branch_id) FROM stdin;
\.


--
-- Name: admission_daily_rounds_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admission_daily_rounds_id_seq', 1, false);


--
-- Name: admissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.admissions_id_seq', 1, false);


--
-- Name: appointments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.appointments_id_seq', 8, true);


--
-- Name: approvals_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.approvals_id_seq', 1, false);


--
-- Name: audit_trail_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.audit_trail_id_seq', 23, true);


--
-- Name: bed_transfers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.bed_transfers_id_seq', 1, false);


--
-- Name: beds_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.beds_id_seq', 95, true);


--
-- Name: blood_bank_crossmatch_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.blood_bank_crossmatch_id_seq', 1, false);


--
-- Name: blood_bank_donors_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.blood_bank_donors_id_seq', 1, false);


--
-- Name: blood_bank_transfusions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.blood_bank_transfusions_id_seq', 1, false);


--
-- Name: blood_bank_units_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.blood_bank_units_id_seq', 1, false);


--
-- Name: branches_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.branches_id_seq', 2, false);


--
-- Name: clinical_pharmacy_reviews_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.clinical_pharmacy_reviews_id_seq', 1, false);


--
-- Name: cme_activities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cme_activities_id_seq', 1, false);


--
-- Name: cme_registrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cme_registrations_id_seq', 1, false);


--
-- Name: consent_forms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.consent_forms_id_seq', 1, false);


--
-- Name: cosmetic_cases_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cosmetic_cases_id_seq', 1, false);


--
-- Name: cosmetic_consents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cosmetic_consents_id_seq', 1, false);


--
-- Name: cosmetic_followups_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cosmetic_followups_id_seq', 1, false);


--
-- Name: cosmetic_photos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cosmetic_photos_id_seq', 1, false);


--
-- Name: cosmetic_procedures_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cosmetic_procedures_id_seq', 375, true);


--
-- Name: cssd_instrument_sets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cssd_instrument_sets_id_seq', 1, false);


--
-- Name: cssd_load_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cssd_load_items_id_seq', 1, false);


--
-- Name: cssd_sterilization_cycles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.cssd_sterilization_cycles_id_seq', 1, false);


--
-- Name: daily_close_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.daily_close_id_seq', 1, false);


--
-- Name: dental_records_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.dental_records_id_seq', 1, false);


--
-- Name: departments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.departments_id_seq', 1, false);


--
-- Name: diet_meals_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.diet_meals_id_seq', 1, false);


--
-- Name: diet_orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.diet_orders_id_seq', 1, false);


--
-- Name: discount_rules_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.discount_rules_id_seq', 1, false);


--
-- Name: doctor_inventory_request_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.doctor_inventory_request_items_id_seq', 1, false);


--
-- Name: doctor_inventory_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.doctor_inventory_requests_id_seq', 1, false);


--
-- Name: drug_interactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.drug_interactions_id_seq', 1, false);


--
-- Name: emar_administrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.emar_administrations_id_seq', 1, false);


--
-- Name: emar_orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.emar_orders_id_seq', 1, false);


--
-- Name: emergency_beds_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.emergency_beds_id_seq', 8, true);


--
-- Name: emergency_trauma_assessments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.emergency_trauma_assessments_id_seq', 1, false);


--
-- Name: emergency_visits_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.emergency_visits_id_seq', 1, false);


--
-- Name: employee_exposures_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.employee_exposures_id_seq', 1, false);


--
-- Name: employees_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.employees_id_seq', 3, true);


--
-- Name: facilities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.facilities_id_seq', 2, false);


--
-- Name: finance_chart_of_accounts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.finance_chart_of_accounts_id_seq', 1, false);


--
-- Name: finance_cost_centers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.finance_cost_centers_id_seq', 1, false);


--
-- Name: finance_doctor_commissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.finance_doctor_commissions_id_seq', 1, false);


--
-- Name: finance_fiscal_years_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.finance_fiscal_years_id_seq', 1, false);


--
-- Name: finance_journal_entries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.finance_journal_entries_id_seq', 1, false);


--
-- Name: finance_journal_lines_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.finance_journal_lines_id_seq', 1, false);


--
-- Name: finance_tax_declarations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.finance_tax_declarations_id_seq', 1, false);


--
-- Name: finance_vouchers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.finance_vouchers_id_seq', 1, false);


--
-- Name: form_templates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.form_templates_id_seq', 1, false);


--
-- Name: hand_hygiene_audits_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.hand_hygiene_audits_id_seq', 1, false);


--
-- Name: hr_advances_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.hr_advances_id_seq', 1, false);


--
-- Name: hr_attendance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.hr_attendance_id_seq', 1, false);


--
-- Name: hr_employee_custody_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.hr_employee_custody_id_seq', 1, false);


--
-- Name: hr_employee_documents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.hr_employee_documents_id_seq', 1, false);


--
-- Name: hr_employees_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.hr_employees_id_seq', 1, false);


--
-- Name: hr_leaves_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.hr_leaves_id_seq', 1, false);


--
-- Name: hr_salaries_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.hr_salaries_id_seq', 1, false);


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
-- Name: infection_outbreaks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.infection_outbreaks_id_seq', 1, false);


--
-- Name: infection_surveillance_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.infection_surveillance_id_seq', 1, false);


--
-- Name: insurance_claims_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.insurance_claims_id_seq', 3, true);


--
-- Name: insurance_companies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.insurance_companies_id_seq', 1, false);


--
-- Name: insurance_contracts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.insurance_contracts_id_seq', 1, false);


--
-- Name: insurance_policies_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.insurance_policies_id_seq', 1, false);


--
-- Name: integration_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.integration_settings_id_seq', 1, false);


--
-- Name: internal_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.internal_messages_id_seq', 1, false);


--
-- Name: inventory_dept_request_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inventory_dept_request_items_id_seq', 1, false);


--
-- Name: inventory_dept_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inventory_dept_requests_id_seq', 1, false);


--
-- Name: inventory_issue_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inventory_issue_items_id_seq', 1, false);


--
-- Name: inventory_issue_to_dept_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inventory_issue_to_dept_id_seq', 1, false);


--
-- Name: inventory_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inventory_items_id_seq', 1, false);


--
-- Name: inventory_opening_balances_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inventory_opening_balances_id_seq', 1, false);


--
-- Name: inventory_purchase_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inventory_purchase_items_id_seq', 1, false);


--
-- Name: inventory_purchases_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inventory_purchases_id_seq', 1, false);


--
-- Name: inventory_stock_count_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.inventory_stock_count_id_seq', 1, false);


--
-- Name: invoices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.invoices_id_seq', 11, true);


--
-- Name: lab_radiology_orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lab_radiology_orders_id_seq', 1, false);


--
-- Name: lab_results_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lab_results_id_seq', 1, false);


--
-- Name: lab_samples_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lab_samples_id_seq', 1, false);


--
-- Name: lab_tests_catalog_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.lab_tests_catalog_id_seq', 455, true);


--
-- Name: maintenance_equipment_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.maintenance_equipment_id_seq', 1, false);


--
-- Name: maintenance_pm_schedules_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.maintenance_pm_schedules_id_seq', 1, false);


--
-- Name: maintenance_work_orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.maintenance_work_orders_id_seq', 1, false);


--
-- Name: medical_certificates_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.medical_certificates_id_seq', 1, false);


--
-- Name: medical_records_coding_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.medical_records_coding_id_seq', 1, false);


--
-- Name: medical_records_files_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.medical_records_files_id_seq', 1, false);


--
-- Name: medical_records_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.medical_records_id_seq', 1, false);


--
-- Name: medical_records_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.medical_records_requests_id_seq', 1, false);


--
-- Name: medical_services_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.medical_services_id_seq', 338, true);


--
-- Name: medications_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.medications_id_seq', 1, false);


--
-- Name: mortuary_cases_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.mortuary_cases_id_seq', 1, false);


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
-- Name: nutrition_assessments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.nutrition_assessments_id_seq', 1, false);


--
-- Name: online_bookings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.online_bookings_id_seq', 1, false);


--
-- Name: operating_rooms_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.operating_rooms_id_seq', 4, true);


--
-- Name: package_sessions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.package_sessions_id_seq', 1, false);


--
-- Name: packages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.packages_id_seq', 1, false);


--
-- Name: pathology_cases_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pathology_cases_id_seq', 1, false);


--
-- Name: patient_drug_education_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.patient_drug_education_id_seq', 1, false);


--
-- Name: patient_referrals_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.patient_referrals_id_seq', 1, false);


--
-- Name: patients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.patients_id_seq', 23, true);


--
-- Name: pharmacy_drug_catalog_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pharmacy_drug_catalog_id_seq', 90, true);


--
-- Name: pharmacy_opening_balances_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pharmacy_opening_balances_id_seq', 1, false);


--
-- Name: pharmacy_prescriptions_queue_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pharmacy_prescriptions_queue_id_seq', 1, false);


--
-- Name: pharmacy_purchase_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pharmacy_purchase_items_id_seq', 1, false);


--
-- Name: pharmacy_purchase_orders_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pharmacy_purchase_orders_id_seq', 1, false);


--
-- Name: pharmacy_sale_items_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pharmacy_sale_items_id_seq', 1, false);


--
-- Name: pharmacy_sales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pharmacy_sales_id_seq', 1, false);


--
-- Name: pharmacy_suppliers_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.pharmacy_suppliers_id_seq', 1, false);


--
-- Name: portal_appointments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.portal_appointments_id_seq', 1, false);


--
-- Name: portal_users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.portal_users_id_seq', 1, false);


--
-- Name: prescriptions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.prescriptions_id_seq', 1, false);


--
-- Name: quality_incidents_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.quality_incidents_id_seq', 1, false);


--
-- Name: quality_kpis_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.quality_kpis_id_seq', 1, false);


--
-- Name: quality_patient_satisfaction_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.quality_patient_satisfaction_id_seq', 1, false);


--
-- Name: queue_advertisements_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.queue_advertisements_id_seq', 1, false);


--
-- Name: radiology_catalog_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.radiology_catalog_id_seq', 305, true);


--
-- Name: rehab_assessments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rehab_assessments_id_seq', 1, false);


--
-- Name: rehab_goals_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rehab_goals_id_seq', 1, false);


--
-- Name: rehab_patients_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rehab_patients_id_seq', 1, false);


--
-- Name: rehab_sessions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.rehab_sessions_id_seq', 1, false);


--
-- Name: social_work_cases_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.social_work_cases_id_seq', 1, false);


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
-- Name: system_users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.system_users_id_seq', 25, true);


--
-- Name: telemedicine_sessions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.telemedicine_sessions_id_seq', 1, false);


--
-- Name: tenant_lab_test_overrides_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tenant_lab_test_overrides_id_seq', 13, true);


--
-- Name: tenant_radiology_overrides_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tenant_radiology_overrides_id_seq', 10, true);


--
-- Name: tenant_service_overrides_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tenant_service_overrides_id_seq', 1, false);


--
-- Name: tenant_settings_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tenant_settings_id_seq', 1, false);


--
-- Name: tenants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.tenants_id_seq', 3, false);


--
-- Name: transport_requests_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transport_requests_id_seq', 1, false);


--
-- Name: user_facilities_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_facilities_id_seq', 25, true);


--
-- Name: user_permissions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_permissions_id_seq', 1, false);


--
-- Name: user_tenants_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_tenants_id_seq', 25, true);


--
-- Name: waiting_queue_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.waiting_queue_id_seq', 1, false);


--
-- Name: wards_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.wards_id_seq', 9, true);


--
-- Name: zatca_invoices_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.zatca_invoices_id_seq', 1, false);


--
-- Name: admission_daily_rounds admission_daily_rounds_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admission_daily_rounds
    ADD CONSTRAINT admission_daily_rounds_pkey PRIMARY KEY (id);


--
-- Name: admissions admissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.admissions
    ADD CONSTRAINT admissions_pkey PRIMARY KEY (id);


--
-- Name: appointments appointments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appointments_pkey PRIMARY KEY (id);


--
-- Name: approvals approvals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.approvals
    ADD CONSTRAINT approvals_pkey PRIMARY KEY (id);


--
-- Name: audit_trail audit_trail_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.audit_trail
    ADD CONSTRAINT audit_trail_pkey PRIMARY KEY (id);


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
-- Name: blood_bank_crossmatch blood_bank_crossmatch_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blood_bank_crossmatch
    ADD CONSTRAINT blood_bank_crossmatch_pkey PRIMARY KEY (id);


--
-- Name: blood_bank_donors blood_bank_donors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blood_bank_donors
    ADD CONSTRAINT blood_bank_donors_pkey PRIMARY KEY (id);


--
-- Name: blood_bank_transfusions blood_bank_transfusions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blood_bank_transfusions
    ADD CONSTRAINT blood_bank_transfusions_pkey PRIMARY KEY (id);


--
-- Name: blood_bank_units blood_bank_units_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blood_bank_units
    ADD CONSTRAINT blood_bank_units_pkey PRIMARY KEY (id);


--
-- Name: branches branches_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.branches
    ADD CONSTRAINT branches_pkey PRIMARY KEY (id);


--
-- Name: clinical_pharmacy_reviews clinical_pharmacy_reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.clinical_pharmacy_reviews
    ADD CONSTRAINT clinical_pharmacy_reviews_pkey PRIMARY KEY (id);


--
-- Name: cme_activities cme_activities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cme_activities
    ADD CONSTRAINT cme_activities_pkey PRIMARY KEY (id);


--
-- Name: cme_registrations cme_registrations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cme_registrations
    ADD CONSTRAINT cme_registrations_pkey PRIMARY KEY (id);


--
-- Name: company_settings company_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.company_settings
    ADD CONSTRAINT company_settings_pkey PRIMARY KEY (setting_key);


--
-- Name: consent_forms consent_forms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.consent_forms
    ADD CONSTRAINT consent_forms_pkey PRIMARY KEY (id);


--
-- Name: cosmetic_cases cosmetic_cases_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cosmetic_cases
    ADD CONSTRAINT cosmetic_cases_pkey PRIMARY KEY (id);


--
-- Name: cosmetic_consents cosmetic_consents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cosmetic_consents
    ADD CONSTRAINT cosmetic_consents_pkey PRIMARY KEY (id);


--
-- Name: cosmetic_followups cosmetic_followups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cosmetic_followups
    ADD CONSTRAINT cosmetic_followups_pkey PRIMARY KEY (id);


--
-- Name: cosmetic_photos cosmetic_photos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cosmetic_photos
    ADD CONSTRAINT cosmetic_photos_pkey PRIMARY KEY (id);


--
-- Name: cosmetic_procedures cosmetic_procedures_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cosmetic_procedures
    ADD CONSTRAINT cosmetic_procedures_pkey PRIMARY KEY (id);


--
-- Name: cssd_instrument_sets cssd_instrument_sets_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cssd_instrument_sets
    ADD CONSTRAINT cssd_instrument_sets_pkey PRIMARY KEY (id);


--
-- Name: cssd_load_items cssd_load_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cssd_load_items
    ADD CONSTRAINT cssd_load_items_pkey PRIMARY KEY (id);


--
-- Name: cssd_sterilization_cycles cssd_sterilization_cycles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.cssd_sterilization_cycles
    ADD CONSTRAINT cssd_sterilization_cycles_pkey PRIMARY KEY (id);


--
-- Name: daily_close daily_close_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.daily_close
    ADD CONSTRAINT daily_close_pkey PRIMARY KEY (id);


--
-- Name: dental_records dental_records_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.dental_records
    ADD CONSTRAINT dental_records_pkey PRIMARY KEY (id);


--
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (id);


--
-- Name: diet_meals diet_meals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diet_meals
    ADD CONSTRAINT diet_meals_pkey PRIMARY KEY (id);


--
-- Name: diet_orders diet_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diet_orders
    ADD CONSTRAINT diet_orders_pkey PRIMARY KEY (id);


--
-- Name: discount_rules discount_rules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.discount_rules
    ADD CONSTRAINT discount_rules_pkey PRIMARY KEY (id);


--
-- Name: doctor_inventory_request_items doctor_inventory_request_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctor_inventory_request_items
    ADD CONSTRAINT doctor_inventory_request_items_pkey PRIMARY KEY (id);


--
-- Name: doctor_inventory_requests doctor_inventory_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctor_inventory_requests
    ADD CONSTRAINT doctor_inventory_requests_pkey PRIMARY KEY (id);


--
-- Name: drug_interactions drug_interactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.drug_interactions
    ADD CONSTRAINT drug_interactions_pkey PRIMARY KEY (id);


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
-- Name: emergency_beds emergency_beds_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emergency_beds
    ADD CONSTRAINT emergency_beds_pkey PRIMARY KEY (id);


--
-- Name: emergency_trauma_assessments emergency_trauma_assessments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emergency_trauma_assessments
    ADD CONSTRAINT emergency_trauma_assessments_pkey PRIMARY KEY (id);


--
-- Name: emergency_visits emergency_visits_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.emergency_visits
    ADD CONSTRAINT emergency_visits_pkey PRIMARY KEY (id);


--
-- Name: employee_exposures employee_exposures_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employee_exposures
    ADD CONSTRAINT employee_exposures_pkey PRIMARY KEY (id);


--
-- Name: employees employees_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.employees
    ADD CONSTRAINT employees_pkey PRIMARY KEY (id);


--
-- Name: facilities facilities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.facilities
    ADD CONSTRAINT facilities_pkey PRIMARY KEY (id);


--
-- Name: finance_chart_of_accounts finance_chart_of_accounts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.finance_chart_of_accounts
    ADD CONSTRAINT finance_chart_of_accounts_pkey PRIMARY KEY (id);


--
-- Name: finance_cost_centers finance_cost_centers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.finance_cost_centers
    ADD CONSTRAINT finance_cost_centers_pkey PRIMARY KEY (id);


--
-- Name: finance_doctor_commissions finance_doctor_commissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.finance_doctor_commissions
    ADD CONSTRAINT finance_doctor_commissions_pkey PRIMARY KEY (id);


--
-- Name: finance_fiscal_years finance_fiscal_years_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.finance_fiscal_years
    ADD CONSTRAINT finance_fiscal_years_pkey PRIMARY KEY (id);


--
-- Name: finance_journal_entries finance_journal_entries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.finance_journal_entries
    ADD CONSTRAINT finance_journal_entries_pkey PRIMARY KEY (id);


--
-- Name: finance_journal_lines finance_journal_lines_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.finance_journal_lines
    ADD CONSTRAINT finance_journal_lines_pkey PRIMARY KEY (id);


--
-- Name: finance_tax_declarations finance_tax_declarations_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.finance_tax_declarations
    ADD CONSTRAINT finance_tax_declarations_pkey PRIMARY KEY (id);


--
-- Name: finance_vouchers finance_vouchers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.finance_vouchers
    ADD CONSTRAINT finance_vouchers_pkey PRIMARY KEY (id);


--
-- Name: form_templates form_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.form_templates
    ADD CONSTRAINT form_templates_pkey PRIMARY KEY (id);


--
-- Name: hand_hygiene_audits hand_hygiene_audits_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hand_hygiene_audits
    ADD CONSTRAINT hand_hygiene_audits_pkey PRIMARY KEY (id);


--
-- Name: hr_advances hr_advances_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hr_advances
    ADD CONSTRAINT hr_advances_pkey PRIMARY KEY (id);


--
-- Name: hr_attendance hr_attendance_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hr_attendance
    ADD CONSTRAINT hr_attendance_pkey PRIMARY KEY (id);


--
-- Name: hr_employee_custody hr_employee_custody_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hr_employee_custody
    ADD CONSTRAINT hr_employee_custody_pkey PRIMARY KEY (id);


--
-- Name: hr_employee_documents hr_employee_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hr_employee_documents
    ADD CONSTRAINT hr_employee_documents_pkey PRIMARY KEY (id);


--
-- Name: hr_employees hr_employees_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hr_employees
    ADD CONSTRAINT hr_employees_pkey PRIMARY KEY (id);


--
-- Name: hr_leaves hr_leaves_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hr_leaves
    ADD CONSTRAINT hr_leaves_pkey PRIMARY KEY (id);


--
-- Name: hr_salaries hr_salaries_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.hr_salaries
    ADD CONSTRAINT hr_salaries_pkey PRIMARY KEY (id);


--
-- Name: icd10_codes icd10_codes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.icd10_codes
    ADD CONSTRAINT icd10_codes_pkey PRIMARY KEY (code);


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
-- Name: infection_outbreaks infection_outbreaks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.infection_outbreaks
    ADD CONSTRAINT infection_outbreaks_pkey PRIMARY KEY (id);


--
-- Name: infection_surveillance infection_surveillance_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.infection_surveillance
    ADD CONSTRAINT infection_surveillance_pkey PRIMARY KEY (id);


--
-- Name: insurance_claims insurance_claims_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.insurance_claims
    ADD CONSTRAINT insurance_claims_pkey PRIMARY KEY (id);


--
-- Name: insurance_companies insurance_companies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.insurance_companies
    ADD CONSTRAINT insurance_companies_pkey PRIMARY KEY (id);


--
-- Name: insurance_contracts insurance_contracts_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.insurance_contracts
    ADD CONSTRAINT insurance_contracts_pkey PRIMARY KEY (id);


--
-- Name: insurance_policies insurance_policies_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.insurance_policies
    ADD CONSTRAINT insurance_policies_pkey PRIMARY KEY (id);


--
-- Name: integration_settings integration_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.integration_settings
    ADD CONSTRAINT integration_settings_pkey PRIMARY KEY (id);


--
-- Name: internal_messages internal_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.internal_messages
    ADD CONSTRAINT internal_messages_pkey PRIMARY KEY (id);


--
-- Name: inventory_dept_request_items inventory_dept_request_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_dept_request_items
    ADD CONSTRAINT inventory_dept_request_items_pkey PRIMARY KEY (id);


--
-- Name: inventory_dept_requests inventory_dept_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_dept_requests
    ADD CONSTRAINT inventory_dept_requests_pkey PRIMARY KEY (id);


--
-- Name: inventory_issue_items inventory_issue_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_issue_items
    ADD CONSTRAINT inventory_issue_items_pkey PRIMARY KEY (id);


--
-- Name: inventory_issue_to_dept inventory_issue_to_dept_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_issue_to_dept
    ADD CONSTRAINT inventory_issue_to_dept_pkey PRIMARY KEY (id);


--
-- Name: inventory_items inventory_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_items
    ADD CONSTRAINT inventory_items_pkey PRIMARY KEY (id);


--
-- Name: inventory_opening_balances inventory_opening_balances_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_opening_balances
    ADD CONSTRAINT inventory_opening_balances_pkey PRIMARY KEY (id);


--
-- Name: inventory_purchase_items inventory_purchase_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_purchase_items
    ADD CONSTRAINT inventory_purchase_items_pkey PRIMARY KEY (id);


--
-- Name: inventory_purchases inventory_purchases_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_purchases
    ADD CONSTRAINT inventory_purchases_pkey PRIMARY KEY (id);


--
-- Name: inventory_stock_count inventory_stock_count_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.inventory_stock_count
    ADD CONSTRAINT inventory_stock_count_pkey PRIMARY KEY (id);


--
-- Name: invoices invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.invoices
    ADD CONSTRAINT invoices_pkey PRIMARY KEY (id);


--
-- Name: lab_radiology_orders lab_radiology_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lab_radiology_orders
    ADD CONSTRAINT lab_radiology_orders_pkey PRIMARY KEY (id);


--
-- Name: lab_results lab_results_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lab_results
    ADD CONSTRAINT lab_results_pkey PRIMARY KEY (id);


--
-- Name: lab_samples lab_samples_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lab_samples
    ADD CONSTRAINT lab_samples_pkey PRIMARY KEY (id);


--
-- Name: lab_tests_catalog lab_tests_catalog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lab_tests_catalog
    ADD CONSTRAINT lab_tests_catalog_pkey PRIMARY KEY (id);


--
-- Name: maintenance_equipment maintenance_equipment_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenance_equipment
    ADD CONSTRAINT maintenance_equipment_pkey PRIMARY KEY (id);


--
-- Name: maintenance_pm_schedules maintenance_pm_schedules_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenance_pm_schedules
    ADD CONSTRAINT maintenance_pm_schedules_pkey PRIMARY KEY (id);


--
-- Name: maintenance_work_orders maintenance_work_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.maintenance_work_orders
    ADD CONSTRAINT maintenance_work_orders_pkey PRIMARY KEY (id);


--
-- Name: medical_certificates medical_certificates_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medical_certificates
    ADD CONSTRAINT medical_certificates_pkey PRIMARY KEY (id);


--
-- Name: medical_records_coding medical_records_coding_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medical_records_coding
    ADD CONSTRAINT medical_records_coding_pkey PRIMARY KEY (id);


--
-- Name: medical_records_files medical_records_files_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medical_records_files
    ADD CONSTRAINT medical_records_files_pkey PRIMARY KEY (id);


--
-- Name: medical_records medical_records_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medical_records
    ADD CONSTRAINT medical_records_pkey PRIMARY KEY (id);


--
-- Name: medical_records_requests medical_records_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medical_records_requests
    ADD CONSTRAINT medical_records_requests_pkey PRIMARY KEY (id);


--
-- Name: medical_services medical_services_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medical_services
    ADD CONSTRAINT medical_services_pkey PRIMARY KEY (id);


--
-- Name: medications medications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medications
    ADD CONSTRAINT medications_pkey PRIMARY KEY (id);


--
-- Name: mortuary_cases mortuary_cases_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mortuary_cases
    ADD CONSTRAINT mortuary_cases_pkey PRIMARY KEY (id);


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
-- Name: nutrition_assessments nutrition_assessments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.nutrition_assessments
    ADD CONSTRAINT nutrition_assessments_pkey PRIMARY KEY (id);


--
-- Name: online_bookings online_bookings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.online_bookings
    ADD CONSTRAINT online_bookings_pkey PRIMARY KEY (id);


--
-- Name: operating_rooms operating_rooms_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.operating_rooms
    ADD CONSTRAINT operating_rooms_pkey PRIMARY KEY (id);


--
-- Name: package_sessions package_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.package_sessions
    ADD CONSTRAINT package_sessions_pkey PRIMARY KEY (id);


--
-- Name: packages packages_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.packages
    ADD CONSTRAINT packages_pkey PRIMARY KEY (id);


--
-- Name: pathology_cases pathology_cases_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pathology_cases
    ADD CONSTRAINT pathology_cases_pkey PRIMARY KEY (id);


--
-- Name: patient_drug_education patient_drug_education_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patient_drug_education
    ADD CONSTRAINT patient_drug_education_pkey PRIMARY KEY (id);


--
-- Name: patient_referrals patient_referrals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patient_referrals
    ADD CONSTRAINT patient_referrals_pkey PRIMARY KEY (id);


--
-- Name: patients patients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT patients_pkey PRIMARY KEY (id);


--
-- Name: pharmacy_drug_catalog pharmacy_drug_catalog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacy_drug_catalog
    ADD CONSTRAINT pharmacy_drug_catalog_pkey PRIMARY KEY (id);


--
-- Name: pharmacy_opening_balances pharmacy_opening_balances_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacy_opening_balances
    ADD CONSTRAINT pharmacy_opening_balances_pkey PRIMARY KEY (id);


--
-- Name: pharmacy_prescriptions_queue pharmacy_prescriptions_queue_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacy_prescriptions_queue
    ADD CONSTRAINT pharmacy_prescriptions_queue_pkey PRIMARY KEY (id);


--
-- Name: pharmacy_purchase_items pharmacy_purchase_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacy_purchase_items
    ADD CONSTRAINT pharmacy_purchase_items_pkey PRIMARY KEY (id);


--
-- Name: pharmacy_purchase_orders pharmacy_purchase_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacy_purchase_orders
    ADD CONSTRAINT pharmacy_purchase_orders_pkey PRIMARY KEY (id);


--
-- Name: pharmacy_sale_items pharmacy_sale_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacy_sale_items
    ADD CONSTRAINT pharmacy_sale_items_pkey PRIMARY KEY (id);


--
-- Name: pharmacy_sales pharmacy_sales_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacy_sales
    ADD CONSTRAINT pharmacy_sales_pkey PRIMARY KEY (id);


--
-- Name: pharmacy_suppliers pharmacy_suppliers_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.pharmacy_suppliers
    ADD CONSTRAINT pharmacy_suppliers_pkey PRIMARY KEY (id);


--
-- Name: portal_appointments portal_appointments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portal_appointments
    ADD CONSTRAINT portal_appointments_pkey PRIMARY KEY (id);


--
-- Name: portal_users portal_users_patient_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portal_users
    ADD CONSTRAINT portal_users_patient_id_key UNIQUE (patient_id);


--
-- Name: portal_users portal_users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.portal_users
    ADD CONSTRAINT portal_users_pkey PRIMARY KEY (id);


--
-- Name: prescriptions prescriptions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.prescriptions
    ADD CONSTRAINT prescriptions_pkey PRIMARY KEY (id);


--
-- Name: quality_incidents quality_incidents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quality_incidents
    ADD CONSTRAINT quality_incidents_pkey PRIMARY KEY (id);


--
-- Name: quality_kpis quality_kpis_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quality_kpis
    ADD CONSTRAINT quality_kpis_pkey PRIMARY KEY (id);


--
-- Name: quality_patient_satisfaction quality_patient_satisfaction_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.quality_patient_satisfaction
    ADD CONSTRAINT quality_patient_satisfaction_pkey PRIMARY KEY (id);


--
-- Name: queue_advertisements queue_advertisements_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.queue_advertisements
    ADD CONSTRAINT queue_advertisements_pkey PRIMARY KEY (id);


--
-- Name: radiology_catalog radiology_catalog_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.radiology_catalog
    ADD CONSTRAINT radiology_catalog_pkey PRIMARY KEY (id);


--
-- Name: rehab_assessments rehab_assessments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rehab_assessments
    ADD CONSTRAINT rehab_assessments_pkey PRIMARY KEY (id);


--
-- Name: rehab_goals rehab_goals_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rehab_goals
    ADD CONSTRAINT rehab_goals_pkey PRIMARY KEY (id);


--
-- Name: rehab_patients rehab_patients_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rehab_patients
    ADD CONSTRAINT rehab_patients_pkey PRIMARY KEY (id);


--
-- Name: rehab_sessions rehab_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rehab_sessions
    ADD CONSTRAINT rehab_sessions_pkey PRIMARY KEY (id);


--
-- Name: social_work_cases social_work_cases_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.social_work_cases
    ADD CONSTRAINT social_work_cases_pkey PRIMARY KEY (id);


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
-- Name: system_users system_users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_users
    ADD CONSTRAINT system_users_pkey PRIMARY KEY (id);


--
-- Name: system_users system_users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.system_users
    ADD CONSTRAINT system_users_username_key UNIQUE (username);


--
-- Name: telemedicine_sessions telemedicine_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.telemedicine_sessions
    ADD CONSTRAINT telemedicine_sessions_pkey PRIMARY KEY (id);


--
-- Name: tenant_lab_test_overrides tenant_lab_test_overrides_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenant_lab_test_overrides
    ADD CONSTRAINT tenant_lab_test_overrides_pkey PRIMARY KEY (id);


--
-- Name: tenant_radiology_overrides tenant_radiology_overrides_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenant_radiology_overrides
    ADD CONSTRAINT tenant_radiology_overrides_pkey PRIMARY KEY (id);


--
-- Name: tenant_service_overrides tenant_service_overrides_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenant_service_overrides
    ADD CONSTRAINT tenant_service_overrides_pkey PRIMARY KEY (id);


--
-- Name: tenant_settings tenant_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenant_settings
    ADD CONSTRAINT tenant_settings_pkey PRIMARY KEY (id);


--
-- Name: tenants tenants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenants
    ADD CONSTRAINT tenants_pkey PRIMARY KEY (id);


--
-- Name: tenants tenants_subdomain_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenants
    ADD CONSTRAINT tenants_subdomain_key UNIQUE (subdomain);


--
-- Name: transport_requests transport_requests_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transport_requests
    ADD CONSTRAINT transport_requests_pkey PRIMARY KEY (id);


--
-- Name: tenant_lab_test_overrides uq_tenant_lab_test; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenant_lab_test_overrides
    ADD CONSTRAINT uq_tenant_lab_test UNIQUE (tenant_id, test_id);


--
-- Name: tenant_radiology_overrides uq_tenant_radiology; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenant_radiology_overrides
    ADD CONSTRAINT uq_tenant_radiology UNIQUE (tenant_id, radiology_id);


--
-- Name: tenant_service_overrides uq_tenant_service; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenant_service_overrides
    ADD CONSTRAINT uq_tenant_service UNIQUE (tenant_id, service_id);


--
-- Name: tenant_settings uq_tenant_setting_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenant_settings
    ADD CONSTRAINT uq_tenant_setting_key UNIQUE (tenant_id, setting_key);


--
-- Name: user_facilities uq_user_facility_branch; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_facilities
    ADD CONSTRAINT uq_user_facility_branch UNIQUE (user_id, facility_id, branch_id);


--
-- Name: user_tenants uq_user_tenant; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_tenants
    ADD CONSTRAINT uq_user_tenant UNIQUE (user_id, tenant_id);


--
-- Name: user_facilities user_facilities_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_facilities
    ADD CONSTRAINT user_facilities_pkey PRIMARY KEY (id);


--
-- Name: user_permissions user_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_permissions
    ADD CONSTRAINT user_permissions_pkey PRIMARY KEY (id);


--
-- Name: user_tenants user_tenants_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_tenants
    ADD CONSTRAINT user_tenants_pkey PRIMARY KEY (id);


--
-- Name: waiting_queue waiting_queue_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.waiting_queue
    ADD CONSTRAINT waiting_queue_pkey PRIMARY KEY (id);


--
-- Name: wards wards_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.wards
    ADD CONSTRAINT wards_pkey PRIMARY KEY (id);


--
-- Name: zatca_invoices zatca_invoices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.zatca_invoices
    ADD CONSTRAINT zatca_invoices_pkey PRIMARY KEY (id);


--
-- Name: idx_admissions_tenant_facility; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_admissions_tenant_facility ON public.admissions USING btree (tenant_id, facility_id);


--
-- Name: idx_appts_tenant_branch; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_appts_tenant_branch ON public.appointments USING btree (tenant_id, branch_id, appt_date);


--
-- Name: idx_audit_trail_tenant; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_audit_trail_tenant ON public.audit_trail USING btree (tenant_id);


--
-- Name: idx_beds_tenant_branch; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_beds_tenant_branch ON public.beds USING btree (tenant_id, branch_id);


--
-- Name: idx_consent_forms_tenant_facility; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_consent_forms_tenant_facility ON public.consent_forms USING btree (tenant_id, facility_id);


--
-- Name: idx_dental_records_tenant_facility; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_dental_records_tenant_facility ON public.dental_records USING btree (tenant_id, facility_id, patient_id);


--
-- Name: idx_er_visits_tenant_facility; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_er_visits_tenant_facility ON public.emergency_visits USING btree (tenant_id, facility_id);


--
-- Name: idx_hr_employees_tenant; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_hr_employees_tenant ON public.hr_employees USING btree (tenant_id);


--
-- Name: idx_ins_claims_tenant_fac_branch; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ins_claims_tenant_fac_branch ON public.insurance_claims USING btree (tenant_id, facility_id, branch_id);


--
-- Name: idx_journal_entries_tenant_fac_branch; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_journal_entries_tenant_fac_branch ON public.finance_journal_entries USING btree (tenant_id, facility_id, branch_id);


--
-- Name: idx_lab_rad_orders_tenant_facility; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_lab_rad_orders_tenant_facility ON public.lab_radiology_orders USING btree (tenant_id, facility_id, patient_id);


--
-- Name: idx_lab_results_tenant_facility; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_lab_results_tenant_facility ON public.lab_results USING btree (tenant_id, facility_id);


--
-- Name: idx_lab_samples_tenant; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_lab_samples_tenant ON public.lab_samples USING btree (tenant_id);


--
-- Name: idx_med_certificates_tenant_facility; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_med_certificates_tenant_facility ON public.medical_certificates USING btree (tenant_id, facility_id);


--
-- Name: idx_medical_records_tenant_facility; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_medical_records_tenant_facility ON public.medical_records USING btree (tenant_id, facility_id, patient_id);


--
-- Name: idx_nursing_vitals_tenant_facility; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_nursing_vitals_tenant_facility ON public.nursing_vitals USING btree (tenant_id, facility_id, patient_id);


--
-- Name: idx_patient_referrals_tenant_facility; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_patient_referrals_tenant_facility ON public.patient_referrals USING btree (tenant_id, facility_id);


--
-- Name: idx_ph_rx_queue_tenant; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_ph_rx_queue_tenant ON public.pharmacy_prescriptions_queue USING btree (tenant_id, branch_id);


--
-- Name: idx_prescriptions_tenant_facility; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_prescriptions_tenant_facility ON public.prescriptions USING btree (tenant_id, facility_id, patient_id);


--
-- Name: idx_surgeries_tenant_facility; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_surgeries_tenant_facility ON public.surgeries USING btree (tenant_id, facility_id);


--
-- Name: idx_tenant_lab_overrides; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tenant_lab_overrides ON public.tenant_lab_test_overrides USING btree (tenant_id, test_id);


--
-- Name: idx_tenant_rad_overrides; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tenant_rad_overrides ON public.tenant_radiology_overrides USING btree (tenant_id, radiology_id);


--
-- Name: idx_tenant_svc_overrides; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_tenant_svc_overrides ON public.tenant_service_overrides USING btree (tenant_id, service_id);


--
-- Name: idx_waiting_tenant_branch; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_waiting_tenant_branch ON public.waiting_queue USING btree (tenant_id, branch_id);


--
-- Name: idx_wards_tenant_branch; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_wards_tenant_branch ON public.wards USING btree (tenant_id, branch_id);


--
-- Name: idx_zatca_invoices_tenant_fac_branch; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX idx_zatca_invoices_tenant_fac_branch ON public.zatca_invoices USING btree (tenant_id, facility_id, branch_id);


--
-- Name: branches branches_facility_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.branches
    ADD CONSTRAINT branches_facility_id_fkey FOREIGN KEY (facility_id) REFERENCES public.facilities(id) ON DELETE CASCADE;


--
-- Name: departments departments_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id) ON DELETE CASCADE;


--
-- Name: facilities facilities_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.facilities
    ADD CONSTRAINT facilities_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: lab_samples fk_lab_samples_tenant; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.lab_samples
    ADD CONSTRAINT fk_lab_samples_tenant FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: tenant_lab_test_overrides tenant_lab_test_overrides_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenant_lab_test_overrides
    ADD CONSTRAINT tenant_lab_test_overrides_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: tenant_lab_test_overrides tenant_lab_test_overrides_test_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenant_lab_test_overrides
    ADD CONSTRAINT tenant_lab_test_overrides_test_id_fkey FOREIGN KEY (test_id) REFERENCES public.lab_tests_catalog(id) ON DELETE CASCADE;


--
-- Name: tenant_radiology_overrides tenant_radiology_overrides_radiology_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenant_radiology_overrides
    ADD CONSTRAINT tenant_radiology_overrides_radiology_id_fkey FOREIGN KEY (radiology_id) REFERENCES public.radiology_catalog(id) ON DELETE CASCADE;


--
-- Name: tenant_radiology_overrides tenant_radiology_overrides_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenant_radiology_overrides
    ADD CONSTRAINT tenant_radiology_overrides_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: tenant_service_overrides tenant_service_overrides_service_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenant_service_overrides
    ADD CONSTRAINT tenant_service_overrides_service_id_fkey FOREIGN KEY (service_id) REFERENCES public.medical_services(id) ON DELETE CASCADE;


--
-- Name: tenant_service_overrides tenant_service_overrides_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenant_service_overrides
    ADD CONSTRAINT tenant_service_overrides_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: tenant_settings tenant_settings_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tenant_settings
    ADD CONSTRAINT tenant_settings_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: user_facilities user_facilities_branch_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_facilities
    ADD CONSTRAINT user_facilities_branch_id_fkey FOREIGN KEY (branch_id) REFERENCES public.branches(id) ON DELETE CASCADE;


--
-- Name: user_facilities user_facilities_facility_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_facilities
    ADD CONSTRAINT user_facilities_facility_id_fkey FOREIGN KEY (facility_id) REFERENCES public.facilities(id) ON DELETE CASCADE;


--
-- Name: user_facilities user_facilities_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_facilities
    ADD CONSTRAINT user_facilities_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.system_users(id) ON DELETE CASCADE;


--
-- Name: user_tenants user_tenants_tenant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_tenants
    ADD CONSTRAINT user_tenants_tenant_id_fkey FOREIGN KEY (tenant_id) REFERENCES public.tenants(id) ON DELETE CASCADE;


--
-- Name: user_tenants user_tenants_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_tenants
    ADD CONSTRAINT user_tenants_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.system_users(id) ON DELETE CASCADE;


--
-- Name: appointments; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

--
-- Name: beds; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.beds ENABLE ROW LEVEL SECURITY;

--
-- Name: emergency_beds; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.emergency_beds ENABLE ROW LEVEL SECURITY;

--
-- Name: emergency_visits; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.emergency_visits ENABLE ROW LEVEL SECURITY;

--
-- Name: insurance_claims; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.insurance_claims ENABLE ROW LEVEL SECURITY;

--
-- Name: invoices; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

--
-- Name: lab_radiology_orders; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.lab_radiology_orders ENABLE ROW LEVEL SECURITY;

--
-- Name: lab_results; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.lab_results ENABLE ROW LEVEL SECURITY;

--
-- Name: lab_samples; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.lab_samples ENABLE ROW LEVEL SECURITY;

--
-- Name: nursing_vitals; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.nursing_vitals ENABLE ROW LEVEL SECURITY;

--
-- Name: patients; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

--
-- Name: pharmacy_prescriptions_queue; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.pharmacy_prescriptions_queue ENABLE ROW LEVEL SECURITY;

--
-- Name: pharmacy_sale_items; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.pharmacy_sale_items ENABLE ROW LEVEL SECURITY;

--
-- Name: pharmacy_sales; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.pharmacy_sales ENABLE ROW LEVEL SECURITY;

--
-- Name: prescriptions; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.prescriptions ENABLE ROW LEVEL SECURITY;

--
-- Name: admissions rls_admissions_tenant_isolation; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY rls_admissions_tenant_isolation ON public.admissions USING ((tenant_id = (NULLIF(current_setting('app.tenant_id'::text, true), ''::text))::integer)) WITH CHECK (((tenant_id = (NULLIF(current_setting('app.tenant_id'::text, true), ''::text))::integer) AND ((patient_id IS NULL) OR (( SELECT patients.tenant_id
   FROM public.patients
  WHERE (patients.id = admissions.patient_id)) = tenant_id)) AND ((bed_id IS NULL) OR (( SELECT beds.tenant_id
   FROM public.beds
  WHERE (beds.id = admissions.bed_id)) = tenant_id))));


--
-- Name: appointments rls_appointments_tenant_isolation; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY rls_appointments_tenant_isolation ON public.appointments USING ((tenant_id = (NULLIF(current_setting('app.tenant_id'::text, true), ''::text))::integer)) WITH CHECK ((tenant_id = (NULLIF(current_setting('app.tenant_id'::text, true), ''::text))::integer));


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
-- Name: emergency_beds rls_emergency_beds_tenant_isolation; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY rls_emergency_beds_tenant_isolation ON public.emergency_beds USING ((tenant_id = (NULLIF(current_setting('app.tenant_id'::text, true), ''::text))::integer)) WITH CHECK ((tenant_id = (NULLIF(current_setting('app.tenant_id'::text, true), ''::text))::integer));


--
-- Name: emergency_visits rls_emergency_visits_tenant_isolation; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY rls_emergency_visits_tenant_isolation ON public.emergency_visits USING ((tenant_id = (NULLIF(current_setting('app.tenant_id'::text, true), ''::text))::integer)) WITH CHECK ((tenant_id = (NULLIF(current_setting('app.tenant_id'::text, true), ''::text))::integer));


--
-- Name: insurance_claims rls_insurance_claims_tenant_isolation; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY rls_insurance_claims_tenant_isolation ON public.insurance_claims USING ((tenant_id = (NULLIF(current_setting('app.tenant_id'::text, true), ''::text))::integer)) WITH CHECK ((tenant_id = (NULLIF(current_setting('app.tenant_id'::text, true), ''::text))::integer));


--
-- Name: invoices rls_invoices_tenant_isolation; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY rls_invoices_tenant_isolation ON public.invoices USING ((tenant_id = (NULLIF(current_setting('app.tenant_id'::text, true), ''::text))::integer)) WITH CHECK ((tenant_id = (NULLIF(current_setting('app.tenant_id'::text, true), ''::text))::integer));


--
-- Name: lab_radiology_orders rls_lab_radiology_orders_tenant_isolation; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY rls_lab_radiology_orders_tenant_isolation ON public.lab_radiology_orders USING ((tenant_id = (NULLIF(current_setting('app.tenant_id'::text, true), ''::text))::integer)) WITH CHECK ((tenant_id = (NULLIF(current_setting('app.tenant_id'::text, true), ''::text))::integer));


--
-- Name: lab_results rls_lab_results_tenant_isolation; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY rls_lab_results_tenant_isolation ON public.lab_results USING ((tenant_id = (NULLIF(current_setting('app.tenant_id'::text, true), ''::text))::integer)) WITH CHECK ((tenant_id = (NULLIF(current_setting('app.tenant_id'::text, true), ''::text))::integer));


--
-- Name: lab_samples rls_lab_samples_tenant_isolation; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY rls_lab_samples_tenant_isolation ON public.lab_samples USING ((tenant_id = (NULLIF(current_setting('app.tenant_id'::text, true), ''::text))::integer)) WITH CHECK ((tenant_id = (NULLIF(current_setting('app.tenant_id'::text, true), ''::text))::integer));


--
-- Name: nursing_vitals rls_nursing_vitals_tenant_isolation; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY rls_nursing_vitals_tenant_isolation ON public.nursing_vitals USING ((tenant_id = (NULLIF(current_setting('app.tenant_id'::text, true), ''::text))::integer)) WITH CHECK ((tenant_id = (NULLIF(current_setting('app.tenant_id'::text, true), ''::text))::integer));


--
-- Name: patients rls_patients_tenant_isolation; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY rls_patients_tenant_isolation ON public.patients USING ((tenant_id = (NULLIF(current_setting('app.tenant_id'::text, true), ''::text))::integer)) WITH CHECK ((tenant_id = (NULLIF(current_setting('app.tenant_id'::text, true), ''::text))::integer));


--
-- Name: pharmacy_prescriptions_queue rls_pharmacy_prescriptions_queue_tenant_isolation; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY rls_pharmacy_prescriptions_queue_tenant_isolation ON public.pharmacy_prescriptions_queue USING ((tenant_id = (NULLIF(current_setting('app.tenant_id'::text, true), ''::text))::integer)) WITH CHECK ((tenant_id = (NULLIF(current_setting('app.tenant_id'::text, true), ''::text))::integer));


--
-- Name: pharmacy_sale_items rls_pharmacy_sale_items_tenant_isolation; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY rls_pharmacy_sale_items_tenant_isolation ON public.pharmacy_sale_items USING ((tenant_id = (NULLIF(current_setting('app.tenant_id'::text, true), ''::text))::integer)) WITH CHECK ((tenant_id = (NULLIF(current_setting('app.tenant_id'::text, true), ''::text))::integer));


--
-- Name: pharmacy_sales rls_pharmacy_sales_tenant_isolation; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY rls_pharmacy_sales_tenant_isolation ON public.pharmacy_sales USING ((tenant_id = (NULLIF(current_setting('app.tenant_id'::text, true), ''::text))::integer)) WITH CHECK ((tenant_id = (NULLIF(current_setting('app.tenant_id'::text, true), ''::text))::integer));


--
-- Name: prescriptions rls_prescriptions_tenant_isolation; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY rls_prescriptions_tenant_isolation ON public.prescriptions USING ((tenant_id = (NULLIF(current_setting('app.tenant_id'::text, true), ''::text))::integer)) WITH CHECK ((tenant_id = (NULLIF(current_setting('app.tenant_id'::text, true), ''::text))::integer));


--
-- Name: tenant_lab_test_overrides rls_tenant_lab_test_overrides_tenant_isolation; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY rls_tenant_lab_test_overrides_tenant_isolation ON public.tenant_lab_test_overrides USING ((tenant_id = (NULLIF(current_setting('app.tenant_id'::text, true), ''::text))::integer)) WITH CHECK ((tenant_id = (NULLIF(current_setting('app.tenant_id'::text, true), ''::text))::integer));


--
-- Name: tenant_radiology_overrides rls_tenant_radiology_overrides_tenant_isolation; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY rls_tenant_radiology_overrides_tenant_isolation ON public.tenant_radiology_overrides USING ((tenant_id = (NULLIF(current_setting('app.tenant_id'::text, true), ''::text))::integer)) WITH CHECK ((tenant_id = (NULLIF(current_setting('app.tenant_id'::text, true), ''::text))::integer));


--
-- Name: tenant_service_overrides rls_tenant_service_overrides_tenant_isolation; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY rls_tenant_service_overrides_tenant_isolation ON public.tenant_service_overrides USING ((tenant_id = (NULLIF(current_setting('app.tenant_id'::text, true), ''::text))::integer)) WITH CHECK ((tenant_id = (NULLIF(current_setting('app.tenant_id'::text, true), ''::text))::integer));


--
-- Name: wards rls_wards_tenant_isolation; Type: POLICY; Schema: public; Owner: postgres
--

CREATE POLICY rls_wards_tenant_isolation ON public.wards USING ((tenant_id = (NULLIF(current_setting('app.tenant_id'::text, true), ''::text))::integer)) WITH CHECK ((tenant_id = (NULLIF(current_setting('app.tenant_id'::text, true), ''::text))::integer));


--
-- Name: tenant_lab_test_overrides; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.tenant_lab_test_overrides ENABLE ROW LEVEL SECURITY;

--
-- Name: tenant_radiology_overrides; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.tenant_radiology_overrides ENABLE ROW LEVEL SECURITY;

--
-- Name: tenant_service_overrides; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.tenant_service_overrides ENABLE ROW LEVEL SECURITY;

--
-- Name: wards; Type: ROW SECURITY; Schema: public; Owner: postgres
--

ALTER TABLE public.wards ENABLE ROW LEVEL SECURITY;

--
-- Name: TABLE admission_daily_rounds; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.admission_daily_rounds TO test_rls_user;


--
-- Name: SEQUENCE admission_daily_rounds_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.admission_daily_rounds_id_seq TO test_rls_user;


--
-- Name: TABLE admissions; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.admissions TO test_rls_user;


--
-- Name: SEQUENCE admissions_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.admissions_id_seq TO test_rls_user;


--
-- Name: TABLE appointments; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.appointments TO test_rls_user;


--
-- Name: SEQUENCE appointments_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.appointments_id_seq TO test_rls_user;


--
-- Name: TABLE approvals; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.approvals TO test_rls_user;


--
-- Name: SEQUENCE approvals_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.approvals_id_seq TO test_rls_user;


--
-- Name: TABLE audit_trail; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.audit_trail TO test_rls_user;


--
-- Name: SEQUENCE audit_trail_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.audit_trail_id_seq TO test_rls_user;


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
-- Name: TABLE blood_bank_crossmatch; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.blood_bank_crossmatch TO test_rls_user;


--
-- Name: SEQUENCE blood_bank_crossmatch_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.blood_bank_crossmatch_id_seq TO test_rls_user;


--
-- Name: TABLE blood_bank_donors; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.blood_bank_donors TO test_rls_user;


--
-- Name: SEQUENCE blood_bank_donors_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.blood_bank_donors_id_seq TO test_rls_user;


--
-- Name: TABLE blood_bank_transfusions; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.blood_bank_transfusions TO test_rls_user;


--
-- Name: SEQUENCE blood_bank_transfusions_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.blood_bank_transfusions_id_seq TO test_rls_user;


--
-- Name: TABLE blood_bank_units; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.blood_bank_units TO test_rls_user;


--
-- Name: SEQUENCE blood_bank_units_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.blood_bank_units_id_seq TO test_rls_user;


--
-- Name: TABLE branches; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.branches TO test_rls_user;


--
-- Name: SEQUENCE branches_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.branches_id_seq TO test_rls_user;


--
-- Name: TABLE clinical_pharmacy_reviews; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.clinical_pharmacy_reviews TO test_rls_user;


--
-- Name: SEQUENCE clinical_pharmacy_reviews_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.clinical_pharmacy_reviews_id_seq TO test_rls_user;


--
-- Name: TABLE cme_activities; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.cme_activities TO test_rls_user;


--
-- Name: SEQUENCE cme_activities_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.cme_activities_id_seq TO test_rls_user;


--
-- Name: TABLE cme_registrations; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.cme_registrations TO test_rls_user;


--
-- Name: SEQUENCE cme_registrations_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.cme_registrations_id_seq TO test_rls_user;


--
-- Name: TABLE company_settings; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.company_settings TO test_rls_user;


--
-- Name: TABLE consent_forms; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.consent_forms TO test_rls_user;


--
-- Name: SEQUENCE consent_forms_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.consent_forms_id_seq TO test_rls_user;


--
-- Name: TABLE cosmetic_cases; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.cosmetic_cases TO test_rls_user;


--
-- Name: SEQUENCE cosmetic_cases_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.cosmetic_cases_id_seq TO test_rls_user;


--
-- Name: TABLE cosmetic_consents; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.cosmetic_consents TO test_rls_user;


--
-- Name: SEQUENCE cosmetic_consents_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.cosmetic_consents_id_seq TO test_rls_user;


--
-- Name: TABLE cosmetic_followups; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.cosmetic_followups TO test_rls_user;


--
-- Name: SEQUENCE cosmetic_followups_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.cosmetic_followups_id_seq TO test_rls_user;


--
-- Name: TABLE cosmetic_photos; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.cosmetic_photos TO test_rls_user;


--
-- Name: SEQUENCE cosmetic_photos_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.cosmetic_photos_id_seq TO test_rls_user;


--
-- Name: TABLE cosmetic_procedures; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.cosmetic_procedures TO test_rls_user;


--
-- Name: SEQUENCE cosmetic_procedures_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.cosmetic_procedures_id_seq TO test_rls_user;


--
-- Name: TABLE cssd_instrument_sets; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.cssd_instrument_sets TO test_rls_user;


--
-- Name: SEQUENCE cssd_instrument_sets_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.cssd_instrument_sets_id_seq TO test_rls_user;


--
-- Name: TABLE cssd_load_items; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.cssd_load_items TO test_rls_user;


--
-- Name: SEQUENCE cssd_load_items_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.cssd_load_items_id_seq TO test_rls_user;


--
-- Name: TABLE cssd_sterilization_cycles; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.cssd_sterilization_cycles TO test_rls_user;


--
-- Name: SEQUENCE cssd_sterilization_cycles_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.cssd_sterilization_cycles_id_seq TO test_rls_user;


--
-- Name: TABLE daily_close; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.daily_close TO test_rls_user;


--
-- Name: SEQUENCE daily_close_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.daily_close_id_seq TO test_rls_user;


--
-- Name: TABLE dental_records; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.dental_records TO test_rls_user;


--
-- Name: SEQUENCE dental_records_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.dental_records_id_seq TO test_rls_user;


--
-- Name: TABLE departments; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.departments TO test_rls_user;


--
-- Name: SEQUENCE departments_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.departments_id_seq TO test_rls_user;


--
-- Name: TABLE diet_meals; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.diet_meals TO test_rls_user;


--
-- Name: SEQUENCE diet_meals_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.diet_meals_id_seq TO test_rls_user;


--
-- Name: TABLE diet_orders; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.diet_orders TO test_rls_user;


--
-- Name: SEQUENCE diet_orders_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.diet_orders_id_seq TO test_rls_user;


--
-- Name: TABLE discount_rules; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.discount_rules TO test_rls_user;


--
-- Name: SEQUENCE discount_rules_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.discount_rules_id_seq TO test_rls_user;


--
-- Name: TABLE doctor_inventory_request_items; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.doctor_inventory_request_items TO test_rls_user;


--
-- Name: SEQUENCE doctor_inventory_request_items_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.doctor_inventory_request_items_id_seq TO test_rls_user;


--
-- Name: TABLE doctor_inventory_requests; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.doctor_inventory_requests TO test_rls_user;


--
-- Name: SEQUENCE doctor_inventory_requests_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.doctor_inventory_requests_id_seq TO test_rls_user;


--
-- Name: TABLE drug_interactions; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.drug_interactions TO test_rls_user;


--
-- Name: SEQUENCE drug_interactions_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.drug_interactions_id_seq TO test_rls_user;


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
-- Name: TABLE emergency_beds; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.emergency_beds TO test_rls_user;


--
-- Name: SEQUENCE emergency_beds_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.emergency_beds_id_seq TO test_rls_user;


--
-- Name: TABLE emergency_trauma_assessments; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.emergency_trauma_assessments TO test_rls_user;


--
-- Name: SEQUENCE emergency_trauma_assessments_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.emergency_trauma_assessments_id_seq TO test_rls_user;


--
-- Name: TABLE emergency_visits; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.emergency_visits TO test_rls_user;


--
-- Name: SEQUENCE emergency_visits_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.emergency_visits_id_seq TO test_rls_user;


--
-- Name: TABLE employee_exposures; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.employee_exposures TO test_rls_user;


--
-- Name: SEQUENCE employee_exposures_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.employee_exposures_id_seq TO test_rls_user;


--
-- Name: TABLE employees; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.employees TO test_rls_user;


--
-- Name: SEQUENCE employees_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.employees_id_seq TO test_rls_user;


--
-- Name: TABLE facilities; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.facilities TO test_rls_user;


--
-- Name: SEQUENCE facilities_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.facilities_id_seq TO test_rls_user;


--
-- Name: TABLE finance_chart_of_accounts; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.finance_chart_of_accounts TO test_rls_user;


--
-- Name: SEQUENCE finance_chart_of_accounts_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.finance_chart_of_accounts_id_seq TO test_rls_user;


--
-- Name: TABLE finance_cost_centers; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.finance_cost_centers TO test_rls_user;


--
-- Name: SEQUENCE finance_cost_centers_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.finance_cost_centers_id_seq TO test_rls_user;


--
-- Name: TABLE finance_doctor_commissions; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.finance_doctor_commissions TO test_rls_user;


--
-- Name: SEQUENCE finance_doctor_commissions_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.finance_doctor_commissions_id_seq TO test_rls_user;


--
-- Name: TABLE finance_fiscal_years; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.finance_fiscal_years TO test_rls_user;


--
-- Name: SEQUENCE finance_fiscal_years_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.finance_fiscal_years_id_seq TO test_rls_user;


--
-- Name: TABLE finance_journal_entries; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.finance_journal_entries TO test_rls_user;


--
-- Name: SEQUENCE finance_journal_entries_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.finance_journal_entries_id_seq TO test_rls_user;


--
-- Name: TABLE finance_journal_lines; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.finance_journal_lines TO test_rls_user;


--
-- Name: SEQUENCE finance_journal_lines_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.finance_journal_lines_id_seq TO test_rls_user;


--
-- Name: TABLE finance_tax_declarations; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.finance_tax_declarations TO test_rls_user;


--
-- Name: SEQUENCE finance_tax_declarations_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.finance_tax_declarations_id_seq TO test_rls_user;


--
-- Name: TABLE finance_vouchers; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.finance_vouchers TO test_rls_user;


--
-- Name: SEQUENCE finance_vouchers_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.finance_vouchers_id_seq TO test_rls_user;


--
-- Name: TABLE form_templates; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.form_templates TO test_rls_user;


--
-- Name: SEQUENCE form_templates_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.form_templates_id_seq TO test_rls_user;


--
-- Name: TABLE hand_hygiene_audits; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.hand_hygiene_audits TO test_rls_user;


--
-- Name: SEQUENCE hand_hygiene_audits_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.hand_hygiene_audits_id_seq TO test_rls_user;


--
-- Name: TABLE hr_advances; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.hr_advances TO test_rls_user;


--
-- Name: SEQUENCE hr_advances_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.hr_advances_id_seq TO test_rls_user;


--
-- Name: TABLE hr_attendance; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.hr_attendance TO test_rls_user;


--
-- Name: SEQUENCE hr_attendance_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.hr_attendance_id_seq TO test_rls_user;


--
-- Name: TABLE hr_employee_custody; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.hr_employee_custody TO test_rls_user;


--
-- Name: SEQUENCE hr_employee_custody_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.hr_employee_custody_id_seq TO test_rls_user;


--
-- Name: TABLE hr_employee_documents; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.hr_employee_documents TO test_rls_user;


--
-- Name: SEQUENCE hr_employee_documents_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.hr_employee_documents_id_seq TO test_rls_user;


--
-- Name: TABLE hr_employees; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.hr_employees TO test_rls_user;


--
-- Name: SEQUENCE hr_employees_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.hr_employees_id_seq TO test_rls_user;


--
-- Name: TABLE hr_leaves; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.hr_leaves TO test_rls_user;


--
-- Name: SEQUENCE hr_leaves_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.hr_leaves_id_seq TO test_rls_user;


--
-- Name: TABLE hr_salaries; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.hr_salaries TO test_rls_user;


--
-- Name: SEQUENCE hr_salaries_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.hr_salaries_id_seq TO test_rls_user;


--
-- Name: TABLE icd10_codes; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.icd10_codes TO test_rls_user;


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
-- Name: TABLE infection_outbreaks; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.infection_outbreaks TO test_rls_user;


--
-- Name: SEQUENCE infection_outbreaks_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.infection_outbreaks_id_seq TO test_rls_user;


--
-- Name: TABLE infection_surveillance; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.infection_surveillance TO test_rls_user;


--
-- Name: SEQUENCE infection_surveillance_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.infection_surveillance_id_seq TO test_rls_user;


--
-- Name: TABLE insurance_claims; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.insurance_claims TO test_rls_user;


--
-- Name: SEQUENCE insurance_claims_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.insurance_claims_id_seq TO test_rls_user;


--
-- Name: TABLE insurance_companies; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.insurance_companies TO test_rls_user;


--
-- Name: SEQUENCE insurance_companies_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.insurance_companies_id_seq TO test_rls_user;


--
-- Name: TABLE insurance_contracts; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.insurance_contracts TO test_rls_user;


--
-- Name: SEQUENCE insurance_contracts_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.insurance_contracts_id_seq TO test_rls_user;


--
-- Name: TABLE insurance_policies; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.insurance_policies TO test_rls_user;


--
-- Name: SEQUENCE insurance_policies_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.insurance_policies_id_seq TO test_rls_user;


--
-- Name: TABLE integration_settings; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.integration_settings TO test_rls_user;


--
-- Name: SEQUENCE integration_settings_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.integration_settings_id_seq TO test_rls_user;


--
-- Name: TABLE internal_messages; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.internal_messages TO test_rls_user;


--
-- Name: SEQUENCE internal_messages_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.internal_messages_id_seq TO test_rls_user;


--
-- Name: TABLE inventory_dept_request_items; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.inventory_dept_request_items TO test_rls_user;


--
-- Name: SEQUENCE inventory_dept_request_items_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.inventory_dept_request_items_id_seq TO test_rls_user;


--
-- Name: TABLE inventory_dept_requests; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.inventory_dept_requests TO test_rls_user;


--
-- Name: SEQUENCE inventory_dept_requests_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.inventory_dept_requests_id_seq TO test_rls_user;


--
-- Name: TABLE inventory_issue_items; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.inventory_issue_items TO test_rls_user;


--
-- Name: SEQUENCE inventory_issue_items_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.inventory_issue_items_id_seq TO test_rls_user;


--
-- Name: TABLE inventory_issue_to_dept; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.inventory_issue_to_dept TO test_rls_user;


--
-- Name: SEQUENCE inventory_issue_to_dept_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.inventory_issue_to_dept_id_seq TO test_rls_user;


--
-- Name: TABLE inventory_items; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.inventory_items TO test_rls_user;


--
-- Name: SEQUENCE inventory_items_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.inventory_items_id_seq TO test_rls_user;


--
-- Name: TABLE inventory_opening_balances; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.inventory_opening_balances TO test_rls_user;


--
-- Name: SEQUENCE inventory_opening_balances_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.inventory_opening_balances_id_seq TO test_rls_user;


--
-- Name: TABLE inventory_purchase_items; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.inventory_purchase_items TO test_rls_user;


--
-- Name: SEQUENCE inventory_purchase_items_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.inventory_purchase_items_id_seq TO test_rls_user;


--
-- Name: TABLE inventory_purchases; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.inventory_purchases TO test_rls_user;


--
-- Name: SEQUENCE inventory_purchases_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.inventory_purchases_id_seq TO test_rls_user;


--
-- Name: TABLE inventory_stock_count; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.inventory_stock_count TO test_rls_user;


--
-- Name: SEQUENCE inventory_stock_count_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.inventory_stock_count_id_seq TO test_rls_user;


--
-- Name: TABLE invoices; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.invoices TO test_rls_user;


--
-- Name: SEQUENCE invoices_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.invoices_id_seq TO test_rls_user;


--
-- Name: TABLE lab_radiology_orders; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.lab_radiology_orders TO test_rls_user;


--
-- Name: SEQUENCE lab_radiology_orders_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.lab_radiology_orders_id_seq TO test_rls_user;


--
-- Name: TABLE lab_results; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.lab_results TO test_rls_user;


--
-- Name: SEQUENCE lab_results_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.lab_results_id_seq TO test_rls_user;


--
-- Name: TABLE lab_samples; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.lab_samples TO test_rls_user;


--
-- Name: SEQUENCE lab_samples_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.lab_samples_id_seq TO test_rls_user;


--
-- Name: TABLE lab_tests_catalog; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.lab_tests_catalog TO test_rls_user;


--
-- Name: SEQUENCE lab_tests_catalog_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.lab_tests_catalog_id_seq TO test_rls_user;


--
-- Name: TABLE maintenance_equipment; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.maintenance_equipment TO test_rls_user;


--
-- Name: SEQUENCE maintenance_equipment_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.maintenance_equipment_id_seq TO test_rls_user;


--
-- Name: TABLE maintenance_pm_schedules; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.maintenance_pm_schedules TO test_rls_user;


--
-- Name: SEQUENCE maintenance_pm_schedules_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.maintenance_pm_schedules_id_seq TO test_rls_user;


--
-- Name: TABLE maintenance_work_orders; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.maintenance_work_orders TO test_rls_user;


--
-- Name: SEQUENCE maintenance_work_orders_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.maintenance_work_orders_id_seq TO test_rls_user;


--
-- Name: TABLE medical_certificates; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.medical_certificates TO test_rls_user;


--
-- Name: SEQUENCE medical_certificates_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.medical_certificates_id_seq TO test_rls_user;


--
-- Name: TABLE medical_records; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.medical_records TO test_rls_user;


--
-- Name: TABLE medical_records_coding; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.medical_records_coding TO test_rls_user;


--
-- Name: SEQUENCE medical_records_coding_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.medical_records_coding_id_seq TO test_rls_user;


--
-- Name: TABLE medical_records_files; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.medical_records_files TO test_rls_user;


--
-- Name: SEQUENCE medical_records_files_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.medical_records_files_id_seq TO test_rls_user;


--
-- Name: SEQUENCE medical_records_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.medical_records_id_seq TO test_rls_user;


--
-- Name: TABLE medical_records_requests; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.medical_records_requests TO test_rls_user;


--
-- Name: SEQUENCE medical_records_requests_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.medical_records_requests_id_seq TO test_rls_user;


--
-- Name: TABLE medical_services; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.medical_services TO test_rls_user;


--
-- Name: SEQUENCE medical_services_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.medical_services_id_seq TO test_rls_user;


--
-- Name: TABLE medications; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.medications TO test_rls_user;


--
-- Name: SEQUENCE medications_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.medications_id_seq TO test_rls_user;


--
-- Name: TABLE mortuary_cases; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.mortuary_cases TO test_rls_user;


--
-- Name: SEQUENCE mortuary_cases_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.mortuary_cases_id_seq TO test_rls_user;


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
-- Name: TABLE nutrition_assessments; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.nutrition_assessments TO test_rls_user;


--
-- Name: SEQUENCE nutrition_assessments_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.nutrition_assessments_id_seq TO test_rls_user;


--
-- Name: TABLE online_bookings; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.online_bookings TO test_rls_user;


--
-- Name: SEQUENCE online_bookings_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.online_bookings_id_seq TO test_rls_user;


--
-- Name: TABLE operating_rooms; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.operating_rooms TO test_rls_user;


--
-- Name: SEQUENCE operating_rooms_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.operating_rooms_id_seq TO test_rls_user;


--
-- Name: TABLE package_sessions; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.package_sessions TO test_rls_user;


--
-- Name: SEQUENCE package_sessions_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.package_sessions_id_seq TO test_rls_user;


--
-- Name: TABLE packages; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.packages TO test_rls_user;


--
-- Name: SEQUENCE packages_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.packages_id_seq TO test_rls_user;


--
-- Name: TABLE pathology_cases; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.pathology_cases TO test_rls_user;


--
-- Name: SEQUENCE pathology_cases_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.pathology_cases_id_seq TO test_rls_user;


--
-- Name: TABLE patient_drug_education; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.patient_drug_education TO test_rls_user;


--
-- Name: SEQUENCE patient_drug_education_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.patient_drug_education_id_seq TO test_rls_user;


--
-- Name: TABLE patient_referrals; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.patient_referrals TO test_rls_user;


--
-- Name: SEQUENCE patient_referrals_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.patient_referrals_id_seq TO test_rls_user;


--
-- Name: TABLE patients; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.patients TO test_rls_user;


--
-- Name: SEQUENCE patients_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.patients_id_seq TO test_rls_user;


--
-- Name: TABLE pharmacy_drug_catalog; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.pharmacy_drug_catalog TO test_rls_user;


--
-- Name: SEQUENCE pharmacy_drug_catalog_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.pharmacy_drug_catalog_id_seq TO test_rls_user;


--
-- Name: TABLE pharmacy_opening_balances; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.pharmacy_opening_balances TO test_rls_user;


--
-- Name: SEQUENCE pharmacy_opening_balances_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.pharmacy_opening_balances_id_seq TO test_rls_user;


--
-- Name: TABLE pharmacy_prescriptions_queue; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.pharmacy_prescriptions_queue TO test_rls_user;


--
-- Name: SEQUENCE pharmacy_prescriptions_queue_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.pharmacy_prescriptions_queue_id_seq TO test_rls_user;


--
-- Name: TABLE pharmacy_purchase_items; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.pharmacy_purchase_items TO test_rls_user;


--
-- Name: SEQUENCE pharmacy_purchase_items_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.pharmacy_purchase_items_id_seq TO test_rls_user;


--
-- Name: TABLE pharmacy_purchase_orders; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.pharmacy_purchase_orders TO test_rls_user;


--
-- Name: SEQUENCE pharmacy_purchase_orders_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.pharmacy_purchase_orders_id_seq TO test_rls_user;


--
-- Name: TABLE pharmacy_sale_items; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.pharmacy_sale_items TO test_rls_user;


--
-- Name: SEQUENCE pharmacy_sale_items_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.pharmacy_sale_items_id_seq TO test_rls_user;


--
-- Name: TABLE pharmacy_sales; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.pharmacy_sales TO test_rls_user;


--
-- Name: SEQUENCE pharmacy_sales_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.pharmacy_sales_id_seq TO test_rls_user;


--
-- Name: TABLE pharmacy_suppliers; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.pharmacy_suppliers TO test_rls_user;


--
-- Name: SEQUENCE pharmacy_suppliers_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.pharmacy_suppliers_id_seq TO test_rls_user;


--
-- Name: TABLE portal_appointments; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.portal_appointments TO test_rls_user;


--
-- Name: SEQUENCE portal_appointments_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.portal_appointments_id_seq TO test_rls_user;


--
-- Name: TABLE portal_users; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.portal_users TO test_rls_user;


--
-- Name: SEQUENCE portal_users_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.portal_users_id_seq TO test_rls_user;


--
-- Name: TABLE prescriptions; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.prescriptions TO test_rls_user;


--
-- Name: SEQUENCE prescriptions_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.prescriptions_id_seq TO test_rls_user;


--
-- Name: TABLE quality_incidents; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.quality_incidents TO test_rls_user;


--
-- Name: SEQUENCE quality_incidents_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.quality_incidents_id_seq TO test_rls_user;


--
-- Name: TABLE quality_kpis; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.quality_kpis TO test_rls_user;


--
-- Name: SEQUENCE quality_kpis_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.quality_kpis_id_seq TO test_rls_user;


--
-- Name: TABLE quality_patient_satisfaction; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.quality_patient_satisfaction TO test_rls_user;


--
-- Name: SEQUENCE quality_patient_satisfaction_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.quality_patient_satisfaction_id_seq TO test_rls_user;


--
-- Name: TABLE queue_advertisements; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.queue_advertisements TO test_rls_user;


--
-- Name: SEQUENCE queue_advertisements_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.queue_advertisements_id_seq TO test_rls_user;


--
-- Name: TABLE radiology_catalog; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.radiology_catalog TO test_rls_user;


--
-- Name: SEQUENCE radiology_catalog_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.radiology_catalog_id_seq TO test_rls_user;


--
-- Name: TABLE rehab_assessments; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.rehab_assessments TO test_rls_user;


--
-- Name: SEQUENCE rehab_assessments_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.rehab_assessments_id_seq TO test_rls_user;


--
-- Name: TABLE rehab_goals; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.rehab_goals TO test_rls_user;


--
-- Name: SEQUENCE rehab_goals_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.rehab_goals_id_seq TO test_rls_user;


--
-- Name: TABLE rehab_patients; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.rehab_patients TO test_rls_user;


--
-- Name: SEQUENCE rehab_patients_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.rehab_patients_id_seq TO test_rls_user;


--
-- Name: TABLE rehab_sessions; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.rehab_sessions TO test_rls_user;


--
-- Name: SEQUENCE rehab_sessions_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.rehab_sessions_id_seq TO test_rls_user;


--
-- Name: TABLE social_work_cases; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.social_work_cases TO test_rls_user;


--
-- Name: SEQUENCE social_work_cases_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.social_work_cases_id_seq TO test_rls_user;


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
-- Name: TABLE system_users; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.system_users TO test_rls_user;


--
-- Name: SEQUENCE system_users_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.system_users_id_seq TO test_rls_user;


--
-- Name: TABLE telemedicine_sessions; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.telemedicine_sessions TO test_rls_user;


--
-- Name: SEQUENCE telemedicine_sessions_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.telemedicine_sessions_id_seq TO test_rls_user;


--
-- Name: TABLE tenant_lab_test_overrides; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.tenant_lab_test_overrides TO test_rls_user;


--
-- Name: SEQUENCE tenant_lab_test_overrides_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.tenant_lab_test_overrides_id_seq TO test_rls_user;


--
-- Name: TABLE tenant_radiology_overrides; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.tenant_radiology_overrides TO test_rls_user;


--
-- Name: SEQUENCE tenant_radiology_overrides_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.tenant_radiology_overrides_id_seq TO test_rls_user;


--
-- Name: TABLE tenant_service_overrides; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.tenant_service_overrides TO test_rls_user;


--
-- Name: SEQUENCE tenant_service_overrides_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.tenant_service_overrides_id_seq TO test_rls_user;


--
-- Name: TABLE tenant_settings; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.tenant_settings TO test_rls_user;


--
-- Name: SEQUENCE tenant_settings_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.tenant_settings_id_seq TO test_rls_user;


--
-- Name: TABLE tenants; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.tenants TO test_rls_user;


--
-- Name: SEQUENCE tenants_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.tenants_id_seq TO test_rls_user;


--
-- Name: TABLE transport_requests; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.transport_requests TO test_rls_user;


--
-- Name: SEQUENCE transport_requests_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.transport_requests_id_seq TO test_rls_user;


--
-- Name: TABLE user_facilities; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.user_facilities TO test_rls_user;


--
-- Name: SEQUENCE user_facilities_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.user_facilities_id_seq TO test_rls_user;


--
-- Name: TABLE user_permissions; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.user_permissions TO test_rls_user;


--
-- Name: SEQUENCE user_permissions_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.user_permissions_id_seq TO test_rls_user;


--
-- Name: TABLE user_tenants; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.user_tenants TO test_rls_user;


--
-- Name: SEQUENCE user_tenants_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.user_tenants_id_seq TO test_rls_user;


--
-- Name: TABLE waiting_queue; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.waiting_queue TO test_rls_user;


--
-- Name: SEQUENCE waiting_queue_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.waiting_queue_id_seq TO test_rls_user;


--
-- Name: TABLE wards; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.wards TO test_rls_user;


--
-- Name: SEQUENCE wards_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.wards_id_seq TO test_rls_user;


--
-- Name: TABLE zatca_invoices; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,INSERT,DELETE,UPDATE ON TABLE public.zatca_invoices TO test_rls_user;


--
-- Name: SEQUENCE zatca_invoices_id_seq; Type: ACL; Schema: public; Owner: postgres
--

GRANT SELECT,USAGE ON SEQUENCE public.zatca_invoices_id_seq TO test_rls_user;


--
-- PostgreSQL database dump complete
--

\unrestrict yZz0CHAok1zTATX7KoKNVtkAnYdCyqaaYMPk6E7pJUWUfPB703LPMwt23vphsib

