<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import * as HoverCard from '$lib/components/ui/hover-card';
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import type { SaasUser } from '$types/saas/user';
	import { theRoles } from '../../config';
	import { goto, invalidateAll } from '$app/navigation';
	import { getToastState } from '$lib/toast-state.svelte';
	import type { ActionResult } from '@sveltejs/kit';
	const toast = getToastState();
	let user = $state<SaasUser>($page.data.user);
	let roles: string = $state<string>(user?.roles?.join(',') ?? []);
</script>

<div class="w-[450px]">
	{#if user}
		<form
			method="POST"
			action="?/updateUser"
			use:enhance={() => {
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
						await invalidateAll();
						toast.add('Se han guardado los cambios correctamente.', {
							type: 'success'
						});

						goto('/app/settings/users');
					}
					if (type === 'error' || type === 'failure') {
						toast.add('Error: No se pudieron guardar los cambios', {
							type: 'error',
							description:
								result.data?.message ?? 'Si el problema persiste, comunícate con soporte técnico.'
						});
					}
				};
			}}
		>
			<input type="hidden" name="id" value={user.id} />
			<input type="hidden" name="roles" value={roles} />
			<Card.Root class="w-[450px]">
				<Card.Header>
					<Card.Title>Editar usuario</Card.Title>
					<Card.Description>Edita, cambia accesos o borra un usuario.</Card.Description>
				</Card.Header>
				<Card.Content>
					<div class="grid w-full items-center gap-4">
						<div class="flex flex-col space-y-1.5">
							<Label for="name">Nombre</Label>
							<Input
								id="name"
								name="name"
								placeholder="Nombre de usuario"
								disabled
								value={user.name}
							/>
						</div>
						<div class="flex flex-col space-y-1.5">
							<Label for="name">Correo electrónico</Label>
							<Input
								id="email"
								name="email"
								placeholder="Correo electrónico"
								disabled
								value={user.email}
							/>
						</div>
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
									checked={roles.includes(role.role)}
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
				</Card.Content>
				<Card.Footer class="flex justify-between">
					<Button variant="outline" href="/app/settings/users">Cancelar</Button>
					<Button type="submit">Guardar</Button>
				</Card.Footer>
			</Card.Root>
		</form>
	{:else}
		<h3>No se encontró al usuario que buscas</h3>
		<Button variant="outline" class="mt-4" href="/app/settings/users">Regresar</Button>
	{/if}
</div>
