<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { Button } from '$lib/components/ui/button';
	import { Label } from '$lib/components/ui/label';
	import { enhance } from '$app/forms';
	import type { ActionResult } from '@sveltejs/kit';
	import { _upsert } from '$lib/helpers/_upsert';
	import { getToastState } from '$lib/toast-state.svelte';
	import { type DateValue, getLocalTimeZone, today } from '@internationalized/date';
	import { Calendar } from '$lib/components/ui/calendar';

	let value = $state<DateValue>(today(getLocalTimeZone()));

	const toast = getToastState();
	let open = $state<boolean>(false);
</script>

<Sheet.Root bind:open>
	<Sheet.Trigger>
		{#snippet child({ props })}
			<Button {...props} class="mt-4">Procesar día</Button>
		{/snippet}
	</Sheet.Trigger>
	<Sheet.Content side="right">
		<ScrollArea class="h-full w-full p-4">
			<form
				action="?/procesarDia"
				method="post"
				use:enhance={() => {
					return ({
						result
					}: {
						result: ActionResult & {
							data?: {
								message?: string;
							};
						};
					}) => {
						const { type } = result;
						if (type === 'success') {
							toast.add(
								'Se ha creado el trabajo en segundo plano, las pólizas se actualizarán en breve.',
								{
									type: 'success'
								}
							);
							open = false;
						}
						if (type === 'error' || type === 'failure') {
							toast.add('Error: No se pudo enviar la tarea de procesamiento por día.', {
								type: 'error',
								description:
									result.data?.message ?? 'Si el problema persiste, comunícate con soporte técnico.'
							});
						}
					};
				}}
			>
				<Sheet.Header>
					<Sheet.Title>Actualizar pólizas de 1 día</Sheet.Title>
					<Sheet.Description
						>Lanza un trabajo en segundo plano para actualizar las pólizas de un día completo.</Sheet.Description
					>
				</Sheet.Header>
				<div class="grid gap-4 py-6">
					<div>
						<Label for="poliza" class=" text-right">Fecha para procesamiento de pólizas</Label>
					</div>
					<div>
						<Calendar type="single" bind:value class="rounded-md border p-2" />
						<input type="hidden" name="day" bind:value />
					</div>
				</div>

				<Sheet.Footer>
					<Button
						type="reset"
						variant="ghost"
						size="sm"
						id="cancel_button"
						onclick={() => {
							open = false;
						}}
					>
						Cancelar
					</Button>
					<Button type="submit" size="sm">Procesar día</Button>
				</Sheet.Footer>
			</form>
		</ScrollArea>
	</Sheet.Content>
</Sheet.Root>
