<script lang="ts">
	import DataTable from '$lib/components/data-table/data-table.svelte';

	import { page } from '$app/state';
	import type { FilterOptions, SearchOptions } from '$lib/components/data-table/types';
	import type { ColumnDef } from '@tanstack/table-core';
	import { createRawSnippet } from 'svelte';
	import { renderComponent, renderSnippet } from '$lib/components/ui/data-table';
	import CobranzaStatus from './cobranza-status.svelte';
	import type { ListCobranza } from '$api/cobros/listCobranza';
	import { formatMoney } from '$lib/formatters/formatMoney';

	const columns: ColumnDef<ListCobranza['data'][number]>[] = [
		{ accessorKey: 'agente', header: 'Agente', enableSorting: true },
		{ accessorKey: 'conducto', header: 'Conducto' },
		{ accessorKey: 'cliente', header: 'Cliente' },
		{ accessorKey: 'numeroPoliza', header: 'Póliza' },
		{ accessorKey: 'numeroRecibo', header: 'Recibo' },
		{ accessorKey: 'endoso', header: 'Endoso' },
		{ accessorKey: 'fechaVencimiento', header: 'Vencimiento' },
		{ accessorKey: 'fechaLimite', header: 'Límite' },
		{
			accessorKey: 'estado',
			header: 'Estado',
			cell: ({ row }) => {
				return renderComponent(CobranzaStatus, { cobro: row.original });
			}
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
		}
	];

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
			caption: 'Estado',
			options: [
				{ label: 'PENDIENTE', value: 'PENDIENTE' },
				{ label: 'PAGADA', value: 'PAGADA' },
				{ label: 'VENCIDA', value: 'VENCIDA' },
				{ label: 'CANCELADA', value: 'CANCELADA' }
			],
			type: 'combo',
			param: 'estado'
		},
		{
			caption: 'Fecha Límite de pago',
			type: 'dateInterval',
			param: 'fechaLimite'
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
	let rawData: ListCobranza | null = $state(null);
</script>

{#if rawData}
	<div class="pt-12 text-lg">
		Total de registros: {rawData.total?.count ?? 0}<br />
		Importe: {formatMoney(rawData.total.importe)}<br />
	</div>
{/if}

<DataTable
	{columns}
	{filterOptions}
	{searchOptions}
	bind:rawData
	baseURL="/api/cobros"
	model="cobranza"
	download={true}
/>
