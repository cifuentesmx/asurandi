<script lang="ts">
	import TextData from '$lib/components/text-data.svelte';
	import { buttonVariants } from '$lib/components/ui/button';
	let { poliza } = $props();
	import * as Drawer from '$lib/components/ui/drawer';
	import { formatMoney } from '$lib/formatters/formatMoney';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import Button from '$lib/components/ui/button/button.svelte';
	import { getPolizasStore } from '$lib/polizas-store.svelte';
	const polizasStore = getPolizasStore();
</script>

<Drawer.Root>
	<Drawer.Trigger>
		{#snippet child({ props })}
			<div
				class="cursor-pointer rounded-lg bg-indigo-950/85 px-4 py-2"
				role="button"
				tabindex="0"
				{...props}
			>
				<div class="truncate capitalize text-white">
					{poliza.asegurado.toLowerCase()}
				</div>
				<div class="truncate text-xs text-white">
					{poliza.numeroPoliza} - {poliza.vehiculo}
				</div>
				<div class="truncate text-xs text-white">
					Vigencia: del {poliza.vigenciaInicio} al {poliza.vigenciaFin}
				</div>
			</div>
		{/snippet}
	</Drawer.Trigger>
	<Drawer.Content>
		<Drawer.Header>
			<Drawer.Title>{poliza.numeroPoliza} - {poliza.asegurado}</Drawer.Title>
			<Drawer.Description>
				{poliza.vehiculo}
			</Drawer.Description>
		</Drawer.Header>
		<ScrollArea class=" mx-2 h-[50vh]">
			<div class="layout">
				<TextData caption="Compañía">{poliza.company}</TextData>
				<TextData caption="Cuenta">{poliza.account}</TextData>
				<TextData caption="No. Póliza">{poliza.numeroPoliza}</TextData>
				<TextData caption="Asegurado">{poliza.asegurado}</TextData>
				<TextData caption="Agente">{poliza.agente}</TextData>
				<TextData caption="Conducto">{poliza.conducto}</TextData>
				<TextData caption="No. serie">{poliza.serie}</TextData>
				<TextData caption="Vehiculo">{poliza.vehiculo}</TextData>
				<TextData caption="Inicio de Vigencia">{poliza.vigenciaInicio}</TextData>
				<TextData caption="Fin de Vigencia">{poliza.vigenciaFin}</TextData>
				<TextData caption="Origen">{poliza.origen}</TextData>
				<TextData caption="Status">{poliza.status}</TextData>
				<TextData caption="Prima Total">{formatMoney(poliza.primaTotal)}</TextData>
			</div>
		</ScrollArea>
		<Drawer.Footer>
			<Drawer.Close class={buttonVariants({ variant: 'outline', size: 'sm' })}>Cerrar</Drawer.Close>
			<Button
				onclick={() => {
					polizasStore.getOne(poliza.id);
				}}>Ver póliza completa</Button
			>
		</Drawer.Footer>
	</Drawer.Content>
</Drawer.Root>

<style>
	.layout {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
	}
</style>
