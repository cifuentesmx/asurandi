<script lang="ts">
	import type { getPolizaByNumero } from '$api/polizas/getPolizaByNumero';
	import SimpleTable from '$lib/components/simple-table/simple-table.svelte';
	import { buttonVariants } from '$lib/components/ui/button';
	import Button from '$lib/components/ui/button/button.svelte';
	import * as Drawer from '$lib/components/ui/drawer';

	type Coberturas = Awaited<ReturnType<typeof getPolizaByNumero>>['polizas'][number]['coberturas'];
	const { coberturas = $bindable() } = $props<{
		coberturas: Coberturas;
	}>();
</script>

<Drawer.Root>
	<Drawer.Trigger class={buttonVariants({ variant: 'outline', size: 'sm', class: 'mr-2' })}>
		Ver coberturas
	</Drawer.Trigger>

	<Drawer.Content class="p-6">
		<div class="pt-3">
			<SimpleTable
				data={coberturas}
				columns={[
					{ accessorKey: 'prima', header: 'Prima' },
					{ accessorKey: 'cobertura', header: 'Cobertura' },
					{ accessorKey: 'deducible', header: 'Deducible' },
					{ accessorKey: 'sumaAsegurada', header: 'Suma asegurada' }
				]}
				pageSize={12}
			/>
		</div>
		<Drawer.Footer>
			<Drawer.Close>
				<Button>Cerrar</Button>
			</Drawer.Close>
		</Drawer.Footer>
	</Drawer.Content>
</Drawer.Root>
