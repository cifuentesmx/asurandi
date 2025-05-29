<script lang="ts">
	import TextData from '$lib/components/text-data.svelte';
	import { getPolizasStore } from './polizas-store.svelte';
	import type { GetOnePolizaResponse } from '@asurandi/types';
	import EditarContacto from './editar-contacto.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { MessageCircle, Phone, Mail } from 'lucide-svelte';
	const polizasStore = getPolizasStore();
	if (!polizasStore.onePoliza) {
		throw new Error('No se encontró la póliza');
	}
	const { contacto }: { contacto: NonNullable<GetOnePolizaResponse['contactos']>[number] } =
		$props();

	const numero = $derived.by(() => {
		if (!contacto.telefono) return null;
		const cel = contacto.telefono?.replace(/\s|\D/g, '');
		return cel?.length === 10 ? `52${cel}` : (cel ?? '');
	});
</script>

{#if contacto}
	<div class="bg-muted mt-4 rounded p-4">
		<div class="py-4 text-sm font-bold">{contacto.nombre}</div>
		<div class="layout">
			<TextData caption="Teléfono">{contacto.telefono ?? 'No registrado'}</TextData>
			<TextData caption="Email">{contacto.email ?? 'No registrado'}</TextData>
		</div>
		<div class="mt-4 flex justify-center gap-2">
			<EditarContacto {contacto} />
			{#if numero}
				<Button href={`https://wa.me/${numero}`} target="_blank" variant="ghost" size="sm">
					<MessageCircle class="h-6 w-6" />
				</Button>
			{/if}
			{#if contacto.telefono}
				<Button
					href={`tel:${numero ?? contacto.telefono}`}
					target="_blank"
					variant="ghost"
					size="sm"
				>
					<Phone class="h-6 w-6" />
				</Button>
			{/if}
			{#if contacto.email}
				<Button href={`mailto:${contacto.email}`} target="_blank" variant="ghost" size="sm">
					<Mail class="h-6 w-6" />
				</Button>
			{/if}
		</div>
	</div>
{/if}

<style>
	.layout {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
		gap: 0.3rem;
	}
</style>
