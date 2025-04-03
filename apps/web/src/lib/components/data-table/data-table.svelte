<script lang="ts" generics="TData, TValue, RawDataType">
	import {
		getCoreRowModel,
		type ColumnDef,
		type SortingState,
		getSortedRowModel,
		type VisibilityState,
		getFilteredRowModel,
		type ColumnFiltersState
	} from '@tanstack/table-core';
	import { createSvelteTable, FlexRender, renderComponent } from '$lib/components/ui/data-table';
	import * as Table from '$lib/components/ui/table';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import type { FilterOptions, SelectedFilters, SearchOptions, SelectedSearch } from './types';
	import { getCookie } from '$lib/utils';
	import PerpageSelect from './perpage-select.svelte';
	import Input from '../ui/input/input.svelte';
	import Pagination from './pagination.svelte';
	import SortableHeader from './sortable-header.svelte';
	import DataTableFilter from './data-table-filter.svelte';
	import DataTableSearch from './data-table-search.svelte';
	import { X } from 'lucide-svelte';
	import { getTableDataObject } from './table-data.svelte';
	import DownloadData from './download-data.svelte';

	type DataTableProps<TData, TValue> = {
		title?: string;
		columns: ColumnDef<TData, TValue>[];
		model?: string;
		baseURL?: string;
		filterOptions?: FilterOptions;
		searchOptions?: SearchOptions;
		paginate?: boolean;
		currentFilters?: string;
		currentSearches?: string;
		showControls?: boolean;
		download?: boolean;
		rawData?: RawDataType | null;
	};

	let estado: string = $state('idle');
	const tableData = getTableDataObject();

	let {
		columns,
		model = 'data-table',
		baseURL,
		filterOptions,
		searchOptions,
		paginate = true,
		currentFilters = $bindable('{}'),
		currentSearches = $bindable('{}'),
		showControls = true,
		download = false,
		rawData = $bindable<RawDataType>()
	}: DataTableProps<TData, TValue> = $props();

	let columnVisibility = $state<VisibilityState>(
		JSON.parse(getCookie(`cfgDataTable:columnVisibility:${model}`) ?? '{}')
	);

	let filters = $state<SelectedFilters>(
		JSON.parse(getCookie(`cfgDataTable:filters:${model}`) ?? '{}')
	);
	let searchs = $state<SelectedSearch>(
		JSON.parse(getCookie(`cfgDataTable:searchs:${model}`) ?? '{}')
	);
	const perPageStr = getCookie('cfgDataTable:perPage');

	let filterStr = $state('');
	let page = $state(1);
	let count = $state(0);
	let perPage = $state<number>(Number(perPageStr));

	const calcularFilterChips = () => {
		const chips: { label: string; key: string; caption: string }[] = [];
		for (const key in filters) {
			if (Object.prototype.hasOwnProperty.call(filters, key)) {
				const value = filters[key];
				const [filter] = [filterOptions?.find((t) => t.param === key)] as FilterOptions;
				if (filter && filter.type === 'combo') {
					const chip = filter?.options?.find((o) => o.value === value);
					if (chip) chips.push({ label: chip.label, key, caption: filter.caption });
				} else if (filter && filter.type === 'dateInterval' && value.end && value.start) {
					chips.push({
						key,
						caption: filter.caption,
						label: `del ${value.start.year}/${value.start.month}/${value.start.day} al ${value.end.year}/${value.end.month}/${value.end.day}`
					});
				}
			}
		}
		return chips;
	};

	const calcularSearchChips = () => {
		const chips: { label: string; key: string; caption: string }[] = [];
		for (const key in searchs) {
			if (Object.prototype.hasOwnProperty.call(searchs, key)) {
				const value = searchs[key];
				const [search] = [searchOptions?.find((t) => t.param === key)] as SearchOptions;
				if (search && search.type === 'combo') {
					const chip = search?.options?.find((o) => o.value === value);
					if (chip) chips.push({ label: chip.label, key, caption: search.caption });
				} else if (search && search.type === 'dateInterval' && value.end && value.start) {
					chips.push({
						key,
						caption: search.caption,
						label: `del ${value.start.year}/${value.start.month}/${value.start.day} al ${value.end.year}/${value.end.month}/${value.end.day}`
					});
				} else if (search && search.type === 'text') {
					chips.push({
						key,
						caption: search.caption,
						label: value
					});
				}
			}
		}
		return chips;
	};

	const loadData = async () => {
		try {
			estado = 'loading';
			currentFilters = JSON.stringify(filters);
			currentSearches = JSON.stringify(searchs);
			const offset = (page - 1) * perPage;
			const url = `${baseURL}${baseURL?.includes('?') ? `${baseURL.endsWith('&') ? '' : '&'}` : '?'}l=${perPage}&o=${offset}&f=${currentFilters}&s=${currentSearches}`;
			if (baseURL)
				await fetch(url).then(async (r) => {
					if (r.ok) {
						const response = (await r.json()) as RawDataType & {
							data?: TData;
							total?: { count?: number };
						};

						filterStr = '';
						tableData.setTableData((response?.data as TData[]) ?? []);
						count = response?.total?.count ?? 0;
						rawData = response;
					} else {
						rawData = null;
					}
				});
			estado = 'idle';
			return;
		} catch {
			estado = 'error';
			rawData = null;
			return;
		}
	};

	let sorting = $state<SortingState>([]);
	for (let idx = 0; idx < columns.length; idx++) {
		const col = columns[idx];
		if (col.enableSorting && typeof col.header === 'string') {
			const originalHeader = col.header;
			columns[idx].header = ({ column }) =>
				renderComponent(SortableHeader, {
					text: originalHeader,
					onclick: () => {
						return column.toggleSorting(column.getIsSorted() === 'asc');
					}
				});
		}
	}

	let columnFilters = $state<ColumnFiltersState>([]);
	const table = createSvelteTable<TData>({
		get data() {
			return tableData.data as unknown as TData[];
		},
		columns,
		onSortingChange: (updater) => {
			if (typeof updater === 'function') {
				sorting = updater(sorting);
			} else {
				sorting = updater;
			}
		},
		onColumnFiltersChange: (updater) => {
			if (typeof updater === 'function') {
				columnFilters = updater(columnFilters);
			} else {
				columnFilters = updater;
			}
		},
		getCoreRowModel: getCoreRowModel(),
		state: {
			get sorting() {
				return sorting;
			},
			get columnVisibility() {
				return columnVisibility;
			}
		},
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: (updater) => {
			if (typeof updater === 'function') {
				columnVisibility = updater(columnVisibility);
			} else {
				columnVisibility = updater;
			}
			document.cookie = `cfgDataTable:columnVisibility:${model}=${JSON.stringify(columnVisibility)};path=/;samesite=strict;`;
		}
	});

	let filterChips = $derived(calcularFilterChips());
	let searchChips = $derived(calcularSearchChips());

	$effect(() => {
		loadData();
		if (!baseURL) count = tableData.data.length;
		document.cookie = `cfgDataTable:filters:${model}=${JSON.stringify(filters)};path=/;samesite=strict;`;
		document.cookie = `cfgDataTable:searchs:${model}=${JSON.stringify(searchs)};path=/;samesite=strict;`;
	});
</script>

{#if showControls}
	<div class="my-4 flex">
		<Input
			class="mr-2 max-w-[180px]"
			placeholder="Filtrar datos..."
			type="text"
			bind:value={tableData.filterStr}
		/>
		{#if paginate}
			<PerpageSelect bind:value={perPage} />
		{/if}
		{#if filterOptions}
			<div class="ml-2">
				<DataTableFilter {filterOptions} bind:filters />
			</div>
		{/if}
		{#if searchOptions}
			<div class="ml-2">
				<DataTableSearch {searchOptions} bind:searchs />
			</div>
		{/if}
		{#if download}
			<div class="ml-2">
				<DownloadData {columns} {baseURL} {filters} {searchs} />
			</div>
		{/if}
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Button {...props} variant="outline" class="ml-auto">Columnas</Button>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content align="end">
				{#each table.getAllColumns().filter((col) => col.getCanHide()) as column (column.id)}
					<DropdownMenu.CheckboxItem
						class="capitalize"
						checked={column.getIsVisible()}
						onCheckedChange={(value) => column.toggleVisibility(!!value)}
					>
						{column.id}
					</DropdownMenu.CheckboxItem>
				{/each}
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
	{#if (filterOptions && filterChips && filterChips.length > 0) || (searchOptions && searchChips && searchChips.length > 0)}
		<div class="flex pt-2 text-sm">
			{#each filterChips as p}
				<div class="bg-muted mr-2 flex items-center rounded px-2 py-1">
					<div class="max-w-[180px] truncate">
						<div class="text-xs">
							{p.caption}
						</div>
						<div class="uppercase">
							{p.label}
						</div>
					</div>
					<button
						onclick={() => {
							delete filters[p.key];
						}}
					>
						<X size="24" class="pl-2" />
					</button>
				</div>
			{/each}
			{#each searchChips as p}
				<div class="bg-muted mr-2 flex items-center rounded px-2 py-1">
					<div class="max-w-[180px] truncate">
						<div class="text-xs">
							{p.caption}
						</div>
						<div class="uppercase">
							{p.label}
						</div>
					</div>
					<button
						onclick={() => {
							delete searchs[p.key];
						}}
					>
						<X size="24" class="pl-2" />
					</button>
				</div>
			{/each}
		</div>
	{/if}

	<div class="my-1 flex">
		{#if paginate}
			<Pagination {count} bind:page {perPage}></Pagination>
		{/if}
	</div>
{/if}

<div class="text-muted-foreground mb-2 pt-4 text-xs">
	Mostrando <span class="font-bold">{tableData.data?.length ?? 0}</span>
	registros de <span class="font-bold">{count}</span> totales
	{#if paginate}
		<span class="font-bold">
			( del {count > 0 ? perPage * (page - 1) + 1 : 0} al {perPage * (page - 1) +
				(tableData.data?.length ?? 0)})
		</span>
	{/if}
	.
</div>
<div class="rounded-md border">
	<Table.Root>
		<Table.Header>
			{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
				<Table.Row>
					{#each headerGroup.headers as header (header.id)}
						<Table.Head>
							{#if !header.isPlaceholder}
								<FlexRender
									content={header.column.columnDef.header}
									context={header.getContext()}
								/>
							{/if}
						</Table.Head>
					{/each}
				</Table.Row>
			{/each}
		</Table.Header>
		<Table.Body>
			{#each table.getRowModel().rows as row (row.id)}
				<Table.Row data-state={row.getIsSelected() && 'selected'}>
					{#each row.getVisibleCells() as cell (cell.id)}
						<Table.Cell>
							<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
						</Table.Cell>
					{/each}
				</Table.Row>
			{:else}
				<Table.Row>
					<Table.Cell
						colspan={columns.length}
						class="h-24 text-center text-xl text-muted-foreground"
					>
						{#if estado === 'idle'}
							Sin datos para mostrar.
						{:else if estado === 'loading'}
							Cargando datos
						{/if}
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
