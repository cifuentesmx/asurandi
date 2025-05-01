<script lang="ts">
	import TextData from '$lib/components/text-data.svelte';
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Drawer from '$lib/components/ui/drawer';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { formatMoney } from '$lib/formatters/formatMoney';
	import { getPolizasStore } from '$lib/polizas-store.svelte';
	import type { GetOnePolizaResponse } from '@asurandi/types';
	const polizasStore = getPolizasStore();
	const poliza = polizasStore.onePoliza?.poliza;
	const { siniestro }: { siniestro: NonNullable<GetOnePolizaResponse['siniestros']>[number] } =
		$props();
</script>

{#if siniestro && poliza}
	<Drawer.Root>
		<Drawer.Trigger class={buttonVariants({ variant: 'outline', size: 'sm' })}>
			Ver detalles del siniestro
		</Drawer.Trigger>
		<Drawer.Content>
			<Drawer.Header>
				<Drawer.Title>Detalle de Siniestro {siniestro.numeroSiniestro}</Drawer.Title>
				<Drawer.Description
					>Póliza: {poliza.numeroPoliza} / Reporte: {siniestro.numeroReporte}</Drawer.Description
				>
			</Drawer.Header>
			<ScrollArea class=" mx-2 h-[55vh]">
				<div class="py-4 text-lg">General</div>
				<div class="layout mt-6 px-2">
					<TextData caption="Agente">{poliza.agente}</TextData>
					<TextData caption="Conducto">{poliza.conducto}</TextData>
					<TextData caption="Asegurado">{poliza.asegurado}</TextData>
					<TextData caption="Número de Poliza">{poliza.numeroPoliza}</TextData>
					<TextData caption="Número de Serie">{poliza.numeroSerie}</TextData>
					<TextData caption="Número de Siniestro">{siniestro.numeroSiniestro}</TextData>
					<TextData caption="Causa">{siniestro.causa}</TextData>
					<TextData caption="Fecha de Siniestro">{siniestro.fechaSiniestro}</TextData>
					<TextData caption="Hora de Siniestro">{siniestro.horaSiniestro}</TextData>
					<TextData caption="Fecha de Cierre">{siniestro.fechaCierre ?? '-'}</TextData>
					<TextData caption="Monto Estimado"
						>{typeof siniestro.montoEstimado === 'number'
							? formatMoney(siniestro.montoEstimado)
							: ''}</TextData
					>
					<TextData caption="Monto Actualizado"
						>{typeof siniestro.montoActualizado === 'number'
							? formatMoney(siniestro.montoActualizado)
							: ''}</TextData
					>
					<TextData caption="Monto Final"
						>{typeof siniestro.montoFinal === 'number'
							? formatMoney(siniestro.montoFinal)
							: ''}</TextData
					>
				</div>
				<div class="py-4 text-lg">Detalles</div>
				<div class="p-2">
					<TextData caption="Número de Reporte">{siniestro.detalle?.numeroReporte}</TextData>
					<TextData caption="Fecha de Reporte">{siniestro.detalle?.fechaReporte}</TextData>
					<TextData caption="Causa"
						>{siniestro.detalle?.causa && siniestro.detalle?.causa.length > 0
							? siniestro.detalle?.causa
							: '-'}</TextData
					>
					<TextData caption="Colonia"
						>{siniestro.detalle?.colonia && siniestro.detalle?.colonia.length > 0
							? siniestro.detalle?.colonia
							: '-'}</TextData
					>
					<TextData caption="Teléfono">{siniestro.detalle?.telefono}</TextData>
					<TextData caption="Ajustador">{siniestro.detalle?.ajustador?.nombre}</TextData>
					<TextData caption="Conductor">{siniestro.detalle?.conductor}</TextData>
					<TextData caption="Ubicación">{siniestro.detalle?.ubicacion}</TextData>
					<TextData caption="Comentarios"
						>{siniestro.detalle?.comentarios && siniestro.detalle?.comentarios.length > 0
							? siniestro.detalle?.comentarios
							: '-'}</TextData
					>
				</div>
				{#if siniestro.actividades && siniestro.actividades.length > 0}
					<div class="py-4 text-lg">Actividades de seguimiento</div>
					{#each siniestro.actividades as actividad}
						<div class="p-2">
							<TextData caption="Fecha"
								>{new Date(actividad.timestamp ?? new Date()).toLocaleString()}</TextData
							>
							<TextData caption="Usuario">{actividad.user}</TextData>
							<TextData caption="Comentario">{''}</TextData>
							<div class="text-muted-foreground px-1 text-sm">{actividad.comentario}</div>
						</div>
					{/each}
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
