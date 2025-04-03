<script lang="ts">
	import DataTable from '$lib/components/data-table/data-table.svelte';
	import { createRawSnippet } from 'svelte';
	import { renderComponent, renderSnippet } from '$lib/components/ui/data-table';
	import PolizaConsultaAcciones from './poliza-consulta-acciones.svelte';

	import { page } from '$app/state';
	import type { FilterOptions, SearchOptions } from '$lib/components/data-table/types';
	import type { ListPolizasGeneral } from '$api/polizas/listPolizas';
	import type { ColumnDef } from '@tanstack/table-core';

	const columns: ColumnDef<ListPolizasGeneral['data'][number]>[] = [
		{ accessorKey: 'agente', header: 'Agente' },
		{ accessorKey: 'conducto', header: 'Conducto' },
		{ accessorKey: 'numeroPoliza', header: 'Poliza' },
		{ accessorKey: 'asegurado', header: 'Asegurado' },
		{ accessorKey: 'vehiculo', header: 'Vehículo' },
		{ accessorKey: 'origen', header: 'Origen' },
		{ accessorKey: 'polizaEstatus', header: 'Estado' },
		{ accessorKey: 'servicio', header: 'Servicio' },
		{ accessorKey: 'uso', header: 'Uso' },
		{ accessorKey: 'subRamo', header: 'Subramo' },
		{
			accessorKey: 'total',
			header: 'Total',
			enableSorting: true,
			sortingFn: (a, b) => {
				const totalA = Number(a.getValue('total')) ?? 0;
				const totalB = Number(b.getValue('total')) ?? 0;
				if (totalA > totalB) return 1;
				else return -1;
			}
		},
		{
			accessorKey: 'primaNeta',
			header: () => {
				const amountHeaderSnippet = createRawSnippet(() => ({
					render: () => `<div class="text-right">Prima Neta</div>`
				}));
				return renderSnippet(amountHeaderSnippet, '');
			},
			cell: ({ row }) => {
				if (Number.isNaN(parseFloat(row.getValue('primaNeta')))) return '';
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
					formatter.format(parseFloat(row.getValue('primaNeta')))
				);
			}
		},
		{
			id: 'actions',
			cell: ({ row }) => {
				// You can pass whatever you need from `row.original` to the component
				return renderComponent(PolizaConsultaAcciones, { poliza: row.original });
			},
			enableHiding: false
		}
	];
	const origenes =
		page.data.origenes?.map((a: { origen: any; id: any }) => {
			return {
				label: a.origen,
				value: a.id
			};
		}) ?? [];

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
	const servicios =
		page.data.servicios?.map((a: { servicio: any; id: any }) => {
			return {
				label: a.servicio,
				value: a.id
			};
		}) ?? [];
	const subRamos =
		page.data.subRamos?.map((a: { subramo: any; id: any }) => {
			return {
				label: a.subramo,
				value: a.id
			};
		}) ?? [];
	const modoPagos =
		page.data.modoPagos?.map((a: { modoPago: any; id: any }) => {
			return {
				label: a.modoPago,
				value: a.id
			};
		}) ?? [];
	const polizaStatus =
		page.data.polizaStatus?.map((a: { status: any; id: any }) => {
			return {
				label: a.status,
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
			caption: 'Fecha de emisión/inicio vigencia',
			type: 'dateInterval',
			param: 'fechaEmision'
		},
		{
			caption: 'Tipo servicio',
			options: servicios,
			type: 'combo',
			param: 'servicio'
		},
		{
			caption: 'Sub Ramo',
			options: subRamos,
			type: 'combo',
			param: 'subramo'
		},
		{
			caption: 'Modo de pago',
			options: modoPagos,
			type: 'combo',
			param: 'modoPago'
		},
		{
			caption: 'Status de póliza',
			options: polizaStatus,
			type: 'combo',
			param: 'polizaStatus'
		},
		{
			caption: 'Origen de la póliza',
			options: origenes,
			type: 'combo',
			param: 'origen'
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

<DataTable {columns} {filterOptions} {searchOptions} baseURL="/api/polizas" download={true} />
