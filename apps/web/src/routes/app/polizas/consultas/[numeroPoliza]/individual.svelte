<script lang="ts">
	import type { getPolizaByNumero } from '$api/polizas/getPolizaByNumero';
	import Coberturas from './coberturas.svelte';
	import TextData from '$lib/components/ui/text-data.svelte';

	type Inciso = Awaited<ReturnType<typeof getPolizaByNumero>>['polizas'][number];
	const { inciso = $bindable() } = $props<{
		inciso: Inciso;
	}>();
</script>

<div class="text-muted-foreground text-sm, mb-2 pl-2">
	<div class="flex">
		<div class="flex-1">
			Vehículo: {inciso.vehiculo}
		</div>
		<Coberturas coberturas={inciso.coberturas} />
	</div>
</div>
<div class="layout px-2">
	<TextData caption="Tipo de uso" text={inciso.uso} />
	<TextData caption="Tipo de servicio" text={inciso.servicio} />
	<TextData caption="Placas" text={inciso.placas} />
	<TextData caption="Número de serie" text={inciso.numeroSerie} />
	<TextData caption="Número economico" text={inciso.numeroEconomico} />
	<TextData caption="Tipo cobertura" text={inciso.cobertura} />
	<TextData caption="Fecha de emision" text={inciso.fechaEmision} />
	<TextData caption="Inicio de vigencia" text={inciso.vigenciaInicio} />
	<TextData caption="Fin de Vigencia" text={inciso.vigenciaFin} />
	<TextData caption="Tarifa" text={inciso.tarifa} />
	<TextData caption="Modo de pago" text={inciso.modoPago} />
	<TextData caption="Prima neta" text={inciso.primaNeta} />
	<TextData caption="Costo expedicion" text={inciso.costoExpedicion} />
	<TextData caption="Subtotal" text={inciso.subtotal} />
	<TextData caption="I.V.A." text={inciso.iva} />
	<TextData caption="Total" text={inciso.total} />
</div>

<style>
	.layout {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 0.309rem;
	}
</style>
