<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Ellipsis } from 'lucide-svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import type { CoreRow } from '@tanstack/table-core';
	import type { ListRecibos } from '$api/recibos/listRecibos';
	import VerPoliza from '../polizas/ver-poliza.svelte';

	let {
		recibo
	}: {
		recibo: CoreRow<ListRecibos['data'][number]>['original'];
	} = $props();
</script>

{#if recibo}
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			{#snippet child({ props })}
				<Button {...props} variant="ghost">
					<Ellipsis />
				</Button>
			{/snippet}
		</DropdownMenu.Trigger>
		<DropdownMenu.Content class="w-56">
			<DropdownMenu.Label>Acciones</DropdownMenu.Label>
			<DropdownMenu.Separator />
			<DropdownMenu.Group>
				<VerPoliza numeroPoliza={recibo.numeroPoliza} numeroSerie={recibo.numeroSerie} />
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{/if}
