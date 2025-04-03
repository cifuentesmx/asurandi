<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as HoverCard from '$lib/components/ui/hover-card';
	import { enhance } from '$app/forms';
	import type { SaasUser } from '$types/saas/user';
	import type { ActionResult } from '@sveltejs/kit';
	import { _upsert } from '$lib/helpers/_upsert';
	import { theRoles } from '../config';
	import { getToastState } from '$lib/toast-state.svelte';
	const toast = getToastState();
	let roles: string = $state<string>('user');
	let { users } = $props<{ users: SaasUser[] }>();
	let open = $state(false);
</script>

<Sheet.Root bind:open>
	<Sheet.Trigger>
		<Button class="mt-4">Agregar usuario</Button>
	</Sheet.Trigger>
	<Sheet.Content side="right">
		<ScrollArea class="h-full w-full p-4">
			<form
				action="?/addUser"
				method="post"
				use:enhance={() => {
					return ({
						result
					}: {
						result: ActionResult & {
							data?: {
								message?: string;
								user?: SaasUser;
							};
						};
					}) => {
						const { type, status } = result;
						if (type === 'success') {
							const data = result.data as { message?: string; user?: SaasUser };
							if (data.user) {
								if (data.user) users = _upsert(users, data.user, 'id');
								toast.add('Usuario agregado correctamente.', {
									type: 'success'
								});
								open = false;
							}
						}
						if (type === 'error' || type === 'failure') {
							toast.add('Error: No se agregar el usuario', {
								type: 'error',
								description:
									result.data?.message ?? 'Si el problema persiste, comunícate con soporte técnico.'
							});
						}
					};
				}}
			>
				<Sheet.Header>
					<Sheet.Title>Agregar usuario</Sheet.Title>
					<Sheet.Description>
						Agrega usuario a esta cuenta, puede ser existente o futuro y asígnale los roles que
						tendrá dentro de tu organización.
					</Sheet.Description>
				</Sheet.Header>
				<div class="grid gap-4 py-4">
					<div>
						<Label for="email" class="pb-2 text-right">Correo electrónico</Label>
						<Input id="email" name="email" type="email" required />
					</div>
					<div class="font-medium">Roles:</div>

					<input type="hidden" bind:value={roles} name="roles" />
					{#each theRoles as role}
						<div class="items-top flex space-x-2">
							<Checkbox
								id={role.role}
								onCheckedChange={(e) => {
									let r = roles.split(',');
									const includes = r.includes(role.role);
									if (e && !includes) {
										r.push(role.role);
									} else if (!e && includes) {
										r = r.filter((t) => t !== role.role);
									}
									roles = r.join(',');
								}}
							/>
							<HoverCard.Root>
								<HoverCard.Trigger>
									<div class="grid gap-1.5 leading-none">
										<Label
											for={role.role}
											class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
										>
											{role.label}
										</Label>
									</div>
								</HoverCard.Trigger>
								<HoverCard.Content class="w-80">
									<p>{role.text}</p>
								</HoverCard.Content>
							</HoverCard.Root>
						</div>
					{/each}
				</div>

				<Sheet.Footer>
					<Sheet.Close>
						<Button type="reset" variant="ghost" size="sm" id="cancel_button">Cancelar</Button>
					</Sheet.Close>
					<Button type="submit" size="sm">Crear usuario</Button>
				</Sheet.Footer>
			</form>
		</ScrollArea>
	</Sheet.Content>
</Sheet.Root>
