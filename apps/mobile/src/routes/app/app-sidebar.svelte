<script lang="ts">
	import Calendar from 'lucide-svelte/icons/calendar';
	import Dashboard from 'lucide-svelte/icons/layout-dashboard';
	import Inbox from 'lucide-svelte/icons/inbox';
	import Cobros from 'lucide-svelte/icons/coins';
	import Contact from 'lucide-svelte/icons/contact';
	import Logout from 'lucide-svelte/icons/log-out';
	import Sun from 'lucide-svelte/icons/sun';
	import Moon from 'lucide-svelte/icons/moon';
	import { auth } from '$lib/firebase';
	import { signOut } from 'firebase/auth';
	import { toggleMode } from 'mode-watcher';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import X from 'lucide-svelte/icons/x';
	import Button from '$lib/components/ui/button/button.svelte';
	import AccountSwitcher from './account-switcher.svelte';
	import { useSidebar } from '$lib/components/ui/sidebar/index.js';
	import { page } from '$app/state';
	const sidebar = useSidebar();
	const items = [
		{
			title: 'Dashboard',
			url: '/app',
			icon: Dashboard,
			items: []
		},
		{
			title: 'Historial de pólizas',
			url: '/app/polizas?newsearch=true',
			icon: Inbox,
			items: [
				{ title: 'Con siniestros', url: '/app/polizas?consiniestros=true' },
				{ title: 'No renovadas', url: '/app/polizas?norenovadas=true' }
			]
		},
		{
			title: 'Cobranza',
			url: '/app/cobranza',
			icon: Cobros,
			items: []
		},
		{
			title: 'Renovaciones',
			url: '/app/renovaciones',
			icon: Calendar,
			items: []
		},
		{
			title: 'Contactos',
			url: '/app/contactos',
			icon: Contact,
			items: [
				{ title: 'Cumpleañeros', url: '/app/contactos?bday=true' },
				{ title: 'Sin teléfono', url: '/app/contactos?woPhone=true' },
				{ title: 'Sin cumpleaños', url: '/app/contactos?woBday=true' }
			]
		}
	] as const;
</script>

<Sidebar.Root collapsible="offcanvas">
	<Sidebar.Header>
		<div class=" flex items-center">
			<div class="flex-1">
				<AccountSwitcher className="mt-2" />
			</div>
			<Button onclick={sidebar.toggle} size="sm" variant="ghost">
				<X />
			</Button>
		</div>
	</Sidebar.Header>
	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupLabel>Aplicación</Sidebar.GroupLabel>
			<Sidebar.Menu>
				{#each items as item (item.title)}
					<Sidebar.MenuItem>
						<Sidebar.MenuButton
							isActive={page.route.id === item.url}
							onclick={() => {
								sidebar.isMobile && sidebar.toggle();
							}}
						>
							{#snippet child({ props })}
								<a href={item.url} {...props}>
									<item.icon />
									<span>{item.title}</span>
								</a>
							{/snippet}
						</Sidebar.MenuButton>
						{#if item.items?.length}
							<Sidebar.MenuSub>
								{#each item.items as subItem (subItem.title)}
									<Sidebar.MenuSubItem>
										<Sidebar.MenuSubButton
											isActive={page.route.id === subItem.url}
											onclick={() => {
												sidebar.isMobile && sidebar.toggle();
											}}
										>
											{#snippet child({ props })}
												<a href={subItem.url} {...props}>{subItem.title}</a>
											{/snippet}
										</Sidebar.MenuSubButton>
									</Sidebar.MenuSubItem>
								{/each}
							</Sidebar.MenuSub>
						{/if}
					</Sidebar.MenuItem>
				{/each}
				<Sidebar.MenuItem>
					<Sidebar.MenuButton
						onclick={() => {
							toggleMode();
							sidebar.isMobile && sidebar.toggle();
						}}
					>
						<Sun
							class="mr-2 size-4 h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
						/>
						<Moon
							class="absolute mr-2 size-4 h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
						/>
						<!-- <svelte:component this={route.icon} class="mr-2 size-4" aria-hidden="true" /> -->
						Alternar tema
					</Sidebar.MenuButton>
				</Sidebar.MenuItem>
				<Sidebar.MenuItem>
					<Sidebar.MenuButton
						onclick={() => {
							signOut(auth);
							sidebar.isMobile && sidebar.toggle();
						}}
					>
						<Logout />

						<span>Cerrar sesión</span>
					</Sidebar.MenuButton>
				</Sidebar.MenuItem>
			</Sidebar.Menu>
		</Sidebar.Group>
	</Sidebar.Content>
	<Sidebar.Footer class="text-muted-foreground text-xs">Asurandi v1.0</Sidebar.Footer>
</Sidebar.Root>
