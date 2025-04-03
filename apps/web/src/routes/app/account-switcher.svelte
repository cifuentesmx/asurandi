<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import { cn } from '$lib/utils.js';
	import { RefreshCcwDot, Building2 } from 'lucide-svelte';

	export let isCollapsed: boolean;
	const accounts = [{ id: 'dev', name: 'BullBrothers', disabled: false }];

	let selectedAccount = accounts[0];
</script>

<div data-collapsed={isCollapsed} class="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2">
	<nav
		class="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2"
	>
		<div
			data-collapsed={isCollapsed}
			class="text-muted-foreground mb-1 text-sm data-[collapsed=true]:hidden"
		>
			Cuenta activa
		</div>
		<Select.Root type="single">
			<Select.Trigger
				class={cn(
					'flex items-center gap-2 [&>span]:line-clamp-1 [&>span]:flex [&>span]:w-full [&>span]:items-center [&>span]:gap-1 [&>span]:truncate [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0',
					isCollapsed &&
						'flex h-9 w-9 shrink-0  items-center justify-center p-0 [&>div>svg]:hidden [&>span]:w-auto'
				)}
				aria-label="Select account"
			>
				<span class="pointer-events-none">
					<svelte:component this={Building2} class={cn(isCollapsed ? 'ml-2' : '')} />
					<span class={cn(isCollapsed ? '!ml-0 !hidden' : 'ml-2')}>
						{selectedAccount.name}
					</span>
				</span>
			</Select.Trigger>
			<Select.Content align={isCollapsed ? 'start' : undefined}>
				<Select.Group>
					{#each accounts as account}
						<Select.Item value={account.id} label={account.name} disabled={account.disabled}>
							<div
								class="[&_svg]:text-foreground flex items-center gap-3 [&_svg]:h-4 [&_svg]:w-4 [&_svg]:shrink-0"
							>
								<svelte:component
									this={RefreshCcwDot}
									aria-hidden="true"
									class="text-foreground size-4 shrink-0"
								/>
								{account.id}
							</div>
						</Select.Item>
					{/each}
				</Select.Group>
			</Select.Content>
		</Select.Root>
	</nav>
</div>
