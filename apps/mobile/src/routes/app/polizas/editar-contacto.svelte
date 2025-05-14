<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Drawer from '$lib/components/ui/drawer';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { Pencil } from 'lucide-svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Contacto from './contacto.svelte';
	import { getPolizasStore } from '$lib/polizas-store.svelte';
	import type { GetOnePolizaResponse } from '@asurandi/types';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { enhance } from '$app/forms';
	const polizasStore = getPolizasStore();
	if (!polizasStore.onePoliza) {
		throw new Error('No se encontró la póliza');
	}
	const { contacto }: { contacto: NonNullable<GetOnePolizaResponse['contactos']>[number] } =
		$props();
	const poliza = polizasStore.onePoliza;
	let updateContacto = $state(contacto);

	const handleSubmit = (e: Event) => {
		e.preventDefault();
		console.log($state.snapshot(updateContacto));
	};
</script>

{#if poliza}
	<Drawer.Root>
		<Drawer.Trigger>
			{#snippet child({ props })}
				<Button {...props} variant="ghost" size="sm"><Pencil class="h-6 w-6 " />Editar</Button>
			{/snippet}
		</Drawer.Trigger>
		<Drawer.Content>
			<form onsubmit={handleSubmit}>
				<Drawer.Header>
					<Drawer.Title>Editar contacto</Drawer.Title>
					<Drawer.Description class="mt-4 flex items-center justify-center">
						{contacto.nombre}
					</Drawer.Description>
				</Drawer.Header>
				<ScrollArea class="mx-4 h-[70vh]">
					<div class="mx-auto flex max-w-sm flex-col gap-6">
						<div class="flex w-full max-w-sm flex-col gap-1.5">
							<Label for="nombre">Nombre</Label>
							<Input
								id="nombre"
								type="text"
								bind:value={updateContacto.nombre}
								placeholder="Nombre"
							/>
						</div>
						<div class="flex w-full max-w-sm flex-col gap-1.5">
							<Label for="email">Email</Label>
							<Input id="email" type="text" bind:value={updateContacto.email} placeholder="Email" />
						</div>
						<div class="flex w-full max-w-sm flex-col gap-1.5">
							<Label for="telefono">Teléfono</Label>
							<Input
								id="telefono"
								type="text"
								bind:value={updateContacto.telefono}
								placeholder="Teléfono"
							/>
						</div>
						<div class="flex w-full max-w-sm flex-col gap-1.5">
							<Label for="direccion">Dirección</Label>
							<Input
								id="direccion"
								type="text"
								bind:value={updateContacto.direccion}
								placeholder="Dirección"
							/>
						</div>
						<div class="flex w-full max-w-sm flex-col gap-1.5">
							<Label for="ciudad">Ciudad</Label>
							<Input
								id="ciudad"
								type="text"
								bind:value={updateContacto.ciudad}
								placeholder="Ciudad"
							/>
						</div>
						<div class="flex w-full max-w-sm flex-col gap-1.5">
							<Label for="rfc">RFC</Label>
							<Input id="rfc" type="text" bind:value={updateContacto.rfc} placeholder="RFC" />
						</div>
					</div>
				</ScrollArea>
				<Drawer.Footer>
					<Drawer.Close class={buttonVariants({ variant: 'outline', size: 'sm' })}>
						Cancelar
					</Drawer.Close>
					<Button size="sm" variant="default" type="submit">Guardar</Button>
				</Drawer.Footer>
			</form>
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
