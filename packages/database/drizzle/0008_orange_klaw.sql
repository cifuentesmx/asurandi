ALTER TABLE "siniestros" ADD COLUMN "updated" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "siniestros" ADD COLUMN "actividades" jsonb DEFAULT '[]'::jsonb;