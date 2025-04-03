<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { enhance } from '$app/forms';
	import type { ActionResult } from '@sveltejs/kit';
	import { getToastState } from '$lib/toast-state.svelte';
	import { _upsert } from '$lib/helpers/_upsert';
	import type { CoreRow } from '@tanstack/table-core';
	import type { ListPolizasSinComisiones } from '$api/polizas/listPolizasSinComisiones';
	import { getTableDataObject } from '$lib/components/data-table/table-data.svelte';
	const toast = getToastState();

	let {
		open = $bindable(false),
		poliza,
		newStatus
	} = $props<{
		poliza: CoreRow<ListPolizasSinComisiones['data'][number]>['original'];
		open?: boolean;
		showTrigger?: boolean;
		newStatus: 'Emitida' | 'Pagada' | 'Por vencer' | 'Cancelada' | 'No renovada' | 'Renovada';
	}>();
	const tableDatata = getTableDataObject();
</script>

{#if poliza}
	<Dialog.Root bind:open>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>Cambiar status de la póliza</Dialog.Title>
				<Dialog.Description>
					Se va a realizar un cambio del status de la póliza número {poliza.numeroPoliza}
				</Dialog.Description>
			</Dialog.Header>
			<table class="text-xs">
				<tbody>
					<tr>
						<th class="w-[40%] pr-2 text-right"> Núm. Poliza </th>
						<td>{poliza.numeroPoliza}</td>
					</tr>
					<tr>
						<th class="w-[40%] pr-2 text-right"> Agente </th>
						<td>{poliza.agente}</td>
					</tr>
					<tr>
						<th class="w-[40%] pr-2 text-right"> Asegurado </th>
						<td>{poliza.asegurado}</td>
					</tr>
					<tr>
						<th class="w-[40%] pr-2 text-right"> Status anterior</th>
						<td>{poliza.polizaEstatus}</td>
					</tr>
					<tr>
						<th class="w-[40%] pr-2 text-right"> Serie </th>
						<td>{poliza.numeroSerie}</td>
					</tr>
					<tr>
						<th class="w-[40%] pr-2 text-right"> Incisos Vigentes </th>
						<td>{poliza.incisosVigentes}</td>
					</tr>
					<tr>
						<th class="w-[40%] pr-2 text-right"> Prima Total </th>
						<td>$ {poliza.total}</td>
					</tr>
				</tbody>
			</table>
			<div class="py-6 text-center">
				<p class="text-sm">Nuevo estado:</p>
				<p
					class="bg-secondary text-secondary-foreground mx-auto mt-3 w-[200px] rounded-md py-2 text-center"
				>
					{newStatus}
				</p>
			</div>
			<Dialog.Footer>
				<form
					action="/app/polizas?/actualizarEstado"
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
								tableDatata.updateElement({ ...poliza, polizaEstatus: newStatus });
								toast.add('Se han realizado los cambios correctamente.', {
									type: 'success'
								});
								open = false;
							}
							if (type === 'error' || type === 'failure') {
								toast.add('Error: No se pudo guardar los cambios solicitados.', {
									type: 'error',
									description:
										result.data?.message ??
										'Si el problema persiste, comunícate con soporte técnico.'
								});
							}
						};
					}}
				>
					<Button variant="ghost" size="sm" onclick={() => (open = false)}>Cancelar</Button>
					<Button type="submit" size="sm">Cambiar status</Button>
					<input type="hidden" name="polizaId" value={poliza.id} />
					<input type="hidden" name="newStatus" value={newStatus} />
				</form>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
{/if}
