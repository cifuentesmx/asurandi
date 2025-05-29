<script lang="ts">
	import { goto } from '$app/navigation';
	import TextData from '$lib/components/text-data.svelte';
	import { buttonVariants } from '$lib/components/ui/button';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Drawer from '$lib/components/ui/drawer';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { tick } from 'svelte';
	import { getPolizasStore } from '../polizas/polizas-store.svelte';
	import EditarContacto from './editar-contacto.svelte';
	let { contacto } = $props();
	let open = $state(false);
	const polizasStore = getPolizasStore();
</script>

<Drawer.Root bind:open>
	<Drawer.Trigger>
		{#snippet child({ props })}
			<div
				class="cursor-pointer rounded-lg bg-indigo-950/85 px-4 py-2"
				role="button"
				tabindex="0"
				{...props}
			>
				<div class="truncate capitalize text-white">
					{contacto.nombre.toLowerCase()}
				</div>
				<div class="truncate text-xs text-white">
					{contacto.telefono || 'Sin teléfono'} - {contacto.email || 'Sin correo'}
				</div>
			</div>
		{/snippet}
	</Drawer.Trigger>
	<Drawer.Content>
		<Drawer.Header>
			<Drawer.Title>{contacto.nombre}</Drawer.Title>
			<Drawer.Description>
				{contacto.vehiculo}
			</Drawer.Description>
		</Drawer.Header>
		<ScrollArea class=" mx-2 h-[50vh]">
			<div class="layout">
				<TextData caption="Nombre">{contacto.nombre}</TextData>
				<TextData caption="Teléfono">{contacto.telefono}</TextData>
				<TextData caption="Email">{contacto.email}</TextData>
				<TextData caption="Dirección">{contacto.direccion}</TextData>
				<TextData caption="Cumpleaños">{contacto.fechaNacimiento}</TextData>
				<TextData caption="RFC">{contacto.rfc}</TextData>
			</div>
		</ScrollArea>
		<Drawer.Footer>
			<Drawer.Close class={buttonVariants({ variant: 'outline', size: 'sm' })}>Cerrar</Drawer.Close>
			<EditarContacto {contacto} />
			<Button
				variant="default"
				size="sm"
				onclick={async () => {
					await goto('/app/polizas?search=' + contacto.nombre, { invalidateAll: true });
				}}>Ver Pólizas</Button
			>
		</Drawer.Footer>
	</Drawer.Content>
</Drawer.Root>

<style>
	.layout {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
	}
</style>
