<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { Button } from '$lib/components/ui/button';
	import { enhance } from '$app/forms';
	import type { ActionResult } from '@sveltejs/kit';
	import { _upsert } from '$lib/helpers/_upsert';
	import { getToastState } from '$lib/toast-state.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Checkbox from '$lib/components/ui/checkbox/checkbox.svelte';
	import { tblAgentes } from '@asurandi/database';
	import type { InferSelectModel } from 'drizzle-orm';

	const toast = getToastState();

	let {
		open = $bindable(false),
		collection = $bindable<unknown[]>([]),
		showTrigger = true,
		class: triggerClass = ''
	} = $props<{
		open?: boolean;
		collection: unknown[];
		showTrigger?: boolean;
		class?: string;
	}>();
	let checked = $state(true);
</script>

<Sheet.Root bind:open>
	{#if showTrigger}
		<Sheet.Trigger>
			{#snippet child({ props })}
				<Button variant="outline" size="sm" {...props} class={triggerClass}>Nuevo agente</Button>
			{/snippet}
		</Sheet.Trigger>
	{/if}
	<Sheet.Content side="right">
		<ScrollArea class="h-full w-full p-4">
			<form
				action="?/createAgent"
				method="post"
				use:enhance={() => {
					// TODO: validar el formulario
					return async ({
						result
					}: {
						result: ActionResult & {
							data?: {
								message?: string;
								agente?: InferSelectModel<typeof tblAgentes>;
							};
						};
					}) => {
						const { type } = result;
						if (type === 'success') {
							toast.add('El agente se ha creado correctamente.', {
								type: 'success'
							});
							if (result.data?.agente) collection.unshift(result.data?.agente);
							open = false;
						}
						if (type === 'error' || type === 'failure') {
							toast.add('No se pudo crear un nuevo agente.', {
								type: 'error',
								description:
									result?.data?.message ?? 'Si el problema persiste contacte a soporte técnico'
							});
						}
					};
				}}
			>
				<Sheet.Header>
					<Sheet.Title>Registrar nuevo agente</Sheet.Title>
					<Sheet.Description>
						Crea el registro de un nuevo agente de seguros, este agente puede existir en varias
						compañias.
					</Sheet.Description>
				</Sheet.Header>

				<div class="flex flex-col">
					<Label for="name" class="mt-5 pb-2">Nombre del agente</Label>
					<Input
						type="text"
						id="name"
						name="name"
						placeholder="e.g. Juan José Pérez Martínez"
						required
					/>

					<Label for="alias" class="mt-5 pb-2">Alias (Nombre amigable)</Label>
					<Input type="text" id="alias" name="alias" placeholder="e.g. Juanjo" required />

					<Label for="email" class="mt-5 pb-2">Correo electrónico</Label>
					<Input
						type="email"
						id="email"
						name="email"
						placeholder="e.g. juanjo@ejemplo.com"
						required
					/>

					<Label for="phone" class="mt-5 pb-2">Teléfono (incluir código de país)</Label>
					<Input type="text" id="phone" name="phone" placeholder="e.g. +529616151561" />

					<Label for="qualitasId" class="mt-5 pb-2">Identificador Quálitas</Label>
					<Input type="text" id="qualitasId" name="qualitasId" placeholder="e.g. 458845" />

					<Label for="anaId" class="mt-5 pb-2">Identificador Ana Seguros</Label>
					<Input type="text" id="anaId" name="anaId" placeholder="e.g. 11545236" />

					<Label
						id="check-label"
						for="terms"
						class="mt-4 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
						onclick={() => {
							checked = !checked;
						}}
					>
						<Checkbox
							id="aditional"
							bind:checked
							aria-labelledby="check-label"
							class="mr-2"
							name="aditional"
						/>
						Crear un conducto y asociarlo al agente.
					</Label>
				</div>
				<Sheet.Footer class="mt-6">
					<Button
						type="reset"
						variant="ghost"
						size="sm"
						id="cancel_button"
						onclick={() => (open = false)}>Cancelar</Button
					>

					<Button type="submit" size="sm">Crear agente</Button>
				</Sheet.Footer>
			</form>
		</ScrollArea>
	</Sheet.Content>
</Sheet.Root>
