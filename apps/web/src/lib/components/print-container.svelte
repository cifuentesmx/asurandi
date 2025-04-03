<script lang="ts">
	import { jsPDF } from 'jspdf';
	import type { Snippet } from 'svelte';
	import Button from './ui/button/button.svelte';

	let { id, children, goback }: { goback?: () => void; id: string; children: Snippet } = $props();
</script>

<div class="bg-grey-200 m-auto h-full w-full px-6">
	<div class="mx-2 flex items-center py-12">
		<h4 class="flex-1">Vista previa del PDF</h4>
		{#if goback}
			<Button onclick={goback} class="mr-2" variant="outline" size="sm">Regresar</Button>
		{/if}
		<Button
			size="sm"
			onclick={() => {
				const doc = new jsPDF({ format: 'letter' });
				doc.html(document.getElementById(id) as HTMLElement, {
					callback: function (doc) {
						doc.save();
						if (goback) goback();
					},
					width: 190, // Ancho en mm (el ancho típico de una página A4 es 210mm)
					windowWidth: document.getElementById(id)?.offsetWidth as number, // Ancho actual del elemento
					margin: [8, 12.5, 8, 12.5], // Márgenes [superior, izquierdo, inferior, derecho] en mm
					autoPaging: true // Permite paginación automática si el contenido es largo
				});
			}}>Generar PDF</Button
		>
	</div>
	<div class="print-container" {id}>
		{@render children?.()}
	</div>
</div>

<style>
	:global(.print-container) {
		background-color: white !important;
		margin: auto;
		color: black !important;
		width: 980px;
		padding: 3rem 1.6rem;
	}

	/* Seleccionar TODOS los elementos anidados */
	:global(.print-container *),
	:global(.print-container * *),
	:global(.print-container * * *),
	:global(.print-container * * * *),
	:global(.print-container * * * * *),
	:global(.print-container * * * * * *),
	:global(.print-container * * * * * * *) {
		background-color: transparent !important;
		color: black !important;
		opacity: 1 !important;
		border-color: black !important;
	}

	/* Asegurar que textos e iconos sean visibles */
	:global(.color-svg) {
		stroke: currentColor !important;
		fill: currentColor !important;
	}
</style>
