<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Plus } from 'lucide-svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';

	let {
		actions,
		title,
		position = 'bottom-right'
	}: {
		title?: string;
		position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
		actions: Array<{
			label: string;
			icon?: any;
			onClick: () => void;
		}>;
	} = $props();

	let open = $state(false);

	const positionClasses = {
		'bottom-right': 'bottom-4 right-4',
		'bottom-left': 'bottom-4 left-4',
		'top-right': 'top-4 right-4',
		'top-left': 'top-4 left-4'
	};
</script>

<DropdownMenu.Root bind:open>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button
				variant="default"
				size="icon"
				class="fixed rounded-full shadow-lg {positionClasses[position]}"
				{...props}
			>
				<Plus
					size={32}
					class="transition-transform duration-200"
					style="transform: {open ? 'rotate(45deg)' : 'rotate(0deg)'}"
				/>
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="mr-4 max-w-[250px] ">
		{#if title}
			<DropdownMenu.Group>
				<DropdownMenu.GroupHeading>{title}</DropdownMenu.GroupHeading>
				<DropdownMenu.Separator />
			</DropdownMenu.Group>
		{/if}
		<DropdownMenu.Group>
			{#each actions as action}
				<DropdownMenu.Item
					onclick={() => {
						if (typeof action.onClick === 'function') {
							alert('here');
							action.onClick();
						}
					}}
				>
					<action.icon />
					<span>{action.label}</span>
				</DropdownMenu.Item>
			{/each}
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>

<!-- <div class="fixed {positionClasses[position]}">
	{#if open}
		<div class="mb-12 flex flex-col-reverse gap-2" transition:fade={{ duration: 200 }}>
			{#each actions as action}
				<Button variant="secondary" onclick={() => handleActionClick(action)}>
					{#if action.icon}
						<action.icon />
					{/if}
					{action.label}
				</Button>
			{/each}
		</div>
	{/if}
</div>
-->
