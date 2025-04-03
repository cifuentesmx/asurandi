<script lang="ts">
	import Ellipsis from 'lucide-svelte/icons/ellipsis';
	import { Button } from '$lib/components/ui/button/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import type { CoreRow } from '@tanstack/table-core';
	import type { ListPolizasGeneral } from '$api/polizas/listPolizas';
	import VerPoliza from '../ver-poliza.svelte';

	let { poliza }: { poliza: CoreRow<ListPolizasGeneral['data'][number]>['original'] } = $props();
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
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.GroupHeading>Acciones</DropdownMenu.GroupHeading>
			<VerPoliza {poliza}></VerPoliza>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
	</DropdownMenu.Content>
</DropdownMenu.Root>
