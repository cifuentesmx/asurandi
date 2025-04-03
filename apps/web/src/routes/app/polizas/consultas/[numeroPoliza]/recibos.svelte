<script lang="ts">
	import type { getPolizaByNumero } from '$api/polizas/getPolizaByNumero';
	import SimpleTable from '$lib/components/simple-table/simple-table.svelte';

	type Recibos = Awaited<ReturnType<typeof getPolizaByNumero>>['recibos'];
	const { recibos = $bindable() } = $props<{
		recibos: Recibos;
	}>();
</script>

<SimpleTable
	data={recibos}
	columns={[
		{ accessorKey: 'numeroRecibo', header: 'Número de recibo', enableSorting: true },
		{ accessorKey: 'serie', header: 'Serie', enableSorting: true },
		{ accessorKey: 'estado', header: 'Estado', enableSorting: true },
		{ accessorKey: 'importe', header: 'Importe', enableSorting: true },
		{ accessorKey: 'vigenciaInicio', header: 'Inicio de vigencia', enableSorting: true },
		{ accessorKey: 'vigenciaFin', header: 'Fin de vigencia', enableSorting: true }
	]}
	pageSize={12}
/>
