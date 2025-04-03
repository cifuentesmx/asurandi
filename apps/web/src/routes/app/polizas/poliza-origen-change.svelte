<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { getToastState } from '$lib/toast-state.svelte';
	import type { ListPolizasGeneral } from '$api/polizas/listPolizas';
	import type { ListPolizasSinComisiones } from '$api/polizas/listPolizasSinComisiones';
	import { enhance } from '$app/forms';
	import type { ActionResult } from '@sveltejs/kit';

	const toast = getToastState();
	let {
		poliza
	}: {
		poliza: ListPolizasGeneral['data'][number] | ListPolizasSinComisiones['data'][number];
	} = $props();
	let origenId: string | undefined = $state(poliza.origenId?.toString() ?? undefined);
	const origenes = [
		['8', 'Indeterminado'],
		['6', 'Cambio de conducto'],
		['1', 'Nueva'],
		['7', 'Nueva ganada'],
		['2', 'Renovada'],
		['3', 'Renovación tardía'],
		['4', 'Sustituida'],
		['5', 'Recuperada']
	];
	$effect(() => {
		if (origenId !== poliza.origenId?.toString()) {
			const form = document.querySelector(`#update-origen-${poliza.id}`) as HTMLButtonElement;
			if (form) form.click();
		}
	});
</script>

<form
	action="/app/polizas?/actualizarOrigen"
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
				toast.add('Se ha actualizado el origen correctamente.', {
					type: 'success'
				});
				origenes.forEach(([key, val]) => {
					if (key === origenId) poliza.origen = val;
				});
			}
			if (type === 'error' || type === 'failure') {
				toast.add('Error: No se pudo guardar los cambios solicitados.', {
					type: 'error',
					description:
						result.data?.message ?? 'Si el problema persiste, comunícate con soporte técnico.'
				});
			}
		};
	}}
>
	<input type="hidden" bind:value={poliza.id} name="polizaId" />
	<input type="hidden" bind:value={origenId} name="origenId" />
	<button type="submit" class="hidden" id={`update-origen-${poliza.id}`}>No se muestra</button>
</form>

<DropdownMenu.Root>
	<DropdownMenu.Trigger class={buttonVariants({ variant: 'outline', size: 'sm' })}>
		{poliza.origen}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-56">
		<DropdownMenu.Group>
			<DropdownMenu.GroupHeading>Cambiar origen</DropdownMenu.GroupHeading>
			<DropdownMenu.Separator />
			<DropdownMenu.RadioGroup bind:value={origenId}>
				{#each origenes as [theVal, caption]}
					<DropdownMenu.RadioItem value={theVal}>{caption}</DropdownMenu.RadioItem>
				{/each}
			</DropdownMenu.RadioGroup>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
