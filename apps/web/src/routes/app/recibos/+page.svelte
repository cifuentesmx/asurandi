<script lang="ts">
	import DataTable from '$lib/components/data-table/data-table.svelte';
	import type { FilterOptions, SearchOptions } from '$lib/components/data-table/types';
	import { page } from '$app/state';
	import type { ColumnDef } from '@tanstack/table-core';
	import type { ListRecibos } from '$api/recibos/listRecibos';
	import { renderComponent } from '$lib/components/ui/data-table';
	import RecibosAccciones from './recibos-accciones.svelte';
	import { formatMoney } from '$lib/formatters/formatMoney';

	const agentes =
		page.data.agentes?.map((a: { alias: any; id: any }) => {
			return {
				label: a.alias,
				value: a.id
			};
		}) ?? [];
	const statuses =
		page.data.statuses?.map((a: { estado: any; id: any }) => {
			return {
				label: a.estado,
				value: a.id
			};
		}) ?? [];

	const conductos =
		page.data.conductos?.map((a: { alias: any; id: any }) => {
			return {
				label: a.alias,
				value: a.id
			};
		}) ?? [];

	const columns: ColumnDef<ListRecibos['data'][number]>[] = [
		{
			accessorKey: 'agente',
			header: 'Agente',
			enableSorting: true
		},
		{
			accessorKey: 'conducto',
			header: 'Conducto',
			enableSorting: true
		},
		{
			accessorKey: 'asegurado',
			header: 'Asegurado',
			enableSorting: true
		},
		{
			accessorKey: 'numeroPoliza',
			header: 'Poliza',
			enableSorting: true
		},
		{
			accessorKey: 'vehiculo',
			header: 'Vehículo'
		},
		{
			accessorKey: 'remesa',
			header: 'Remesa',
			enableSorting: true
		},
		{
			accessorKey: 'numeroRecibo',
			header: 'Num. Recibo',
			enableSorting: true
		},
		{
			accessorKey: 'endoso',
			header: 'Endoso'
		},
		{
			accessorKey: 'importe',
			header: 'Importe'
		},
		{
			accessorKey: 'fechaVencimiento',
			header: 'Vencimiento',
			enableSorting: true
		},
		{
			accessorKey: 'fechaPago',
			header: 'Fecha Pago',
			enableSorting: true
		},
		{
			accessorKey: 'estado',
			header: 'Estado',
			enableSorting: true
		},
		{
			accessorKey: 'tipoEndoso',
			header: 'Tipo Endoso'
		},
		{
			id: 'actions',
			header: '',
			enableHiding: false,
			cell: ({ row }) => {
				return renderComponent(RecibosAccciones, { recibo: row.original });
			}
		}
	];
	const filterOptions: FilterOptions = [
		{
			caption: 'Status de recibo',
			options: statuses,
			type: 'combo',
			param: 'estado'
		},
		{
			caption: 'Agentes',
			options: agentes,
			type: 'combo',
			param: 'agente'
		},
		{
			caption: 'Conductos',
			options: conductos,
			type: 'combo',
			param: 'conducto'
		},
		{
			caption: 'Fecha de vencimiento',
			type: 'dateInterval',
			param: 'fechaVencimiento'
		}
	];
	const searchOptions: SearchOptions = [
		{
			caption: 'Número de póliza',
			type: 'text',
			param: 'numeroPoliza'
		},
		{
			caption: 'Número de serie',
			type: 'text',
			param: 'numeroSerie'
		},
		{
			caption: 'Nombre del cliente',
			type: 'text',
			param: 'cliente'
		}
	];
	let rawData: ListRecibos | null = $state(null);
</script>

{#if rawData}
	<div class="pt-12 text-lg">
		Total de registros: {rawData.total?.count ?? 0}<br />
		Importe: {formatMoney(rawData.total.importe)}<br />
	</div>
{/if}

<DataTable
	title="Recibos de cobro"
	{columns}
	model="Recibos"
	baseURL="/api/recibos"
	bind:rawData
	{filterOptions}
	{searchOptions}
	download
></DataTable>
