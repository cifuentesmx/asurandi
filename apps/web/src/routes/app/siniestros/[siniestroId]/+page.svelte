<script lang="ts">
	import { page } from '$app/state';
	import PreviewFiles from '$lib/components/preview-files.svelte';
	import SimpleTable from '$lib/components/simple-table/simple-table.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { renderComponent } from '$lib/components/ui/data-table';
	import TextData from '$lib/components/ui/text-data.svelte';
	import { formatDate } from '$lib/formatters/formatDate';
	import { formatMoney } from '$lib/formatters/formatMoney';
	import CerrarSiniestro from './cerrar-siniestro.svelte';
	import RegistrarActividadSiniestro from './registrar-actividad-siniestro.svelte';
	import Reporte from './reporte.svelte';
	import { getSiniestroCtx } from './siniestroCtx.svelte';
	const siniestro = getSiniestroCtx();
	siniestro.set(page.data.siniestro);
</script>

{#if siniestro && siniestro.value}
	<div class="my-4 flex">
		<Button variant="outline" href="/app/siniestros" class="mr-2">Regresar</Button>
		<Button
			variant="outline"
			href="/app/polizas/consultas/{siniestro.value.numeroPoliza}"
			class="mr-2">Ver póliza</Button
		>
		<Button variant="outline" href={`/app/siniestros/${siniestro.value.id}/preview`} class="mr-2">
			Reporte
		</Button>
		<RegistrarActividadSiniestro />
		<CerrarSiniestro />
	</div>

	<div class="text-muted-foreground">
		Vehículo: <span class="ml-4 text-xl">{siniestro.value.vehiculo}</span>
		{#if siniestro.value.updated}
			<div class="text-sm">Última actualización: {formatDate(siniestro.value.updated)}</div>
		{/if}
	</div>

	<div class="py-4 text-lg">Bitácora</div>
	<SimpleTable
		data={siniestro.actividades}
		columns={[
			{
				accessorKey: 'timestamp',
				header: 'Fecha',
				cell: ({ cell }) => {
					const value = cell.getValue();
					if (typeof value !== 'string' && typeof value !== 'number') return '';

					const date = new Date(Number(value));
					const now = new Date();
					const diffMs = now.getTime() - date.getTime();
					const diffMins = Math.floor(diffMs / (1000 * 60));
					const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
					const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
					const diffMonths = Math.round(diffDays / 30);

					if (diffMs < 60_000) {
						return `Hace unos momentos`;
					} else if (diffMins < 60) {
						return `Hace ${diffMins} minuto(s)`;
					} else if (diffHours < 24) {
						return `Hace ${diffHours} horas`;
					} else if (diffDays < 60) {
						return `Hace ${diffDays} días`;
					} else {
						return `Hace ${diffMonths} meses`;
					}
				}
			},
			{ accessorKey: 'tipoActividad', header: 'Tipo actualizacion' },
			{ accessorKey: 'user', header: 'Usuario' },
			{ accessorKey: 'comentario', header: 'Comentarios' },
			{
				accessorKey: 'files',
				header: 'Archivos',
				cell: ({ row }) => {
					return renderComponent(PreviewFiles, { files: row.original.files ?? [] });
				}
			}
		]}
	/>
	<div class="py-4 text-lg">Datos del siniestro</div>

	<div class="layout mt-6 px-2">
		<TextData caption="Agente">{siniestro.value.agente}</TextData>
		<TextData caption="Conducto">{siniestro.value.conducto}</TextData>
		<TextData caption="Asegurado">{siniestro.value.asegurado}</TextData>
		<TextData caption="Número de Poliza">{siniestro.value.numeroPoliza}</TextData>
		<TextData caption="Número de Serie">{siniestro.value.numeroSerie}</TextData>
		<TextData caption="Número de Siniestro">{siniestro.value.siniestro}</TextData>
		<TextData caption="Causa">{siniestro.value.causa}</TextData>
		<TextData caption="Fecha de Siniestro">{siniestro.value.fechaSiniestro}</TextData>
		<TextData caption="Hora de Siniestro">{siniestro.value.horaSiniestro}</TextData>
		<TextData caption="Fecha de Cierre">{siniestro.value.fechaCierre ?? '-'}</TextData>
		<TextData caption="Monto Estimado">{formatMoney(siniestro.value.montoEstimado)}</TextData>
		<TextData caption="Monto Actualizado">{formatMoney(siniestro.value.montoActualizado)}</TextData>
		<TextData caption="Monto Final">{formatMoney(siniestro.value.montoFinal)}</TextData>
	</div>

	{#if siniestro.value.detalles}
		<div class="py-4 text-lg">Detalles</div>
		<Reporte reporte={siniestro.value.detalles} />
	{/if}
{/if}

<style>
	.layout {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
	}
	/*  */
</style>
