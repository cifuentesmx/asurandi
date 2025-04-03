<script lang="ts">
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { enhance } from '$app/forms';
	import type { ActionResult } from '@sveltejs/kit';
	import { getToastState } from '$lib/toast-state.svelte';
	import { _upsert } from '$lib/helpers/_upsert';
	import FileUploader from '$lib/components/file-uploader.svelte';
	import type { SiniestroActividad } from '../../../../database/schema/siniestros';
	import Label from '$lib/components/ui/label/label.svelte';
	import Textarea from '$lib/components/ui/textarea/textarea.svelte';
	import { getSiniestroCtx } from './siniestroCtx.svelte';
	import { tick } from 'svelte';
	const toast = getToastState();

	let isLoading = $state(false);

	let {
		open = $bindable(false),
		showTrigger = true,
		class: className = ''
	}: {
		open?: boolean;
		showTrigger?: boolean;
		class?: string;
	} = $props();
	const siniestro = getSiniestroCtx();
</script>

{#if siniestro && siniestro.value}
	<Dialog.Root bind:open>
		{#if showTrigger && !siniestro.value.fechaCierre && siniestro.value.enSeguimiento}
			<Dialog.Trigger
				class={`${buttonVariants({ variant: 'outline' })} ${className}`}
				disabled={!!siniestro.value.fechaCierre}
			>
				Registrar actividad
			</Dialog.Trigger>
		{/if}
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>Agregar actividad de seguimiento</Dialog.Title>

				<Dialog.Description>
					<div class=" text-sm">Vehículo: {siniestro.value.vehiculo}</div>
				</Dialog.Description>
			</Dialog.Header>
			<form
				action="/app/siniestros?/registrarActividad"
				method="post"
				enctype="multipart/form-data"
				use:enhance={() => {
					isLoading = true;
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
							toast.add('Se han realizado los cambios correctamente.', {
								type: 'success'
							});
							if (result.data?.actividad) {
								await tick();
								siniestro.addActividad(result.data?.actividad);
								await tick();
							}
							open = false;
						}
						if (type === 'error' || type === 'failure') {
							toast.add('No se pudo agregar los datos.', {
								type: 'error',
								description: result?.data?.message ?? 'Si el problema persiste, contacte a soporte.'
							});
						}
						isLoading = false;
					};
				}}
			>
				<div class="flex flex-col">
					<div class="flex flex-col">
						<Label for="comentarios" class="mt-3 pb-1">Comentarios:</Label>
						<Textarea name="comentarios" placeholder="Describe la actualización del siniestro" />
					</div>
					<Label for="files" class="mt-3 pb-1">Si quieres incluir archivos:</Label>
					<FileUploader name="files" icon={false} />
				</div>

				<input type="hidden" name="siniestroId" bind:value={siniestro.value.id} />
				<Dialog.Footer class="pt-6">
					<Button variant="ghost" size="sm" onclick={() => (open = false)}>Cancelar</Button>
					<Button type="submit" size="sm" disabled={isLoading}>
						{#if isLoading}
							Procesando...
						{:else}
							Registrar reguimiento
						{/if}
					</Button>
				</Dialog.Footer>
			</form>
		</Dialog.Content>
	</Dialog.Root>
{/if}
