<script lang="ts">
	import SimpleTable from '$lib/components/simple-table/simple-table.svelte';
	import type { getPolizaByNumero } from '$api/polizas/getPolizaByNumero';

	type Endosos = Awaited<ReturnType<typeof getPolizaByNumero>>['endosos'];
	const { endosos = $bindable() } = $props<{
		endosos: Endosos;
	}>();
</script>

<SimpleTable
	data={endosos}
	columns={[
		{ accessorKey: 'endoso', header: 'endoso' },
		{ accessorKey: 'numeroRecibo', header: 'numeroRecibo' },
		{ accessorKey: 'fechaVencimiento', header: 'fechaVencimiento' },
		{ accessorKey: 'remesa', header: 'remesa' },
		{ accessorKey: 'fechaPago', header: 'fechaPago' },
		{ accessorKey: 'fechaRegistroPago', header: 'fechaRegistroPago' },
		{ accessorKey: 'estado', header: 'estado' },
		{ accessorKey: 'tipoEndoso', header: 'tipoEndoso' }
	]}
	pageSize={12}
/>
