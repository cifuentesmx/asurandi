<script lang="ts">
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import { setSession } from '$lib/session.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	import { getToastState } from '$lib/toast-state.svelte';
	let { children } = $props();
	setSession();
	getToastState();
</script>

<ModeWatcher />
<Toaster richColors />

{@render children()}
