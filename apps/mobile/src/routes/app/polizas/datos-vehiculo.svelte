<script lang="ts">
	import TextData from '$lib/components/text-data.svelte';
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
			<div class="text-lg font-semibold">Vehículo</div>
			<Collapsible.Trigger
				class={buttonVariants({ variant: 'ghost', size: 'sm', class: 'w-9 p-0' })}
			>
				<ChevronsUpDown />
				<span class="sr-only">Toggle</span>
			</Collapsible.Trigger>
		</div>
		<div class="layout">
			<TextData caption="vehiculo" text={poliza.vehiculo} />
			<TextData caption="Tipo" text={poliza.vehiculoTipo} />
			<TextData caption="Placas" text={poliza.placas} />
			<TextData caption="No. de serie" text={poliza.numeroSerie} />
		</div>
		<Collapsible.Content>
			<div class="layout">
				<TextData caption="No. Económico" text={poliza.numeroEconomico} />
				<TextData caption="No. motor" text={poliza.motor} />
				<TextData caption="Descripcion" text={poliza.vehiculoDescripcion} />
				<TextData caption="Carroceria" text={poliza.vehiculoCarroceria} />
				<TextData caption="Color" text={poliza.vehiculoColor} />
				<TextData caption="Ocupantes" text={poliza.vehiculoOcupantes?.toString() ?? null} />
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
