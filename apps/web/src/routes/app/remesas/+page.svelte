<script lang="ts">
	import DataTable from '$lib/components/data-table/data-table.svelte';
	import SubirDecenaQualitas from './subir-decena-qualitas.svelte';
	import RemesasAcciones from './remesas-acciones.svelte';
	import { page } from '$app/state';
	import type { FilterOptions } from '$lib/components/data-table/types';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { ColumnDef } from '@tanstack/table-core';
	import type { ListRemesasSinComisiones } from '$api/remesas/listRemesasSinComisiones';
	import { renderComponent, renderSnippet } from '$lib/components/ui/data-table';
	import { createRawSnippet } from 'svelte';
	import type { ListRemesasGeneral } from '$api/remesas/listRemesas';
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

	let columns: ColumnDef<ListRemesasSinComisiones['data'][number]>[] = [
		{
			accessorKey: 'numeroPoliza',
			header: 'Póliza',
			enableSorting: true
		},
		{
			accessorKey: 'remesa',
			header: 'Remesa'
		},
		{
			accessorKey: 'numeroRecibo',
			header: 'Recibo',
			enableSorting: true
		},
		{
			accessorKey: 'agente',
			header: 'Agente',
			enableSorting: true
		},
		{
			accessorKey: 'conducto',
			header: 'conducto',
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
			enableSorting: true,
			sortingFn: (a, b) => {
				const totalA = Number(a.getValue('importe')) ?? 0;
				const totalB = Number(b.getValue('importe')) ?? 0;
				if (totalA > totalB) return 1;
				else return -1;
			},
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
			}
		},
		{
			id: 'acciones',
			header: '',
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
		}
	];
	let rawData: ListRemesasGeneral | null = $state(null);
</script>

<div class="pt-6">
	<SubirDecenaQualitas />
	<Button href="/app/remesas/consultas">Consultas</Button>
</div>
{#if rawData}
	<div class="pt-12 text-lg">
		Total de registros: {rawData.total?.count ?? 0}<br />
		Importe: {formatMoney(rawData.total.importe)}<br />
		Comisión sin asignación de conducto: {formatMoney(rawData.total.comision)}<br />
	</div>
{/if}

<div class="pt-5">
	<DataTable
		title="Comisiones sin aplicar"
		{columns}
		model="remesas:sincomision"
		bind:rawData
		baseURL="/api/remesas/sincomisiones"
		{filterOptions}
		download
	/>
</div>
