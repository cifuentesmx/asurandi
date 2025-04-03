<script lang="ts">
	import type { ListRemesasSinComisiones } from '$api/remesas/listRemesasSinComisiones';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Ellipsis } from 'lucide-svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import type { CoreRow } from '@tanstack/table-core';
	import VerPoliza from '../polizas/ver-poliza.svelte';
	let {
		remesa
	}: {
		remesa: CoreRow<ListRemesasSinComisiones['data'][number]>['original'];
	} = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button {...props} variant="ghost" size="icon" class="relative size-8 p-0">
				<span class="sr-only">Abrir menu</span>
				<Ellipsis class="size-4" />
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-56">
		<DropdownMenu.Label>Acciones</DropdownMenu.Label>
		<DropdownMenu.Separator />
		<DropdownMenu.Group>
			<VerPoliza numeroPoliza={remesa.numeroPoliza} numeroSerie={remesa.numeroSerie} />
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
