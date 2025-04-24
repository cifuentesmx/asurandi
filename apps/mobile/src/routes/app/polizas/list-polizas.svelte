<script lang="ts">
	import { getPolizasStore } from '$lib/polizas-store.svelte';
	import PolizaDetalle from './poliza-detalle.svelte';
	import { Search, X } from 'lucide-svelte';
	import MessageAlert from '$lib/components/ui/message-alert.svelte';
	import { fade, fly } from 'svelte/transition';
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	const polizas = getPolizasStore();
	const results = $derived(polizas.searchedPolizas);
</script>

{#snippet btn()}
	<button
		onclick={() => {
			polizas.reset();
			goto('/app/polizas', { invalidateAll: true });
		}}
	>
		<X class="size-4" />
	</button>
{/snippet}
<MessageAlert title={`Se ha buscado: ${polizas.lastSearch.toUpperCase()}`} {btn}>
	{#if polizas.total > polizas.searchedPolizas.length}
		Mostrando {polizas.searchedPolizas.length} de {polizas.total} resultado(s).<br />
		<Button
			variant="outline"
			size="sm"
			class="mt-2"
			onclick={() => {
				polizas.searchMore();
			}}><Search />Ver más resultados</Button
		>
	{:else}
		Se han encontrado {polizas.total} resultado(s).
	{/if}

	{#if polizas.lastSearch === 'Pólizas no renovadas'}
		<div class="mt-2">
			Se muestran las polizas que aún no cuentan con un registro como renovadas que se emitieron
			hace más de 18 meses.<br />
			Puede ser que se hayan renovado pero no se haya actualizado el registro.
		</div>
	{/if}
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
