<script lang="ts">
	import type { getPolizaByNumero } from '$api/polizas/getPolizaByNumero';
	import { buttonVariants } from '$lib/components/ui/button';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Drawer from '$lib/components/ui/drawer/index.js';
	import Coberturas from './coberturas.svelte';
	import TextData from '$lib/components/ui/text-data.svelte';

	type Inciso = Awaited<ReturnType<typeof getPolizaByNumero>>['polizas'][number];
	const { inciso } = $props<{
		inciso: Inciso;
	}>();
</script>

<Drawer.Root>
	<Drawer.Trigger class={buttonVariants({ variant: 'outline', size: 'sm', class: 'mr-2' })}>
		Inciso {inciso.inciso}
	</Drawer.Trigger>

	<Drawer.Content>
		<div class="text-muted-foreground mb-2 pl-4 text-xl">
			Inciso: {inciso.inciso}
			{inciso.vehiculo}
		</div>
		<div class="layout px-4">
			<TextData caption="Tipo de uso" text={inciso.uso} />
			<TextData caption="Tipo de servicio" text={inciso.servicio} />
			<TextData caption="Placas" text={inciso.placas} />
			<TextData caption="Número de serie" text={inciso.numeroSerie} />
			<TextData caption="Número economico" text={inciso.numeroEconomico} />
			<TextData caption="Tipo cobertura" text={inciso.cobertura} />
			<TextData caption="Fecha de emision" text={inciso.fechaEmision} />
			<TextData caption="Inicio de vigencia" text={inciso.vigenciaInicio} />
			<TextData caption="Fin de Vigencia" text={inciso.vigenciaFin} />
			<TextData caption="Tarifa" text={inciso.tarifa} />
			<TextData caption="Modo de pago" text={inciso.modoPago} />
			<TextData caption="Prima neta" text={inciso.primaNeta} />
			<TextData caption="Costo expedicion" text={inciso.costoExpedicion} />
			<TextData caption="Subtotal" text={inciso.subtotal} />
			<TextData caption="I.V.A." text={inciso.iva} />
			<TextData caption="Total" text={inciso.total} />
		</div>
		<Drawer.Footer>
			<div class="flex justify-center pb-4">
				<Coberturas coberturas={inciso.coberturas} />
				<!-- <Button
					style="width: 150px;"
					variant="outline"
					size="sm"
					onclick={() => {
					}}>Cerrar</Button
				> -->
				<Drawer.Close>
					{#snippet child({ props })}
						<Button {...props} size="sm">Cerrar</Button>
					{/snippet}
				</Drawer.Close>
			</div>
		</Drawer.Footer>
	</Drawer.Content>
</Drawer.Root>

<style>
	.layout {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
		gap: 0.309rem;
	}
</style>
