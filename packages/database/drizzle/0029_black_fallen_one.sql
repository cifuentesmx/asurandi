ALTER TABLE "polizas" ADD COLUMN "meta_data" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "polizas" DROP COLUMN "files";