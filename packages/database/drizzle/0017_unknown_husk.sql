CREATE TABLE IF NOT EXISTS "poliza_origen" (
	"id" serial PRIMARY KEY NOT NULL,
	"origen" varchar(256) NOT NULL,
	CONSTRAINT "poliza_origen_origen_unique" UNIQUE("origen")
);
--> statement-breakpoint
ALTER TABLE "polizas" ADD COLUMN "origen_id" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "polizas" ADD CONSTRAINT "polizas_origen_id_poliza_origen_id_fk" FOREIGN KEY ("origen_id") REFERENCES "public"."poliza_origen"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

INSERT INTO "poliza_origen" ("origen") 
VALUES 
('Nueva'), 
('Renovada'), 
('Renovación tardía'), 
('Sustituida'), 
('Recuperada'),
('Cambio de conducto'),
('Nueva ganada'),
('Indeterminado')
;