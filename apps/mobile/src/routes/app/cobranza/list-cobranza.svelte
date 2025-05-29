<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '$lib/components/ui/button/button.svelte';
	import MessageAlert from '$lib/components/ui/message-alert.svelte';
	import { getCobranzaStore } from './cobranza-store.svelte';
	import { Search, X } from 'lucide-svelte';
	import Cobro from './cobro.svelte';
	const cobranza = getCobranzaStore();
</script>

{#snippet btn()}
	<button
		onclick={() => {
			cobranza.reset();
			goto('/app/cobranza', { invalidateAll: true });
		}}
	>
		<X class="size-4" />
	</button>
{/snippet}
<MessageAlert title={`Cobranza`} {btn}>
	{#if cobranza.total > cobranza.items.length}
		Mostrando {cobranza.items.length} de {cobranza.total} cobros pendientes.<br />
		<Button
			variant="outline"
			size="sm"
			class="mt-2"
			onclick={() => {
				cobranza.fetchMore();
			}}><Search />Ver más resultados</Button
		>
	{:else}
		Se han encontrado {cobranza.total} cobros pendientes.
	{/if}
</MessageAlert>
{#if cobranza.items.length > 0}
	<div class="layout">
		{#each cobranza.items as cobro}
			<Cobro {cobro} />
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
