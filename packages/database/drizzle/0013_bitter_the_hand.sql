update cobros set importe = '0';
update cobros set importe = REPLACE(importe2, ',', '');
ALTER TABLE "cobros" ALTER COLUMN "importe" SET DATA TYPE numeric(12, 2) USING importe::numeric(12, 2);
ALTER TABLE "cobros" DROP COLUMN IF EXISTS "importe2";