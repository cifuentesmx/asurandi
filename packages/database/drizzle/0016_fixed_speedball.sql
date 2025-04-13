CREATE TABLE IF NOT EXISTS "scrapped_logs" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"saas_id" varchar(50),
	"company_id" varchar,
	"accion" varchar,
	"key" varchar,
	"messages" jsonb DEFAULT '[]'::jsonb,
	"status" varchar,
	"created" timestamp DEFAULT now(),
	"updated" timestamp DEFAULT now()
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "scrapped_logs" ADD CONSTRAINT "scrapped_logs_company_id_companias_id_fk" FOREIGN KEY ("company_id") REFERENCES "public"."companias"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "accion_key" ON "scrapped_logs" USING btree ("saas_id","company_id","accion","key");