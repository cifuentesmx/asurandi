<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { enhance } from '$app/forms';
	import type { ActionResult } from '@sveltejs/kit';
	import { _upsert } from '$lib/helpers/_upsert';
	import type { QualitasAccountCredential } from '$types/qualitas/account-credential';
	import { getToastState } from '$lib/toast-state.svelte';
	const toast = getToastState();
	let { accounts = $bindable() } = $props<{ accounts: QualitasAccountCredential[] }>();
	let open = $state<boolean>(false);
</script>

<Sheet.Root bind:open>
	<Sheet.Trigger>
		<Button class="mt-4">Agregar cuenta Quálitas</Button>
	</Sheet.Trigger>
	<Sheet.Content side="right">
		<ScrollArea class="h-full w-full p-4">
			<form
				action="?/addAccount"
				method="post"
				use:enhance={() => {
					return ({
						result
					}: {
						result: ActionResult & {
							data?: {
								message?: string;
								account?: QualitasAccountCredential;
							};
						};
					}) => {
						const { type } = result;
						if (type === 'success') {
							const data = result.data as { message?: string; account?: QualitasAccountCredential };
							if (data.account) {
								toast.add('Se ha creado correctamente una nueva cuenta en la compañía Quálitas.', {
									type: 'success'
								});
								if (data.account) accounts = _upsert(accounts, data.account, 'id');
								open = false;
							}
						}
						if (type === 'error' || type === 'failure') {
							toast.add('Error: No se pudo crear la cuenta', {
								type: 'error',
								description:
									result.data?.message ?? 'Si el problema persiste, comunícate con soporte técnico.'
							});
						}
					};
				}}
			>
				<Sheet.Header>
					<Sheet.Title>Agregar cuenta</Sheet.Title>
					<Sheet.Description>
						Agrega una cuenta de la compañía Quálitas para que esté incluida en tu cuenta de
						Agencia.
					</Sheet.Description>
				</Sheet.Header>
				<div class="grid gap-4 py-4">
					<div>
						<Label for="alias" class="pb-2 text-right">Alias de la cuenta</Label>
						<Input id="alias" name="alias" type="text" required />
					</div>
					<div>
						<Label for="agente" class="pb-2 text-right">Número de agente</Label>
						<Input id="agente" name="agente" type="text" required />
					</div>
					<div>
						<Label for="cuenta" class="pb-2 text-right">Cuenta</Label>
						<Input id="cuenta" name="cuenta" type="text" required />
					</div>
					<div>
						<Label for="password" class="pb-2 text-right">Contraseña</Label>
						<Input id="password" name="password" type="password" required />
					</div>
				</div>

				<Sheet.Footer>
					<Sheet.Close>
						<Button type="reset" variant="ghost" size="sm" id="cancel_button">Cancelar</Button>
					</Sheet.Close>
					<Button type="submit" size="sm">Crear cuenta</Button>
				</Sheet.Footer>
			</form>
		</ScrollArea>
	</Sheet.Content>
</Sheet.Root>
