<script lang="ts">
	import DataTable from '$lib/components/data-table/data-table.svelte';
	import type { ListComisionesDetalles } from '$api/comisiones/detalles/listComisionesDetalles';
	import { createRawSnippet } from 'svelte';
	import { renderSnippet } from '$lib/components/ui/data-table';
	import type { ColumnDef } from '@tanstack/table-core';
	import { getTableDataObject } from '$lib/components/data-table/table-data.svelte';
	import { page } from '$app/state';
	import { formatMoney } from '$lib/formatters/formatMoney';
	import Button from '$lib/components/ui/button/button.svelte';

	let currentFilters = $state('');
	const tableData = getTableDataObject();
	tableData.setTableData(page.data.data);

	let columns: ColumnDef<ListComisionesDetalles['data'][number]>[] = [
		{
			accessorKey: 'agente',
			header: 'Agente'
		},
		{
			accessorKey: 'conducto',
			header: 'conducto'
		},
		{
			accessorKey: 'poliza',
			header: 'Poliza'
		},
		{
			accessorKey: 'fechaPago',
			header: 'Fecha Pago'
		},
		{
			accessorKey: 'clave',
			header: 'CVE'
		},
		{
			accessorKey: 'concepto',
			header: 'Concepto'
		},

		{
			accessorKey: 'importe',
			header: 'Importe',
			cell: ({ row }) => {
				if (Number.isNaN(parseFloat(row.getValue('importe')))) return '';
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
					formatter.format(parseFloat(row.getValue('importe')))
				);
			},
			enableSorting: true,
			sortingFn: (a, b) => {
				const totalA = Number(a.getValue('importe')) ?? 0;
				const totalB = Number(b.getValue('importe')) ?? 0;
				if (totalA > totalB) return 1;
				else return -1;
			}
		},

		{
			accessorKey: 'porcentajeComision',
			header: '% comisión',
			cell: ({ row }) => {
				return `${row.original.porcentajeComision ? `${row.original.porcentajeComision} %` : '-'}`;
			}
		},
		{
			accessorKey: 'comisionConducto',
			header: 'Comisión',
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
		}
	];

	const total = $derived(
		(tableData.data as ListComisionesDetalles['data']).reduce((total, current) => {
			if (!current.comisionConducto) return total;
			return total + parseFloat(current.comisionConducto);
		}, 0)
	);
	const totalPrima = $derived(
		(tableData.data as ListComisionesDetalles['data']).reduce((total, current) => {
			if (!current.importe) return total;
			return total + parseFloat(current.importe);
		}, 0)
	);
	type Fechas = {
		start: {
			year: number;
			month: number;
			day: number;
		};
		end: {
			year: number;
			month: number;
			day: number;
		};
	} | null;

	const fechas = $state<Fechas>(page.data?.dates?.fechaPago ?? null);
</script>

<div class="pt-6 text-xl">
	Comisiones por agente y conducto (detalles)
	<Button href="/app/comisiones" size="sm" variant="outline" class="ml-6">Regresar</Button>
</div>

{#if fechas}
	<div class="text-muted-foreground">
		Prima Total: {formatMoney(totalPrima)}<br />
		Total: {formatMoney(total)}<br />
		Fechas: {`del ${fechas.start.year}/${fechas.start.month}/${fechas.start.day} al ${fechas.end.year}/${fechas.end.month}/${fechas.end.day}`}
	</div>
{/if}

<div class="pt-5">
	<DataTable
		title={`Detalle de comisiones`}
		{columns}
		model="Comisiones_detalles"
		paginate={false}
		bind:currentFilters
		download
	></DataTable>
</div>
