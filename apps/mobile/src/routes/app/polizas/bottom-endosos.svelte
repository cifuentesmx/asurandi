<script lang="ts">
	import TextData from '$lib/components/text-data.svelte';
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Drawer from '$lib/components/ui/drawer';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { getPolizasStore } from './polizas-store.svelte';
	import type { GetOnePolizaResponse } from '@asurandi/types';
	import { WalletCards } from 'lucide-svelte';
	const polizasStore = getPolizasStore();
	const poliza: GetOnePolizaResponse['poliza'] = polizasStore.onePoliza?.poliza;
	const endosos: GetOnePolizaResponse['endosos'] = polizasStore.onePoliza?.endosos;
</script>

{#if endosos && poliza}
	<Drawer.Root>
		<Drawer.Trigger>
			{#snippet child({ props })}
				<button {...props}><WalletCards class="h-6 w-6 " /></button>
			{/snippet}
		</Drawer.Trigger>
		<Drawer.Content>
			<Drawer.Header>
				<Drawer.Title>Endosos</Drawer.Title>
				<Drawer.Description>Póliza {poliza.numeroPoliza}</Drawer.Description>
			</Drawer.Header>
			<ScrollArea class=" mx-2 h-[50vh]">
				{#each endosos as endoso}
					<div class="layout m-2 mt-4 rounded-sm border border-b p-2 text-sm">
						<TextData caption="No. endoso" text={endoso.numeroEndoso ?? 'N.A.'} />
						<TextData caption="Tipo" text={endoso.tipoEndoso ?? 'N.A.'} />
						<TextData caption="Recibo" text={endoso.numeroRecibo ?? 'N.A.'} />
						<TextData caption="Remesa" text={endoso.remesa ?? 'N.A.'} />
						<TextData caption="Pago" text={endoso.fechaPago ?? 'N.A.'} />
						<TextData caption="Registro" text={endoso.fechaRegistroPago ?? 'N.A.'} />
						<TextData caption="Estado" text={endoso.estado ?? 'N.A.'} />
						<TextData caption="Importe" text={endoso.importe ?? 'N.A.'} />
						<TextData caption="Vencimiento" text={endoso.fechaVencimiento ?? 'N.A.'} />
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
