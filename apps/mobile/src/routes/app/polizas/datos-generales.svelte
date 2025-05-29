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
			<div class="text-lg font-semibold">Datos de la póliza</div>
			<Collapsible.Trigger
				class={buttonVariants({ variant: 'ghost', size: 'sm', class: 'w-9 p-0' })}
			>
				<ChevronsUpDown />
				<span class="sr-only">Toggle</span>
			</Collapsible.Trigger>
		</div>
		<div class="layout">
			<TextData caption="Compañía" text={poliza.company} />
			<TextData caption="Número de póliza" text={poliza.numeroPoliza} />
			<TextData caption="Cobertura" text={poliza.cobertura} />
			<TextData caption="Inciso" text={poliza.inciso} />
			<TextData caption="Fecha emision" text={poliza.fechaEmision} />
			<TextData caption="Inicio de vigencia" text={poliza.vigenciaInicio} />
			<TextData caption="Fin de vigencia" text={poliza.vigenciaFin} />
			<TextData caption="Status de lectura" text={poliza.polizaEstatus} />
			<TextData caption="Tipo de origen" text={poliza.origen} />
			<TextData caption="Última actualización" text={poliza.lastSync} />
		</div>
		<Collapsible.Content>
			<div class="layout">
				<TextData caption="Ramo" text={poliza.ramo} />
				<TextData caption="Subramo" text={poliza.subramo} />
				<TextData caption="Uso" text={poliza.uso} />
				<TextData caption="Servicio" text={poliza.servicio} />
				<TextData caption="Placas" text={poliza.placas} />
				<TextData caption="Póliza anterior" text={poliza.polizaAnterior} />
				<TextData caption="Póliza Renovada" text={poliza.polizaRenovada} />
				<TextData caption="Incisos totales" text={poliza.totalIncisos?.toString()} />
				<TextData caption="Incisos vigentes" text={poliza.incisosVigentes?.toString()} />
				<TextData caption="Incisos cancelados" text={poliza.incisosCancelados?.toString()} />
				<TextData caption="Endoso" text={poliza.endoso} />
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
