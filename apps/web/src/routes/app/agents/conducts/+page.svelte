<script lang="ts">
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button';
	import Input from '$lib/components/ui/input/input.svelte';
	import ConductoCard from './conducto-card.svelte';
	import CreateConduct from './create-conduct.svelte';
	let filterStr = $state('');
	let conductos = $state(page.data.conductos);
</script>

<div class="py-4 text-2xl">Conductos</div>
<div class="flex w-40 max-w-40 pb-6">
	<Input bind:value={filterStr} type="text" placeholder="Filtrar agentes" class="max-w-50 w-50" />
	<Button href="/app/agents" size="sm" class="ml-4" variant="outline">Ver agentes</Button>
	<CreateConduct bind:collection={conductos} class="ml-4"></CreateConduct>
</div>
<div class="layout">
	{#each conductos as conducto}
		{#if conducto.nombre.toUpperCase().includes(filterStr.toUpperCase())}
			<ConductoCard {conducto}></ConductoCard>
		{/if}
	{/each}
</div>

<style>
	.layout {
		display: grid;
		gap: 1rem;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
	}
</style>
