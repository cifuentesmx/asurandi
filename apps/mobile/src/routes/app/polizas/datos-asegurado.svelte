<script lang="ts">
	import TextData from '$lib/components/text-data.svelte';
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
	import { buttonVariants } from '$lib/components/ui/button';
	import { ChevronsUpDown } from 'lucide-svelte';
	import { getPolizasStore } from './polizas-store.svelte';
	const polizasStore = getPolizasStore();
	const poliza = polizasStore.onePoliza?.poliza;
</script>

{#if poliza}
	<Collapsible.Root class="space-y-2">
		<div class="mt-6 flex items-center justify-between space-x-4">
			<div class="text-lg font-semibold">Asegurado</div>
			<Collapsible.Trigger
				class={buttonVariants({ variant: 'ghost', size: 'sm', class: 'w-9 p-0' })}
			>
				<ChevronsUpDown />
				<span class="sr-only">Toggle</span>
			</Collapsible.Trigger>
		</div>
		<div class="layout">
			<TextData caption="asegurado" text={poliza.asegurado} />
			<TextData caption="Celular" text={poliza.aseguradoCelular} />
		</div>
		<Collapsible.Content>
			<div class="layout">
				<TextData caption="Dirección" text={poliza.aseguradoDireccion} />
				<TextData caption="R.F.C." text={poliza.aseguradoRfc} />
			</div>
		</Collapsible.Content>
	</Collapsible.Root>
{/if}

<style>
	.layout {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
	}
</style>
