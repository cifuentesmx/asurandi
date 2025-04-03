<script lang="ts">
	import type { ListSiniestros } from '$api/siniestros/listSiniestros';
	import { enhance } from '$app/forms';
	import { Switch } from '$lib/components/ui/switch/index.js';
	import { getToastState } from '$lib/toast-state.svelte';
	import type { ActionResult } from '@sveltejs/kit';
	const toast = getToastState();

	let {
		siniestro,
		value = $bindable()
	}: {
		value: boolean;
		siniestro: ListSiniestros['data'][number];
	} = $props();
	let changed = $state(value);
	$effect(() => {
		if (changed !== value) {
			const form = document.querySelector(
				`#siniestro-toggle-seguimiento-${siniestro.id}`
			) as HTMLButtonElement;
			if (form) form.click();
		}
	});
</script>

{#if siniestro && !siniestro.fechaCierre}
	<form
		action="/app/siniestros?/toggleSeguimiento"
		method="post"
		use:enhance={() => {
			return ({
				result
			}: {
				result: ActionResult & {
					data?: {
						message?: string;
					};
				};
			}) => {
				const { type } = result;
				if (type === 'success') {
					toast.add(`Se ha ${changed ? '' : 'des'}activado el seguimiento al siniestro.`, {
						type: 'success'
					});
					value = changed;
				}
				if (type === 'error' || type === 'failure') {
					toast.add('Error: No se pudo guardar los cambios solicitados.', {
						type: 'error',
						description:
							result.data?.message ?? 'Si el problema persiste, comunícate con soporte técnico.'
					});
					changed = !changed;
				}
			};
		}}
	>
		<Switch bind:checked={changed} name="enSeguimiento" />
		<input type="hidden" bind:value={siniestro.id} name="siniestroId" />
		<button class="hidden" id={`siniestro-toggle-seguimiento-${siniestro.id}`}>Foobar;</button>
	</form>
{:else}
	<span class="text-muted-foreground xs">Siniestro cerrado</span>
{/if}
