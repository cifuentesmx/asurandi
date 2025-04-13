ALTER TABLE "asegurados_to_contactos" ADD COLUMN "created" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "agentes" ADD COLUMN "created" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "asegurados" ADD COLUMN "created" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "conductos" ADD COLUMN "created" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "contactos" ADD COLUMN "created" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "endosos" ADD COLUMN "created" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "poliza_movimientos" ADD COLUMN "created" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "polizas" ADD COLUMN "created" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "recibos" ADD COLUMN "created" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "remesas" ADD COLUMN "created" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "siniestros" ADD COLUMN "created" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "vehiculos" ADD COLUMN "created" timestamp DEFAULT now();