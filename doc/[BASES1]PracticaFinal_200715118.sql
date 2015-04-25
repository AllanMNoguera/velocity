--
-- ER/Studio 8.0 SQL Code Generation
-- Company :      Home
-- Project :      [BASES1]PracticaFinal_200715118.dm1
-- Author :       Allan Noguera
--
-- Date Created : Thursday, April 23, 2015 16:59:43
-- Target DBMS : MySQL 5.x
--

-- 
-- TABLE: BUS 
--

CREATE TABLE BUS(
    BUS         INT            NOT NULL,
    PLACA       VARCHAR(10),
    TIPO_BUS    INT            NOT NULL,
    PRIMARY KEY (BUS)
)ENGINE=MYISAM
;



-- 
-- TABLE: LUGAR 
--

CREATE TABLE LUGAR(
    LUGAR         INT            NOT NULL,
    NOMBRE        VARCHAR(20),
    COORDENADA    VARCHAR(10),
    PRIMARY KEY (LUGAR)
)ENGINE=MYISAM
;



-- 
-- TABLE: PAGO 
--

CREATE TABLE PAGO(
    CONFIRMACION    INT            NOT NULL,
    MONTO           FLOAT(8, 0),
    TIQUETE         INT,
    PRIMARY KEY (CONFIRMACION)
)ENGINE=MYISAM
;



-- 
-- TABLE: RUTA 
--

CREATE TABLE RUTA(
    RUTA            VARCHAR(10)    NOT NULL,
    HORA_PARTIDA    VARCHAR(5)     NOT NULL,
    BUS             INT            NOT NULL,
    PRIMARY KEY (RUTA, HORA_PARTIDA, BUS)
)ENGINE=MYISAM
;



-- 
-- TABLE: RUTA_LUGAR 
--

CREATE TABLE RUTA_LUGAR(
    RUTA               VARCHAR(10)    NOT NULL,
    HORA_LUGAR         VARCHAR(5)     NOT NULL,
    LUGAR              INT            NOT NULL,
    HORA_PARTIDA       VARCHAR(5)     NOT NULL,
    BUS                INT            NOT NULL,
    COSTO_DESDE_ANT    FLOAT(8, 0),
    TIPO_PUNTO         INT            NOT NULL,
    PRIMARY KEY (RUTA, HORA_LUGAR, LUGAR, HORA_PARTIDA, BUS)
)ENGINE=MYISAM
;



-- 
-- TABLE: RUTA_TIQUETE 
--

CREATE TABLE RUTA_TIQUETE(
    RUTA            VARCHAR(10)    NOT NULL,
    HORA_LUGAR      VARCHAR(5)     NOT NULL,
    LUGAR           INT            NOT NULL,
    HORA_PARTIDA    VARCHAR(5)     NOT NULL,
    BUS             INT            NOT NULL,
    TIQUETE         INT            NOT NULL,
    TIPO_PUNTO      INT            NOT NULL,
    PRIMARY KEY (RUTA, HORA_LUGAR, LUGAR, HORA_PARTIDA, BUS, TIQUETE)
)ENGINE=MYISAM
;



-- 
-- TABLE: TIPO_BUS 
--

CREATE TABLE TIPO_BUS(
    TIPO_BUS     INT            NOT NULL,
    NOMBRE       VARCHAR(20),
    CAPACIDAD    INT,
    PRIMARY KEY (TIPO_BUS)
)ENGINE=MYISAM
;



-- 
-- TABLE: TIPO_PUNTO 
--

CREATE TABLE TIPO_PUNTO(
    TIPO_PUNTO    INT            NOT NULL,
    TIPO          VARCHAR(20),
    PRIMARY KEY (TIPO_PUNTO)
)ENGINE=MYISAM
;



-- 
-- TABLE: TIQUETE 
--

CREATE TABLE TIQUETE(
    TIQUETE         INT     NOT NULL,
    FECHA_COMPRA    DATE,
    PRIMARY KEY (TIQUETE)
)ENGINE=MYISAM
;



-- 
-- INDEX: Ref52 
--

CREATE INDEX Ref52 ON BUS(TIPO_BUS)
;
-- 
-- INDEX: Ref714 
--

CREATE INDEX Ref714 ON PAGO(TIQUETE)
;
-- 
-- INDEX: Ref35 
--

CREATE INDEX Ref35 ON RUTA(BUS)
;
-- 
-- INDEX: Ref23 
--

CREATE INDEX Ref23 ON RUTA_LUGAR(HORA_PARTIDA, BUS, RUTA)
;
-- 
-- INDEX: Ref14 
--

CREATE INDEX Ref14 ON RUTA_LUGAR(LUGAR)
;
-- 
-- INDEX: Ref1013 
--

CREATE INDEX Ref1013 ON RUTA_LUGAR(TIPO_PUNTO)
;
-- 
-- INDEX: Ref1010 
--

CREATE INDEX Ref1010 ON RUTA_TIQUETE(TIPO_PUNTO)
;
-- 
-- INDEX: Ref611 
--

CREATE INDEX Ref611 ON RUTA_TIQUETE(BUS, RUTA, HORA_PARTIDA, LUGAR, HORA_LUGAR)
;
-- 
-- INDEX: Ref712 
--

CREATE INDEX Ref712 ON RUTA_TIQUETE(TIQUETE)
;
-- 
-- TABLE: BUS 
--

ALTER TABLE BUS ADD CONSTRAINT RefTIPO_BUS2 
    FOREIGN KEY (TIPO_BUS)
    REFERENCES TIPO_BUS(TIPO_BUS)
;


-- 
-- TABLE: PAGO 
--

ALTER TABLE PAGO ADD CONSTRAINT RefTIQUETE14 
    FOREIGN KEY (TIQUETE)
    REFERENCES TIQUETE(TIQUETE)
;


-- 
-- TABLE: RUTA 
--

ALTER TABLE RUTA ADD CONSTRAINT RefBUS5 
    FOREIGN KEY (BUS)
    REFERENCES BUS(BUS)
;


-- 
-- TABLE: RUTA_LUGAR 
--

ALTER TABLE RUTA_LUGAR ADD CONSTRAINT RefRUTA3 
    FOREIGN KEY (RUTA, HORA_PARTIDA, BUS)
    REFERENCES RUTA(RUTA, HORA_PARTIDA, BUS)
;

ALTER TABLE RUTA_LUGAR ADD CONSTRAINT RefLUGAR4 
    FOREIGN KEY (LUGAR)
    REFERENCES LUGAR(LUGAR)
;

ALTER TABLE RUTA_LUGAR ADD CONSTRAINT RefTIPO_PUNTO13 
    FOREIGN KEY (TIPO_PUNTO)
    REFERENCES TIPO_PUNTO(TIPO_PUNTO)
;


-- 
-- TABLE: RUTA_TIQUETE 
--

ALTER TABLE RUTA_TIQUETE ADD CONSTRAINT RefTIPO_PUNTO10 
    FOREIGN KEY (TIPO_PUNTO)
    REFERENCES TIPO_PUNTO(TIPO_PUNTO)
;

ALTER TABLE RUTA_TIQUETE ADD CONSTRAINT RefRUTA_LUGAR11 
    FOREIGN KEY (RUTA, HORA_LUGAR, LUGAR, HORA_PARTIDA, BUS)
    REFERENCES RUTA_LUGAR(RUTA, HORA_LUGAR, LUGAR, HORA_PARTIDA, BUS)
;

ALTER TABLE RUTA_TIQUETE ADD CONSTRAINT RefTIQUETE12 
    FOREIGN KEY (TIQUETE)
    REFERENCES TIQUETE(TIQUETE)
;


