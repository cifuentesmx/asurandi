<script lang="ts">
	import { browser } from '$app/environment';
	import { apiRequest } from '$lib/ApiRequest.svelte';
	import { auth } from '$lib/firebase/app.client';
	import { getSession, setSession } from '$lib/session.svelte';
	import { onDestroy } from 'svelte';
	import '../app.css';
	import { page } from '$app/state';
	import { ModeWatcher } from 'mode-watcher';
	import { Toaster } from '$lib/components/ui/sonner';
	import { setToastState } from '$lib/toast-state.svelte';
	import { setTableData } from '$lib/components/data-table/table-data.svelte';
	let { children } = $props();
	setToastState();
	setSession();
	setTableData();
	const session = getSession();
	let unsubs: (() => void) | null = null;

	let reloadTimeout: string | number | NodeJS.Timeout | undefined;

	if (!unsubs && browser)
		unsubs = auth.onAuthStateChanged(async (user) => {
			if (user) {
				// Check if user is already logged in server
				const response = await apiRequest('/api/session').catch(() => null);
				if (response && response.ok) {
					if (reloadTimeout) clearTimeout(reloadTimeout);
					const _user = await response.json().catch(() => null);
					const account = await apiRequest('/api/session/account')
						.then(async (res) => {
							if (res.ok) return await res.json();
						})
						.catch(() => null);
					session.setCurrentAccount(account);
					session.setUser(_user);
				}
			} else {
				const response = await apiRequest('/api/session', { method: 'DELETE' }).catch(() => null);
				session.setUser(null);
				if (!reloadTimeout && page.route.id?.startsWith('/app'))
					reloadTimeout = setTimeout(() => {
						window.location.replace('/');
					}, 1000);
			}
		});
	onDestroy(() => {
		if (typeof unsubs === 'function') unsubs();
	});
</script>

<ModeWatcher />
<Toaster richColors />
<div>
	{@render children()}
</div>

<style>
</style>
