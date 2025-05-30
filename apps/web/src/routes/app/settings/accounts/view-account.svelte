<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { enhance } from '$app/forms';
	import type { ActionResult } from '@sveltejs/kit';
	import { _upsert } from '$lib/helpers/_upsert';
	import DeleteAccount from './delete-account.svelte';
	import type { QualitasAccountCredential } from '@asurandi/types';
	let {
		accounts = $bindable(),
		account,
		company,
		companyName
	} = $props<{
		accounts: QualitasAccountCredential[];
		account: QualitasAccountCredential;
		company: 'qualitas' | 'anaseguros';
		companyName: string;
	}>();
	let open = $state<boolean>(false);
</script>

<Sheet.Root bind:open>
	<Sheet.Trigger>
		<Button variant="outline" class="w-full">{account.alias} - {account.cuenta}</Button>
	</Sheet.Trigger>
	<Sheet.Content side="right">
		<ScrollArea class="h-full w-full p-2">
			<div class="px-1">
				<form
					action="?/updateAccount"
					method="post"
					use:enhance={() => {
						return ({ result }: { result: ActionResult & { data?: unknown } }) => {
							const { type, status } = result;
							if (type === 'success') {
								const data = result.data as {
									message?: string;
									account?: QualitasAccountCredential;
								};
								if (data.account) {
									if (data.account) accounts = _upsert(accounts, data.account, 'id');
									open = false;
								}
							}
						};
					}}
				>
					<Sheet.Header>
						<Sheet.Title>Editar cuenta {companyName}</Sheet.Title>
						<Sheet.Description>
							Edita una cuenta de la compañía {companyName} para que esté incluida en tu cuenta de Agencia.
						</Sheet.Description>
					</Sheet.Header>
					<div class="grid gap-4 py-4">
						<input type="hidden" name="id" value={account.id} />
						<input type="hidden" name="agente" value={account.agente} />
						<input type="hidden" name="cuenta" value={account.cuenta} />
						<input type="hidden" name="company" value={company} />
						<div>
							<Label for="alias" class="pb-2 text-right">Alias de cuenta</Label>
							<Input id="alias" name="alias" type="text" required value={account.alias} />
						</div>
						<div>
							<Label for="agente" class="pb-2 text-right">Número de agente</Label>
							<Input id="agente" type="text" required disabled value={account.agente} />
						</div>
						<div>
							<Label for="cuenta" class="pb-2 text-right">Cuenta</Label>
							<Input id="cuenta" type="text" required disabled value={account.cuenta} />
						</div>
						<div>
							<Label for="password" class="pb-2 text-right">Contraseña</Label>
							<Input id="password" name="password" type="password" />
						</div>
					</div>
					<div class=" py-4">
						<DeleteAccount
							bind:accounts
							{account}
							{company}
							{companyName}
							onDelete={() => (open = false)}
						/>
					</div>
					<Sheet.Footer>
						<Sheet.Close>
							<Button type="reset" variant="ghost" size="sm" id="cancel_button">Cancelar</Button>
						</Sheet.Close>
						<Button type="submit" size="sm">Actualizar cuenta</Button>
					</Sheet.Footer>
				</form>
			</div>
		</ScrollArea>
	</Sheet.Content>
</Sheet.Root>
