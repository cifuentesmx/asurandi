<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { cn } from '$lib/utils';
	import { LucideLogOut } from 'lucide-svelte';
	export let isCollapsed = false;
	import { auth } from '$lib/firebase/app.client';
	import { signOut } from 'firebase/auth';
	export const logOut = async () => {
		await signOut(auth);
	};
</script>

<div data-collapsed={isCollapsed} class="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2">
	<nav
		class="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2"
	>
		{#if isCollapsed}
			<Tooltip.Provider>
				<Tooltip.Root>
					<Tooltip.Trigger>
						<Button onclick={logOut} variant="ghost" size="sm" class={cn('justify-start', {})}>
							<LucideLogOut />
						</Button>
					</Tooltip.Trigger>
					<Tooltip.Content side="right" class="flex items-center gap-4">
						Cerrar sesión
					</Tooltip.Content>
				</Tooltip.Root>
			</Tooltip.Provider>
		{:else}
			<Button onclick={logOut} variant="ghost" size="sm" class={cn('justify-start', {})}>
				<LucideLogOut />
				Cerrar sesión
			</Button>
		{/if}
	</nav>
</div>
