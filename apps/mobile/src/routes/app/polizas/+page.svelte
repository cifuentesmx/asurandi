<script lang="ts">
	import Loader from '$lib/components/ui/loader.svelte';
	import ListPolizas from './list-polizas.svelte';
	import { getPolizasStore } from '$lib/polizas-store.svelte';
	import MessageAlert from '$lib/components/ui/message-alert.svelte';
	import { getSearchStore } from '$lib/search-store.svelte';
	import ShowOne from './show-one.svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	const polizas = getPolizasStore();
	const search = getSearchStore();

	$effect(() => {
		if (page.url.searchParams.get('newsearch')) {
			polizas.reset();
			goto('/app/polizas');
		} else if (page.url.searchParams.get('consiniestros')) {
			polizas.reset();
			polizas.searchSiniestros();
		} else if (page.url.searchParams.get('norenovadas')) {
			polizas.reset();
			polizas.searchNoRenovadas();
		}
	});
	search.searchFn = async () => {
		await polizas.search(search.value);
	};
</script>

{#if polizas.status === 'idle'}
	<MessageAlert title="Sugerencia" variant="tip">
		Para encontrar una póliza, puedes buscar el nombre de tu cliente o directamente el número de
		póliza.
	</MessageAlert>
{:else if polizas.status === 'searching'}
	<Loader />
{:else if polizas.status instanceof Error}
	<MessageAlert title="Error" variant="error">
		{polizas.status.message}
	</MessageAlert>
{:else if polizas.status === 'search-result'}
	<ListPolizas />
{:else if polizas.status === 'not-found'}
	<MessageAlert variant="info">
		No se ha encontrado la póliza que estás buscando, es posible que tu oficina de emisión la haya
		borrado recientemente.
	</MessageAlert>
{:else if polizas.status === 'show-one'}
	<ShowOne />
{/if}
