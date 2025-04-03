<script lang="ts">
	import * as Resizable from '$lib/components/ui/resizable';
	import { cn, getCookie } from '$lib/utils';
	import { Separator } from '$lib/components/ui/select';
	import Logo from './logo.svelte';
	// import SuperSearch from './super-search.svelte';
	import MenuAlt from './menu-alt.svelte';
	import MenuMain from './menu-main.svelte';
	import MenuProfile from './menu-profile.svelte';
	import AccountSwitcher from './account-switcher.svelte';

	let isCollapsed = getCookie('PaneForge:collapsed') === 'true';

	let defaultLayout = JSON.parse(getCookie('PaneForge:layout') ?? '[150,0]');
	let navCollapsedSize: number = 4;

	function onLayoutChange(sizes: number[]) {
		document.cookie = `PaneForge:layout=${JSON.stringify(sizes)};path=/;samesite=strict;`;
	}

	function onCollapse() {
		isCollapsed = true;
		document.cookie = `PaneForge:collapsed=${true};path=/;samesite=strict;`;
	}

	function onExpand() {
		isCollapsed = false;
		document.cookie = `PaneForge:collapsed=${false};path=/;samesite=strict;`;
	}
</script>

<div class="h-screen min-h-screen">
	<Resizable.PaneGroup direction="horizontal" {onLayoutChange} class="h-screen items-stretch">
		<Resizable.Pane
			defaultSize={defaultLayout[0]}
			collapsedSize={navCollapsedSize}
			collapsible
			minSize={10}
			maxSize={20}
			{onCollapse}
			{onExpand}
		>
			<div class={cn('flex h-[52px]', isCollapsed ? 'h-[52px]' : 'px-2')}>
				<Logo {isCollapsed} />
			</div>
			<Separator />
			<AccountSwitcher {isCollapsed} />
			<Separator />
			<MenuMain {isCollapsed} />
			<Separator />
			<MenuAlt {isCollapsed} />
			<Separator />
			<MenuProfile {isCollapsed} />
		</Resizable.Pane>
		<Resizable.Handle withHandle />
		<Resizable.Pane defaultSize={defaultLayout[1]} minSize={30}>
			<!-- <div class={cn('flex h-[52px]', isCollapsed ? 'h-[52px]' : 'px-2')}>
				<SuperSearch />
			</div>
			<Separator /> -->
			<div class="h-full scroll-m-2 overflow-y-auto px-6">
				<slot />
				<div class="h-[150px]"></div>
			</div>
		</Resizable.Pane>
	</Resizable.PaneGroup>
</div>

<style>
	.full-height {
		min-height: 100vh;
		height: 100vh;
	}
</style>
