<script lang="ts">
	import { getPolizasStore } from '$lib/polizas-store.svelte';
	import PolizaDetalle from './poliza-detalle.svelte';
	import { X } from 'lucide-svelte';
	import MessageAlert from '$lib/components/ui/message-alert.svelte';
	import { fade, fly } from 'svelte/transition';
	const polizas = getPolizasStore();
	const results = $derived(polizas.searchedPolizas);
</script>

{#snippet btn()}
	<button
		onclick={() => {
			polizas.reset();
		}}
	>
		<X class="size-4" />
	</button>
{/snippet}
<MessageAlert title={`Se ha buscado: ${polizas.lastSearch.toUpperCase()}`} {btn}>
	Se han encontrado {polizas.total} resultado(s).
</MessageAlert>

<div
	class="layout mt-6"
	in:fade={{ duration: 250, delay: 250 }}
	out:fly={{ y: -200, duration: 250 }}
>
	{#each results as poliza}
		<PolizaDetalle {poliza} />
	{/each}
</div>

<style>
	.layout {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 0.61rem;
	}
</style>
