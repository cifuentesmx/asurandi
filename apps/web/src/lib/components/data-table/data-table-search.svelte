<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { _upsert } from '$lib/helpers/_upsert';
	import { SearchIcon, X } from 'lucide-svelte';
	import type { SearchOptions, SelectedSearch } from './types';
	import Label from '../ui/label/label.svelte';
	import ComboBox from '../combo-box.svelte';
	import Dates from '../date-range.svelte';
	import Input from '../ui/input/input.svelte';

	let open = $state(false);
	let {
		searchs = $bindable({}),
		searchOptions
	}: {
		searchs?: SelectedSearch;
		searchOptions: SearchOptions;
	} = $props();
	let localSearchs = $state<SelectedSearch>({});
	const localValues = $state<SelectedSearch>({});

	for (let idx = 0; idx < searchOptions.length; idx++) {
		const element = searchOptions[idx];
		localSearchs[element.param] = searchs[`${element.param}`] ?? undefined;
	}
</script>

<Sheet.Root bind:open>
	<Sheet.Trigger class={buttonVariants({ variant: 'outline', size: 'icon' })}>
		<SearchIcon class="text-muted-foreground" size="16" />
	</Sheet.Trigger>
	<Sheet.Content side="right">
		<ScrollArea class="h-full w-full p-4">
			<Sheet.Header>
				<Sheet.Title>Buscar en la base de datos</Sheet.Title>
				<Sheet.Description>
					Agrega los criterios de búsqueda que necesites, basta que se encuentren algunas
					coincidencias.
				</Sheet.Description>
			</Sheet.Header>
			<div class="py-5">
				{#each searchOptions as search}
					<div class="flex flex-col">
						<Label for={`cbm-${search.param}`} class="mt-3 pb-1">{search.caption}</Label>
						{#if search.type === 'combo'}
							<div class="flex">
								<ComboBox
									options={search.options}
									bind:selected={localSearchs[search.param]}
									bind:value={localValues[search.param]}
									id={`search-combo-${search.param}`}
									identifier="value"
									labelField="label"
									emptyText={`Buscar por ${search.caption}`}
								/>
								<Button
									variant="outline"
									class="ml-2"
									size="sm"
									onclick={() => {
										localValues[search.param] = undefined;
									}}><X /></Button
								>
							</div>
						{:else if search.type === 'dateInterval'}
							<Dates bind:dateRange={localSearchs[search.param]} />
						{:else if search.type === 'text'}
							<Input bind:value={localSearchs[search.param]} />
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
						for (const key in localSearchs) {
							if (Object.prototype.hasOwnProperty.call(localSearchs, key)) {
								const element = localSearchs[key];
								if (element && (localValues[key] || element.type !== 'combo')) {
									searchs[`${key}`] = element;
								}
							}
						}
						open = false;
					}}>Realizar búsqueda</Button
				>
			</Sheet.Footer>
		</ScrollArea>
	</Sheet.Content>
</Sheet.Root>
