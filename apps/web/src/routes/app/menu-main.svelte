<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Tooltip from '$lib/components/ui/tooltip';
	import { cn } from '$lib/utils';
	import {
		SearchCode,
		LayoutDashboard,
		ClipboardPlus,
		CoinsIcon,
		CircleDollarSign,
		SlidersHorizontal,
		HandCoins,
		Users,
		Siren,
		RefreshCcw,
		WalletCards
	} from 'lucide-svelte';
	const routes = [
		{ count: 2, icon: LayoutDashboard, url: '/app', title: 'Dashboard' },
		{ count: null, icon: SearchCode, url: '/app/polizas/consultas', title: 'Consultas' },
		{ count: null, icon: WalletCards, url: '/app/cobranza', title: 'Cobranza' },
		{ count: null, icon: RefreshCcw, url: '/app/renovaciones', title: 'Renovaciones' },
		{ count: null, icon: Siren, url: '/app/siniestros', title: 'Siniestros' },
		{ count: null, icon: ClipboardPlus, url: '/app/emisiones', title: 'Emisiones' },
		{ count: null, icon: HandCoins, url: '/app/recibos', title: 'Recibos de cobro' },
		{ count: null, icon: CoinsIcon, url: '/app/remesas', title: 'Remesas' },
		{ count: null, icon: CircleDollarSign, url: '/app/comisiones', title: 'Comisiones' },
		{ count: null, icon: Users, url: '/app/agents', title: 'Agentes y conductos' },
		{ count: null, icon: SlidersHorizontal, url: '/app/settings', title: 'Configuración' }
	];

	export let isCollapsed: boolean;
</script>

<div data-collapsed={isCollapsed} class="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2">
	<nav
		class="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2"
	>
		{#each routes as route}
			{#if isCollapsed}
				<Tooltip.Provider>
					<Tooltip.Root>
						<Tooltip.Trigger>
							<Button
								href={route.url}
								variant={$page.route.id === route.url ? 'default' : 'ghost'}
								size="icon"
								class={cn(
									'size-9',
									$page.route.id === route.url &&
										'dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white'
								)}
							>
								<svelte:component this={route.icon} class="size-4" aria-hidden="true" />
								<span class="sr-only">{route.title}</span>
							</Button>
						</Tooltip.Trigger>
						<Tooltip.Content side="right" class="flex items-center gap-4">
							{route.title}
							{#if route.count}
								<span class="text-muted-foreground ml-auto">
									{route.count}
								</span>
							{/if}
						</Tooltip.Content>
					</Tooltip.Root>
				</Tooltip.Provider>
			{:else}
				<Button
					href={route.url}
					variant={$page.route.id === route.url ? 'default' : 'ghost'}
					size="sm"
					class={cn('justify-start', {
						'dark:bg-muted dark:hover:bg-muted dark:text-white dark:hover:text-white':
							$page.route.id === route.url
					})}
				>
					<svelte:component this={route.icon} class="mr-2 size-4" aria-hidden="true" />
					{route.title}
					{#if route.count}
						<span
							class={cn('ml-auto', {
								'text-background dark:text-white': $page.route.id === route.url
							})}
						>
							{route.count}
						</span>
					{/if}
				</Button>
			{/if}
		{/each}
	</nav>
</div>
