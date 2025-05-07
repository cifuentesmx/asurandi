<script lang="ts">
	import { ArrowLeft, MessageCircle } from 'lucide-svelte';
	import { getPolizasStore } from '$lib/polizas-store.svelte';
	import BottomSiniestros from './bottom-siniestros.svelte';
	import BottomRecibos from './bottom-recibos.svelte';
	import BottomEndosos from './bottom-endosos.svelte';
	import BottomComisiones from './bottom-comisiones.svelte';
	import BottomContactos from './bottom-contactos.svelte';
	const polizasStore = getPolizasStore();
	const poliza = $derived(polizasStore.onePoliza?.poliza);

	const numero = $derived.by(() => {
		if (!polizasStore.onePoliza?.poliza?.aseguradoCelular) return null;
		const cel = polizasStore.onePoliza?.poliza?.aseguradoCelular?.replace(/\s|\D/g, '');
		return cel?.length === 10 ? `52${cel}` : (cel ?? '');
	});
</script>

{#if poliza}
	<div class="bg-muted layout fixed bottom-0 left-0 right-0 z-40 h-16 px-4">
		<BottomSiniestros />
		<BottomEndosos />
		<BottomRecibos />
		<BottomComisiones />
		<BottomContactos />
		{#if numero}
			<a href={`https://wa.me/${numero}`} target="_blank">
				<MessageCircle class="h-6 w-6" />
			</a>
		{/if}
		<button
			onclick={() => {
				polizasStore.status = 'search-result';
			}}
		>
			<ArrowLeft class="h-6 w-6" />
		</button>
	</div>
{/if}

<style>
	.layout {
		display: grid;
		margin: auto;
		grid-template-columns: repeat(auto-fit, minmax(15px, 1fr));
		place-items: center;
		place-content: center;
	}
</style>
