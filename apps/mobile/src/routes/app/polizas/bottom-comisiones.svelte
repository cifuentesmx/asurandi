<script lang="ts">
	import TextData from '$lib/components/text-data.svelte';
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Drawer from '$lib/components/ui/drawer';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { getPolizasStore } from '$lib/polizas-store.svelte';
	import type { GetOnePolizaResponse } from '@asurandi/types';
	import { HandCoins } from 'lucide-svelte';
	const polizasStore = getPolizasStore();
	const poliza: GetOnePolizaResponse['poliza'] = polizasStore.onePoliza?.poliza;
	const comisiones: GetOnePolizaResponse['remesas'] = polizasStore.onePoliza?.remesas;
	$inspect(poliza);
	$inspect(comisiones);
</script>

{#if poliza && comisiones}
	<Drawer.Root>
		<Drawer.Trigger>
			{#snippet child({ props })}
				<button {...props}><HandCoins class="h-6 w-6 " /></button>
			{/snippet}
		</Drawer.Trigger>
		<Drawer.Content>
			<Drawer.Header>
				<Drawer.Title>Comisiones</Drawer.Title>
				<Drawer.Description>Póliza {poliza.numeroPoliza}</Drawer.Description>
			</Drawer.Header>
			<ScrollArea class="mx-2 h-[50vh]">
				<div class="layout">
					{#each comisiones as comision}
						<TextData caption="Concepto" text={comision.concepto} />
						<TextData caption="Importe" text={comision.importe} />
						<TextData caption="Comisión" text={comision.comision} />
						<TextData caption="Cargo" text={comision.cargo} />
						<TextData caption="Abono" text={comision.abono} />
						<TextData caption="Contabilizado" text={comision.contabilizado} />
						<TextData caption="Porcentaje de comisión" text={comision.porcentajeComision} />
						<TextData caption="Comisión de conducto" text={comision.comisionConducto} />
						<TextData caption="Fecha de pago" text={comision.fechaPago} />
						<TextData caption="Fecha de creación" text={comision.created} />
						<TextData caption="Fecha de contabilización" text={comision.contabilizado} />
					{/each}
				</div>
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
