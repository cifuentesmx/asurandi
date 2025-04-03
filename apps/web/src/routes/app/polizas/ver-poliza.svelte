<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { _upsert } from '$lib/helpers/_upsert';
	import type { CoreRow } from '@tanstack/table-core';
	import type { ListPolizasGeneral } from '$api/polizas/listPolizas';
	import { goto } from '$app/navigation';
	import { getToastState } from '$lib/toast-state.svelte';
	const toast = getToastState();
	let {
		poliza,
		numeroPoliza,
		numeroSerie
	}: {
		poliza?: CoreRow<ListPolizasGeneral['data'][number]>['original'];
		numeroPoliza?: string | null;
		numeroSerie?: string | null;
	} = $props();
	const nPoliza = poliza ? poliza.numeroPoliza : (numeroPoliza ?? '');
	const nSerie = poliza ? poliza.numeroSerie : (numeroSerie ?? undefined);
</script>

<DropdownMenu.Item
	onclick={() => {
		goto(`/app/polizas/consultas/${nPoliza}`);
	}}
>
	<span>Ver póliza</span>
</DropdownMenu.Item>
<DropdownMenu.Item
	onclick={() => {
		navigator.clipboard.writeText(nPoliza ?? '');
		toast.add(`Se ha copiado el texto: ${nPoliza}`, { type: 'info' });
	}}
>
	Copiar número de póliza
</DropdownMenu.Item>

{#if nSerie}
	<DropdownMenu.Item
		onclick={() => {
			navigator.clipboard.writeText(nSerie);
			toast.add(`Se ha copiado el texto: ${nSerie}`, { type: 'info' });
		}}
	>
		Copiar número de serie
	</DropdownMenu.Item>
{/if}
