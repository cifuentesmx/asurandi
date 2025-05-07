<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import type { FilterOptions, SearchOptions } from '$lib/components/data-table/types';
	import { page } from '$app/state';
	import DataTable from '$lib/components/data-table/data-table.svelte';
	import type { ColumnDef } from '@tanstack/table-core';
	import type { ListPolizasGeneral } from '$api/polizas/listPolizas';
	import { renderComponent, renderSnippet } from '$lib/components/ui/data-table';
	import { createRawSnippet } from 'svelte';
	import AccionesEmisiones from '../acciones-emisiones.svelte';
	import PolizaOrigenChange from '../../polizas/poliza-origen-change.svelte';
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

	const columns: ColumnDef<ListPolizasGeneral['data'][number]>[] = [
		{
			accessorKey: 'numeroPoliza',
			header: 'Poliza',
			enableSorting: true
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
			accessorKey: 'polizaAnterior',
			header: 'Poliza anterior',
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
			header: 'Vigencia Inicio',
			enableSorting: true
		},
		{
			accessorKey: 'vigenciaFin',
			header: 'Vigencia Fin',
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
		},
		{
			caption: 'Tipo servicio',
			options: servicios,
			type: 'combo',
			param: 'servicio'
		},
		{
			caption: 'Sub Ramos',
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

<div class="mt-2">
	<Button href="/app/emisiones">Regresar</Button>
</div>

<div class="pt-5">
	<DataTable
		{columns}
		title="Emisión de pólizas"
		model="Emisiones"
		baseURL="/api/polizas"
		{filterOptions}
		{searchOptions}
		download
	></DataTable>
</div>
