<script lang="ts">
	import TextData from '$lib/components/text-data.svelte';
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Drawer from '$lib/components/ui/drawer';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { getPolizasStore } from '$lib/polizas-store.svelte';
	import type { GetOnePolizaResponse } from '@asurandi/types';
	import { CircleDollarSign } from 'lucide-svelte';
	const polizasStore = getPolizasStore();
	const poliza = polizasStore.onePoliza?.poliza;
	const recibos: GetOnePolizaResponse['recibos'] = polizasStore.onePoliza?.recibos;
</script>

{#if poliza && recibos}
	<Drawer.Root>
		<Drawer.Trigger>
			{#snippet child({ props })}
				<button {...props}><CircleDollarSign class="h-6 w-6 " /></button>
			{/snippet}
		</Drawer.Trigger>
		<Drawer.Content>
			<Drawer.Header>
				<Drawer.Title>Recibos de cobro</Drawer.Title>
				<Drawer.Description>Póliza {poliza.numeroPoliza}</Drawer.Description>
			</Drawer.Header>
			<ScrollArea class=" mx-2 h-[50vh]">
				{#each recibos as recibo}
					<div class="layout m-2 mt-4 rounded-sm border border-b p-2 text-sm">
						<TextData caption="No. recibo" text={recibo.numeroRecibo} />
						<TextData caption="Status" text={recibo.estado} />
						<TextData caption="Serie" text={recibo.serie} />
						<TextData caption="Folio" text={recibo.folio} />
						<TextData caption="Serie emisión" text={recibo.serieEmision} />
						<TextData caption="Importe" text={recibo.importe} />
						<TextData caption="Prima neta comisión" text={recibo.primaNetaComision} />
						<TextData caption="Vigencia inicio" text={recibo.vigenciaInicio} />
						<TextData caption="Vigencia fin" text={recibo.vigenciaFin} />
						<TextData caption="Fecha registro" text={recibo.created} />
					</div>
				{/each}
			</ScrollArea>
			<Drawer.Footer>
				<Drawer.Close class={buttonVariants({ variant: 'outline', size: 'sm' })}>
					Cerrar
				</Drawer.Close>
			</Drawer.Footer>
		</Drawer.Content>
	</Drawer.Root>
{/if}

<style>
	.layout {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
		gap: 1rem;
	}
</style>
