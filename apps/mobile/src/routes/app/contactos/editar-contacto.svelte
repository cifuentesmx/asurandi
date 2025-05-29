<script lang="ts">
	import * as Drawer from '$lib/components/ui/drawer';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { Pencil } from 'lucide-svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Birthday from '$lib/components/birthday.svelte';
	import { getContactosStore } from './contactos-store.svelte';

	const contactosStore = getContactosStore();
	const { contacto }: { contacto: NonNullable<(typeof contactosStore.items)[number]> } = $props();
	let updateContacto = $state(contacto);
	let open = $state(false);

	const handleSubmit = async (e: Event) => {
		e.preventDefault();
		const result = await contactosStore.updateContacto(contacto.id, updateContacto);
		if (result) {
			open = false;
		}
	};
</script>

{#if contacto}
	<Drawer.Root bind:open>
		<Drawer.Trigger>
			{#snippet child({ props })}
				<Button {...props} variant="outline" size="sm"
					><Pencil class="h-6 w-6 " /> Editar contacto</Button
				>
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
								required
							/>
						</div>
						<div class="flex w-full max-w-sm flex-col gap-1.5">
							<Label for="email">Email</Label>
							<Input
								id="email"
								type="email"
								bind:value={updateContacto.email}
								placeholder="Email"
							/>
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
							<Label for="rfc">RFC</Label>
							<Input id="rfc" type="text" bind:value={updateContacto.rfc} placeholder="RFC" />
						</div>
						<div class="flex w-full max-w-sm flex-col gap-1.5">
							<Label for="fechaNacimiento">Fecha de nacimiento</Label>
							<Birthday bind:value={updateContacto.fechaNacimiento} />
						</div>
					</div>
				</ScrollArea>
				<Drawer.Footer>
					<Button size="sm" variant="outline" type="button" onclick={() => (open = false)}>
						Cancelar
					</Button>
					<Button size="sm" variant="default" type="submit">Guardar</Button>
				</Drawer.Footer>
			</form>
		</Drawer.Content>
	</Drawer.Root>
{/if}
