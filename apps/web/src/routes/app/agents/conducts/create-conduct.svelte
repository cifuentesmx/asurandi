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
	import type { InferSelectModel } from 'drizzle-orm';
	import { tblConductos } from '@asurandi/database';

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
</script>

<Sheet.Root bind:open>
	{#if showTrigger}
		<Sheet.Trigger>
			{#snippet child({ props })}
				<Button variant="outline" size="sm" {...props} class={triggerClass}>Nuevo conducto</Button>
			{/snippet}
		</Sheet.Trigger>
	{/if}
	<Sheet.Content side="right">
		<ScrollArea class="h-full w-full p-4">
			<form
				action="?/createConduct"
				method="post"
				use:enhance={() => {
					// TODO: validar el formulario
					return async ({
						result
					}: {
						result: ActionResult & {
							data?: {
								message?: string;
								conducto?: InferSelectModel<typeof tblConductos>;
							};
						};
					}) => {
						const { type } = result;
						if (type === 'success') {
							toast.add('El conducto se ha creado correctamente.', {
								type: 'success'
							});
							if (result.data?.conducto) collection.unshift(result.data?.conducto);
							open = false;
						}
						if (type === 'error' || type === 'failure') {
							toast.add('No se pudo crear un nuevo conducto.', {
								type: 'error',
								description:
									result?.data?.message ?? 'Si el problema persiste contacte a soporte técnico'
							});
						}
					};
				}}
			>
				<Sheet.Header>
					<Sheet.Title>Registrar nuevo conducto</Sheet.Title>
					<Sheet.Description>
						Crea el registro de un nuevo conducto de seguros, este conducto puede existir en varias
						compañias y luego ser asociado a varios agentes.
					</Sheet.Description>
				</Sheet.Header>

				<div class="flex flex-col">
					<Label for="name" class="mt-5 pb-2">Nombre del conducto</Label>
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

					<Label for="tel" class="mt-5 pb-2">Teléfono (incluir código de país)</Label>
					<Input type="text" id="tel" name="tel" placeholder="e.g. +529616151561" />
				</div>
				<Sheet.Footer class="mt-6">
					<Button
						type="reset"
						variant="ghost"
						size="sm"
						id="cancel_button"
						onclick={() => (open = false)}>Cancelar</Button
					>

					<Button type="submit" size="sm">Crear conducto</Button>
				</Sheet.Footer>
			</form>
		</ScrollArea>
	</Sheet.Content>
</Sheet.Root>
