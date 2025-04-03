<script lang="ts">
	import type { ListSiniestros } from '$api/siniestros/listSiniestros';
	import DataTable from '$lib/components/data-table/data-table.svelte';
	import { renderComponent, renderSnippet } from '$lib/components/ui/data-table';
	import type { ColumnDef } from '@tanstack/table-core';
	import { createRawSnippet } from 'svelte';
	import AccionesSiniestos from './acciones-siniestros.svelte';
	import type { FilterOptions, SearchOptions } from '$lib/components/data-table/types';
	import { page } from '$app/state';
	import SeguimientoToggle from './seguimiento-toggle.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	const columns: ColumnDef<ListSiniestros['data'][number]>[] = [
		{
			accessorKey: 'numeroPoliza',
			header: 'Póliza',
			enableSorting: true
		},
		{
			accessorKey: 'siniestro',
			header: 'Siniestro',
			enableSorting: true
		},
		{
			accessorKey: 'numeroReporte',
			header: 'Reporte',
			enableSorting: true
		},
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
			accessorKey: 'vehiculo',
			header: 'Vehículo',
			enableSorting: true
		},

		{
			accessorKey: 'causa',
			header: 'causa'
		},
		{
			accessorKey: 'fechaSiniestro',
			header: 'Fecha',
			enableSorting: true
		},
		{
			accessorKey: 'montoEstimado',
			header: 'Monto Estimado',
			cell: ({ row }) => {
				if (Number.isNaN(parseFloat(row.getValue('montoEstimado')))) return '';
				const formatter = new Intl.NumberFormat('es-MX', {
					style: 'currency',
					currency: 'MXN'
				});

				const amountCellSnippet = createRawSnippet<[string]>((getAmount) => {
					const amount = getAmount();
					return {
						render: () => `<div class="text-right font-medium">${amount}</div>`
					};
				});

				return renderSnippet(
					amountCellSnippet,
					formatter.format(parseFloat(row.getValue('montoEstimado')))
				);
			},
			enableSorting: true,
			sortingFn: (a, b) => {
				const totalA = Number(a.getValue('montoEstimado')) ?? 0;
				const totalB = Number(b.getValue('montoEstimado')) ?? 0;
				if (totalA > totalB) return 1;
				else return -1;
			}
		},
		{
			accessorKey: 'montoActualizado',
			header: 'Monto Actualizado',
			cell: ({ row }) => {
				if (Number.isNaN(parseFloat(row.getValue('montoActualizado')))) return '';
				const formatter = new Intl.NumberFormat('es-MX', {
					style: 'currency',
					currency: 'MXN'
				});

				const amountCellSnippet = createRawSnippet<[string]>((getAmount) => {
					const amount = getAmount();
					return {
						render: () => `<div class="text-right font-medium">${amount}</div>`
					};
				});

				return renderSnippet(
					amountCellSnippet,
					formatter.format(parseFloat(row.getValue('montoActualizado')))
				);
			},
			enableSorting: true,
			sortingFn: (a, b) => {
				const totalA = Number(a.getValue('montoActualizado')) ?? 0;
				const totalB = Number(b.getValue('montoActualizado')) ?? 0;
				if (totalA > totalB) return 1;
				else return -1;
			}
		},
		{
			id: 'actions',
			enableHiding: false,
			header: '',
			cell: ({ row }) => {
				return renderComponent(AccionesSiniestos, { siniestro: row.original });
			}
		}
	];

	const agentes =
		page.data.agentes?.map((a: { alias: any; id: any }) => {
			return {
				...a,
				label: a.alias,
				value: a.id
			};
		}) ?? [];

	const conductos =
		page.data.conductos?.map((a: { alias: any; id: any }) => {
			return {
				...a,
				label: a.alias,
				value: a.id
			};
		}) ?? [];
	const causas =
		page.data.siniestroCausas?.map((a: { causa: any; id: any }) => {
			return {
				label: a.causa,
				value: a.id
			};
		}) ?? [];

	const filterOptions: FilterOptions = [
		{
			caption: 'Agente',
			options: agentes,
			type: 'combo',
			param: 'agente'
		},
		{
			caption: 'Conducto',
			options: conductos,
			type: 'combo',
			param: 'conducto'
		},
		{
			caption: 'Causa',
			options: causas,
			type: 'combo',
			param: 'causa'
		},
		{
			caption: 'Fecha siniestro',
			type: 'dateInterval',
			param: 'fechaSiniestro'
		}
	];
	const searchOptions: SearchOptions = [
		{
			caption: 'Número de reporte',
			type: 'text',
			param: 'numeroReporte'
		},
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
</script>

<div class="my-12 flex">
	<Button size="sm" class="mr-2" href="/app/siniestros/consultas">Consulta global</Button>
	<Button size="sm" class="mr-2" href="/app/siniestros/sin-seguimiento">Sin seguimiento</Button>
</div>
<DataTable
	title="Siniestros"
	baseURL="/api/siniestros?enSeguimiento=1"
	{columns}
	model="siniestros"
	{filterOptions}
	{searchOptions}
	download
/>
