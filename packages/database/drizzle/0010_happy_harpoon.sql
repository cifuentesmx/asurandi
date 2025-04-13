CREATE TABLE IF NOT EXISTS "cobros" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"saas_id" varchar(50),
	"poliza_id" bigint,
	"numero_poliza" varchar,
	"endoso" varchar(40),
	"fecha_vencimiento" date,
	"fecha_limite" date,
	"estado" varchar DEFAULT 'PENDIENTE',
	"company_id" varchar,
	"serie" varchar(40),
	"numero_recibo" varchar(40),
	"importe" varchar(40),
	"created" timestamp DEFAULT now()
);
--> statement-breakpoint
DROP INDEX IF EXISTS "poliza_renovacion";--> statement-breakpoint
DROP INDEX IF EXISTS "renovacion_poliza";--> statement-breakpoint
ALTER TABLE "renovaciones" ADD COLUMN "company_id" varchar;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cobros" ADD CONSTRAINT "cobros_poliza_id_polizas_id_fk" FOREIGN KEY ("poliza_id") REFERENCES "public"."polizas"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "cobros" ADD CONSTRAINT "cobros_company_id_companias_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companias"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "cobro_estado_vencimiento_poliza" ON "cobros" USING btree ("saas_id","estado","fecha_vencimiento","numero_poliza");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "cobro_company_numero_poliza_recibo_endoso_serie" ON "cobros" USING btree ("saas_id","company_id","numero_poliza","numero_recibo","endoso","serie");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "renovaciones" ADD CONSTRAINT "renovaciones_company_id_companias_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companias"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "renovacion_estado_vencimiento_poliza" ON "renovaciones" USING btree ("saas_id","estado","company_id","fecha_vencimiento","numero_poliza");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "renovacion_poliza" ON "renovaciones" USING btree ("saas_id","company_id","numero_poliza");