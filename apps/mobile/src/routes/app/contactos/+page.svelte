<script lang="ts">
	import MessageAlert from '$lib/components/ui/message-alert.svelte';
	import Loader from '$lib/components/ui/loader.svelte';
	import { getContactosStore } from './contactos-store.svelte';
	import { getSearchStore } from '$lib/search-store.svelte';
	import ListContactos from './list-contactos.svelte';
	import { page } from '$app/state';
	import { goto } from '$app/navigation';
	const contactosStore = getContactosStore();
	const search = getSearchStore();

	$effect(() => {
		if (page.url.searchParams.get('newsearch')) {
			contactosStore.reset();
			goto('/app/contactos');
		} else if (page.url.searchParams.get('bday')) {
			contactosStore.reset();
			contactosStore.searchBirthdays();
		} else if (page.url.searchParams.get('woBday')) {
			contactosStore.reset();
			contactosStore.searchWoBirthdays();
		} else if (page.url.searchParams.get('woPhone')) {
			contactosStore.reset();
			contactosStore.searchWoPhone();
		}
	});
	search.searchFn = async () => {
		await contactosStore.search(search.value);
	};
</script>

<div>
	{#if contactosStore.status === 'idle'}
		<MessageAlert title="Sugerencia" variant="tip">
			Para encontrar un contacto, puedes buscar el nombre de tu cliente.
		</MessageAlert>
	{:else if contactosStore.status === 'searching' || contactosStore.status === 'searching-more'}
		<Loader />
	{:else if contactosStore.status === 'search-result'}
		<ListContactos />
	{:else if contactosStore.status === 'not-found'}
		<MessageAlert variant="info">
			No se ha encontrado el contacto que estás buscando, es posible que tu oficina de emisión el
			haya borrado recientemente.
		</MessageAlert>
	{:else if contactosStore.status instanceof Error}
		<MessageAlert title="Error" variant="error">
			{contactosStore.status.message}
		</MessageAlert>
	{/if}
</div>
