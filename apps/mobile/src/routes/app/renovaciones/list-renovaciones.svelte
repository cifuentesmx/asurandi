<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import MessageAlert from '$lib/components/ui/message-alert.svelte';
	import { getRenovacionesStore } from '$lib/renovaciones-store.svelte';
	import { Search, X } from 'lucide-svelte';
	import Renovacion from './renovacion.svelte';
	const renovaciones = getRenovacionesStore();
</script>

{#snippet btn()}
	<button
		onclick={() => {
			renovaciones.reset();
			goto('/app/renovaciones', { invalidateAll: true });
		}}
	>
		<X class="size-4" />
	</button>
{/snippet}
<MessageAlert title={`Renovaciones`} {btn}>
	{#if renovaciones.total > renovaciones.items.length}
		Mostrando {renovaciones.items.length} de {renovaciones.total} renovaciones pendientes.<br />
		<Button
			variant="outline"
			size="sm"
			class="mt-2"
			onclick={() => {
				renovaciones.fetchMore();
			}}><Search />Ver más resultados</Button
		>
	{:else}
		Se han encontrado {renovaciones.total} renovaciones pendientes.
	{/if}
</MessageAlert>
{#if renovaciones.items.length > 0}
	<div class="layout">
		{#each renovaciones.items as renovacion}
			<Renovacion {renovacion} />
		{/each}
	</div>
{/if}

<style>
	.layout {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
		gap: 0.61rem;
	}
</style>
