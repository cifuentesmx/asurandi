<script lang="ts">
	import '../app.css';
	import { ModeWatcher } from 'mode-watcher';
	import { setSession } from '$lib/session.svelte';
	import { setToastState } from '$lib/toast-state.svelte';
	import { Toaster } from '$lib/components/ui/sonner';
	let { children } = $props();
	setSession();
	setToastState();
</script>

<ModeWatcher />
<Toaster richColors />

{@render children()}
