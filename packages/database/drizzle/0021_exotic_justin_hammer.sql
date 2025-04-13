CREATE TABLE IF NOT EXISTS "logs" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"saas_id" varchar(50),
	"model" varchar(50),
	"model_id" bigint,
	"action" varchar(1),
	"user" varchar,
	"description" varchar,
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "log_model_modelID" ON "logs" USING btree ("saas_id","model","model_id");