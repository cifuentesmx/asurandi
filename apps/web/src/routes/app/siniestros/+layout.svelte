<script lang="ts">
	import type { Snippet } from 'svelte';
	import { setSiniestroCtx } from './[siniestroId]/siniestroCtx.svelte';
	setSiniestroCtx();
	let { children }: { children: Snippet } = $props();
</script>

{@render children?.()}
