<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Ellipsis } from 'lucide-svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import type { CoreRow } from '@tanstack/table-core';
	import type { ListSiniestros } from '$api/siniestros/listSiniestros';
	import { goto } from '$app/navigation';
	import VerPoliza from '../polizas/ver-poliza.svelte';

	let {
		siniestro
	}: {
		siniestro: CoreRow<ListSiniestros['data'][number]>['original'];
	} = $props();
</script>

{#if siniestro}
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
				<DropdownMenu.Item
					onclick={() => {
						goto(`/app/siniestros/${siniestro.id}`);
					}}
				>
					<span>Ver siniestro</span>
				</DropdownMenu.Item>
			</DropdownMenu.Group>
			<DropdownMenu.Separator />
			<DropdownMenu.Group>
				<VerPoliza numeroPoliza={siniestro.numeroPoliza} numeroSerie={siniestro.numeroSerie} />
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{/if}
