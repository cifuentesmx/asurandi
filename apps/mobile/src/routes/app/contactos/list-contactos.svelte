<script lang="ts">
	import { getContactosStore } from './contactos-store.svelte';
	import { goto } from '$app/navigation';
	import { Search, X } from 'lucide-svelte';
	import MessageAlert from '$lib/components/ui/message-alert.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { fade, fly } from 'svelte/transition';
	import ContactoDetalle from './contacto-detalle.svelte';
	const contactos = getContactosStore();
</script>

{#snippet btn()}
	<button
		onclick={() => {
			contactos.reset();
			goto('/app/contactos', { invalidateAll: true });
		}}
	>
		<X class="size-4" />
	</button>
{/snippet}

<MessageAlert title={`Se ha buscado: ${contactos.lastSearch.toUpperCase()}`} {btn}>
	{#if contactos.total > contactos.items.length}
		Mostrando {contactos.items.length} de {contactos.total} resultado(s).<br />
		<Button
			variant="outline"
			size="sm"
			class="mt-2"
			onclick={() => {
				contactos.fetchMore();
			}}><Search />Ver más resultados</Button
		>
	{:else}
		Se han encontrado {contactos.total} resultado(s).
	{/if}

	{#if contactos.lastSearch === 'Cumpleañeros'}
		<div class="mt-2">Se muestran los contactos que cumplen años proximamente.</div>
	{/if}
	{#if contactos.lastSearch === 'Sin cumpleaños registrados'}
		<div class="mt-2">Se muestran los contactos que no tienen cumpleaños registrados.</div>
	{/if}
	{#if contactos.lastSearch === 'Sin teléfono registrado'}
		<div class="mt-2">Se muestran los contactos que no tienen teléfono registrado.</div>
	{/if}
</MessageAlert>

<div
	class="layout mt-6"
	in:fade={{ duration: 250, delay: 250 }}
	out:fly={{ y: -200, duration: 250 }}
>
	{#each contactos.items as contacto}
		<ContactoDetalle {contacto} />
	{/each}
</div>

<style>
	.layout {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
		gap: 0.61rem;
	}
</style>
