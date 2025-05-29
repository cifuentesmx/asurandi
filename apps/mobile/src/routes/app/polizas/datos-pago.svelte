<script lang="ts">
	import TextData from '$lib/components/text-data.svelte';
	import { formatMoney } from '$lib/formatters/formatMoney';
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
	import { buttonVariants } from '$lib/components/ui/button';
	import { ChevronsUpDown } from 'lucide-svelte';
	import { getPolizasStore } from './polizas-store.svelte';
	const polizasStore = getPolizasStore();
	const poliza = polizasStore.onePoliza?.poliza;
</script>

{#if poliza}
	<Collapsible.Root class="space-y-2">
		<div class="mt-6 flex items-center justify-between space-x-4">
			<div class=" text-lg font-semibold">Datos de pago</div>
			<Collapsible.Trigger
				class={buttonVariants({ variant: 'ghost', size: 'sm', class: 'w-9 p-0' })}
			>
				<ChevronsUpDown />
				<span class="sr-only">Toggle</span>
			</Collapsible.Trigger>
		</div>
		<div class="layout">
			<TextData caption="Modo de pago" text={poliza.modoPago} />
			<TextData caption="Prima Neta" text={formatMoney(poliza.primaNeta)} />
			<TextData caption="Costo de expedicion" text={formatMoney(poliza.costoExpedicion)} />
			<TextData caption="Subtotal" text={formatMoney(poliza.subtotal)} />
			<TextData caption="IVA" text={formatMoney(poliza.iva)} />
			<TextData caption="Total" text={formatMoney(poliza.total)} />
		</div>
		<Collapsible.Content>
			<div class="layout">
				<TextData caption="Tarifa" text={poliza.tarifa} />
				<TextData caption="% Descuento" text={poliza.porcentajeDescuento} />
				<TextData caption="Moneda" text={poliza.moneda} />
				<TextData caption="Pago" text={poliza.descripcionPago} />
				<TextData caption="Periodo de gracia" text={poliza.periodoGracia} />
				<TextData caption="Recargo Finaciero" text={poliza.recargoFinacieroPorcentual} />
				<TextData caption="Financiamiento" text={formatMoney(poliza.financiamiento)} />
			</div>
		</Collapsible.Content>
	</Collapsible.Root>
{/if}

<style>
	.layout {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
	}
</style>
