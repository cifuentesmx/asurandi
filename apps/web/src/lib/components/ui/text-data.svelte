<script lang="ts">
	import type { Snippet } from 'svelte';

	let { caption, children, text } = $props<{
		caption?: string;
		text?: string | null;
		children?: Snippet;
	}>();
</script>

{#if (text && text.length > 0) || children}
	<div class="text-muted-foreground rounded p-2">
		{#if caption}
			<div class="text-foreground text-xs">{caption}</div>
		{/if}
		{#if text}
			{text}
		{/if}
		{#if children}
			{@render children()}
		{/if}
	</div>
{/if}
