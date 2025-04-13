ALTER TABLE "agentes" ADD COLUMN "firebase_uid" varchar;--> statement-breakpoint
ALTER TABLE "conductos" ADD COLUMN "firebase_uid" varchar;--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "firebase_agente_uid" ON "agentes" USING btree ("firebase_uid");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "firebase_conducto_uid" ON "conductos" USING btree ("firebase_uid");