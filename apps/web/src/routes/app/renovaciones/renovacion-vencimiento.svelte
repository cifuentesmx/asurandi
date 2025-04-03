<script lang="ts">
	import type { ListRenovaciones } from '$api/renovaciones/listRenovaciones';
	let {
		renovacion
	}: {
		renovacion: ListRenovaciones['data'][number];
	} = $props();
	const days = $state(
		renovacion.fechaVencimiento
			? Math.round(
					(new Date(renovacion.fechaVencimiento).getTime() - new Date().getTime()) /
						1000 /
						3600 /
						24
				) + 1
			: 0
	);
</script>

<div
	class="rounded-lg border-2 px-2 py-1 text-center"
	class:border-orange-600={renovacion.estado === 'NO RENOVADA'}
	class:border-green-600={renovacion.estado === 'RENOVADA'}
	class:text-white={renovacion.estado === 'PENDIENTE'}
	class:bg-red-900={renovacion.estado === 'PENDIENTE' && days < 1}
	class:bg-red-500={renovacion.estado === 'PENDIENTE' && days >= 1 && days < 10}
	class:bg-orange-400={renovacion.estado === 'PENDIENTE' && days >= 10 && days < 15}
	class:bg-green-800={renovacion.estado === 'PENDIENTE' && days >= 15}
>
	<div>
		{renovacion.fechaVencimiento}
	</div>
	<div class="text-xs">
		{#if renovacion.estado === 'PENDIENTE'}
			{#if days < 0}
				Venció hace {-days} días
			{:else if days === 0}
				¡Vence hoy!
			{:else}
				Dentro de {days} días
			{/if}
		{:else if renovacion.estado === 'NO RENOVADA'}
			No renovada
		{:else if renovacion.estado === 'RENOVADA'}
			Renovada
		{/if}
	</div>
</div>
