<script lang="ts">
	import type { getPolizaByNumero } from '$api/polizas/getPolizaByNumero';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card';
	import TextData from '$lib/components/ui/text-data.svelte';

	type Poliza = Awaited<ReturnType<typeof getPolizaByNumero>>['polizas'][number];
	const { poliza = $bindable() } = $props<{
		poliza: Poliza;
	}>();
	const siniestros = poliza.siniestros;
</script>

<div class="ml-4 mt-2">
	Inciso: {poliza.inciso} (Cobertura {poliza.cobertura}) - {poliza.vehiculo}
	{#each siniestros as siniestro}
		<Card.Root class="mt-2">
			<Card.Header>
				<Card.Description>
					<div>Número de siniestro: {siniestro.numeroSiniestro}, Causa: {siniestro.causa}</div>
				</Card.Description>
			</Card.Header>
			<Card.Content>
				<div class="flex items-center justify-around text-sm">
					<div class="flex-1">
						<div>Numero de reporte: {siniestro.detalle.numeroReporte}</div>
						<div>Fecha: {siniestro.fechaSiniestro} a las {siniestro.horaSiniestro}</div>
						<div>Código Postal: {siniestro.codigoPostal}</div>
					</div>
					<div class="flex-1">
						<div>Monto estimado: {siniestro.montoEstimado ?? '-'}</div>
						<div>Monto actualizado: {siniestro.montoActualizado ?? '-'}</div>
						<div>Monto Final: {siniestro.montoFinal ?? '-'}</div>
					</div>
					<div class="flex-0">
						<div>
							<Button variant="outline" size="sm" href={`/app/siniestros/${siniestro.id}`}
								>Ver detalles</Button
							>
						</div>
					</div>
				</div>
			</Card.Content>
		</Card.Root>
	{/each}
</div>
