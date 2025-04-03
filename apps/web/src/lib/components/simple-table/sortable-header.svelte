<script lang="ts">
	import type { ComponentProps } from 'svelte';
	import ArrowUpDown from 'lucide-svelte/icons/arrow-up-down';
	import { Button } from '$lib/components/ui/button/index.js';

	let {
		text = 'Column',
		variant = 'ghost',
		onclick,
		...restProps
	}: {
		text: string;
		variant?: ComponentProps<typeof Button>['variant'];
		onclick: ComponentProps<typeof Button>['onclick'];
	} = $props();
</script>

<Button {variant} {onclick} {...restProps}>
	{text}
	<ArrowUpDown class="ml-2 size-4" />
</Button>
