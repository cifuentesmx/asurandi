<script lang="ts">
	import AccionesEmisiones from './acciones-emisiones.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { FilterOptions, SearchOptions } from '$lib/components/data-table/types';
	import { page } from '$app/state';
	import DataTable from '$lib/components/data-table/data-table.svelte';
	import type { ColumnDef } from '@tanstack/table-core';
	import type { ListPolizasSinComisiones } from '$api/polizas/listPolizasSinComisiones';
	import { createRawSnippet } from 'svelte';
	import { renderComponent, renderSnippet } from '$lib/components/ui/data-table';
	import PolizaOrigenChange from '../polizas/poliza-origen-change.svelte';

	const agentes =
		page.data.agentes?.map((a: { alias: any; id: any }) => {
			return {
				...a,
				label: a.alias,
				value: a.id
			};
		}) ?? [];
	const origenes =
		page.data.origenes?.map((a: { origen: any; id: any }) => {
			return {
				label: a.origen,
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

	const columns: ColumnDef<ListPolizasSinComisiones['data'][number]>[] = [
		{
			accessorKey: 'numeroPoliza',
			header: 'Poliza',
			enableSorting: true,
			enableHiding: false
		},
		{
			accessorKey: 'asegurado',
			header: 'Asegurado',
			enableSorting: true
		},
		{
			accessorKey: 'servicio',
			header: 'Serv.',
			enableSorting: true
		},
		{
			accessorKey: 'subRamo',
			header: 'Subramo',
			enableSorting: true
		},
		{
			accessorKey: 'modoPago',
			header: 'M. Pago',
			enableSorting: true
		},
		{
			accessorKey: 'compania',
			header: 'Compañia'
		},
		{
			accessorKey: 'incisosVigentes',
			header: 'Incisos vigentes',
			enableSorting: true
		},
		{
			accessorKey: 'totalIncisos',
			header: 'Incisos tot.',
			enableSorting: true
		},
		{
			accessorKey: 'agente',
			header: 'Agente',
			enableSorting: true
		},
		{
			accessorKey: 'fechaEmision',
			header: 'Fecha Emisión',
			enableSorting: true
		},
		{
			accessorKey: 'vigenciaInicio',
			header: 'Inicio',
			enableSorting: true
		},
		{
			accessorKey: 'vigenciaFin',
			header: 'Fin',
			enableSorting: true
		},
		{
			accessorKey: 'origen',
			header: 'Origen',
			enableSorting: true,
			cell: ({ row }) => {
				return renderComponent(PolizaOrigenChange, { poliza: row.original });
			}
		},
		{ accessorKey: 'polizaEstatus', header: 'Estado', enableSorting: true },
		{
			accessorKey: 'conducto',
			header: 'Conducto',
			enableSorting: true
		},
		{
			accessorKey: 'total',
			header: 'Prima',
			cell: ({ row }) => {
				if (Number.isNaN(parseFloat(row.getValue('total')))) return '';
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
					formatter.format(parseFloat(row.getValue('total')))
				);
			},
			enableSorting: true,
			sortingFn: (a, b) => {
				const totalA = Number(a.getValue('total')) ?? 0;
				const totalB = Number(b.getValue('total')) ?? 0;
				if (totalA > totalB) return 1;
				else return -1;
			}
		},
		{
			id: 'actions',
			enableHiding: false,
			header: '',
			cell: ({ row }) => {
				return renderComponent(AccionesEmisiones, { poliza: row.original, agentes, conductos });
			}
		}
	];
	const filterOptions: FilterOptions = [
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
			caption: 'Origen de la póliza',
			options: origenes,
			type: 'combo',
			param: 'origen'
		},
		{
			caption: 'Fecha de emisión',
			type: 'dateInterval',
			param: 'fechaEmision'
		},
		{
			caption: 'Inicio vigencia',
			type: 'dateInterval',
			param: 'vigenciaInicio'
		},
		{
			caption: 'Fin vigencia',
			type: 'dateInterval',
			param: 'vigenciaFin'
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
</script>

<div class="mt-2">
	<Button href="/app/emisiones/qualitas">Registros Quálitas</Button>
	<Button href="/app/emisiones/consultas">Consultas</Button>
</div>

<div class="pt-5">
	<DataTable
		title="Pólizas sin asignar"
		{columns}
		model="Emisiones_pendientes"
		baseURL="/api/polizas/sincomisiones"
		{filterOptions}
		{searchOptions}
		download
	></DataTable>
</div>
