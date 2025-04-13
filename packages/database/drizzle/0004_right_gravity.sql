ALTER TABLE "remesas" ADD COLUMN "contabilizado" timestamp;--> statement-breakpoint
ALTER TABLE "remesas" ADD COLUMN "porcentaje_comision" numeric(5, 2);--> statement-breakpoint
ALTER TABLE "remesas" ADD COLUMN "comisionConducto" numeric(12, 2);