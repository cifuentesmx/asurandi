<script lang="ts">
	import SimpleTable from '$lib/components/simple-table/simple-table.svelte';
	import TextData from '$lib/components/ui/text-data.svelte';
	import type { SiniestroDetalle } from '../../../../database/schema/siniestros';

	let { reporte = {} } = $props<{
		reporte: SiniestroDetalle;
	}>();
</script>

<div class="text-sm">
	<div class="layout">
		<TextData caption="Número de Reporte">{reporte.numeroReporte}</TextData>
		<TextData caption="Fecha de Reporte">{reporte.fechaReporte}</TextData>
		<TextData caption="Causa"
			>{reporte.causa && reporte.causa.length > 0 ? reporte.causa : '-'}</TextData
		>
		<TextData caption="Colonia"
			>{reporte.colonia && reporte.colonia.length > 0 ? reporte.colonia : '-'}</TextData
		>
		<TextData caption="Teléfono">{reporte.telefono}</TextData>
		<TextData caption="Ajustador">{reporte.ajustador?.nombre}</TextData>
		<TextData caption="Conductor">{reporte.conductor}</TextData>
		<TextData caption="Ubicación">{reporte.ubicacion}</TextData>
		<TextData caption="Comentarios"
			>{reporte.comentarios && reporte.comentarios.length > 0 ? reporte.comentarios : '-'}</TextData
		>
	</div>
	{#if Array.isArray(reporte.involucrados) && reporte.involucrados.length > 0}
		<div class="mt-2 px-4">
			<div class="my-2">Involucrados:</div>
			<SimpleTable
				data={reporte.involucrados}
				columns={[
					{ accessorKey: 'conductor', header: 'Conductor' },
					{ accessorKey: 'tipo_involucrado', header: 'Tipo' },
					{ accessorKey: 'proveedor', header: 'Proveedor' },
					{ accessorKey: 'folio_asignacion', header: 'Folio de asignación' }
				]}
			/>
		</div>
	{/if}
</div>

<style>
	.layout {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
	}
</style>
