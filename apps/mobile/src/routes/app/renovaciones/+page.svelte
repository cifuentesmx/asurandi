<script lang="ts">
	import Loader from '$lib/components/ui/loader.svelte';
	import { getPolizasStore } from '../polizas/polizas-store.svelte';
	import MessageAlert from '$lib/components/ui/message-alert.svelte';
	import { getSearchStore } from '$lib/search-store.svelte';
	import { getRenovacionesStore } from './renovaciones-store.svelte';
	import ListRenovaciones from './list-renovaciones.svelte';
	const polizas = getPolizasStore();
	const search = getSearchStore();
	const renovaciones = getRenovacionesStore();
	renovaciones.fetch();

	$effect(() => {});
	search.searchFn = async () => {
		await polizas.search(search.value);
	};
</script>

{#if renovaciones.status === 'idle'}
	<MessageAlert title="Renovaciones" variant="info">
		Se están cargando las pólizas proximas a renovarse.
	</MessageAlert>
{:else if renovaciones.status === 'searching'}
	<Loader />
{:else if renovaciones.status instanceof Error}
	<MessageAlert title="Error" variant="error">
		{renovaciones.status.message}
	</MessageAlert>
{:else if renovaciones.status === 'search-result'}
	<ListRenovaciones />
{/if}
