<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import { getCookie } from '$lib/utils';
	const perPageItems = [
		{ value: 10, label: 'Ver 10' },
		{ value: 20, label: 'Ver 20' },
		{ value: 50, label: 'Ver 50' },
		{ value: 100, label: 'Ver 100' },
		{ value: 200, label: 'Ver 200' }
	];
	let { value = $bindable() }: { value: number } = $props();
	const triggerContent = $derived(
		perPageItems.find((f) => f.value === value)?.label ?? 'Seleccionar'
	);
</script>

<Select.Root type="single" name="perPage" value={value.toString()}>
	<Select.Trigger
		class="w-[180px]"
		onchange={(v) => {
			const el = v.target as HTMLInputElement | null;
			if (el instanceof HTMLInputElement) {
				let val = Number(el.value);
				if (Number.isNaN(val)) val = Number(getCookie('DataTable:perPage') ?? '10');
				value = val;
				document.cookie = `DataTable:perPage=${val};path=/;samesite=strict;`;
			}
		}}
	>
		{triggerContent}
	</Select.Trigger>
	<Select.Content>
		<Select.Group>
			{#each perPageItems as item}
				<Select.Item value={item.value.toString()} label={item.label}>{item.label}</Select.Item>
			{/each}
		</Select.Group>
	</Select.Content>
</Select.Root>
