<script lang="ts">
	import * as Select from '$lib/components/ui/select';
	import { getCookie } from '$lib/utils';
	const perPageItems = [
		{ value: 10, label: 'Ver 10 registros' },
		{ value: 20, label: 'Ver 20 registros' },
		{ value: 50, label: 'Ver 50 registros' },
		{ value: 100, label: 'Ver 100 registros' },
		{ value: 200, label: 'Ver 200 registros' }
	];
	let { value = $bindable() }: { value?: number } = $props();
	if (!value || Number.isNaN(value) || value < 10) value = 10;
</script>

<Select.Root
	type="single"
	name="perpage"
	onValueChange={(v) => {
		let val = Number(v);
		if (Number.isNaN(val)) val = Number(getCookie('DataTable:perPage') ?? '10');
		value = val;
		document.cookie = `cfgDataTable:perPage=${val};path=/;samesite=strict;`;
	}}
>
	<Select.Trigger class="w-[180px]">
		Mostrando {value}
	</Select.Trigger>
	<Select.Content>
		<Select.Group>
			{#each perPageItems as item}
				<Select.Item value={item.value.toFixed()} label={item.label}>{item.label}</Select.Item>
			{/each}
		</Select.Group>
	</Select.Content>
</Select.Root>
