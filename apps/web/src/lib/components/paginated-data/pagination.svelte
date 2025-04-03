<script lang="ts">
	import ChevronLeft from 'lucide-svelte/icons/chevron-left';
	import ChevronRight from 'lucide-svelte/icons/chevron-right';
	import * as Pagination from '$lib/components/ui/pagination/index.js';

	let {
		count,
		perPage,
		siblingCount = 2,
		pagActual = $bindable(1)
	} = $props<{
		count: number;
		perPage: number;
		siblingCount?: number;
		pagActual?: number;
	}>();
</script>

<Pagination.Root {count} {perPage} {siblingCount}>
	{#snippet children({ pages, currentPage })}
		<Pagination.Content>
			<Pagination.Item>
				<Pagination.PrevButton
					onclick={() => {
						pagActual--;
					}}
				>
					<ChevronLeft class="h-4 w-4" />
					<span class="hidden sm:block">Anterior</span>
				</Pagination.PrevButton>
			</Pagination.Item>
			{#each pages as page (page.key)}
				{#if page.type === 'ellipsis'}
					<Pagination.Item>
						<Pagination.Ellipsis />
					</Pagination.Item>
				{:else}
					<Pagination.Item>
						<Pagination.Link
							{page}
							isActive={currentPage === page.value}
							onclick={() => {
								pagActual = page.value;
							}}
						>
							{page.value}
						</Pagination.Link>
					</Pagination.Item>
				{/if}
			{/each}
			<Pagination.Item>
				<Pagination.NextButton
					onclick={() => {
						pagActual++;
					}}
				>
					<span class="hidden sm:block">Siguiente</span>
					<ChevronRight class="h-4 w-4" />
				</Pagination.NextButton>
			</Pagination.Item>
		</Pagination.Content>
	{/snippet}
</Pagination.Root>
