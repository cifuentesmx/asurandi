<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { enhance } from '$app/forms';
	import type { ActionResult } from '@sveltejs/kit';
	import { _upsert } from '$lib/helpers/_upsert';
	import { getToastState } from '$lib/toast-state.svelte';
	import * as Select from '$lib/components/ui/select';
	import { page } from '$app/state';
	import type { QualitasAccountCredential } from '$types/qualitas/account-credential';
	const toast = getToastState();
	let open = $state<boolean>(false);
	const accounts = $state<QualitasAccountCredential[]>(page.data.qualitasAccounts);
	let accountId = $state<string | undefined>(undefined);
	const getTriggerText = () => {
		if (!accountId) return 'Selecciona una cuenta';
		return accounts.find((f) => f.id === accountId)?.id ?? 'Selecciona una cuenta';
	};
	const triggerContent = $derived(getTriggerText());
</script>

<Sheet.Root bind:open>
	<Sheet.Trigger>
		{#snippet child({ props })}
			<Button class="mt-4" {...props}>Registrar poliza</Button>
		{/snippet}
	</Sheet.Trigger>
	<Sheet.Content side="right">
		<ScrollArea class="h-full w-full p-4">
			<form
				action="?/registrarPoliza"
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
								'Se ha creado el trabajo en segundo plano, la póliza se actualizará en breve.',
								{
									type: 'success'
								}
							);
							open = false;
						}
						if (type === 'error' || type === 'failure') {
							toast.add('Error: No se pudo solicitar el registro de poliza', {
								type: 'error',
								description:
									result.data?.message ?? 'Si el problema persiste, comunícate con soporte técnico.'
							});
						}
					};
				}}
			>
				<Sheet.Header>
					<Sheet.Title>Actualizar póliza</Sheet.Title>
					<Sheet.Description>Actualiza manualmente una póliza</Sheet.Description>
				</Sheet.Header>
				<div class="grid gap-4 py-4">
					<div>
						<Label for="cuentaId" class="pb-2 text-right">Selecciona la cuenta</Label>
						<Select.Root type="single" name="cuentaId" bind:value={accountId}>
							<Select.Trigger class="w-full">{triggerContent}</Select.Trigger>
							<Select.Content>
								<Select.Group>
									{#each accounts as account}
										<Select.Item value={account.id} label={account.id}>
											{`${account.alias} (${account.id})`}
										</Select.Item>
									{/each}
								</Select.Group>
							</Select.Content>
						</Select.Root>
					</div>
					<div>
						<Label for="poliza" class="pb-2 text-right">Número de póliza</Label>
						<Input id="poliza" name="poliza" type="text" required />
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
					<Button type="submit" size="sm">Actualizar póliza</Button>
				</Sheet.Footer>
			</form>
		</ScrollArea>
	</Sheet.Content>
</Sheet.Root>
