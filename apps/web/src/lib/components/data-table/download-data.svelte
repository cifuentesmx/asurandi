<script lang="ts" generics="TData, TValue">
	import type { ColumnDef } from '@tanstack/table-core';
	import Button from '../ui/button/button.svelte';
	import { FolderDown } from 'lucide-svelte';
	import type { SelectedFilters, SelectedSearch } from './types';
	let estado: string = $state('idle');
	import * as XLSX from 'xlsx';
	import { getTableDataObject } from './table-data.svelte';

	const tableData = getTableDataObject();

	let { baseURL, columns, filters, searchs } = $props<{
		baseURL?: string;
		columns: ColumnDef<TData, TValue>[];
		filters: SelectedFilters;
		searchs: SelectedSearch;
	}>();
	const getData = async () => {
		try {
			estado = 'loading';
			const currentFilters = JSON.stringify(filters);
			const currentSearches = JSON.stringify(searchs);
			const url = `${baseURL}?f=${currentFilters}&s=${currentSearches}&download=1`;

			const data = baseURL
				? await fetch(url).then(async (r) => {
						if (r.ok) {
							const response = await r.json();
							return response?.data;
						}
					})
				: tableData.data;

			// Create CSV header row from visible column accessorKeys
			const headers = columns
				.filter((col: { accessorKey: any }) => col.accessorKey) // Only include columns with accessorKey
				.map((col: { accessorKey: string }) => col.accessorKey as string);

			const headerRow = columns
				.filter((col: { accessorKey: any }) => col.accessorKey) // Only include columns with accessorKey
				.map(
					(col: { accessorKey: string; header: string }) =>
						(typeof col.header === 'string' ? col.header : col.accessorKey) as string
				);

			// Create Excel workbook and worksheet
			const wb = XLSX.utils.book_new();
			const ws = XLSX.utils.json_to_sheet(
				data.map((row: { [x: string]: any }) => {
					const newRow: { [key: string]: any } = {};
					headers.forEach((key: string, index: number) => {
						newRow[headerRow[index]] = !Number.isNaN(Number(row[key]))
							? Number(row[key])
							: row[key];
					});
					return newRow;
				})
			);
			XLSX.utils.book_append_sheet(wb, ws, 'Datos');
			XLSX.writeFile(wb, 'datos.xlsx');
			estado = 'idle';
			return;
		} catch {
			estado = 'error';
			return;
		}
	};
</script>

<Button
	variant="outline"
	size="icon"
	onclick={getData}
	title="Descargar datos"
	disabled={estado === 'loading'}
>
	<FolderDown class="text-muted-foreground" size="16" />
</Button>
