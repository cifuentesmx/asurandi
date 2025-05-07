<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Drawer from '$lib/components/ui/drawer';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { getPolizasStore } from '$lib/polizas-store.svelte';
	import { Contact } from 'lucide-svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import TextData from '$lib/components/text-data.svelte';
	import { terminate } from 'firebase/firestore';
	const polizasStore = getPolizasStore();
	const poliza = polizasStore.onePoliza?.poliza;
	const contactos = polizasStore.onePoliza?.contactos;
	let open = $state(false);
</script>

{#if poliza}
	<Drawer.Root bind:open>
		<Drawer.Trigger>
			{#snippet child({ props })}
				<button {...props}><Contact class="h-6 w-6 " /></button>
			{/snippet}
		</Drawer.Trigger>
		<Drawer.Content>
			<Drawer.Header>
				<Drawer.Title>Contactos</Drawer.Title>
				<Drawer.Description class="mt-4 flex items-center justify-center">
					Póliza {poliza.numeroPoliza}
				</Drawer.Description>
			</Drawer.Header>
			<ScrollArea class="mx-4 h-[50vh]">
				{#if contactos}
					{#each contactos as contacto}
						<div class="bg-muted mt-4 rounded p-4">
							<div class="text-sm font-bold">{contacto.nombre}</div>
							<div class="layout">
								<TextData caption="Teléfono">{contacto.telefono ?? 'No registrado'}</TextData>
								<TextData caption="Email">{contacto.email ?? 'No registrado'}</TextData>
								<TextData caption="Dirección">{contacto.direccion ?? 'No registrada'}</TextData>
							</div>
						</div>
					{/each}
				{:else}
					<div class="flex justify-center">
						<p class="text-sm text-gray-500">No hay contactos</p>
					</div>
				{/if}
			</ScrollArea>
			<Drawer.Footer>
				<Button size="sm" variant="outline">Agregar contacto a esta póliza</Button>
				<Drawer.Close class={buttonVariants({ variant: 'default', size: 'sm' })}>
					Cerrar
				</Drawer.Close>
			</Drawer.Footer>
		</Drawer.Content>
	</Drawer.Root>
{/if}

<style>
	.layout {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
		gap: 0.3rem;
	}
</style>
