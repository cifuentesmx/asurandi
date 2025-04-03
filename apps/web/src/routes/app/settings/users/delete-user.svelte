<script lang="ts">
	import { enhance } from '$app/forms';
	import * as AlertDialog from '$lib/components/ui/alert-dialog/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { getToastState } from '$lib/toast-state.svelte';
	import type { SaasUser } from '$types/saas/user';
	import type { ActionResult } from '@sveltejs/kit';
	import { Trash } from 'lucide-svelte';
	const toast = getToastState();
	let { user, users = $bindable() } = $props<{ user: SaasUser; users: SaasUser[] }>();
	let open = $state<boolean>(false);
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Trigger>
		<Button variant="ghost" size="icon"><Trash class="text-red-300" /></Button>
	</AlertDialog.Trigger>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>¿Estás seguro que quieres eliminar al usuario?</AlertDialog.Title>
			<AlertDialog.Description>
				Si borras al usuario ya no tendrá acceso a tu cuenta, sin embargo, los registros que se
				hayan generado para este usuario permanecerán disponibles para tu consulta.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>Cancelar</AlertDialog.Cancel>
			<form
				action="?/deleteUser"
				method="post"
				use:enhance={() => {
					return async ({
						result
					}: {
						result: ActionResult & {
							data?: {
								message?: string;
								user?: SaasUser;
							};
						};
					}) => {
						const { type } = result;
						if (type === 'success') {
							users = users.filter((t: SaasUser) => t.id !== user.id);
							open = false;
							toast.add('Usuario eliminado correctamente.', {
								type: 'success'
							});
						}
						if (type === 'error' || type === 'failure') {
							toast.add('Error: No se pudo eliminar el usuario seleccionado', {
								type: 'error',
								description:
									result.data?.message ?? 'Si el problema persiste, comunícate con soporte técnico.'
							});
						}
					};
				}}
			>
				<input type="hidden" value={user.id} name="id" />
				<Button variant="destructive" type="submit">Borrar</Button>
			</form>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
