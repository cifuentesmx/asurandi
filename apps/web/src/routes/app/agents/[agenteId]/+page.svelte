<script lang="ts">
	import type { ListAgentes } from '$api/agentes/listAgentes';
	import type { ListConductos } from '$api/conducto/listConductos';
	import { enhance } from '$app/forms';
	import { page } from '$app/state';
	import ComboBox from '$lib/components/combo-box.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { getToastState } from '$lib/toast-state.svelte';
	import type { ActionResult } from '@sveltejs/kit';
	import { X } from 'lucide-svelte';
	let agentes = $state<ListAgentes['agentes']>(page.data.agentes);
	const conductos = $state<ListConductos['conductos']>(page.data.conductos);
	const agente = $state(agentes.find((t) => t.id === Number(page.params.agenteId)));
	const toast = getToastState();
	let anaId = $state(agente?.anaId);
	let qualitasId = $state(agente?.qualitasId);
	let conductoId = $state(agente?.conductoId ?? null);
	let cmbValue = $state(0);
</script>

<div class="py-4 text-2xl">Agentes</div>
{#if agente}
	<form
		action="?/save"
		method="post"
		use:enhance={() => {
			return ({ result }: { result: ActionResult }) => {
				const { type } = result;
				if (type === 'success') {
					toast.add('Datos guardados correctamente', { type: 'success' });
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
				bind:value={agente.nombre}
			/>
			<Label class="mt-2" for="alias">Alias del agente</Label>
			<Input
				type="text"
				id="alias"
				name="alias"
				placeholder="Alias del agente"
				bind:value={agente.alias}
			/>
			<Label class="mt-2" for="email">Correo electrónico</Label>
			<Input type="email" id="email" name="email" placeholder="Email" bind:value={agente.email} />
			<Label class="mt-2" for="tel">Número de teléfono</Label>
			<Input type="phone" id="tel" name="tel" placeholder="Teléfono" bind:value={agente.phone} />
			<Label class="mt-2" for="qualitasId">Identificador Quálitas</Label>
			<Input
				type="text"
				id="qualitasId"
				name="qualitasId"
				placeholder="Identificador Quálitas"
				bind:value={qualitasId}
				disabled={!!agente.qualitasId}
			/>
			<Label class="mt-2" for="anaId">Identificador Ana Seguros</Label>
			<Input
				type="text"
				id="anaId"
				name="anaId"
				placeholder="Identificador Ana Seguros"
				bind:value={anaId}
				disabled={!!agente.anaId}
			/>
			<Label class="mt-2" for="anaId">Conducto por default</Label>
			<div class="flex">
				<ComboBox
					identifier="id"
					options={conductos}
					bind:value={cmbValue}
					bind:selected={conductoId}
				></ComboBox>
				<Button
					class="ml-1"
					variant="outline"
					size="icon"
					onclick={() => {
						// conductoId = null;
						cmbValue = 0;
					}}><X /></Button
				>
			</div>
		</div>
		<input type="hidden" name="id" bind:value={agente.id} />
		<input type="hidden" name="conductoId" bind:value={conductoId} />
		<input type="hidden" name="newAnaId" bind:value={anaId} />
		<input type="hidden" name="newQualitasId" bind:value={qualitasId} />
		<div class="mt-4">
			<Button href="/app/agents" variant="secondary" class="mr-4">Regresar</Button>
			<Button type="submit">Guardar</Button>
		</div>
	</form>
{/if}
