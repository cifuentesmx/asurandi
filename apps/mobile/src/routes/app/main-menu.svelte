<script lang="ts">
	import Calendar from 'lucide-svelte/icons/calendar';
	import Dashboard from 'lucide-svelte/icons/layout-dashboard';
	import Inbox from 'lucide-svelte/icons/inbox';
	import Cobros from 'lucide-svelte/icons/coins';
	import Contact from 'lucide-svelte/icons/contact';
	import Logout from 'lucide-svelte/icons/log-out';
	import Sun from 'lucide-svelte/icons/sun';
	import Moon from 'lucide-svelte/icons/moon';
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';

	import { auth } from '$lib/firebase';
	import { signOut } from 'firebase/auth';
	import { toggleMode } from 'mode-watcher';

	// Menu items.
	const items = [
		{
			title: 'Dashboard',
			url: '/app',
			icon: Dashboard
		},
		{
			title: 'Polizas',
			url: '/app/polizas',
			icon: Inbox
		},
		{
			title: 'Cobranza',
			url: '/app/cobranza',
			icon: Cobros
		},
		{
			title: 'Renovaciones',
			url: '/app/renovaciones',
			icon: Calendar
		},
		{
			title: 'Contactos',
			url: '/app/contacts',
			icon: Contact
		}
	];
</script>

<Sidebar.Menu>
	{#each items as item (item.title)}
		<Sidebar.MenuItem>
			<Sidebar.MenuButton>
				{#snippet child({ props })}
					<a href={item.url} {...props}>
						<item.icon />
						<span>{item.title}</span>
					</a>
				{/snippet}
			</Sidebar.MenuButton>
		</Sidebar.MenuItem>
	{/each}
	<Sidebar.MenuItem>
		<Sidebar.MenuButton onclick={toggleMode}>
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
			}}
		>
			<Logout />

			<span>Cerrar sesión</span>
		</Sidebar.MenuButton>
	</Sidebar.MenuItem>
</Sidebar.Menu>
