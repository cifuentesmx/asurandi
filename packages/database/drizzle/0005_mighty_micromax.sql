CREATE TABLE IF NOT EXISTS "agentes_to_conductos" (
	"agente_id" integer NOT NULL,
	"conducto_id" integer NOT NULL,
	CONSTRAINT "agentes_to_conductos_agente_id_conducto_id_pk" PRIMARY KEY("agente_id","conducto_id")
);
--> statement-breakpoint
ALTER TABLE "agentes" ADD COLUMN "alias" varchar;--> statement-breakpoint
ALTER TABLE "agentes" ADD COLUMN "phone" varchar;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "agentes_to_conductos" ADD CONSTRAINT "agentes_to_conductos_agente_id_agentes_id_fk" FOREIGN KEY ("agente_id") REFERENCES "public"."agentes"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "agentes_to_conductos" ADD CONSTRAINT "agentes_to_conductos_conducto_id_agentes_id_fk" FOREIGN KEY ("conducto_id") REFERENCES "public"."agentes"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

UPDATE "agentes" SET alias = agentes.nombre;