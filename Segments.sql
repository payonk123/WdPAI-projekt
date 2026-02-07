--
-- PostgreSQL database dump
--

\restrict eyTOlse1eKX7sQKrXL1HnCtOzckpYftuIKe16GIVIcMDtjC2dh4ZZgs7X5dCbcA

-- Dumped from database version 18.0 (Debian 18.0-1.pgdg13+3)
-- Dumped by pg_dump version 18.1

-- Started on 2026-02-07 01:34:53

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 3563 (class 1262 OID 16384)
-- Name: db; Type: DATABASE; Schema: -; Owner: docker
--

CREATE DATABASE db WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE db OWNER TO docker;

\unrestrict eyTOlse1eKX7sQKrXL1HnCtOzckpYftuIKe16GIVIcMDtjC2dh4ZZgs7X5dCbcA
\connect db
\restrict eyTOlse1eKX7sQKrXL1HnCtOzckpYftuIKe16GIVIcMDtjC2dh4ZZgs7X5dCbcA

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 238 (class 1255 OID 24767)
-- Name: create_prepared(); Type: FUNCTION; Schema: public; Owner: docker
--

CREATE FUNCTION public.create_prepared() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO PREPARED (id_segment_r, portions_left) 
  VALUES (NEW.id_segment_r, (SELECT portions FROM RECIPES WHERE id_recipe = NEW.id_recipe));
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.create_prepared() OWNER TO docker;

--
-- TOC entry 239 (class 1255 OID 24769)
-- Name: decrease_portions(); Type: FUNCTION; Schema: public; Owner: docker
--

CREATE FUNCTION public.decrease_portions() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  UPDATE PREPARED
  SET portions_left = portions_left - 1
  WHERE id_prepared = NEW.id_prepared;
  RETURN NEW;
END;
$$;


ALTER FUNCTION public.decrease_portions() OWNER TO docker;

--
-- TOC entry 240 (class 1255 OID 24771)
-- Name: increase_portions(); Type: FUNCTION; Schema: public; Owner: docker
--

CREATE FUNCTION public.increase_portions() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
  UPDATE PREPARED
  SET portions_left = portions_left + 1
  WHERE id_prepared = OLD.id_prepared;
  RETURN OLD;
END;
$$;


ALTER FUNCTION public.increase_portions() OWNER TO docker;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 222 (class 1259 OID 24609)
-- Name: ingredients; Type: TABLE; Schema: public; Owner: docker
--

CREATE TABLE public.ingredients (
    id_in integer NOT NULL,
    name character varying(100) NOT NULL
);


ALTER TABLE public.ingredients OWNER TO docker;

--
-- TOC entry 221 (class 1259 OID 24608)
-- Name: ingredients_id_in_seq; Type: SEQUENCE; Schema: public; Owner: docker
--

CREATE SEQUENCE public.ingredients_id_in_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.ingredients_id_in_seq OWNER TO docker;

--
-- TOC entry 3564 (class 0 OID 0)
-- Dependencies: 221
-- Name: ingredients_id_in_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: docker
--

ALTER SEQUENCE public.ingredients_id_in_seq OWNED BY public.ingredients.id_in;


--
-- TOC entry 237 (class 1259 OID 24799)
-- Name: logins; Type: TABLE; Schema: public; Owner: docker
--

CREATE TABLE public.logins (
    ip character varying(50) NOT NULL,
    success integer NOT NULL,
    login_time timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.logins OWNER TO docker;

--
-- TOC entry 232 (class 1259 OID 24698)
-- Name: prepared; Type: TABLE; Schema: public; Owner: docker
--

CREATE TABLE public.prepared (
    id_prepared integer NOT NULL,
    id_segment_r integer NOT NULL,
    portions_left integer NOT NULL,
    CONSTRAINT prepared_portions_left_check CHECK ((portions_left >= 0))
);


ALTER TABLE public.prepared OWNER TO docker;

--
-- TOC entry 231 (class 1259 OID 24697)
-- Name: prepared_id_prepared_seq; Type: SEQUENCE; Schema: public; Owner: docker
--

CREATE SEQUENCE public.prepared_id_prepared_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.prepared_id_prepared_seq OWNER TO docker;

--
-- TOC entry 3565 (class 0 OID 0)
-- Dependencies: 231
-- Name: prepared_id_prepared_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: docker
--

ALTER SEQUENCE public.prepared_id_prepared_seq OWNED BY public.prepared.id_prepared;


--
-- TOC entry 228 (class 1259 OID 24653)
-- Name: recipe_in; Type: TABLE; Schema: public; Owner: docker
--

CREATE TABLE public.recipe_in (
    id_ri integer NOT NULL,
    id_recipe integer NOT NULL,
    id_in integer NOT NULL,
    id_unity integer NOT NULL,
    amount numeric(10,2) NOT NULL,
    CONSTRAINT recipe_in_amount_check CHECK ((amount > (0)::numeric))
);


ALTER TABLE public.recipe_in OWNER TO docker;

--
-- TOC entry 227 (class 1259 OID 24652)
-- Name: recipe_in_id_ri_seq; Type: SEQUENCE; Schema: public; Owner: docker
--

CREATE SEQUENCE public.recipe_in_id_ri_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.recipe_in_id_ri_seq OWNER TO docker;

--
-- TOC entry 3566 (class 0 OID 0)
-- Dependencies: 227
-- Name: recipe_in_id_ri_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: docker
--

ALTER SEQUENCE public.recipe_in_id_ri_seq OWNED BY public.recipe_in.id_ri;


--
-- TOC entry 226 (class 1259 OID 24631)
-- Name: recipes; Type: TABLE; Schema: public; Owner: docker
--

CREATE TABLE public.recipes (
    id_recipe integer NOT NULL,
    id_user integer NOT NULL,
    name character varying(200) NOT NULL,
    instructions text NOT NULL,
    portions integer NOT NULL,
    p_time integer NOT NULL,
    CONSTRAINT recipes_p_time_check CHECK ((p_time > 0)),
    CONSTRAINT recipes_portions_check CHECK ((portions > 0))
);


ALTER TABLE public.recipes OWNER TO docker;

--
-- TOC entry 225 (class 1259 OID 24630)
-- Name: recipes_id_recipe_seq; Type: SEQUENCE; Schema: public; Owner: docker
--

CREATE SEQUENCE public.recipes_id_recipe_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.recipes_id_recipe_seq OWNER TO docker;

--
-- TOC entry 3567 (class 0 OID 0)
-- Dependencies: 225
-- Name: recipes_id_recipe_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: docker
--

ALTER SEQUENCE public.recipes_id_recipe_seq OWNED BY public.recipes.id_recipe;


--
-- TOC entry 234 (class 1259 OID 24716)
-- Name: segments_p; Type: TABLE; Schema: public; Owner: docker
--

CREATE TABLE public.segments_p (
    id_segment_p integer NOT NULL,
    id_prepared integer NOT NULL,
    start_time timestamp without time zone NOT NULL,
    end_time timestamp without time zone NOT NULL,
    CONSTRAINT segments_p_check CHECK ((end_time > start_time))
);


ALTER TABLE public.segments_p OWNER TO docker;

--
-- TOC entry 233 (class 1259 OID 24715)
-- Name: segments_p_id_segment_p_seq; Type: SEQUENCE; Schema: public; Owner: docker
--

CREATE SEQUENCE public.segments_p_id_segment_p_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.segments_p_id_segment_p_seq OWNER TO docker;

--
-- TOC entry 3568 (class 0 OID 0)
-- Dependencies: 233
-- Name: segments_p_id_segment_p_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: docker
--

ALTER SEQUENCE public.segments_p_id_segment_p_seq OWNED BY public.segments_p.id_segment_p;


--
-- TOC entry 230 (class 1259 OID 24681)
-- Name: segments_r; Type: TABLE; Schema: public; Owner: docker
--

CREATE TABLE public.segments_r (
    id_segment_r integer NOT NULL,
    id_recipe integer NOT NULL,
    start_time timestamp without time zone NOT NULL,
    end_time timestamp without time zone NOT NULL,
    CONSTRAINT segments_r_check CHECK ((end_time > start_time))
);


ALTER TABLE public.segments_r OWNER TO docker;

--
-- TOC entry 229 (class 1259 OID 24680)
-- Name: segments_r_id_segment_r_seq; Type: SEQUENCE; Schema: public; Owner: docker
--

CREATE SEQUENCE public.segments_r_id_segment_r_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.segments_r_id_segment_r_seq OWNER TO docker;

--
-- TOC entry 3569 (class 0 OID 0)
-- Dependencies: 229
-- Name: segments_r_id_segment_r_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: docker
--

ALTER SEQUENCE public.segments_r_id_segment_r_seq OWNED BY public.segments_r.id_segment_r;


--
-- TOC entry 224 (class 1259 OID 24620)
-- Name: unity; Type: TABLE; Schema: public; Owner: docker
--

CREATE TABLE public.unity (
    id_unity integer NOT NULL,
    name character varying(30) NOT NULL
);


ALTER TABLE public.unity OWNER TO docker;

--
-- TOC entry 223 (class 1259 OID 24619)
-- Name: unity_id_unity_seq; Type: SEQUENCE; Schema: public; Owner: docker
--

CREATE SEQUENCE public.unity_id_unity_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.unity_id_unity_seq OWNER TO docker;

--
-- TOC entry 3570 (class 0 OID 0)
-- Dependencies: 223
-- Name: unity_id_unity_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: docker
--

ALTER SEQUENCE public.unity_id_unity_seq OWNED BY public.unity.id_unity;


--
-- TOC entry 220 (class 1259 OID 24593)
-- Name: users; Type: TABLE; Schema: public; Owner: docker
--

CREATE TABLE public.users (
    id_user integer NOT NULL,
    email character varying(50) NOT NULL,
    password character varying(1000) NOT NULL,
    firstname character varying(50) NOT NULL,
    lastname character varying(100) NOT NULL
);


ALTER TABLE public.users OWNER TO docker;

--
-- TOC entry 236 (class 1259 OID 24777)
-- Name: user_prepared_recipes; Type: VIEW; Schema: public; Owner: docker
--

CREATE VIEW public.user_prepared_recipes AS
 SELECT concat(u.firstname, ' ', u.lastname) AS user_full_name,
    r.name AS recipe_name,
    p.portions_left
   FROM (((public.prepared p
     JOIN public.segments_r sr ON ((sr.id_segment_r = p.id_segment_r)))
     JOIN public.recipes r ON ((r.id_recipe = sr.id_recipe)))
     JOIN public.users u ON ((r.id_user = u.id_user)))
  ORDER BY (concat(u.firstname, ' ', u.lastname)), r.name;


ALTER VIEW public.user_prepared_recipes OWNER TO docker;

--
-- TOC entry 235 (class 1259 OID 24773)
-- Name: user_recipes; Type: VIEW; Schema: public; Owner: docker
--

CREATE VIEW public.user_recipes AS
 SELECT concat(u.firstname, ' ', u.lastname) AS user_full_name,
    r.name AS recipe_name
   FROM (public.recipes r
     JOIN public.users u ON ((r.id_user = u.id_user)))
  ORDER BY (concat(u.firstname, ' ', u.lastname)), r.name;


ALTER VIEW public.user_recipes OWNER TO docker;

--
-- TOC entry 219 (class 1259 OID 24592)
-- Name: users_id_user_seq; Type: SEQUENCE; Schema: public; Owner: docker
--

CREATE SEQUENCE public.users_id_user_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_user_seq OWNER TO docker;

--
-- TOC entry 3571 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_user_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: docker
--

ALTER SEQUENCE public.users_id_user_seq OWNED BY public.users.id_user;


--
-- TOC entry 3340 (class 2604 OID 24612)
-- Name: ingredients id_in; Type: DEFAULT; Schema: public; Owner: docker
--

ALTER TABLE ONLY public.ingredients ALTER COLUMN id_in SET DEFAULT nextval('public.ingredients_id_in_seq'::regclass);


--
-- TOC entry 3345 (class 2604 OID 24701)
-- Name: prepared id_prepared; Type: DEFAULT; Schema: public; Owner: docker
--

ALTER TABLE ONLY public.prepared ALTER COLUMN id_prepared SET DEFAULT nextval('public.prepared_id_prepared_seq'::regclass);


--
-- TOC entry 3343 (class 2604 OID 24656)
-- Name: recipe_in id_ri; Type: DEFAULT; Schema: public; Owner: docker
--

ALTER TABLE ONLY public.recipe_in ALTER COLUMN id_ri SET DEFAULT nextval('public.recipe_in_id_ri_seq'::regclass);


--
-- TOC entry 3342 (class 2604 OID 24634)
-- Name: recipes id_recipe; Type: DEFAULT; Schema: public; Owner: docker
--

ALTER TABLE ONLY public.recipes ALTER COLUMN id_recipe SET DEFAULT nextval('public.recipes_id_recipe_seq'::regclass);


--
-- TOC entry 3346 (class 2604 OID 24719)
-- Name: segments_p id_segment_p; Type: DEFAULT; Schema: public; Owner: docker
--

ALTER TABLE ONLY public.segments_p ALTER COLUMN id_segment_p SET DEFAULT nextval('public.segments_p_id_segment_p_seq'::regclass);


--
-- TOC entry 3344 (class 2604 OID 24684)
-- Name: segments_r id_segment_r; Type: DEFAULT; Schema: public; Owner: docker
--

ALTER TABLE ONLY public.segments_r ALTER COLUMN id_segment_r SET DEFAULT nextval('public.segments_r_id_segment_r_seq'::regclass);


--
-- TOC entry 3341 (class 2604 OID 24623)
-- Name: unity id_unity; Type: DEFAULT; Schema: public; Owner: docker
--

ALTER TABLE ONLY public.unity ALTER COLUMN id_unity SET DEFAULT nextval('public.unity_id_unity_seq'::regclass);


--
-- TOC entry 3339 (class 2604 OID 24596)
-- Name: users id_user; Type: DEFAULT; Schema: public; Owner: docker
--

ALTER TABLE ONLY public.users ALTER COLUMN id_user SET DEFAULT nextval('public.users_id_user_seq'::regclass);


--
-- TOC entry 3544 (class 0 OID 24609)
-- Dependencies: 222
-- Data for Name: ingredients; Type: TABLE DATA; Schema: public; Owner: docker
--

INSERT INTO public.ingredients VALUES (2, 'milk');
INSERT INTO public.ingredients VALUES (3, 'eggs');
INSERT INTO public.ingredients VALUES (4, 'butter');
INSERT INTO public.ingredients VALUES (5, 'salt');
INSERT INTO public.ingredients VALUES (6, 'black pepper');
INSERT INTO public.ingredients VALUES (7, 'sugar');
INSERT INTO public.ingredients VALUES (8, 'flour');
INSERT INTO public.ingredients VALUES (9, 'water');
INSERT INTO public.ingredients VALUES (10, 'olive oil');
INSERT INTO public.ingredients VALUES (11, 'vegetable oil');
INSERT INTO public.ingredients VALUES (12, 'garlic');
INSERT INTO public.ingredients VALUES (13, 'onion');
INSERT INTO public.ingredients VALUES (14, 'carrot');
INSERT INTO public.ingredients VALUES (15, 'potato');
INSERT INTO public.ingredients VALUES (16, 'tomato');
INSERT INTO public.ingredients VALUES (17, 'bell pepper');
INSERT INTO public.ingredients VALUES (18, 'spinach');
INSERT INTO public.ingredients VALUES (19, 'broccoli');
INSERT INTO public.ingredients VALUES (20, 'zucchini');
INSERT INTO public.ingredients VALUES (21, 'cucumber');
INSERT INTO public.ingredients VALUES (22, 'chicken breast');
INSERT INTO public.ingredients VALUES (23, 'chicken thigh');
INSERT INTO public.ingredients VALUES (24, 'beef');
INSERT INTO public.ingredients VALUES (25, 'pork');
INSERT INTO public.ingredients VALUES (26, 'bacon');
INSERT INTO public.ingredients VALUES (27, 'ham');
INSERT INTO public.ingredients VALUES (28, 'turkey');
INSERT INTO public.ingredients VALUES (29, 'sausages');
INSERT INTO public.ingredients VALUES (30, 'lamb');
INSERT INTO public.ingredients VALUES (31, 'salmon');
INSERT INTO public.ingredients VALUES (32, 'tuna');
INSERT INTO public.ingredients VALUES (33, 'shrimp');
INSERT INTO public.ingredients VALUES (34, 'sardines');
INSERT INTO public.ingredients VALUES (35, 'crab');
INSERT INTO public.ingredients VALUES (36, 'rice');
INSERT INTO public.ingredients VALUES (37, 'pasta');
INSERT INTO public.ingredients VALUES (38, 'bread');
INSERT INTO public.ingredients VALUES (39, 'oats');
INSERT INTO public.ingredients VALUES (40, 'lentils');
INSERT INTO public.ingredients VALUES (41, 'chickpeas');
INSERT INTO public.ingredients VALUES (42, 'kidney beans');
INSERT INTO public.ingredients VALUES (43, 'cheddar cheese');
INSERT INTO public.ingredients VALUES (44, 'mozzarella');
INSERT INTO public.ingredients VALUES (45, 'parmesan');
INSERT INTO public.ingredients VALUES (46, 'heavy cream');
INSERT INTO public.ingredients VALUES (47, 'sour cream');
INSERT INTO public.ingredients VALUES (48, 'yogurt');
INSERT INTO public.ingredients VALUES (49, 'cream cheese');
INSERT INTO public.ingredients VALUES (50, 'feta cheese');
INSERT INTO public.ingredients VALUES (51, 'apple');
INSERT INTO public.ingredients VALUES (52, 'banana');
INSERT INTO public.ingredients VALUES (53, 'orange');
INSERT INTO public.ingredients VALUES (54, 'lemon');
INSERT INTO public.ingredients VALUES (55, 'lime');
INSERT INTO public.ingredients VALUES (56, 'strawberry');
INSERT INTO public.ingredients VALUES (57, 'blueberry');
INSERT INTO public.ingredients VALUES (58, 'raspberry');
INSERT INTO public.ingredients VALUES (59, 'grapes');
INSERT INTO public.ingredients VALUES (60, 'pineapple');
INSERT INTO public.ingredients VALUES (61, 'almonds');
INSERT INTO public.ingredients VALUES (62, 'walnuts');
INSERT INTO public.ingredients VALUES (63, 'peanuts');
INSERT INTO public.ingredients VALUES (64, 'cashews');
INSERT INTO public.ingredients VALUES (65, 'sunflower seeds');
INSERT INTO public.ingredients VALUES (66, 'pumpkin seeds');
INSERT INTO public.ingredients VALUES (67, 'chia seeds');
INSERT INTO public.ingredients VALUES (68, 'sesame seeds');
INSERT INTO public.ingredients VALUES (69, 'hazelnuts');
INSERT INTO public.ingredients VALUES (70, 'basil');
INSERT INTO public.ingredients VALUES (71, 'oregano');
INSERT INTO public.ingredients VALUES (72, 'rosemary');
INSERT INTO public.ingredients VALUES (73, 'cinnamon');
INSERT INTO public.ingredients VALUES (74, 'paprika');
INSERT INTO public.ingredients VALUES (75, 'cumin');
INSERT INTO public.ingredients VALUES (76, 'ginger');
INSERT INTO public.ingredients VALUES (77, 'soy sauce');
INSERT INTO public.ingredients VALUES (78, 'vinegar');
INSERT INTO public.ingredients VALUES (79, 'balsamic vinegar');
INSERT INTO public.ingredients VALUES (80, 'mustard');
INSERT INTO public.ingredients VALUES (81, 'ketchup');
INSERT INTO public.ingredients VALUES (82, 'mayonnaise');
INSERT INTO public.ingredients VALUES (83, 'honey');
INSERT INTO public.ingredients VALUES (84, 'maple syrup');
INSERT INTO public.ingredients VALUES (85, 'hot sauce');
INSERT INTO public.ingredients VALUES (86, 'barbecue sauce');
INSERT INTO public.ingredients VALUES (87, 'tofu');
INSERT INTO public.ingredients VALUES (88, 'turmeric');
INSERT INTO public.ingredients VALUES (89, 'garam masala');
INSERT INTO public.ingredients VALUES (90, 'canned tomatoes');
INSERT INTO public.ingredients VALUES (91, 'peas');
INSERT INTO public.ingredients VALUES (93, 'broth');


--
-- TOC entry 3557 (class 0 OID 24799)
-- Dependencies: 237
-- Data for Name: logins; Type: TABLE DATA; Schema: public; Owner: docker
--

INSERT INTO public.logins VALUES ('172.18.0.1', 1, '2026-02-06 14:30:55.024168');
INSERT INTO public.logins VALUES ('172.18.0.1', 0, '2026-02-06 14:31:47.5893');
INSERT INTO public.logins VALUES ('172.18.0.1', 0, '2026-02-06 14:33:31.761893');
INSERT INTO public.logins VALUES ('172.18.0.1', 0, '2026-02-06 14:33:57.897948');
INSERT INTO public.logins VALUES ('172.18.0.1', 0, '2026-02-06 14:34:21.714435');
INSERT INTO public.logins VALUES ('172.18.0.1', 0, '2026-02-06 14:34:40.589993');
INSERT INTO public.logins VALUES ('172.18.0.1', 0, '2026-02-06 14:35:07.032108');
INSERT INTO public.logins VALUES ('172.18.0.1', 0, '2026-02-06 14:35:45.95835');
INSERT INTO public.logins VALUES ('172.18.0.1', 1, '2026-02-06 14:35:47.959671');
INSERT INTO public.logins VALUES ('172.18.0.1', 1, '2026-02-06 14:37:02.416523');
INSERT INTO public.logins VALUES ('172.18.0.1', 1, '2026-02-06 14:50:31.877175');
INSERT INTO public.logins VALUES ('172.18.0.1', 1, '2026-02-06 15:20:53.659609');
INSERT INTO public.logins VALUES ('172.18.0.1', 1, '2026-02-06 15:37:22.852642');
INSERT INTO public.logins VALUES ('172.18.0.1', 1, '2026-02-06 16:36:34.4907');
INSERT INTO public.logins VALUES ('172.18.0.1', 1, '2026-02-06 17:11:08.909473');
INSERT INTO public.logins VALUES ('172.18.0.1', 1, '2026-02-06 19:01:34.626834');
INSERT INTO public.logins VALUES ('172.18.0.1', 1, '2026-02-06 19:36:45.055148');
INSERT INTO public.logins VALUES ('172.18.0.1', 1, '2026-02-06 19:47:21.475032');
INSERT INTO public.logins VALUES ('172.18.0.1', 1, '2026-02-06 19:56:58.962683');
INSERT INTO public.logins VALUES ('172.18.0.1', 1, '2026-02-06 19:58:10.751835');
INSERT INTO public.logins VALUES ('172.18.0.1', 1, '2026-02-06 19:59:33.311554');
INSERT INTO public.logins VALUES ('172.18.0.1', 1, '2026-02-06 20:10:31.530634');
INSERT INTO public.logins VALUES ('172.18.0.1', 1, '2026-02-06 20:21:16.026159');
INSERT INTO public.logins VALUES ('172.18.0.1', 1, '2026-02-06 20:22:40.869837');
INSERT INTO public.logins VALUES ('172.18.0.1', 0, '2026-02-06 21:51:41.396069');
INSERT INTO public.logins VALUES ('172.18.0.1', 1, '2026-02-06 21:51:44.041316');
INSERT INTO public.logins VALUES ('172.18.0.1', 0, '2026-02-06 21:51:49.62813');
INSERT INTO public.logins VALUES ('172.18.0.1', 0, '2026-02-06 21:51:51.577572');
INSERT INTO public.logins VALUES ('172.18.0.1', 0, '2026-02-06 21:51:53.154477');
INSERT INTO public.logins VALUES ('172.18.0.1', 0, '2026-02-06 21:51:55.014311');
INSERT INTO public.logins VALUES ('172.18.0.1', 0, '2026-02-06 21:51:56.761655');
INSERT INTO public.logins VALUES ('172.18.0.1', 0, '2026-02-06 21:53:39.091233');
INSERT INTO public.logins VALUES ('172.18.0.1', 0, '2026-02-06 21:53:53.331854');
INSERT INTO public.logins VALUES ('172.18.0.1', 0, '2026-02-06 21:55:15.467393');
INSERT INTO public.logins VALUES ('172.18.0.1', 0, '2026-02-06 21:55:25.662889');
INSERT INTO public.logins VALUES ('172.18.0.1', 1, '2026-02-06 21:55:35.806097');
INSERT INTO public.logins VALUES ('172.18.0.1', 1, '2026-02-06 21:55:35.891938');
INSERT INTO public.logins VALUES ('172.18.0.1', 1, '2026-02-06 21:55:36.011229');
INSERT INTO public.logins VALUES ('172.18.0.1', 1, '2026-02-06 21:55:45.125976');
INSERT INTO public.logins VALUES ('172.18.0.1', 0, '2026-02-06 21:56:05.827984');
INSERT INTO public.logins VALUES ('172.18.0.1', 0, '2026-02-06 21:56:07.248184');
INSERT INTO public.logins VALUES ('172.18.0.1', 0, '2026-02-06 21:56:07.822237');
INSERT INTO public.logins VALUES ('172.18.0.1', 0, '2026-02-06 21:56:09.222439');
INSERT INTO public.logins VALUES ('172.18.0.1', 0, '2026-02-06 21:56:10.795602');
INSERT INTO public.logins VALUES ('172.18.0.1', 1, '2026-02-06 21:56:20.93358');
INSERT INTO public.logins VALUES ('172.18.0.1', 1, '2026-02-06 21:56:21.014133');
INSERT INTO public.logins VALUES ('172.18.0.1', 1, '2026-02-06 21:56:21.098846');
INSERT INTO public.logins VALUES ('172.18.0.1', 1, '2026-02-06 21:56:21.186162');
INSERT INTO public.logins VALUES ('172.18.0.1', 1, '2026-02-06 21:56:21.308988');
INSERT INTO public.logins VALUES ('172.18.0.1', 1, '2026-02-06 21:56:21.389807');
INSERT INTO public.logins VALUES ('172.18.0.1', 1, '2026-02-06 21:56:21.470674');
INSERT INTO public.logins VALUES ('172.18.0.1', 1, '2026-02-06 21:56:21.550624');
INSERT INTO public.logins VALUES ('172.18.0.1', 1, '2026-02-06 21:56:21.631558');
INSERT INTO public.logins VALUES ('172.18.0.1', 1, '2026-02-06 21:56:21.712133');
INSERT INTO public.logins VALUES ('172.18.0.1', 1, '2026-02-06 21:56:21.79299');
INSERT INTO public.logins VALUES ('172.18.0.1', 1, '2026-02-06 22:26:13.888401');
INSERT INTO public.logins VALUES ('172.18.0.1', 1, '2026-02-06 22:27:44.735243');
INSERT INTO public.logins VALUES ('172.18.0.1', 1, '2026-02-06 22:28:00.732196');
INSERT INTO public.logins VALUES ('172.18.0.1', 1, '2026-02-06 22:31:47.513862');
INSERT INTO public.logins VALUES ('172.18.0.1', 1, '2026-02-06 22:42:18.379608');
INSERT INTO public.logins VALUES ('172.18.0.1', 1, '2026-02-06 22:45:01.194029');
INSERT INTO public.logins VALUES ('172.18.0.1', 1, '2026-02-06 23:33:38.924628');
INSERT INTO public.logins VALUES ('172.18.0.1', 1, '2026-02-07 00:14:35.874894');


--
-- TOC entry 3554 (class 0 OID 24698)
-- Dependencies: 232
-- Data for Name: prepared; Type: TABLE DATA; Schema: public; Owner: docker
--

INSERT INTO public.prepared VALUES (91, 95, 0);
INSERT INTO public.prepared VALUES (92, 96, 0);
INSERT INTO public.prepared VALUES (93, 97, 0);
INSERT INTO public.prepared VALUES (95, 99, 0);
INSERT INTO public.prepared VALUES (97, 101, 0);
INSERT INTO public.prepared VALUES (100, 104, 0);
INSERT INTO public.prepared VALUES (103, 107, 1);


--
-- TOC entry 3550 (class 0 OID 24653)
-- Dependencies: 228
-- Data for Name: recipe_in; Type: TABLE DATA; Schema: public; Owner: docker
--

INSERT INTO public.recipe_in VALUES (29, 17, 37, 7, 1.50);
INSERT INTO public.recipe_in VALUES (30, 17, 18, 7, 0.50);
INSERT INTO public.recipe_in VALUES (31, 17, 16, 8, 15.00);
INSERT INTO public.recipe_in VALUES (32, 17, 46, 3, 50.00);
INSERT INTO public.recipe_in VALUES (33, 17, 10, 6, 3.00);
INSERT INTO public.recipe_in VALUES (34, 17, 44, 1, 100.00);
INSERT INTO public.recipe_in VALUES (40, 19, 88, 5, 4.00);
INSERT INTO public.recipe_in VALUES (41, 19, 89, 5, 4.00);
INSERT INTO public.recipe_in VALUES (42, 19, 8, 6, 2.00);
INSERT INTO public.recipe_in VALUES (43, 19, 73, 5, 0.30);
INSERT INTO public.recipe_in VALUES (44, 19, 7, 1, 3.00);
INSERT INTO public.recipe_in VALUES (45, 19, 76, 1, 5.00);
INSERT INTO public.recipe_in VALUES (46, 19, 13, 8, 1.00);
INSERT INTO public.recipe_in VALUES (47, 19, 12, 8, 4.00);
INSERT INTO public.recipe_in VALUES (48, 19, 16, 8, 5.00);
INSERT INTO public.recipe_in VALUES (49, 19, 46, 3, 75.00);
INSERT INTO public.recipe_in VALUES (50, 20, 93, 3, 500.00);
INSERT INTO public.recipe_in VALUES (51, 20, 20, 1, 800.00);
INSERT INTO public.recipe_in VALUES (52, 20, 5, 5, 0.50);
INSERT INTO public.recipe_in VALUES (53, 20, 6, 5, 0.50);
INSERT INTO public.recipe_in VALUES (54, 20, 13, 8, 1.00);
INSERT INTO public.recipe_in VALUES (55, 20, 12, 8, 4.00);
INSERT INTO public.recipe_in VALUES (56, 20, 46, 3, 50.00);
INSERT INTO public.recipe_in VALUES (57, 20, 4, 6, 2.00);
INSERT INTO public.recipe_in VALUES (58, 21, 28, 1, 300.00);
INSERT INTO public.recipe_in VALUES (59, 21, 13, 8, 1.00);
INSERT INTO public.recipe_in VALUES (60, 21, 16, 1, 400.00);
INSERT INTO public.recipe_in VALUES (61, 21, 37, 1, 250.00);
INSERT INTO public.recipe_in VALUES (62, 21, 44, 1, 150.00);
INSERT INTO public.recipe_in VALUES (63, 21, 10, 6, 2.00);
INSERT INTO public.recipe_in VALUES (64, 22, 37, 1, 250.00);
INSERT INTO public.recipe_in VALUES (65, 22, 43, 1, 200.00);
INSERT INTO public.recipe_in VALUES (66, 22, 2, 7, 1.00);
INSERT INTO public.recipe_in VALUES (67, 22, 8, 1, 30.00);
INSERT INTO public.recipe_in VALUES (68, 22, 4, 1, 35.00);
INSERT INTO public.recipe_in VALUES (69, 22, 6, 5, 0.50);
INSERT INTO public.recipe_in VALUES (70, 23, 18, 1, 100.00);
INSERT INTO public.recipe_in VALUES (71, 23, 31, 1, 700.00);
INSERT INTO public.recipe_in VALUES (72, 23, 46, 3, 200.00);
INSERT INTO public.recipe_in VALUES (73, 23, 88, 5, 2.00);
INSERT INTO public.recipe_in VALUES (74, 23, 10, 6, 2.00);
INSERT INTO public.recipe_in VALUES (75, 23, 36, 7, 1.00);
INSERT INTO public.recipe_in VALUES (76, 23, 16, 8, 1.00);
INSERT INTO public.recipe_in VALUES (77, 24, 8, 7, 1.00);
INSERT INTO public.recipe_in VALUES (78, 24, 2, 7, 1.00);
INSERT INTO public.recipe_in VALUES (79, 24, 9, 7, 0.75);
INSERT INTO public.recipe_in VALUES (80, 24, 5, 1, 2.00);
INSERT INTO public.recipe_in VALUES (81, 24, 3, 8, 2.00);
INSERT INTO public.recipe_in VALUES (82, 24, 11, 6, 3.00);


--
-- TOC entry 3548 (class 0 OID 24631)
-- Dependencies: 226
-- Data for Name: recipes; Type: TABLE DATA; Schema: public; Owner: docker
--

INSERT INTO public.recipes VALUES (17, 3, 'pasta with garlic', 'start boiling the water for the pasta
heat up the olive oil in the pan
add minced garlic, little tomatoes and fresh spinach
cook the pasta
add heavy cream to the pan once the pasta is ready
 add pasta to the sauce in the pan and enjoy', 2, 30);
INSERT INTO public.recipes VALUES (19, 1, 'tikka masala', 'slice tofu into even cubes
cover the cubes with 2 teaspoons of garam masala, two teaspoons of turmeric
and two tablespoons of flour. Bake in the 180 degree temperature for 20 minutes
fry minced garlic and diced onion with rest of the spices in the pot
chop the tomatoes and add to the pot. Boil the sauce for 5 minutes
let the sauce cool for a while then blend it and add heavy cream.
In the end, add baked tofu and reheat everything together', 3, 70);
INSERT INTO public.recipes VALUES (20, 1, 'zuchinni soup', 'wash, slice and bake zucchini for 30 minutes in 180 degree heat
fry sliced garlic and onion with butter in the pot and then add broth
boil the zucchini with the rest of ingredients for 15 minutes
then blend everything and add heavy cream ', 3, 50);
INSERT INTO public.recipes VALUES (21, 1, 'spaghetti', 'fry turkey and diced onion with olive oil for about ten minutes
add tomatoe and boil everything for 15 minutes
cook the pasta following instructions on the package
mix pasta with sauce and serve with mozzarella', 4, 60);
INSERT INTO public.recipes VALUES (22, 3, 'mac-n-cheese', 'cook the pasta following instructions on the package
melt butter in the deep pan, add flour, mix until even
add milk and wait for the mixture to get dense
then add grated cheddar and pepper
when everything combines together add pasta', 2, 45);
INSERT INTO public.recipes VALUES (23, 1, 'salmon with spinach', 'slice salmon and cover in turmeric. leave for 15 minutes
then fry the salmon for 5-10 minutes
add fresh spinach and sliced tomato
add heavy cream once the spinach shrinks 
serve with rice
', 4, 50);
INSERT INTO public.recipes VALUES (24, 1, 'pancakes', 'mix everything exept for the oil
once everything is combined add oil and mix everything again
fry the pancakes (takes a while </3)', 2, 30);


--
-- TOC entry 3556 (class 0 OID 24716)
-- Dependencies: 234
-- Data for Name: segments_p; Type: TABLE DATA; Schema: public; Owner: docker
--

INSERT INTO public.segments_p VALUES (23, 91, '2026-02-02 14:00:00', '2026-02-02 14:30:00');
INSERT INTO public.segments_p VALUES (24, 91, '2026-02-03 15:00:00', '2026-02-03 15:30:00');
INSERT INTO public.segments_p VALUES (25, 92, '2026-02-04 10:30:00', '2026-02-04 11:00:00');
INSERT INTO public.segments_p VALUES (26, 92, '2026-02-05 15:00:00', '2026-02-05 15:30:00');
INSERT INTO public.segments_p VALUES (27, 93, '2026-01-30 15:00:00', '2026-01-30 15:30:00');
INSERT INTO public.segments_p VALUES (28, 95, '2026-01-30 19:30:00', '2026-01-30 20:00:00');
INSERT INTO public.segments_p VALUES (29, 93, '2026-01-31 16:00:00', '2026-01-31 16:30:00');
INSERT INTO public.segments_p VALUES (30, 95, '2026-01-31 16:30:00', '2026-01-31 17:00:00');
INSERT INTO public.segments_p VALUES (31, 93, '2026-02-01 16:00:00', '2026-02-01 16:30:00');
INSERT INTO public.segments_p VALUES (32, 95, '2026-02-01 16:30:00', '2026-02-01 17:00:00');
INSERT INTO public.segments_p VALUES (33, 97, '2026-02-02 16:00:00', '2026-02-02 16:30:00');
INSERT INTO public.segments_p VALUES (39, 97, '2026-02-02 21:30:00', '2026-02-02 22:00:00');
INSERT INTO public.segments_p VALUES (40, 100, '2026-02-05 14:00:00', '2026-02-05 14:30:00');
INSERT INTO public.segments_p VALUES (41, 100, '2026-02-05 20:30:00', '2026-02-05 21:00:00');
INSERT INTO public.segments_p VALUES (43, 100, '2026-02-07 16:30:00', '2026-02-07 17:00:00');
INSERT INTO public.segments_p VALUES (45, 97, '2026-02-03 16:00:00', '2026-02-03 16:30:00');
INSERT INTO public.segments_p VALUES (46, 97, '2026-02-04 16:00:00', '2026-02-04 16:30:00');
INSERT INTO public.segments_p VALUES (47, 100, '2026-02-06 16:30:00', '2026-02-06 17:00:00');
INSERT INTO public.segments_p VALUES (48, 103, '2026-02-08 09:30:00', '2026-02-08 10:00:00');


--
-- TOC entry 3552 (class 0 OID 24681)
-- Dependencies: 230
-- Data for Name: segments_r; Type: TABLE DATA; Schema: public; Owner: docker
--

INSERT INTO public.segments_r VALUES (95, 22, '2026-02-02 13:00:00', '2026-02-02 14:00:00');
INSERT INTO public.segments_r VALUES (96, 17, '2026-02-04 10:00:00', '2026-02-04 10:30:00');
INSERT INTO public.segments_r VALUES (97, 20, '2026-01-30 14:00:00', '2026-01-30 15:00:00');
INSERT INTO public.segments_r VALUES (99, 19, '2026-01-30 18:00:00', '2026-01-30 19:30:00');
INSERT INTO public.segments_r VALUES (101, 23, '2026-02-02 15:00:00', '2026-02-02 16:00:00');
INSERT INTO public.segments_r VALUES (104, 21, '2026-02-05 13:00:00', '2026-02-05 14:00:00');
INSERT INTO public.segments_r VALUES (107, 24, '2026-02-08 09:00:00', '2026-02-08 09:30:00');


--
-- TOC entry 3546 (class 0 OID 24620)
-- Dependencies: 224
-- Data for Name: unity; Type: TABLE DATA; Schema: public; Owner: docker
--

INSERT INTO public.unity VALUES (1, 'gram');
INSERT INTO public.unity VALUES (2, 'kilogram');
INSERT INTO public.unity VALUES (3, 'milliliter');
INSERT INTO public.unity VALUES (4, 'liter');
INSERT INTO public.unity VALUES (5, 'teaspoon');
INSERT INTO public.unity VALUES (6, 'tablespoon');
INSERT INTO public.unity VALUES (7, 'cup');
INSERT INTO public.unity VALUES (8, 'piece');
INSERT INTO public.unity VALUES (9, 'slice');


--
-- TOC entry 3542 (class 0 OID 24593)
-- Dependencies: 220
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: docker
--

INSERT INTO public.users VALUES (3, 'Pusheen24@wp.pl', '$2y$10$loWR9XDZGd7Y6ncO/AFcp.73zLauVAzbgAB7SxLElXgwqnMjni.FK', 'iga', 'Andrzejewska');
INSERT INTO public.users VALUES (4, 'example2@gmail.com', '$2y$10$c.iZOrY3IaP5TTLIKrf8yer4K2unMwDN3a0qqff0PAdTHRS9.4L9a', 'hishis', 'hissssssss');
INSERT INTO public.users VALUES (1, 'example@gmail.com', '$2y$10$9OT2pbrGR6aTcI7s.Ik/l.P8q1ji/zs/3cFCpcDN5/a9fStspRvky', 'Natalia', 'hisshiss');


--
-- TOC entry 3572 (class 0 OID 0)
-- Dependencies: 221
-- Name: ingredients_id_in_seq; Type: SEQUENCE SET; Schema: public; Owner: docker
--

SELECT pg_catalog.setval('public.ingredients_id_in_seq', 86, true);


--
-- TOC entry 3573 (class 0 OID 0)
-- Dependencies: 231
-- Name: prepared_id_prepared_seq; Type: SEQUENCE SET; Schema: public; Owner: docker
--

SELECT pg_catalog.setval('public.prepared_id_prepared_seq', 103, true);


--
-- TOC entry 3574 (class 0 OID 0)
-- Dependencies: 227
-- Name: recipe_in_id_ri_seq; Type: SEQUENCE SET; Schema: public; Owner: docker
--

SELECT pg_catalog.setval('public.recipe_in_id_ri_seq', 82, true);


--
-- TOC entry 3575 (class 0 OID 0)
-- Dependencies: 225
-- Name: recipes_id_recipe_seq; Type: SEQUENCE SET; Schema: public; Owner: docker
--

SELECT pg_catalog.setval('public.recipes_id_recipe_seq', 24, true);


--
-- TOC entry 3576 (class 0 OID 0)
-- Dependencies: 233
-- Name: segments_p_id_segment_p_seq; Type: SEQUENCE SET; Schema: public; Owner: docker
--

SELECT pg_catalog.setval('public.segments_p_id_segment_p_seq', 48, true);


--
-- TOC entry 3577 (class 0 OID 0)
-- Dependencies: 229
-- Name: segments_r_id_segment_r_seq; Type: SEQUENCE SET; Schema: public; Owner: docker
--

SELECT pg_catalog.setval('public.segments_r_id_segment_r_seq', 107, true);


--
-- TOC entry 3578 (class 0 OID 0)
-- Dependencies: 223
-- Name: unity_id_unity_seq; Type: SEQUENCE SET; Schema: public; Owner: docker
--

SELECT pg_catalog.setval('public.unity_id_unity_seq', 9, true);


--
-- TOC entry 3579 (class 0 OID 0)
-- Dependencies: 219
-- Name: users_id_user_seq; Type: SEQUENCE SET; Schema: public; Owner: docker
--

SELECT pg_catalog.setval('public.users_id_user_seq', 4, true);


--
-- TOC entry 3359 (class 2606 OID 24618)
-- Name: ingredients ingredients_name_key; Type: CONSTRAINT; Schema: public; Owner: docker
--

ALTER TABLE ONLY public.ingredients
    ADD CONSTRAINT ingredients_name_key UNIQUE (name);


--
-- TOC entry 3361 (class 2606 OID 24616)
-- Name: ingredients ingredients_pkey; Type: CONSTRAINT; Schema: public; Owner: docker
--

ALTER TABLE ONLY public.ingredients
    ADD CONSTRAINT ingredients_pkey PRIMARY KEY (id_in);


--
-- TOC entry 3373 (class 2606 OID 24709)
-- Name: prepared prepared_id_segment_r_key; Type: CONSTRAINT; Schema: public; Owner: docker
--

ALTER TABLE ONLY public.prepared
    ADD CONSTRAINT prepared_id_segment_r_key UNIQUE (id_segment_r);


--
-- TOC entry 3375 (class 2606 OID 24707)
-- Name: prepared prepared_pkey; Type: CONSTRAINT; Schema: public; Owner: docker
--

ALTER TABLE ONLY public.prepared
    ADD CONSTRAINT prepared_pkey PRIMARY KEY (id_prepared);


--
-- TOC entry 3369 (class 2606 OID 24664)
-- Name: recipe_in recipe_in_pkey; Type: CONSTRAINT; Schema: public; Owner: docker
--

ALTER TABLE ONLY public.recipe_in
    ADD CONSTRAINT recipe_in_pkey PRIMARY KEY (id_ri);


--
-- TOC entry 3367 (class 2606 OID 24646)
-- Name: recipes recipes_pkey; Type: CONSTRAINT; Schema: public; Owner: docker
--

ALTER TABLE ONLY public.recipes
    ADD CONSTRAINT recipes_pkey PRIMARY KEY (id_recipe);


--
-- TOC entry 3377 (class 2606 OID 24726)
-- Name: segments_p segments_p_pkey; Type: CONSTRAINT; Schema: public; Owner: docker
--

ALTER TABLE ONLY public.segments_p
    ADD CONSTRAINT segments_p_pkey PRIMARY KEY (id_segment_p);


--
-- TOC entry 3371 (class 2606 OID 24691)
-- Name: segments_r segments_r_pkey; Type: CONSTRAINT; Schema: public; Owner: docker
--

ALTER TABLE ONLY public.segments_r
    ADD CONSTRAINT segments_r_pkey PRIMARY KEY (id_segment_r);


--
-- TOC entry 3363 (class 2606 OID 24629)
-- Name: unity unity_name_key; Type: CONSTRAINT; Schema: public; Owner: docker
--

ALTER TABLE ONLY public.unity
    ADD CONSTRAINT unity_name_key UNIQUE (name);


--
-- TOC entry 3365 (class 2606 OID 24627)
-- Name: unity unity_pkey; Type: CONSTRAINT; Schema: public; Owner: docker
--

ALTER TABLE ONLY public.unity
    ADD CONSTRAINT unity_pkey PRIMARY KEY (id_unity);


--
-- TOC entry 3355 (class 2606 OID 24607)
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: docker
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- TOC entry 3357 (class 2606 OID 24605)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: docker
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id_user);


--
-- TOC entry 3389 (class 2620 OID 24768)
-- Name: segments_r trg_create_prepared; Type: TRIGGER; Schema: public; Owner: docker
--

CREATE TRIGGER trg_create_prepared AFTER INSERT ON public.segments_r FOR EACH ROW EXECUTE FUNCTION public.create_prepared();


--
-- TOC entry 3390 (class 2620 OID 24770)
-- Name: segments_p trg_decrease_portions; Type: TRIGGER; Schema: public; Owner: docker
--

CREATE TRIGGER trg_decrease_portions AFTER INSERT ON public.segments_p FOR EACH ROW EXECUTE FUNCTION public.decrease_portions();


--
-- TOC entry 3391 (class 2620 OID 24772)
-- Name: segments_p trg_increase_portions; Type: TRIGGER; Schema: public; Owner: docker
--

CREATE TRIGGER trg_increase_portions AFTER DELETE ON public.segments_p FOR EACH ROW EXECUTE FUNCTION public.increase_portions();


--
-- TOC entry 3387 (class 2606 OID 24747)
-- Name: segments_p fk_prepared; Type: FK CONSTRAINT; Schema: public; Owner: docker
--

ALTER TABLE ONLY public.segments_p
    ADD CONSTRAINT fk_prepared FOREIGN KEY (id_prepared) REFERENCES public.prepared(id_prepared) ON DELETE CASCADE;


--
-- TOC entry 3380 (class 2606 OID 24732)
-- Name: recipe_in fk_recipe; Type: FK CONSTRAINT; Schema: public; Owner: docker
--

ALTER TABLE ONLY public.recipe_in
    ADD CONSTRAINT fk_recipe FOREIGN KEY (id_recipe) REFERENCES public.recipes(id_recipe) ON DELETE CASCADE;


--
-- TOC entry 3385 (class 2606 OID 24742)
-- Name: prepared fk_segment_r; Type: FK CONSTRAINT; Schema: public; Owner: docker
--

ALTER TABLE ONLY public.prepared
    ADD CONSTRAINT fk_segment_r FOREIGN KEY (id_segment_r) REFERENCES public.segments_r(id_segment_r) ON DELETE CASCADE;


--
-- TOC entry 3378 (class 2606 OID 24737)
-- Name: recipes fk_user; Type: FK CONSTRAINT; Schema: public; Owner: docker
--

ALTER TABLE ONLY public.recipes
    ADD CONSTRAINT fk_user FOREIGN KEY (id_user) REFERENCES public.users(id_user) ON DELETE CASCADE;


--
-- TOC entry 3386 (class 2606 OID 24757)
-- Name: prepared prepared_id_segment_r_fkey; Type: FK CONSTRAINT; Schema: public; Owner: docker
--

ALTER TABLE ONLY public.prepared
    ADD CONSTRAINT prepared_id_segment_r_fkey FOREIGN KEY (id_segment_r) REFERENCES public.segments_r(id_segment_r) ON DELETE CASCADE;


--
-- TOC entry 3381 (class 2606 OID 24670)
-- Name: recipe_in recipe_in_id_in_fkey; Type: FK CONSTRAINT; Schema: public; Owner: docker
--

ALTER TABLE ONLY public.recipe_in
    ADD CONSTRAINT recipe_in_id_in_fkey FOREIGN KEY (id_in) REFERENCES public.ingredients(id_in);


--
-- TOC entry 3382 (class 2606 OID 24752)
-- Name: recipe_in recipe_in_id_recipe_fkey; Type: FK CONSTRAINT; Schema: public; Owner: docker
--

ALTER TABLE ONLY public.recipe_in
    ADD CONSTRAINT recipe_in_id_recipe_fkey FOREIGN KEY (id_recipe) REFERENCES public.recipes(id_recipe) ON DELETE CASCADE;


--
-- TOC entry 3383 (class 2606 OID 24675)
-- Name: recipe_in recipe_in_id_unity_fkey; Type: FK CONSTRAINT; Schema: public; Owner: docker
--

ALTER TABLE ONLY public.recipe_in
    ADD CONSTRAINT recipe_in_id_unity_fkey FOREIGN KEY (id_unity) REFERENCES public.unity(id_unity);


--
-- TOC entry 3379 (class 2606 OID 24647)
-- Name: recipes recipes_id_user_fkey; Type: FK CONSTRAINT; Schema: public; Owner: docker
--

ALTER TABLE ONLY public.recipes
    ADD CONSTRAINT recipes_id_user_fkey FOREIGN KEY (id_user) REFERENCES public.users(id_user) ON DELETE CASCADE;


--
-- TOC entry 3388 (class 2606 OID 24762)
-- Name: segments_p segments_p_id_prepared_fkey; Type: FK CONSTRAINT; Schema: public; Owner: docker
--

ALTER TABLE ONLY public.segments_p
    ADD CONSTRAINT segments_p_id_prepared_fkey FOREIGN KEY (id_prepared) REFERENCES public.prepared(id_prepared) ON DELETE CASCADE;


--
-- TOC entry 3384 (class 2606 OID 24782)
-- Name: segments_r segments_r_id_recipe_fkey; Type: FK CONSTRAINT; Schema: public; Owner: docker
--

ALTER TABLE ONLY public.segments_r
    ADD CONSTRAINT segments_r_id_recipe_fkey FOREIGN KEY (id_recipe) REFERENCES public.recipes(id_recipe) ON DELETE CASCADE;


-- Completed on 2026-02-07 01:34:53

--
-- PostgreSQL database dump complete
--

\unrestrict eyTOlse1eKX7sQKrXL1HnCtOzckpYftuIKe16GIVIcMDtjC2dh4ZZgs7X5dCbcA

