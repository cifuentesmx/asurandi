<script lang="ts">
	import * as Drawer from '$lib/components/ui/drawer';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { Plus } from 'lucide-svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { getPolizasStore } from './polizas-store.svelte';
	import type { NewContactoRequest } from '@asurandi/types';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Birthday from '$lib/components/birthday.svelte';

	const polizasStore = getPolizasStore();
	if (!polizasStore.onePoliza) {
		throw new Error('No se encontró la póliza');
	}
	const poliza = polizasStore.onePoliza;
	let newContacto: NewContactoRequest = $state({
		nombre: '',
		email: '',
		telefono: '',
		direccion: '',
		rfc: '',
		fechaNacimiento: '',
		aseguradoId: poliza.poliza?.asegurado_id ?? 0
	});
	let open = $state(false);
	const handleSubmit = async (e: Event) => {
		e.preventDefault();
		const result = await polizasStore.newContacto(newContacto);
		if (result) {
			open = false;
		}
	};
</script>

{#if poliza}
	<Drawer.Root bind:open>
		<Drawer.Trigger>
			{#snippet child({ props })}
				<Button {...props} variant="ghost" size="sm"
					><Plus class="h-6 w-6 " /> Agregar contacto</Button
				>
			{/snippet}
		</Drawer.Trigger>
		<Drawer.Content>
			<form onsubmit={handleSubmit}>
				<Drawer.Header>
					<Drawer.Title>Agregar contacto</Drawer.Title>
					<Drawer.Description class="mt-4 flex items-center justify-center">
						Agrega un contacto para la póliza {poliza.poliza?.numeroPoliza ?? 'sin número'}.
					</Drawer.Description>
				</Drawer.Header>
				<ScrollArea class="mx-4 h-[70vh]">
					<div class="mx-auto flex max-w-sm flex-col gap-6">
						<div class="flex w-full max-w-sm flex-col gap-1.5">
							<Label for="nombre">Nombre</Label>
							<Input
								id="nombre"
								type="text"
								bind:value={newContacto.nombre}
								placeholder="Nombre"
								required
							/>
						</div>
						<div class="flex w-full max-w-sm flex-col gap-1.5">
							<Label for="email">Email</Label>
							<Input id="email" type="text" bind:value={newContacto.email} placeholder="Email" />
						</div>
						<div class="flex w-full max-w-sm flex-col gap-1.5">
							<Label for="telefono">Teléfono</Label>
							<Input
								id="telefono"
								type="text"
								bind:value={newContacto.telefono}
								placeholder="Teléfono"
							/>
						</div>
						<div class="flex w-full max-w-sm flex-col gap-1.5">
							<Label for="direccion">Dirección</Label>
							<Input
								id="direccion"
								type="text"
								bind:value={newContacto.direccion}
								placeholder="Dirección"
							/>
						</div>
						<div class="flex w-full max-w-sm flex-col gap-1.5">
							<Label for="rfc">RFC</Label>
							<Input id="rfc" type="text" bind:value={newContacto.rfc} placeholder="RFC" />
						</div>
						<div class="flex w-full max-w-sm flex-col gap-1.5">
							<Label for="fechaNacimiento">Fecha de nacimiento</Label>
							<Birthday bind:value={newContacto.fechaNacimiento} />
						</div>
					</div>
				</ScrollArea>
				<Drawer.Footer>
					<Button size="sm" variant="outline" type="button" onclick={() => (open = false)}>
						Cancelar
					</Button>
					<Button size="sm" variant="default" type="submit">Crear contacto</Button>
				</Drawer.Footer>
			</form>
		</Drawer.Content>
	</Drawer.Root>
{/if}
