<script lang="ts">
	import { Phone, Mail, MessageCircle } from 'lucide-svelte';
	import { Button } from '$lib/components/ui/button';
	import { getPolizasStore } from '$lib/polizas-store.svelte';
	import { goto } from '$app/navigation';
	const { cobro } = $props();
	const days = $state(
		cobro.fechaVencimiento
			? Math.round(
					(new Date(cobro.fechaVencimiento).getTime() - new Date().getTime()) / 1000 / 3600 / 24
				) + 1
			: 0
	);

	const polizasStore = getPolizasStore();

	const numero = $derived.by(() => {
		if (!cobro.celular) return null;
		const cel = cobro.celular?.replace(/\s|\D/g, '');
		return cel?.length === 10 ? `52${cel}` : (cel ?? '');
	});
</script>

<div class="rounded-lg border px-4 py-2">
	<div class="truncate capitalize">
		{cobro.asegurado?.toLowerCase()}
	</div>
	<div class="truncate text-xs">
		{cobro.numeroPoliza} - {cobro.vehiculo}
	</div>
	<div class="my-2 flex items-center space-x-2">
		<Button
			variant="outline"
			size="sm"
			onclick={async () => {
				await polizasStore.getOne(cobro.polizaId);
				await goto('/app/polizas');
			}}>Ver póliza original</Button
		>
		<div
			class="rounded-lg p-2 text-xs text-white"
			class:bg-red-900={days < 1}
			class:bg-red-500={days >= 1 && days < 10}
			class:bg-orange-400={days >= 10 && days < 15}
			class:bg-green-800={days >= 15}
		>
			{#if days < 0}
				Venció hace {-days} días
			{:else if days === 0}
				¡Vence hoy!
			{:else}
				Dentro de {days} días
			{/if}
		</div>
	</div>
	<div class="mt-2 flex items-center space-x-2">
		{#if cobro.celular}
			<Button variant="outline" size="sm" href={`tel:${cobro.celular}`}>
				<Phone /> Llamar
			</Button>
		{/if}
		{#if numero}
			<Button
				variant="outline"
				size="sm"
				href={`https://wa.me/${numero}`}
				target="_blank"
				class="flex items-center space-x-2"
			>
				<MessageCircle /> Whatsapp
			</Button>
		{/if}
		{#if cobro.email}
			<Button
				variant="outline"
				size="sm"
				class="flex items-center space-x-2"
				href={`mailto:${cobro.email}`}
			>
				<Mail /> Correo
			</Button>
		{/if}
	</div>
</div>
