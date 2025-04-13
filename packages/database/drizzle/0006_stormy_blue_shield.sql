ALTER TABLE "agentes" ADD COLUMN "conducto_id" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "agentes" ADD CONSTRAINT "agentes_conducto_id_conductos_id_fk" FOREIGN KEY ("conducto_id") REFERENCES "public"."conductos"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
