<script lang="ts">
	import DataTable from '$lib/components/data-table/data-table.svelte';
	import RemesasAcciones from '../remesas-acciones.svelte';
	import { page } from '$app/state';
	import type { FilterOptions } from '$lib/components/data-table/types';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { ColumnDef } from '@tanstack/table-core';
	import type { ListRemesasGeneral } from '$api/remesas/listRemesas';
	import { createRawSnippet } from 'svelte';
	import { renderComponent, renderSnippet } from '$lib/components/ui/data-table';
	import { formatMoney } from '$lib/formatters/formatMoney';

	const agentes =
		page.data.agentes?.map((a: { alias: any; id: any }) => {
			return {
				label: a.alias,
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

	let columns: ColumnDef<ListRemesasGeneral['data'][number]>[] = [
		{
			accessorKey: 'numeroPoliza',
			header: 'Póliza',
			enableSorting: true
		},
		{
			accessorKey: 'remesa',
			header: 'Remesa',
			enableSorting: true
		},
		{
			accessorKey: 'numeroRecibo',
			header: 'Recibo',
			enableSorting: true
		},
		{
			accessorKey: 'agente',
			header: 'Agente',
			enableSorting: true,
			cell: ({ row }) => {
				return row.original.agente ?? '-';
			}
		},
		{
			accessorKey: 'conducto',
			header: 'Conducto',
			cell: ({ row }) => {
				return row.original.conducto ?? '-';
			},
			enableSorting: true
		},
		{
			accessorKey: 'clave',
			header: 'clave',
			enableSorting: true
		},
		{
			accessorKey: 'concepto',
			header: 'Concepto',
			enableSorting: true
		},
		{
			accessorKey: 'fechaPago',
			header: 'Pago',
			enableSorting: true
		},
		{
			accessorKey: 'serie',
			header: 'Serie',
			enableSorting: true
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
			header: '%',
			cell: ({ row }) => {
				return row.original.porcentajeComision ?? '-';
			}
		},
		{
			accessorKey: 'comisionConducto',
			header: 'Comision',
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
			id: 'acciones',
			header: '',
			enableHiding: false,
			cell: ({ row }) => {
				return renderComponent(RemesasAcciones, { remesa: row.original });
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
			caption: 'Fecha de pago',
			type: 'dateInterval',
			param: 'fechaPago'
		}
	];
	let rawData: ListRemesasGeneral | null = $state(null);
</script>

<div class="pt-6">
	<Button href="/app/remesas">Regresar</Button>
</div>

{#if rawData}
	<div class="pt-12 text-lg">
		Total de registros: {rawData.total?.count ?? 0}<br />
		Importe: {formatMoney(rawData.total.importe)}<br />
		Comisión conducto: {formatMoney(rawData.total.comision)}<br />
	</div>
{/if}
<div class="pt-5">
	<DataTable
		title="Remesas"
		{columns}
		bind:rawData
		model="remesas"
		baseURL="/api/remesas"
		{filterOptions}
		download
	/>
</div>
