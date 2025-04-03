<script lang="ts">
	import type { getPolizaByNumero } from '$api/polizas/getPolizaByNumero';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import SimpleTable from '$lib/components/simple-table/simple-table.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import { formatDate } from '$lib/formatters/formatDate';
	import Caratula from './caratula.svelte';
	import Endosos from './endosos.svelte';
	import Inciso from './inciso.svelte';
	import Individual from './individual.svelte';
	import Recibos from './recibos.svelte';
	import Siniestros from './siniestro.svelte';
	type Data = Awaited<ReturnType<typeof getPolizaByNumero>>;
	const { endosos, polizas, recibos, movimientos } = $state(page.data as Data);
	const incisos: Data['polizas'] = polizas.filter((p: { inciso: string | null }) => !!p.inciso);
	const maestra = polizas.filter((p) => p.esMaestra)[0];
	const siniestros = polizas.filter((p) => Array.isArray(p.siniestros) && p.siniestros.length > 0);
</script>

<div class="flex py-6">
	<Button
		onclick={() => {
			if (window.history.length > 1) {
				window.history.back();
			} else {
				goto('/app/polizas/consultas'); // Redirecciona a la página principal si no hay historial
			}
		}}>Regresar</Button
	>
</div>

<h3 class="mb-2 mr-4 text-2xl">Número de póliza: {polizas[0]?.numeroPoliza ?? 'no'}</h3>

<h4 class="mt-4 text-lg">Movimientos de la póliza</h4>
<SimpleTable
	data={movimientos}
	columns={[
		{ accessorKey: 'agente' },
		{ accessorKey: 'conducto' },
		{ accessorKey: 'tipoMovimiento' },
		{ accessorKey: 'fechaMovimiento' },
		{ accessorKey: 'motivo', header: 'Comentario' },
		{
			accessorKey: 'created',
			header: 'F. Registro',
			cell: ({ cell }) => {
				return formatDate(cell.getValue() as Date, { hour: '2-digit', minute: '2-digit' });
			}
		}
	]}
></SimpleTable>

<h4 class="mt-4 text-lg">Datos Generales</h4>
<Caratula {maestra} />
{#if incisos.length > 1}
	<h4 class="mt-4 text-lg">Incisos</h4>
	<div class="layout">
		{#each incisos as inciso}
			{#if inciso && inciso.inciso}
				<Inciso {inciso} />
			{/if}
		{/each}
	</div>
{:else if incisos.length === 1}
	<h4 class="mt-4 text-lg">Datos de la póliza</h4>
	<Individual inciso={polizas[0]} />
{/if}

{#if recibos.length > 0}
	<h4 class="mt-4 text-lg">Recibos</h4>
	<Recibos {recibos} />
{/if}

{#if endosos.length > 0}
	<h4 class="mt-4 text-lg">Endosos</h4>
	<Endosos {endosos} />
{/if}

{#if siniestros.length > 0}
	<h4 class="mt-4 text-lg">Siniestros</h4>
	{#each siniestros as poliza}
		{#if poliza}
			<Siniestros {poliza} />
		{/if}
	{/each}
{/if}

<style>
	.layout {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
		gap: 0.309rem;
	}
</style>
