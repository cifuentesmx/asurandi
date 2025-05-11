<script lang="ts">
	import DataTable from '$lib/components/data-table/data-table.svelte';

	import { page } from '$app/state';
	import type { FilterOptions, SearchOptions } from '$lib/components/data-table/types';
	import type { ColumnDef } from '@tanstack/table-core';
	import { createRawSnippet } from 'svelte';
	import { renderComponent, renderSnippet } from '$lib/components/ui/data-table';
	import RenovacionStatus from './renovacion-status.svelte';
	import type { ListRenovaciones } from '$api/renovaciones/listRenovaciones';
	import RenovacionVencimiento from './renovacion-vencimiento.svelte';

	const columns: ColumnDef<ListRenovaciones['data'][number]>[] = [
		{ accessorKey: 'agente', header: 'Agente', enableSorting: true },
		{ accessorKey: 'conducto', header: 'Conducto' },
		{ accessorKey: 'cliente', header: 'Cliente', enableSorting: true },
		{ accessorKey: 'telefono', header: 'Teléfono' },
		{ accessorKey: 'email', header: 'Correo' },
		{ accessorKey: 'numeroPoliza', header: 'Póliza', enableSorting: true },
		{
			accessorKey: 'fechaVencimiento',
			header: 'Vencimiento',
			enableSorting: true,
			cell: ({ row }) => {
				return renderComponent(RenovacionVencimiento, { renovacion: row.original });
			}
		},
		{ accessorKey: 'vehiculo', header: 'Vehiculo' },
		{
			accessorKey: 'montoAnterior',
			header: 'Prima anterior',
			cell: ({ row }) => {
				if (Number.isNaN(parseFloat(row.getValue('montoAnterior')))) return '';
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
					formatter.format(parseFloat(row.getValue('montoAnterior')))
				);
			},
			enableSorting: true,
			sortingFn: (a, b) => {
				const totalA = Number(a.getValue('montoAnterior')) ?? 0;
				const totalB = Number(b.getValue('montoAnterior')) ?? 0;
				if (totalA > totalB) return 1;
				else return -1;
			}
		},
		{
			accessorKey: 'estado',
			header: 'Estado',
			cell: ({ row }) => {
				return renderComponent(RenovacionStatus, { renovacion: row.original });
			},
			enableSorting: true
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
				{ label: 'RENOVADA', value: 'RENOVADA' },
				{ label: 'NO RENOVADA', value: 'NO RENOVADA' }
			],
			type: 'combo',
			param: 'estado'
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
</script>

<DataTable
	{columns}
	{filterOptions}
	{searchOptions}
	baseURL="/api/renovaciones"
	model="renovaciones"
	download
></DataTable>
