<script lang="ts">
	import TextData from '$lib/components/text-data.svelte';
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Drawer from '$lib/components/ui/drawer';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { getPolizasStore } from './polizas-store.svelte';
	import type { GetOnePolizaResponse } from '@asurandi/types';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { Siren } from 'lucide-svelte';
	import Siniestro from './siniestro.svelte';
	const polizasStore = getPolizasStore();
	const poliza = polizasStore.onePoliza?.poliza;
	const siniestros: GetOnePolizaResponse['siniestros'] = polizasStore.onePoliza?.siniestros ?? [];
	let open = false;
</script>

{#if siniestros && poliza}
	<Drawer.Root bind:open>
		<Drawer.Trigger>
			{#snippet child({ props })}
				<button {...props} class="relative">
					<Siren class="h-6 w-6" />
					{#if siniestros.length > 0}
						<Badge
							variant="destructive"
							class="absolute -right-3 -top-1 rounded-full px-1 py-0 text-xs"
							>{siniestros.length}</Badge
						>
					{/if}
				</button>
			{/snippet}
		</Drawer.Trigger>
		<Drawer.Content>
			<Drawer.Header>
				<Drawer.Title>Siniestros</Drawer.Title>
				<Drawer.Description>Póliza {poliza.numeroPoliza}</Drawer.Description>
			</Drawer.Header>
			<ScrollArea class=" mx-2 h-[50vh]">
				{#each siniestros as siniestro}
					<div class="bg-muted mb-6 rounded-sm p-4">
						<Siniestro {siniestro} />
						<div class="layout">
							<TextData caption="No. siniestro" text={siniestro.numeroSiniestro} />
							<TextData caption="Fecha de siniestro" text={siniestro.fechaSiniestro} />
							<TextData caption="Causa" text={siniestro.causa} />
							<TextData caption="Fecha de reporte" text={siniestro.fechaReporte} />
							<TextData caption="En seguimiento" text={siniestro.enSeguimiento ? 'Si' : 'No'} />
							<TextData caption="Abierto" text={siniestro.fechaCierre ? 'No' : 'Si'} />
						</div>
					</div>
				{/each}
				{#if siniestros.length === 0}
					<div class="bg-muted text-muted-foreground mt-4 rounded-sm p-4 text-sm">
						No se han registrado siniestros para esta póliza.
					</div>
				{/if}
			</ScrollArea>
			<Drawer.Footer>
				<Drawer.Close class={buttonVariants({ variant: 'outline', size: 'sm' })}>
					Cerrar
				</Drawer.Close>
			</Drawer.Footer>
		</Drawer.Content>
	</Drawer.Root>
{/if}

<style>
	.layout {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
		gap: 1rem;
	}
</style>
