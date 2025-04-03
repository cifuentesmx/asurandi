<script lang="ts">
	import { getPolizasStore } from '$lib/polizas-store.svelte';
	import BottomMenu from './bottom-menu.svelte';
	import DatosAsegurado from './datos-asegurado.svelte';
	import DatosGenerales from './datos-generales.svelte';
	import DatosPago from './datos-pago.svelte';
	import DatosVehiculo from './datos-vehiculo.svelte';

	const polizasStore = getPolizasStore();
	const poliza = $derived(polizasStore?.onePoliza?.poliza ?? null);
</script>

{#if poliza}
	<div class="text-xl font-bold">
		{poliza.vehiculo}
	</div>
	<DatosGenerales />
	<DatosPago />
	<DatosAsegurado />
	<DatosVehiculo />
	<BottomMenu />
{/if}
<div class="py-16"></div>
