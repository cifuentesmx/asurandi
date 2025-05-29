<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Drawer from '$lib/components/ui/drawer';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { getPolizasStore } from './polizas-store.svelte';
	import { Contact } from 'lucide-svelte';
	import Contacto from './contacto.svelte';
	import AgregarContacto from './agregar-contacto.svelte';
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
				<div class="text-muted-foreground text-xs">
					<div class="text-foreground text-sm font-bold">Asegurado</div>
					{poliza.asegurado ? poliza.asegurado + ',' : 'No hay asegurado,'}
					{poliza.aseguradoCelular ? poliza.aseguradoCelular + ',' : 'No hay teléfono,'}
					{poliza.aseguradoDireccion ? poliza.aseguradoDireccion + ',' : 'No hay dirección,'}
					{poliza.aseguradoRfc ? poliza.aseguradoRfc : 'No hay RFC.'}
				</div>
				{#if contactos}
					{#each contactos as contacto}
						<Contacto {contacto} />
					{/each}
				{:else}
					<div class="flex justify-center">
						<p class="text-sm text-gray-500">No hay contactos</p>
					</div>
				{/if}
			</ScrollArea>
			<Drawer.Footer>
				<AgregarContacto />
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
