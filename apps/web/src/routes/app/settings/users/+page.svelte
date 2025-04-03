<script lang="ts">
	import { page } from '$app/stores';
	import type { SaasUser } from '$types/saas/user';
	import { Pencil } from 'lucide-svelte';
	import AddUser from './add-user.svelte';
	import { formatDate } from '$lib/formatters/formatDate';
	import DeleteUser from './delete-user.svelte';
	let users = $state<SaasUser[]>($page.data.users);
</script>

<AddUser {users} />

<div class="lay">
	{#each users as user}
		<div class="bg-muted rounded-sm px-6 py-2.5">
			<div class="flex justify-between">
				<div class="font-bold">
					<a href={`/app/settings/users/${user.id}`} class="flex align-middle">
						{user.email}
						<Pencil size="16px" class="ml-3 mt-1" />
					</a>
				</div>

				<DeleteUser {user} bind:users />
			</div>
			<div class="flex justify-between">
				<div>
					<div>
						{user.name}{user.phone ? `, ${user.phone}` : ''}, roles:
					</div>
					<div class="py-2">
						{#each user.roles as role}
							{#if role !== 'user'}
								<span class="mr-3 rounded-sm bg-blue-100 px-2 py-1 text-sm text-slate-900"
									>{role}</span
								>
							{/if}
						{/each}
						{#if user.roles.length === 1}
							<span class="text-muted-foreground text-sm"
								>No tiene ningún role de usuario asociado.</span
							>
						{/if}
					</div>
				</div>

				<div class="pt-4 text-right text-xs">
					<div>Creado:</div>
					<div>{formatDate(user.created)}</div>
				</div>
			</div>
		</div>
	{/each}
</div>

<style>
	.lay {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
		gap: 1rem;
		margin-top: 1.5rem;
	}
</style>
