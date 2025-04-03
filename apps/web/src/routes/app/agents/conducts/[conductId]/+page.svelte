<script lang="ts">
	import type { ListConductos } from '$api/conducto/listConductos';
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { getToastState } from '$lib/toast-state.svelte';
	import type { ActionResult } from '@sveltejs/kit';
	import type { InferSelectModel } from 'drizzle-orm';
	import { tblConductos } from '../../../../../database/schema';

	const conductos = $state<ListConductos['conductos']>(page.data.conductos);
	const conducto = $state(conductos.find((t) => t.id === Number(page.params.conductId)));
	const toast = getToastState();
</script>

<div class="py-4 text-2xl">Conductos</div>
{#if conducto}
	<form
		action="?/save"
		method="post"
		use:enhance={() => {
			// TODO: validar el formulario

			return async ({
				result
			}: {
				result: ActionResult & {
					data?: {
						message?: string;
						agente?: InferSelectModel<typeof tblConductos>;
					};
				};
			}) => {
				const { type } = result;
				if (type === 'success') {
					toast.add('Datos guardados correctamente.', {
						type: 'success'
					});
				}
				if (type === 'error' || type === 'failure') {
					toast.add('No se pudo crear un nuevo agente.', {
						type: 'error',
						description:
							result?.data?.message ?? 'Si el problema persiste contacte a soporte técnico'
					});
				}
			};
		}}
	>
		<div class="grid w-full max-w-xs items-center gap-1.5">
			<Label class="mt-2" for="name">Nombre</Label>
			<Input
				type="text"
				id="name"
				name="name"
				placeholder="Nombre del agente"
				bind:value={conducto.nombre}
			/>
			<Label class="mt-2" for="alias">Alias (nombre amigable)</Label>
			<Input type="text" id="alias" name="alias" placeholder="Alias" bind:value={conducto.alias} />
			<Label class="mt-2" for="email">Correo electrónico</Label>
			<Input type="email" id="email" name="email" placeholder="Email" bind:value={conducto.email} />
			<Label class="mt-2" for="tel">Número de teléfono</Label>
			<Input type="phone" id="tel" name="tel" placeholder="Teléfono" bind:value={conducto.phone} />
		</div>
		<input type="hidden" name="id" bind:value={conducto.id} />
		<div class="mt-4">
			<Button href="/app/agents/conducts" variant="secondary" class="mr-4">Regresar</Button>
			<Button type="submit">Guardar</Button>
		</div>
	</form>
{/if}
