<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { enhance } from '$app/forms';
	import type { ActionResult } from '@sveltejs/kit';
	import { getToastState } from '$lib/toast-state.svelte';
	import { _upsert } from '$lib/helpers/_upsert';
	import FileUploader from '$lib/components/file-uploader.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import * as Alert from '$lib/components/ui/alert';
	import { getSiniestroCtx } from './siniestroCtx.svelte';
	import { tick } from 'svelte';
	import type { SiniestroActividad } from '@asurandi/types';
	const toast = getToastState();
	const siniestro = getSiniestroCtx();

	let {
		open = $bindable(false),
		showTrigger = true,
		class: className = ''
	}: {
		open?: boolean;
		showTrigger?: boolean;
		class?: string;
	} = $props();
</script>

{#if siniestro && siniestro.value}
	<Dialog.Root bind:open>
		{#if showTrigger && !siniestro.value.fechaCierre}
			<Dialog.Trigger
				class={`${buttonVariants({ variant: 'outline' })} ${className}`}
				disabled={!!siniestro.value.fechaCierre}>Cerrar siniestro</Dialog.Trigger
			>
		{/if}
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>Cerrar siniestro</Dialog.Title>

				<Dialog.Description>
					<div class=" text-sm">Vehículo: {siniestro.value.vehiculo}</div>
				</Dialog.Description>
				<Alert.Root variant="destructive">
					<Alert.Title>Atención</Alert.Title>
					<Alert.Description>
						Después de realizar esta acción, no se podrán agregar más comentarios.
					</Alert.Description>
				</Alert.Root>
			</Dialog.Header>
			<form
				action="/app/siniestros?/cerrarSiniestro"
				method="post"
				enctype="multipart/form-data"
				use:enhance={() => {
					return async ({
						result
					}: {
						result: ActionResult & {
							data?: {
								message?: string;
								actividad?: SiniestroActividad;
							};
						};
					}) => {
						const { type } = result;
						if (type === 'success') {
							toast.add('Se han cerrado correctamente el siniestro.', {
								type: 'success'
							});
							if (result.data?.actividad) siniestro.close(result.data?.actividad);
							await tick();
							open = false;
						}
						if (type === 'error' || type === 'failure') {
							toast.add('No se pudo completar la acción.', {
								type: 'error',
								description: result?.data?.message ?? 'Si el problema persiste, contacte a soporte.'
							});
						}
					};
				}}
			>
				<div class="flex flex-col">
					<div class="flex flex-col">
						<Label for="comentarios" class="mt-3 pb-1">Comentarios:</Label>
						<Textarea
							name="comentarios"
							placeholder="Agrega comentarios de cierre, oportunidades de mejora, etc."
						/>
					</div>
					<Label for="files" class="mt-3 pb-1">Si quieres incluir archivos:</Label>
					<FileUploader name="files" icon={false} />
				</div>

				<input type="hidden" name="siniestroId" bind:value={siniestro.value.id} />
				<Dialog.Footer class="pt-6">
					<Button variant="ghost" size="sm" onclick={() => (open = false)}>Cancelar</Button>
					<Button type="submit" size="sm">Cerrar siniestro</Button>
				</Dialog.Footer>
			</form>
		</Dialog.Content>
	</Dialog.Root>
{/if}
