<script lang="ts">
	import type { ListAgentes } from '$api/agentes/listAgentes';
	import { page } from '$app/state';
	import { Button } from '$lib/components/ui/button/index.js';
	import Input from '$lib/components/ui/input/input.svelte';
	import AgenteCard from './agente-card.svelte';
	import CreateAgent from './create-agent.svelte';
	let agentes = $state<ListAgentes['agentes']>(page.data.agentes);
	let filterStr = $state('');
</script>

<div class="py-4 text-2xl">Agentes</div>
<div class="flex w-40 max-w-40 pb-6">
	<Input bind:value={filterStr} type="text" placeholder="Filtrar agentes" class="max-w-50 w-50" />
	<Button href="/app/agents/conducts" size="sm" class="ml-4" variant="outline">
		Ver conductos
	</Button>
	<CreateAgent bind:collection={agentes} class="ml-4"></CreateAgent>
</div>
<div class="layout">
	{#each agentes as agente}
		{#if agente.nombre.toUpperCase().includes(filterStr.toUpperCase())}
			<AgenteCard {agente}></AgenteCard>
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
