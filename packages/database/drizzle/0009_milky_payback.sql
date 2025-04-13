CREATE TABLE IF NOT EXISTS "renovaciones" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"saas_id" varchar(50),
	"poliza_id" bigint,
	"numero_poliza" varchar,
	"fecha_vencimiento" date,
	"estado" varchar DEFAULT 'PENDIENTE',
	"created" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "poliza_movimientos" RENAME COLUMN "tipoMovimiento" TO "tipo_movimiento";--> statement-breakpoint
ALTER TABLE "recibos" RENAME COLUMN "serieEmision" TO "serie_emision";--> statement-breakpoint
ALTER TABLE "remesas" RENAME COLUMN "comisionConducto" TO "comision_conducto";--> statement-breakpoint
ALTER TABLE "poliza_movimientos" DROP CONSTRAINT "unique_poliza_movimiento_idx";--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "renovaciones" ADD CONSTRAINT "renovaciones_poliza_id_polizas_id_fk" FOREIGN KEY ("poliza_id") REFERENCES "public"."polizas"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "renovacion_poliza" ON "renovaciones" USING btree ("saas_id","estado","fecha_vencimiento","numero_poliza");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "poliza_renovacion" ON "renovaciones" USING btree ("saas_id","numero_poliza");--> statement-breakpoint
ALTER TABLE "poliza_movimientos" ADD CONSTRAINT "unique_poliza_movimiento_idx" UNIQUE("saas_id","numero_poliza","fecha_movimiento","tipo_movimiento","poliza_id");