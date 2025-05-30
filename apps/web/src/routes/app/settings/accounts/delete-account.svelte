<script lang="ts">
	import { enhance } from '$app/forms';
	import { invalidate } from '$app/navigation';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { getToastState } from '$lib/toast-state.svelte';
	import type { QualitasAccountCredential } from '@asurandi/types';
	import type { ActionResult } from '@sveltejs/kit';
	import { Trash } from 'lucide-svelte';
	const toast = getToastState();
	let {
		account,
		accounts = $bindable(),
		company,
		companyName,
		onDelete
	} = $props<{
		account: QualitasAccountCredential;
		accounts: QualitasAccountCredential[];
		company: 'qualitas' | 'anaseguros';
		companyName: string;
		onDelete?: () => void;
	}>();
	let open = $state<boolean>(false);
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Trigger>
		<Button variant="outline"><Trash size="16px" class="mr-2" /> Borrar cuenta</Button>
	</AlertDialog.Trigger>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>¿Estás seguro que quieres eliminar la cuenta?</AlertDialog.Title>
			<AlertDialog.Description>
				Si borras esta cuenta ya no se incorporarán nuevos datos de ella, sin embargo, los registros
				que se hayan generado permanecerán disponibles para tu consulta.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancelar</AlertDialog.Cancel>
			<form
				action="?/deleteAccount"
				method="post"
				use:enhance={({}) => {
					return async ({
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
							toast.add(`Se ha borrado la cuenta de la compañía ${companyName} correctamente.`, {
								type: 'success'
							});
							if (typeof onDelete === 'function') onDelete();
							accounts = accounts.filter((t: QualitasAccountCredential) => t.id !== account.id);
							invalidate('/app/settings/accounts');
							open = false;
						}
						if (type === 'error' || type === 'failure') {
							toast.add('No se pudo borrar la cuenta', {
								type: 'error',
								description:
									result.data?.message ?? 'Si el problema persiste, comunícate con soporte técnico.'
							});
						}
					};
				}}
			>
				<input type="hidden" value={account.id} name="id" />
				<input type="hidden" value={company} name="company" />
				<Button variant="destructive" type="submit">Borrar</Button>
			</form>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
