ALTER TABLE "siniestros" ADD COLUMN "numero_reporte" varchar;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "siniestro_reporte" ON "siniestros" USING btree ("saas_id","numero_reporte");