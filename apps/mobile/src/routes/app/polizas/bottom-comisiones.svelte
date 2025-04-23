<script lang="ts">
	import TextData from '$lib/components/text-data.svelte';
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Drawer from '$lib/components/ui/drawer';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { getPolizasStore } from '$lib/polizas-store.svelte';
	import type { GetOnePolizaResponse } from '@asurandi/types';
	import { HandCoins } from 'lucide-svelte';
	import { Badge } from '$lib/components/ui/badge/index.js';
	import { formatMoney } from '$lib/formatters/formatMoney';
	const polizasStore = getPolizasStore();
	const poliza: GetOnePolizaResponse['poliza'] = polizasStore.onePoliza?.poliza;
	const comisiones: GetOnePolizaResponse['remesas'] = polizasStore.onePoliza?.remesas;
</script>

{#if poliza && comisiones}
	<Drawer.Root>
		<Drawer.Trigger>
			{#snippet child({ props })}
				<button {...props} class="relative">
					<HandCoins class="h-6 w-6 " />
					{#if comisiones.length === 0}
						<Badge
							variant="destructive"
							class="absolute -right-3 -top-1 rounded-full px-1 py-0 text-xs">!</Badge
						>
					{/if}
				</button>
			{/snippet}
		</Drawer.Trigger>
		<Drawer.Content>
			<Drawer.Header>
				<Drawer.Title>Comisiones</Drawer.Title>
				<Drawer.Description>Póliza {poliza.numeroPoliza}</Drawer.Description>
			</Drawer.Header>
			<ScrollArea class="mx-2 h-[50vh]">
				{#each comisiones as comision}
					<div class="layout bg-muted mt-6 rounded-sm border p-4">
						<TextData caption="Concepto" text={comision.concepto} />
						<TextData caption="Importe" text={formatMoney(comision.importe)} />
						<TextData caption="Comisión" text={formatMoney(comision.comisionConducto ?? 0)} />
						<TextData
							caption="Porcentaje de comisión"
							text={`${(((Number(comision.comisionConducto) ?? 0) / (Number(comision.importe) ?? 1)) * 100).toFixed(2)}%`}
						/>
						<TextData caption="Fecha de pago" text={comision.fechaPago} />
					</div>
				{/each}
				{#if comisiones.length === 0}
					<div class="bg-muted text-muted-foreground mt-4 rounded-sm p-4 text-sm">
						No se han registrado comisiones para esta póliza.
					</div>
				{/if}
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
