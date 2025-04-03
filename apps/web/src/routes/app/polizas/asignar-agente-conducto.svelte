<script lang="ts">
	import * as Sheet from '$lib/components/ui/sheet';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { Button } from '$lib/components/ui/button';
	import { enhance } from '$app/forms';
	import type { ActionResult } from '@sveltejs/kit';
	import { _upsert } from '$lib/helpers/_upsert';
	import { getToastState } from '$lib/toast-state.svelte';
	import type { ListConductos } from '$api/conducto/listConductos';
	import ComboBox from '$lib/components/combo-box.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import * as Collapsible from '$lib/components/ui/collapsible';
	import { ChevronsUpDown } from 'lucide-svelte';
	import { getTableDataObject } from '$lib/components/data-table/table-data.svelte';
	import type { ListAgentes } from '$api/agentes/listAgentes';
	import type { CoreRow } from '@tanstack/table-core';
	import type { ListPolizasGeneral } from '$api/polizas/listPolizas';

	const toast = getToastState();

	let {
		poliza,
		open = $bindable(false),
		showTrigger = true,
		conductos,
		agentes
	}: {
		poliza: CoreRow<ListPolizasGeneral['data'][number]>['original'];
		open?: boolean;
		showTrigger?: boolean;
		conductos: ListConductos['conductos'];
		agentes: ListAgentes['agentes'];
	} = $props();
	const tableData = getTableDataObject();
	let conductoId = $state<number | null>(poliza.conductoId);
	let agenteId = $state<number | null>(poliza.agenteId);
</script>

<Sheet.Root bind:open>
	{#if showTrigger}
		<Sheet.Trigger>
			{#snippet child({ props })}
				<Button variant="outline" size="sm" {...props}>Editar</Button>
			{/snippet}
		</Sheet.Trigger>
	{/if}
	<Sheet.Content side="right">
		<ScrollArea class="h-full w-full p-4">
			<form
				action="/app/polizas?/actualizarConductoAgente"
				method="post"
				use:enhance={() => {
					// TODO: validar el formulario
					return async ({
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
							const agente = agentes.find((a) => a.id === agenteId)?.nombre ?? '';
							const conducto = conductos.find((a) => a.id === conductoId)?.nombre ?? '';
							await tableData.updateElement({ ...poliza, agente, conducto });
							toast.add('Se han realizado los cambios correctamente.', {
								type: 'success'
							});

							open = false;
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
				<Sheet.Header>
					<Sheet.Title>Actualizar comisiones de póliza</Sheet.Title>
					<Sheet.Description
						>Actualiza las comisiones y conductos de pago para las pólizas.</Sheet.Description
					>
				</Sheet.Header>
				<Collapsible.Root class="pt-3">
					<Collapsible.Trigger>
						{#snippet child({ props })}
							<Button variant="outline" size="sm" class="flex w-full justify-between" {...props}>
								<div>Datos de la póliza</div>
								<ChevronsUpDown class="h-4 w-4" />
								<span class="sr-only">Toggle</span>
							</Button>
						{/snippet}
					</Collapsible.Trigger>

					<Collapsible.Content>
						<div class="grid gap-4 pt-6">
							<table class="text-xs">
								<tbody>
									<tr>
										<th class="w-[40%] pr-2 text-right"> Compañía </th>
										<td>{poliza.compania}</td>
									</tr>
									<tr>
										<th class="w-[40%] pr-2 text-right"> Núm. Poliza </th>
										<td>{poliza.numeroPoliza}</td>
									</tr>
									<tr>
										<th class="w-[40%] pr-2 text-right"> Agente </th>
										<td>{poliza.agente}</td>
									</tr>
									<tr>
										<th class="w-[40%] pr-2 text-right"> Vehículo </th>
										<td>{poliza.vehiculo}</td>
									</tr>
									<tr>
										<th class="w-[40%] pr-2 text-right"> Asegurado </th>
										<td>{poliza.asegurado}</td>
									</tr>
									<tr>
										<th class="w-[40%] pr-2 text-right"> Status </th>
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
										<th class="w-[40%] pr-2 text-right"> Servicio </th>
										<td>{poliza.servicio}</td>
									</tr>
									<tr>
										<th class="w-[40%] pr-2 text-right"> Subramo </th>
										<td>{poliza.subRamo}</td>
									</tr>
									<tr>
										<th class="w-[40%] pr-2 text-right"> Modo de pago </th>
										<td>{poliza.modoPago}</td>
									</tr>
									<tr>
										<th class="w-[40%] pr-2 text-right"> Prima Neta </th>
										<td>$ {poliza.primaNeta}</td>
									</tr>
									<tr>
										<th class="w-[40%] pr-2 text-right"> Subtotal </th>
										<td>$ {poliza.subtotal}</td>
									</tr>
									<tr>
										<th class="w-[40%] pr-2 text-right"> IVA </th>
										<td>$ {poliza.iva}</td>
									</tr>
									<tr>
										<th class="w-[40%] pr-2 text-right"> Prima Total </th>
										<td>$ {poliza.total}</td>
									</tr>
									<tr>
										<th class="w-[40%] pr-2 text-right"> Costo expedición </th>
										<td>{poliza.costoExpedicion}</td>
									</tr>
									<tr>
										<th class="w-[40%] pr-2 text-right"> Inicio vigencia </th>
										<td>{poliza.vigenciaInicio}</td>
									</tr>
									<tr>
										<th class="w-[40%] pr-2 text-right"> Fin vigencia </th>
										<td>{poliza.vigenciaFin}</td>
									</tr>
								</tbody>
							</table>
						</div>
					</Collapsible.Content>
				</Collapsible.Root>

				<div class="flex flex-col">
					<Label for="comboAgente" class="mt-3 pb-1">Agente</Label>
					<ComboBox
						options={agentes}
						labelField="label"
						identifier="value"
						bind:selected={agenteId}
						id="comboAgente"
					/>
				</div>
				<div class="flex flex-col">
					<Label for="comboConducto" class="mt-3 pb-1">Conducto</Label>
					<ComboBox
						options={conductos}
						labelField="label"
						identifier="value"
						bind:selected={conductoId}
						id="comboConducto"
					/>
				</div>
				<!-- <div class="flex flex-col">
				<Label for="comision" class="mt-3 pb-1">Porcentaje de comisión sobre remesa</Label>
				<Input
					name="comision"
					id="comision"
					type="number"
					min="0"
					max="100"
					step="0.01"
					placeholder="Ejemplo: 0.80"
				/>
			</div> -->
				<input type="hidden" name="conductoId" value={conductoId} required />
				<input type="hidden" name="agenteId" value={agenteId} required />
				<input type="hidden" name="polizaId" value={poliza.id} required />
				<input type="hidden" name="numeroPoliza" value={poliza.numeroPoliza} required />
				<Sheet.Footer class="mt-6">
					<Button
						type="reset"
						variant="ghost"
						size="sm"
						id="cancel_button"
						onclick={() => (open = false)}>Cancelar</Button
					>

					<Button type="submit" size="sm">Guardar póliza</Button>
				</Sheet.Footer>
			</form>
		</ScrollArea>
	</Sheet.Content>
</Sheet.Root>
