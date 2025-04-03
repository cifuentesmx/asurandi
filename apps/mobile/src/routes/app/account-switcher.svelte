<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar';
	import Check from 'lucide-svelte/icons/check';
	import GalleryVerticalEnd from 'lucide-svelte/icons/gallery-vertical-end';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { getSession } from '$lib/session.svelte';

	const session = getSession();

	let { className }: { className?: string } = $props();
</script>

{#if session.user && session.accounts && session.currentAccount}
	<Sidebar.Menu>
		<Sidebar.MenuItem>
			<DropdownMenu.Root>
				<DropdownMenu.Trigger disabled={session.accounts.length < 2}>
					{#snippet child({ props })}
						<Sidebar.MenuButton
							size="lg"
							class={`data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground ${className}`}
							{...props}
						>
							<div
								class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
							>
								<GalleryVerticalEnd class="size-4" />
							</div>
							<div class="flex flex-col gap-0.5 leading-none">
								<span class="font-semibold">Cuenta</span>
								<span class="text-muted-foreground text-xs">{session?.currentAccount ?? ''}</span>
							</div>
						</Sidebar.MenuButton>
					{/snippet}
				</DropdownMenu.Trigger>
				<DropdownMenu.Content class="w-[var(--bits-dropdown-menu-anchor-width)]" align="start">
					{#each session.accounts as account}
						<DropdownMenu.Item onSelect={() => (session.currentAccount = account.id)}>
							{account.id}
							{#if account.id === session.currentAccount}
								<Check class="ml-auto" />
							{/if}
						</DropdownMenu.Item>
					{/each}
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</Sidebar.MenuItem>
	</Sidebar.Menu>
{/if}
