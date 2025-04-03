<script lang="ts">
	import Check from 'lucide-svelte/icons/check';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import { tick } from 'svelte';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js';

	let {
		options,
		identifier = 'id',
		labelField = 'nombre',
		placeholder = 'Buscar...',
		emptyText = 'Selecciona una opción...',
		notFoundText = 'No se encontraron coincidencias.',
		id = 'combo1',
		selected = $bindable(),
		open = $bindable(false),
		value = $bindable()
	} = $props();

	let triggerRef = $state<HTMLButtonElement>(null!);

	function closeAndFocusTrigger() {
		open = false;
		tick().then(() => {
			triggerRef.focus();
		});
	}

	let opts = options.map((o: any) => {
		return {
			id: o[identifier],
			value: `${o[labelField]}${o[identifier]}`,
			label: o[labelField]
		};
	});

	const initial = options.find((f: any) => f[identifier] === selected);

	value = initial ? `${initial[labelField]}${initial[identifier]}` : null;

	const selectedValue = $derived(opts.find((f: any) => f.value === value)?.label ?? emptyText);
	$effect(() => {
		selected = opts.find((f: any) => f.value === value)?.id ?? null;
	});
</script>

<Popover.Root bind:open>
	<Popover.Trigger bind:ref={triggerRef}>
		{#snippet child({ props })}
			<Button
				variant="outline"
				class="w-auto flex-1 justify-between truncate"
				{...props}
				role="combobox"
				aria-expanded={open}
			>
				{selectedValue || 'Select a framework...'}
				<ChevronsUpDown class="opacity-50" />
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="max-h-[50dvh] p-0">
		<Command.Root>
			<Command.Input {placeholder} />
			<Command.List>
				<Command.Empty>{notFoundText}</Command.Empty>
				<Command.Group>
					{#each opts as option}
						<Command.Item
							value={option.value}
							onSelect={() => {
								value = option.value;
								closeAndFocusTrigger();
							}}
						>
							<Check class={cn('mr-2 h-4 w-4', value !== option.value && 'text-transparent')} />
							{option.label}
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
