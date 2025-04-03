<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import AppSidebar from './app-sidebar.svelte';

	import { Separator } from '$lib/components/ui/separator';
	import { getSession } from '$lib/session.svelte';
	import { goto } from '$app/navigation';
	import SuperSearch from '$lib/components/ui/super-search.svelte';
	import { setSearchStore } from '$lib/search-store.svelte.js';
	let { children } = $props();
	const session = getSession();
	setSearchStore();
	let redirectTimeout: ReturnType<typeof setTimeout> | null = null;
	$effect(() => {
		if (!session.user) {
			redirectTimeout = setTimeout(() => {
				goto('/');
				if (redirectTimeout) clearTimeout(redirectTimeout);
			}, 1500);
		} else {
			if (redirectTimeout) clearTimeout(redirectTimeout);
		}
	});
</script>

<Sidebar.Provider>
	<AppSidebar />
	<Sidebar.Inset>
		<header
			class="fixed left-0 right-0 top-0 z-40 flex h-16 shrink-0 items-center gap-2 bg-indigo-800 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12"
		>
			<div class="flex items-center gap-2 px-4">
				<Sidebar.Trigger />
				<Separator orientation="vertical" />
				<SuperSearch />
			</div>
		</header>
		<div class="h-16"></div>
		<main class="px-4 py-2">
			{@render children?.()}
		</main>
	</Sidebar.Inset>
</Sidebar.Provider>
