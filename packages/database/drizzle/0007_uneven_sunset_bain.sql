ALTER TABLE "conductos" ADD COLUMN "alias" varchar;--> statement-breakpoint
ALTER TABLE "conductos" ADD COLUMN "phone" varchar(50);
UPDATE "conductos" SET alias = name;

UPDATE "polizas" SET porcentaje_comision = '0.80';
update "remesas" set porcentaje_comision = '0.80' where porcentaje_comision is not null;