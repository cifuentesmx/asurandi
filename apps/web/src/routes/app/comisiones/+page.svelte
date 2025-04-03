<script lang="ts">
	import AccionesComisiones from './acciones-comisiones.svelte';
	import DataTable from '$lib/components/data-table/data-table.svelte';
	import type { FilterOptions } from '$lib/components/data-table/types';
	import type { ColumnDef } from '@tanstack/table-core';
	import type { ListComisiones } from '$api/comisiones/listComisiones';
	import { createRawSnippet } from 'svelte';
	import { renderComponent, renderSnippet } from '$lib/components/ui/data-table';
	import { getTableDataObject } from '$lib/components/data-table/table-data.svelte';
	import { formatMoney } from '$lib/formatters/formatMoney';

	let currentFilters = $state('');
	const columns: ColumnDef<ListComisiones['data'][number]>[] = [
		{
			accessorKey: 'agente',
			header: 'Agente'
		},
		{
			accessorKey: 'conducto',
			header: 'Conducto',
			enableHiding: false
		},
		{
			accessorKey: 'prima',
			header: 'Prima',
			enableHiding: false,
			cell: ({ row }) => {
				if (Number.isNaN(parseFloat(row.getValue('prima')))) return '';
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
					formatter.format(parseFloat(row.getValue('prima')))
				);
			},
			enableSorting: true,
			sortingFn: (a, b) => {
				const totalA = Number(a.getValue('prima')) ?? 0;
				const totalB = Number(b.getValue('prima')) ?? 0;
				if (totalA > totalB) return 1;
				else return -1;
			}
		},
		{
			accessorKey: 'comisionConducto',
			header: 'Comisión',
			enableHiding: false,
			cell: ({ row }) => {
				if (Number.isNaN(parseFloat(row.getValue('comisionConducto')))) return '';
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
					formatter.format(parseFloat(row.getValue('comisionConducto')))
				);
			},
			enableSorting: true,
			sortingFn: (a, b) => {
				const totalA = Number(a.getValue('comisionConducto')) ?? 0;
				const totalB = Number(b.getValue('comisionConducto')) ?? 0;
				if (totalA > totalB) return 1;
				else return -1;
			}
		},
		{
			id: 'actions',
			header: '',
			enableHiding: false,
			cell: ({ row }) => {
				return renderComponent(AccionesComisiones, {
					// @ts-ignore
					id: row.original.id ? row.original.id : '',
					filters: currentFilters
				});
			}
		}
	];

	const filterOptions: FilterOptions = [
		{
			caption: 'Fecha de pago',
			type: 'dateInterval',
			param: 'fechaPago'
		}
	];
	const tableData = getTableDataObject();

	const total = $derived(
		(tableData.data as ListComisiones['data']).reduce((total, current) => {
			if (!current.comisionConducto) return total;
			return total + parseFloat(current.comisionConducto);
		}, 0)
	);
	const totalPrima = $derived(
		(tableData.data as ListComisiones['data']).reduce((total, current) => {
			if (!current.prima) return total;
			return total + parseFloat(current.prima);
		}, 0)
	);
</script>

<div class="pt-6 text-lg">Total Prima: {formatMoney(totalPrima)}</div>
<div class="pt-6 text-lg">Total de comisiones: {formatMoney(total)}</div>

<div class="pt-5">
	<DataTable
		title="Comisiones de conductos por periodo"
		{columns}
		model="Comisiones_general"
		baseURL="/api/comisiones"
		{filterOptions}
		paginate={false}
		bind:currentFilters
		download
	></DataTable>
</div>
