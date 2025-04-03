<script lang="ts">
	import type { getPolizaByNumero } from '$api/polizas/getPolizaByNumero';
	import TextData from '$lib/components/ui/text-data.svelte';

	type Polizas = Awaited<ReturnType<typeof getPolizaByNumero>>['polizas'];
	const { maestra = $bindable() } = $props<{
		maestra: Polizas[number];
	}>();
</script>

{#if maestra}
	<div class="layout">
		<TextData caption="Origen de Póliza" text={maestra.origen} />
		<TextData caption="Asegurado" text={maestra.asegurado} />
		<TextData caption="Agente" text={maestra.agente ?? 'Sin agente asignado'} />
		<TextData caption="Conducto" text={maestra.conducto ?? 'Sin conducto asignado'} />
		<TextData caption="Compañía" text={maestra.compania} />
		<TextData caption="Ramo" text={maestra.ramo} />
		<TextData caption="Sub Ramo" text={maestra.subRamo} />
		<TextData caption="Póliza anterior" text={maestra.polizaAnterior} />
		<TextData caption="Póliza renovada" text={maestra.polizaRenovada} />
		<TextData caption="Incisos totales" text={maestra.totalIncisos?.toFixed()} />
		<TextData caption="Incisos vigentes" text={maestra.incisosVigentes?.toFixed()} />
		<TextData caption="Oficina de emisión" text={maestra.oficinaEmision} />
		<TextData caption="Fecha Emision" text={maestra.fechaEmision} />
		<TextData caption="Inicio de vigencia" text={maestra.vigenciaInicio} />
		<TextData caption="Fin de vigencia" text={maestra.vigenciaFin} />
		<TextData caption="Tarifa" text={maestra.tarifa} />
		<TextData caption="Moneda" text={maestra.moneda} />
		<TextData caption="Modo de pago" text={maestra.modoPago} />
		<TextData caption="Sub Total" text={`$ ${maestra.subtotal}`} />
		<TextData caption="I.V.A." text={`$ ${maestra.iva}`} />
		<TextData caption="Total" text={`$ ${maestra.total}`} />
	</div>
{/if}

<style>
	.layout {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 0.309rem;
	}
</style>
