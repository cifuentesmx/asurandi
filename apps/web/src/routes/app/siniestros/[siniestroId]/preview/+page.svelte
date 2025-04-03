<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import PrintContainer from '$lib/components/print-container.svelte';
	import SimpleTable from '$lib/components/simple-table/simple-table.svelte';
	import TextData from '$lib/components/ui/text-data.svelte';
	import { formatDate } from '$lib/formatters/formatDate';
	import { formatMoney } from '$lib/formatters/formatMoney';
	import Reporte from '../reporte.svelte';
	const siniestro = page.data.siniestro;
</script>

{#if siniestro}
	<PrintContainer
		goback={() => {
			goto(`/app/siniestros/${siniestro?.id}`);
		}}
		id="siniestro"
	>
		<div class="mb-1 flex text-2xl">
			<div class="flex-1">BullBrothers - Seguimiento a siniestro</div>
			<div>
				Reporte: {siniestro.numeroReporte}
			</div>
		</div>
		<div>
			Vehículo: {siniestro.vehiculo} <br />
			Asegurado: {siniestro.asegurado} <br />Póliza: {siniestro.numeroPoliza} - Número de siniestro:
			{siniestro.siniestro}<br />
		</div>
		<div class="text-sm">
			Última actualización: {formatDate(siniestro.updated)}
		</div>

		{#if siniestro.actividades && (siniestro.actividades?.length ?? 0) > 0}
			<div class="py-4 text-lg">Bitácora</div>
			<SimpleTable
				data={siniestro.actividades}
				columns={[
					{
						accessorKey: 'timestamp',
						header: 'Fecha',
						cell: ({ row }) => {
							return formatDate(row.original.timestamp);
						}
					},
					{ accessorKey: 'tipoActividad', header: 'Tipo actualizacion' },
					{ accessorKey: 'user', header: 'Usuario' },
					{ accessorKey: 'comentario', header: 'Comentarios' }
				]}
			/>
		{/if}

		<div class="py-4 text-lg">Datos del siniestro</div>

		<div class="layout mt-6 px-2">
			<TextData caption="Agente">{siniestro.agente}</TextData>
			<TextData caption="Conducto">{siniestro.conducto}</TextData>
			<TextData caption="Asegurado">{siniestro.asegurado}</TextData>
			<TextData caption="Número de Poliza">{siniestro.numeroPoliza}</TextData>
			<TextData caption="Número de Serie">{siniestro.numeroSerie}</TextData>
			<TextData caption="Número de Siniestro">{siniestro.siniestro}</TextData>
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

		{#if siniestro.detalles}
			<div class="py-4 text-lg">Detalles</div>
			<Reporte reporte={siniestro.detalles} />
		{/if}
	</PrintContainer>
{/if}

<style>
	.layout {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
	}
	/*  */
</style>
