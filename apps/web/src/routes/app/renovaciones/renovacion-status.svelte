<script lang="ts">
	import type { ListRenovaciones } from '$api/renovaciones/listRenovaciones';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { apiRequest } from '$lib/ApiRequest.svelte';
	import { getToastState } from '$lib/toast-state.svelte';

	const toast = getToastState();
	let {
		renovacion
	}: {
		renovacion: ListRenovaciones['data'][number];
	} = $props();
	let estado: string | undefined = $state(renovacion.estado ?? undefined);
	$effect(() => {
		if (estado !== renovacion.estado) {
			apiRequest(`/api/renovaciones/${renovacion.id}`, {
				method: 'POST',
				body: JSON.stringify({ newStatus: estado })
			})
				.then((r) => {
					if (r.ok && r.status === 200) {
						renovacion.estado = estado as 'PENDIENTE' | 'NO RENOVADA' | 'RENOVADA' | null;
						toast.add('Se ha actualizado el status de la renovación.', { type: 'success' });
					} else {
						r.json()
							.then((data) => {
								const message = data.message ?? 'Error desconocido';
								toast.add(message, { type: 'error' });
							})
							.catch(() => {
								toast.add('Oops... algo salió mal', { type: 'error' });
							});
					}
				})
				.catch(() => {
					toast.add('Error en la comunicación con el servidor.', { type: 'error' });
				});
		}
	});
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger class={buttonVariants({ variant: 'outline', size: 'sm' })}>
		{renovacion.estado}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-56">
		<DropdownMenu.Group>
			<DropdownMenu.GroupHeading>Status</DropdownMenu.GroupHeading>
			<DropdownMenu.Separator />
			<DropdownMenu.RadioGroup bind:value={estado}>
				<DropdownMenu.RadioItem value="PENDIENTE">Pendiente</DropdownMenu.RadioItem>
				<DropdownMenu.RadioItem value="RENOVADA">Renovada</DropdownMenu.RadioItem>
				<DropdownMenu.RadioItem value="NO RENOVADA">No renovada</DropdownMenu.RadioItem>
			</DropdownMenu.RadioGroup>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
