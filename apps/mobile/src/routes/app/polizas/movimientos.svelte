<script lang="ts">
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
	import { buttonVariants } from '$lib/components/ui/button';
	import { ChevronsUpDown } from 'lucide-svelte';
	import { getPolizasStore } from '$lib/polizas-store.svelte';
	import type { GetOnePolizaResponse } from '@asurandi/types';

	const polizasStore = getPolizasStore();
	const movimientos: GetOnePolizaResponse['movimientos'] = $derived(
		polizasStore.onePoliza?.movimientos
	);
</script>

{#if movimientos}
	<Collapsible.Root class="space-y-2">
		<div class="mt-6 flex items-center justify-between space-x-4">
			<div class="text-lg font-semibold">Movimientos de la póliza</div>
			<Collapsible.Trigger
				class={buttonVariants({ variant: 'ghost', size: 'sm', class: 'w-9 p-0' })}
			>
				<ChevronsUpDown />
				<span class="sr-only">Toggle</span>
			</Collapsible.Trigger>
		</div>
		<Collapsible.Content class="text-muted-foreground text-sm">
			<ul class="list-inside list-disc">
				{#each movimientos as movimiento}
					<li>
						<span class="font-bold"
							>{movimiento.fechaMovimiento} - {movimiento.tipoMovimiento}:
						</span>
						<span>{movimiento.motivo}</span>
					</li>
				{/each}
			</ul>
		</Collapsible.Content>
	</Collapsible.Root>
{/if}
