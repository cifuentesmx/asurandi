<script lang="ts">
	import TextData from '$lib/components/text-data.svelte';
	import { getPolizasStore } from '$lib/polizas-store.svelte';
	import type { GetOnePolizaResponse } from '@asurandi/types';
	import EditarContacto from './editar-contacto.svelte';
	const polizasStore = getPolizasStore();
	if (!polizasStore.onePoliza) {
		throw new Error('No se encontró la póliza');
	}
	const { contacto }: { contacto: NonNullable<GetOnePolizaResponse['contactos']>[number] } =
		$props();
</script>

{#if contacto}
	<div class="bg-muted mt-4 rounded p-4">
		<div class="py-4 text-sm font-bold">{contacto.nombre}</div>
		<div class="layout">
			<TextData caption="Teléfono">{contacto.telefono ?? 'No registrado'}</TextData>
			<TextData caption="Email">{contacto.email ?? 'No registrado'}</TextData>
			<TextData caption="RFC">{contacto.rfc ?? 'No registrado'}</TextData>
		</div>
		<TextData caption="Dirección">{contacto.direccion ?? 'No registrada'}</TextData>
		<div class="mt-4">
			<EditarContacto {contacto} />
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
