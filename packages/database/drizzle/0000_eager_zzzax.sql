CREATE TABLE IF NOT EXISTS "asegurados_to_contactos" (
	"asegurado_id" bigint NOT NULL,
	"contacto_id" bigint NOT NULL,
	CONSTRAINT "asegurados_to_contactos_asegurado_id_contacto_id_pk" PRIMARY KEY("asegurado_id","contacto_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "agentes" (
	"id" serial PRIMARY KEY NOT NULL,
	"saas_id" varchar(50),
	"nexus_id" integer,
	"nombre" varchar(256) NOT NULL,
	"email" varchar(200),
	"qualitas_id" varchar,
	"anaseguros_id" varchar
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "asegurados" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"saas_id" varchar(50),
	"name" varchar(200) NOT NULL,
	"email" varchar(200),
	"rfc" varchar(20),
	"nexus_id" integer,
	"qualitas_id" varchar(20),
	"ana_id" varchar(20),
	"celular" varchar(45),
	"direccion" varchar(200)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "companias" (
	"id" varchar(15) PRIMARY KEY NOT NULL,
	"compania" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "conductos" (
	"id" serial PRIMARY KEY NOT NULL,
	"saas_id" varchar(50),
	"nexus_id" integer,
	"name" varchar(256) NOT NULL,
	"email" varchar(200)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "contactos" (
	"13" varchar,
	"id" bigserial PRIMARY KEY NOT NULL,
	"saas_id" varchar,
	"agente_id" integer,
	"conducto_id" integer,
	"nombre" varchar(100) NOT NULL,
	"email" varchar(255) NOT NULL,
	"telefono" varchar(40),
	"direccion" text,
	"ciudad" varchar(100),
	"pais" varchar(100),
	"fecha_nacimiento" date,
	"es_cliente" boolean DEFAULT false,
	"fecha_creacion" date DEFAULT now(),
	"fecha_conversion" date,
	"fecha_actualizacion" date DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "endosos" (
	"id" serial PRIMARY KEY NOT NULL,
	"saas_id" varchar(50),
	"poliza_id" bigint,
	"endoso" varchar(20),
	"fecha_vencimiento" date,
	"numero_recibo" varchar(20),
	"remesa" varchar(20),
	"fecha_pago" date,
	"fecha_registro_pago" date,
	"importe" numeric(12, 2),
	"estado" varchar(20),
	"tipoendoso_id" integer
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "modo_pagos" (
	"id" serial PRIMARY KEY NOT NULL,
	"modo_pago" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "poliza_movimientos" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"saas_id" varchar(50),
	"poliza_id" bigint,
	"agente_id" integer,
	"numero_poliza" varchar(40),
	"conducto_id" integer,
	"asegurado_id" bigint,
	"vehiculo_id" bigint,
	"company_id" varchar,
	"tipoMovimiento" varchar,
	"motivo" varchar,
	"fecha_registro" date DEFAULT now(),
	"fecha_movimiento" date,
	CONSTRAINT "unique_poliza_movimiento_idx" UNIQUE("saas_id","numero_poliza","fecha_movimiento","tipoMovimiento","poliza_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "polizas" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"saas_id" varchar(50),
	"es_maestra" boolean DEFAULT true,
	"ramo_id" integer,
	"subramo_id" integer,
	"company_id" varchar,
	"agente_id" integer,
	"conducto_id" integer,
	"vehiculo_id" bigint,
	"asegurado_id" bigint,
	"uso_id" integer,
	"servicio_id" integer,
	"placas" varchar(20),
	"numero_serie" varchar(40),
	"numero_economico" varchar(40),
	"numero_poliza" varchar(40),
	"poliza_anterior" varchar(40),
	"poliza_renovada" varchar(40),
	"cobertura" varchar(40),
	"total_incisos" smallint DEFAULT 1,
	"incisos_vigentes" smallint DEFAULT 1,
	"incisos_cancelados" smallint DEFAULT 0,
	"inciso" varchar(20),
	"endoso" varchar(20),
	"oficina_emision" varchar(40),
	"descuento_porcentual" numeric(5, 2) DEFAULT '0',
	"fecha_emision" date,
	"vigencia_inicio" date,
	"vigencia_fin" date,
	"tarifa" varchar(20),
	"modopago_id" integer,
	"moneda" varchar(3) DEFAULT 'MXN',
	"descripcion_pago" varchar(200),
	"periodo_gracia" integer,
	"prima_neta" numeric(12, 2),
	"recargo_financiero_porcentual" numeric(5, 2),
	"financiamiento" numeric(12, 2),
	"costo_expedicion" numeric(9, 2),
	"subtotal" numeric(12, 2),
	"iva" numeric(9, 2),
	"total" numeric(12, 2),
	"coberturas" jsonb DEFAULT '[]'::jsonb,
	"poliza_estatus" varchar DEFAULT 'Emitida',
	"prima_neta_comision" numeric(12, 2),
	"porcentaje_comision" numeric(5, 2)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "ramos" (
	"id" serial PRIMARY KEY NOT NULL,
	"ramo" varchar(40) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "recibos" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"saas_id" varchar(50),
	"poliza_id" bigint,
	"numero_recibo" varchar(20),
	"serie" varchar(20),
	"folio" varchar(20),
	"serieEmision" varchar(20),
	"importe" numeric(12, 2),
	"prima_neta_comision" numeric(12, 2),
	"vigencia_inicio" date,
	"vigencia_fin" date,
	"estado" varchar DEFAULT 'DESCONOCIDO'
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "remesas" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"saas_id" varchar(50),
	"poliza_id" bigint,
	"recibo_id" bigint,
	"numero_recibo" varchar(20),
	"numero_poliza" varchar(20),
	"numero_endoso" varchar(20),
	"serie" varchar(20),
	"remesa" varchar(20),
	"clave" varchar(5),
	"concepto" varchar,
	"fecha_pago" date,
	"importe" numeric(12, 2),
	"comision" numeric(9, 2),
	"cargo" numeric(12, 2),
	"abono" numeric(12, 2)
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "servicios" (
	"id" serial PRIMARY KEY NOT NULL,
	"servicio" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "siniestros_causa" (
	"id" serial PRIMARY KEY NOT NULL,
	"causa" varchar(40) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "siniestros" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"saas_id" varchar(50),
	"poliza_id" bigint,
	"agente_id" integer,
	"conducto_id" integer,
	"asegurado_id" bigint,
	"vehiculo_id" bigint,
	"causa_id" integer,
	"company_id" varchar,
	"poliza_primaneta" numeric(12, 2) DEFAULT '0',
	"numero_siniestro" varchar(20),
	"monto_estimado" numeric(12, 2),
	"monto_actualizado" numeric(12, 2),
	"monto_final" numeric(12, 2),
	"fecha_siniestro" date,
	"hora_siniestro" varchar(25),
	"fecha_reporte" date,
	"hora_reporte" varchar(25),
	"fecha_cierre" date,
	"codigo_postal" varchar(8),
	"detalle" jsonb DEFAULT '{}'::jsonb,
	CONSTRAINT "siniestros_numero_siniestro_unique" UNIQUE("numero_siniestro")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "subramos" (
	"id" serial PRIMARY KEY NOT NULL,
	"subramo" varchar(40) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tipo_endoso" (
	"id" serial PRIMARY KEY NOT NULL,
	"tipo_endoso" varchar(256) NOT NULL,
	CONSTRAINT "tipo_endoso_tipo_endoso_unique" UNIQUE("tipo_endoso")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tipo_vehiculos" (
	"id" serial PRIMARY KEY NOT NULL,
	"tipovehiculo" varchar(40) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "usos" (
	"id" serial PRIMARY KEY NOT NULL,
	"uso" varchar(256) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "vehiculos" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"saas_id" varchar(50) NOT NULL,
	"nombre" varchar(256) NOT NULL,
	"descripcion" varchar(200),
	"serie" varchar(40) NOT NULL,
	"motor" varchar(40),
	"placas" varchar(25),
	"tipovehicuo_id" integer,
	"carroceria" varchar(40),
	"color" varchar(40),
	"ocupantes" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "asegurados_to_contactos" ADD CONSTRAINT "asegurados_to_contactos_asegurado_id_asegurados_id_fk" FOREIGN KEY ("asegurado_id") REFERENCES "public"."asegurados"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "asegurados_to_contactos" ADD CONSTRAINT "asegurados_to_contactos_contacto_id_contactos_id_fk" FOREIGN KEY ("contacto_id") REFERENCES "public"."contactos"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contactos" ADD CONSTRAINT "contactos_agente_id_agentes_id_fk" FOREIGN KEY ("agente_id") REFERENCES "public"."agentes"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "contactos" ADD CONSTRAINT "contactos_conducto_id_conductos_id_fk" FOREIGN KEY ("conducto_id") REFERENCES "public"."conductos"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "endosos" ADD CONSTRAINT "endosos_tipoendoso_id_tipo_endoso_id_fk" FOREIGN KEY ("tipoendoso_id") REFERENCES "public"."tipo_endoso"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "poliza_movimientos" ADD CONSTRAINT "poliza_movimientos_poliza_id_polizas_id_fk" FOREIGN KEY ("poliza_id") REFERENCES "public"."polizas"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "poliza_movimientos" ADD CONSTRAINT "poliza_movimientos_agente_id_agentes_id_fk" FOREIGN KEY ("agente_id") REFERENCES "public"."agentes"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "poliza_movimientos" ADD CONSTRAINT "poliza_movimientos_conducto_id_conductos_id_fk" FOREIGN KEY ("conducto_id") REFERENCES "public"."conductos"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "poliza_movimientos" ADD CONSTRAINT "poliza_movimientos_asegurado_id_asegurados_id_fk" FOREIGN KEY ("asegurado_id") REFERENCES "public"."asegurados"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "poliza_movimientos" ADD CONSTRAINT "poliza_movimientos_vehiculo_id_vehiculos_id_fk" FOREIGN KEY ("vehiculo_id") REFERENCES "public"."vehiculos"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "poliza_movimientos" ADD CONSTRAINT "poliza_movimientos_company_id_companias_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companias"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "polizas" ADD CONSTRAINT "polizas_ramo_id_ramos_id_fk" FOREIGN KEY ("ramo_id") REFERENCES "public"."ramos"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "polizas" ADD CONSTRAINT "polizas_subramo_id_subramos_id_fk" FOREIGN KEY ("subramo_id") REFERENCES "public"."subramos"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "polizas" ADD CONSTRAINT "polizas_company_id_companias_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companias"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "polizas" ADD CONSTRAINT "polizas_agente_id_agentes_id_fk" FOREIGN KEY ("agente_id") REFERENCES "public"."agentes"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "polizas" ADD CONSTRAINT "polizas_conducto_id_conductos_id_fk" FOREIGN KEY ("conducto_id") REFERENCES "public"."conductos"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "polizas" ADD CONSTRAINT "polizas_vehiculo_id_vehiculos_id_fk" FOREIGN KEY ("vehiculo_id") REFERENCES "public"."vehiculos"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "polizas" ADD CONSTRAINT "polizas_asegurado_id_asegurados_id_fk" FOREIGN KEY ("asegurado_id") REFERENCES "public"."asegurados"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "polizas" ADD CONSTRAINT "polizas_uso_id_usos_id_fk" FOREIGN KEY ("uso_id") REFERENCES "public"."usos"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "polizas" ADD CONSTRAINT "polizas_servicio_id_servicios_id_fk" FOREIGN KEY ("servicio_id") REFERENCES "public"."servicios"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "polizas" ADD CONSTRAINT "polizas_modopago_id_modo_pagos_id_fk" FOREIGN KEY ("modopago_id") REFERENCES "public"."modo_pagos"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "recibos" ADD CONSTRAINT "recibos_poliza_id_polizas_id_fk" FOREIGN KEY ("poliza_id") REFERENCES "public"."polizas"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "siniestros" ADD CONSTRAINT "siniestros_poliza_id_polizas_id_fk" FOREIGN KEY ("poliza_id") REFERENCES "public"."polizas"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "siniestros" ADD CONSTRAINT "siniestros_agente_id_agentes_id_fk" FOREIGN KEY ("agente_id") REFERENCES "public"."agentes"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "siniestros" ADD CONSTRAINT "siniestros_conducto_id_conductos_id_fk" FOREIGN KEY ("conducto_id") REFERENCES "public"."conductos"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "siniestros" ADD CONSTRAINT "siniestros_asegurado_id_asegurados_id_fk" FOREIGN KEY ("asegurado_id") REFERENCES "public"."asegurados"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "siniestros" ADD CONSTRAINT "siniestros_vehiculo_id_vehiculos_id_fk" FOREIGN KEY ("vehiculo_id") REFERENCES "public"."vehiculos"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "siniestros" ADD CONSTRAINT "siniestros_causa_id_siniestros_causa_id_fk" FOREIGN KEY ("causa_id") REFERENCES "public"."siniestros_causa"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "siniestros" ADD CONSTRAINT "siniestros_company_id_companias_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companias"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "vehiculos" ADD CONSTRAINT "vehiculos_tipovehicuo_id_tipo_vehiculos_id_fk" FOREIGN KEY ("tipovehicuo_id") REFERENCES "public"."tipo_vehiculos"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "account_nombre_idx" ON "agentes" USING btree ("saas_id","nombre");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "asegurados_name_idx" ON "asegurados" USING btree ("saas_id","name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "account_rfc_idx" ON "asegurados" USING btree ("saas_id","rfc");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "conductos_name_idx" ON "conductos" USING btree ("saas_id","name");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "conductos_nexus_idx" ON "conductos" USING btree ("saas_id","nexus_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "numero_poliza_idx" ON "polizas" USING btree ("saas_id","numero_poliza","inciso");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "recibo_status_id" ON "recibos" USING btree ("saas_id","estado","vigencia_inicio","vigencia_fin");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "remesa_search_idx" ON "remesas" USING btree ("saas_id","numero_recibo","numero_poliza","remesa","clave");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "vehiculo_serie_account_idx" ON "vehiculos" USING btree ("saas_id","serie");

INSERT INTO companias (id, compania) VALUES ('qualitas', 'Qualitas');
INSERT INTO companias (id, compania) VALUES ('axa', 'AXA');
INSERT INTO companias (id, compania) VALUES ('anaseguros', 'ANA Seguros');
INSERT INTO companias (id, compania) VALUES ('gnp', 'GNP');
INSERT INTO companias (id, compania) VALUES ('allianz', 'allianz');
INSERT INTO companias (id, compania) VALUES ('bupa', 'bupa');
INSERT INTO companias (id, compania) VALUES ('hdi', 'hdi');
