<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Ellipsis } from 'lucide-svelte';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import type { PolizaStatus } from '$types/polizas/poliza-estatus';
	import type { CoreRow } from '@tanstack/table-core';
	import type { ListPolizasSinComisiones } from '$api/polizas/listPolizasSinComisiones';
	import AsignarAgenteConducto from '../polizas/asignar-agente-conducto.svelte';
	import type { ListConductos } from '$api/conducto/listConductos';
	import type { ListAgentes } from '$api/agentes/listAgentes';
	import VerPoliza from '../polizas/ver-poliza.svelte';
	import PolizaStatusChangeConfirmation from '../polizas/poliza-status-change-confirmation.svelte';

	let { poliza, conductos, agentes } = $props<{
		poliza: CoreRow<ListPolizasSinComisiones['data'][number]>['original'];
		conductos: ListConductos['conductos'];
		agentes: ListAgentes['agentes'];
	}>();
	let newStatus = $state<PolizaStatus>();
	let openComisiones = $state<boolean>(false);
	let openStatus = $state<boolean>(false);

	const statuses: PolizaStatus[] = [
		'Emitida',
		'Pagada',
		'Por vencer',
		'Cancelada',
		'No renovada',
		'Renovada'
	];
</script>

{#if poliza}
	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			{#snippet child({ props })}
				<Button {...props} variant="ghost" size="icon" class="relative size-8 p-0">
					<span class="sr-only">Abrir menu</span>
					<Ellipsis class="size-4" />
				</Button>
			{/snippet}
		</DropdownMenu.Trigger>
		<DropdownMenu.Content class="w-56">
			<DropdownMenu.Label>Acciones</DropdownMenu.Label>
			<DropdownMenu.Separator />
			<DropdownMenu.Group>
				<VerPoliza {poliza} />
				<DropdownMenu.Sub>
					<DropdownMenu.SubTrigger>
						<span>Cambiar estado</span>
					</DropdownMenu.SubTrigger>
					<DropdownMenu.SubContent>
						{#each statuses as status}
							{#if status !== poliza.polizaEstatus}
								<DropdownMenu.Item
									onclick={() => {
										newStatus = status;
										openStatus = true;
									}}
								>
									<span>{status}</span>
								</DropdownMenu.Item>
							{/if}
						{/each}
					</DropdownMenu.SubContent>
				</DropdownMenu.Sub>
				<DropdownMenu.Item
					onclick={() => {
						openComisiones = true;
					}}
				>
					<span>Asignar conducto</span>
				</DropdownMenu.Item>
			</DropdownMenu.Group>
		</DropdownMenu.Content>
	</DropdownMenu.Root>

	<AsignarAgenteConducto
		{poliza}
		bind:open={openComisiones}
		showTrigger={false}
		{conductos}
		{agentes}
	/>
	{#if newStatus}
		<PolizaStatusChangeConfirmation {poliza} {newStatus} bind:open={openStatus} />
	{/if}
{/if}
