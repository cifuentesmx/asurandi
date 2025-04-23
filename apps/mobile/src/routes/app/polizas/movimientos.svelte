<script lang="ts">
	import { getPolizasStore } from '$lib/polizas-store.svelte';
	import type { GetOnePolizaResponse } from '@asurandi/types';

	const polizasStore = getPolizasStore();
	const movimientos: GetOnePolizaResponse['movimientos'] = $derived(
		polizasStore.onePoliza?.movimientos
	);
</script>

{#if movimientos}
	<div class="mb-2 mt-6 text-lg font-semibold">Movimientos de la póliza</div>
	<ul class="text-muted-foreground ml-4 list-inside list-disc space-y-2 text-sm">
		{#each movimientos as movimiento}
			<li>
				<span class="font-bold">{movimiento.fechaMovimiento} - {movimiento.tipoMovimiento}: </span>
				<span>{movimiento.motivo}</span>
			</li>
		{/each}
	</ul>
{/if}
