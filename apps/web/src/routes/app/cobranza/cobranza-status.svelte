<script lang="ts">
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { apiRequest } from '$lib/ApiRequest.svelte';
	import { getToastState } from '$lib/toast-state.svelte';
	import type { ListCobranza } from '$api/cobros/listCobranza';

	const toast = getToastState();
	let {
		cobro
	}: {
		cobro: ListCobranza['data'][number];
	} = $props();
	let estado: string | undefined = $state(cobro.estado ?? undefined);
	$effect(() => {
		if (estado !== cobro.estado) {
			apiRequest(`/api/cobros/${cobro.id}`, {
				method: 'PUT',
				body: JSON.stringify({ newStatus: estado })
			})
				.then((r) => {
					if (r.ok && r.status === 200) {
						cobro.estado = estado as 'PENDIENTE' | 'PAGADA' | 'VENCIDA' | 'CANCELADA' | null;
						toast.add('Se ha actualizado el status del cobro.', { type: 'success' });
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
		{cobro.estado}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-56">
		<DropdownMenu.Group>
			<DropdownMenu.GroupHeading>Status</DropdownMenu.GroupHeading>
			<DropdownMenu.Separator />
			<DropdownMenu.RadioGroup bind:value={estado}>
				<DropdownMenu.RadioItem value="PENDIENTE">Pendiente</DropdownMenu.RadioItem>
				<DropdownMenu.RadioItem value="PAGADA">Pagada</DropdownMenu.RadioItem>
				<DropdownMenu.RadioItem value="VENCIDA">Vencida</DropdownMenu.RadioItem>
				<DropdownMenu.RadioItem value="CANCELADA">Cancelada</DropdownMenu.RadioItem>
			</DropdownMenu.RadioGroup>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
