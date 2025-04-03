<script lang="ts">
	import { goto } from '$app/navigation';
	import { cn } from '$lib/utils';
	import { ArrowLeft } from 'lucide-svelte';
	import { scale } from 'svelte/transition';

	let {
		class: className,
		defaultUrl,
		position = 'bottom-right',
		callbackFn
	}: {
		class?: string;
		defaultUrl?: string;
		callbackFn?: () => void;
		position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
	} = $props();

	const positionClasses = {
		'bottom-right': 'bottom-4 right-4',
		'bottom-left': 'bottom-4 left-4',
		'top-right': 'top-2 right-4',
		'top-left': 'top-2 left-4'
	};
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<div
	in:scale={{ duration: 150, delay: 150 }}
	out:scale={{ duration: 150 }}
	tabindex="0"
	role="button"
	class={cn(
		'fixed z-40 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-950 shadow-lg',
		positionClasses[position],
		className
	)}
	onclick={() => {
		if (typeof callbackFn === 'function') return callbackFn();
		if (window.history.length > 1) {
			window.history.back();
		} else {
			goto(defaultUrl ?? '/app');
		}
	}}
>
	<ArrowLeft size={32} class="text-white" />
</div>
