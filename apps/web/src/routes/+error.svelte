<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$lib/components/ui/button/button.svelte';
	const status: { [key: string]: string } = {
		404: '🔎 Error:'
	};
	const message: { [key: string]: string } = {
		404: 'No hemos encontrado la página que estás buscando'
	};
</script>

<div class="grid-cols-1 place-content-center gap-6 h-screen">
	<div class="text-center">
		{#if status[$page.status] && message[$page.status]}
			<div class="text-3xl">
				{status[$page.status]}
			</div>
			<div class="text-2xl">
				{message[$page.status]}
			</div>
		{:else}
			<div class="text-3xl">
				{$page.status}
			</div>
			<div class="text-2xl">
				{$page.error?.message ?? 'Error desconocido'}
			</div>
		{/if}
	</div>
	<div class="text-center p-6">
		<Button href="/app">Ir al Dashboard</Button>
	</div>
</div>
