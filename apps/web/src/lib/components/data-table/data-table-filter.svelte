<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet/index.js';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { _upsert } from '$lib/helpers/_upsert';
	import { FilterIcon, X } from 'lucide-svelte';
	import type { FilterOptions, SelectedFilters } from './types';
	import Label from '../ui/label/label.svelte';
	import ComboBox from '../combo-box.svelte';
	import Button from '../ui/button/button.svelte';
	import Dates from '../date-range.svelte';
	import Input from '../ui/input/input.svelte';

	let open = $state(false);
	let {
		filters = $bindable({}),
		filterOptions
	}: {
		filters?: SelectedFilters;
		filterOptions: FilterOptions;
	} = $props();
	let localFilters = $state<SelectedFilters>({});
	const localValues = $state<SelectedFilters>({});
	for (let idx = 0; idx < filterOptions.length; idx++) {
		const element = filterOptions[idx];
		localFilters[element.param] = filters[`${element.param}`] ?? undefined;
	}
</script>

<Sheet.Root bind:open>
	<Sheet.Trigger class={buttonVariants({ variant: 'outline', size: 'icon' })}>
		<FilterIcon class="text-muted-foreground" size="16" />
	</Sheet.Trigger>
	<Sheet.Content side="right">
		<ScrollArea class="h-full w-full p-4">
			<Sheet.Header>
				<Sheet.Title>Filtrar datos</Sheet.Title>
				<Sheet.Description>
					Agrega los filtros que sean requeridos para visualizar los datos.
				</Sheet.Description>
			</Sheet.Header>

			<div class="py-5">
				{#each filterOptions as filter}
					<div class="flex flex-col">
						<Label for={`cbm-${filter.param}`} class="mt-3 pb-1">{filter.caption}</Label>
						{#if filter.type === 'combo'}
							<div class="flex">
								<ComboBox
									options={filter.options}
									bind:selected={localFilters[filter.param]}
									bind:value={localValues[filter.param]}
									id={`filter-combo-${filter.param}`}
									identifier="value"
									labelField="label"
									emptyText={`Filtrar por ${filter.caption}`}
								/>
								<Button
									variant="outline"
									class="ml-2"
									size="sm"
									onclick={() => {
										localValues[filter.param] = undefined;
									}}><X /></Button
								>
							</div>
						{:else if filter.type === 'dateInterval'}
							<Dates bind:dateRange={localFilters[filter.param]} />
						{:else if filter.type === 'text'}
							<Input bind:value={localFilters[filter.param]} />
						{/if}
					</div>
				{/each}
			</div>
			<Sheet.Footer class="mt-6">
				<Button
					type="reset"
					variant="outline"
					size="sm"
					onclick={() => {
						open = false;
					}}>Cancelar</Button
				>
				<Button
					size="sm"
					onclick={() => {
						for (const key in localFilters) {
							if (Object.prototype.hasOwnProperty.call(localFilters, key)) {
								const element = localFilters[key];
								if (element && (localValues[key] || element.type !== 'combo')) {
									filters[`${key}`] = element;
								}
							}
						}
						open = false;
					}}>Agregar filtros</Button
				>
			</Sheet.Footer>
		</ScrollArea>
	</Sheet.Content>
</Sheet.Root>
