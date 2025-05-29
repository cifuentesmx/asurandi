<script lang="ts">
	import Loader from '$lib/components/ui/loader.svelte';
	import { getPolizasStore } from '../polizas/polizas-store.svelte';
	import MessageAlert from '$lib/components/ui/message-alert.svelte';
	import { getSearchStore } from '$lib/search-store.svelte';
	import { getCobranzaStore } from './cobranza-store.svelte';
	import ListCobranza from './list-cobranza.svelte';
	const polizas = getPolizasStore();
	const search = getSearchStore();
	const cobranza = getCobranzaStore();
	cobranza.fetch();

	$effect(() => {});
	search.searchFn = async () => {
		await polizas.search(search.value);
	};
</script>

{#if cobranza.status === 'idle'}
	<MessageAlert title="Cobranza" variant="info">
		Se están cargando las cobranzas pendientes.
	</MessageAlert>
{:else if cobranza.status === 'searching'}
	<Loader />
{:else if cobranza.status instanceof Error}
	<MessageAlert title="Error" variant="error">
		{cobranza.status.message}
	</MessageAlert>
{:else if cobranza.status === 'search-result'}
	<ListCobranza />
{/if}
