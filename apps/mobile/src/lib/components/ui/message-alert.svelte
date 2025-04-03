<script lang="ts" module>
	import type { WithElementRef } from 'bits-ui';
	import type { HTMLAttributes } from 'svelte/elements';
	import { type VariantProps, tv } from 'tailwind-variants';

	export const messageAlertVariants = tv({
		base: 'relative w-full rounded-lg px-4 py-3 text-sm [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg~*]:pl-10 shadow-sm',
		variants: {
			variant: {
				default: '[&>svg]:text-foreground border bg-background text-foreground',
				tip: '[&>svg]:text-foreground border bg-background text-foreground',
				success: '[&>svg]:text-white bg-green-700/80 text-white',
				error: '[&>svg]:text-white bg-destructive text-destructive-foreground',
				info: '[&>svg]:text-white bg-blue-600/80 text-white'
			}
		},
		defaultVariants: {
			variant: 'default'
		}
	});

	export type MessageAlertVariant = VariantProps<typeof messageAlertVariants>['variant'];

	export type MessageAlertProps = WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		variant?: MessageAlertVariant;
		class?: string;
		title?: string;
		btn?: Snippet;
		children?: Snippet;
	};
</script>

<script lang="ts">
	import { cn } from '$lib/utils.js';
	import { fly } from 'svelte/transition';
	import { CircleAlert, Info, Lightbulb } from 'lucide-svelte';
	import Check from '@lucide/svelte/icons/check';
	import type { Snippet } from 'svelte';

	let {
		title,
		btn,
		class: className,
		variant = 'default',
		ref = $bindable(null),
		children,
		...restProps
	}: MessageAlertProps = $props();
</script>

<div
	in:fly={{ y: -40, duration: 150, delay: 150 }}
	out:fly={{ x: -200, duration: 150 }}
	bind:this={ref}
	class={cn('mb-2 mt-4 px-2', messageAlertVariants({ variant }), className)}
	{...restProps}
	role="alert"
>
	{#if variant === 'error'}
		<CircleAlert class="size-6" />
	{:else if variant === 'info'}
		<Info class="size-6" />
	{:else if variant === 'tip'}
		<Lightbulb class="size-6" />
	{:else if variant === 'success'}
		<Check class="size-6" />
	{/if}
	{#if title}
		<div class="mb-2 flex font-bold leading-none tracking-tight" aria-level="3" role="heading">
			<div class="flex-1">
				{title}
			</div>
			{#if btn}
				{@render btn()}
			{/if}
		</div>
	{/if}
	<div class="[&_p]:leading-relaxed">
		{@render children?.()}
	</div>
</div>
