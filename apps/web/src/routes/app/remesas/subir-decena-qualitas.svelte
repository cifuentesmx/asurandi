<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { Button } from '$lib/components/ui/button';
	import { enhance } from '$app/forms';
	import type { ActionResult } from '@sveltejs/kit';
	import { _upsert } from '$lib/helpers/_upsert';
	import { getToastState } from '$lib/toast-state.svelte';

	const toast = getToastState();

	let { open = $bindable(false), showTrigger = true } = $props<{
		open?: boolean;
		showTrigger?: boolean;
	}>();

	let submitting = $state(false);

	import FileUploader from '$lib/components/file-uploader.svelte';
	import { Loader } from 'lucide-svelte';
	interface FileInfo {
		file: File;
		name: string;
		size: number;
		type: string;
	}
	let files: FileInfo[] = $state([]);
</script>

<Sheet.Root bind:open>
	{#if showTrigger}
		<Sheet.Trigger>
			{#snippet child({ props })}
				<Button {...props}>Subir Decena Quálitas</Button>
			{/snippet}
		</Sheet.Trigger>
	{/if}
	<Sheet.Content side="right">
		<ScrollArea class="h-full w-full p-4">
			<form
				class="mx-auto max-w-lg"
				method="post"
				action="?/subirDecena"
				enctype="multipart/form-data"
				use:enhance={() => {
					submitting = true;
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
							toast.add(`Se ha procesado correctamente ${files.length} archivo(s) de remesas.`, {
								type: 'success'
							});
							open = false;
						}
						if (type === 'error' || type === 'failure') {
							toast.add('Error: Ha ocurrido un error al intentar procesar los archivos.', {
								type: 'error',
								description:
									result.data?.message ?? 'Si el problema persiste, comunícate con soporte técnico.'
							});
						}
						submitting = false;
						files = [];
					};
				}}
			>
				<Sheet.Header>
					<Sheet.Title>Subir el archivo de remesas Quálitas</Sheet.Title>
					<Sheet.Description>
						Sube uno o varios archivos de remesas en excel para la actualización de los pagos de
						Quálitas.
					</Sheet.Description>
				</Sheet.Header>

				<div>
					<FileUploader accept=".xls,.xlsx" name="files" bind:files />
				</div>
				<Sheet.Footer class="mt-6">
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
					<Button type="submit" size="sm" disabled={submitting || files.length < 1} class="w-40">
						{#if !submitting}
							Procesar archivo(s)
						{:else}
							<Loader class="animate-spin"></Loader>
						{/if}
					</Button>
				</Sheet.Footer>
			</form>
		</ScrollArea>
	</Sheet.Content>
</Sheet.Root>
