<script lang="ts">
	import { buttonVariants } from '$lib/components/ui/button';
	import * as Drawer from '$lib/components/ui/drawer';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';
	import { getPolizasStore } from '$lib/polizas-store.svelte';
	import { WalletCards } from 'lucide-svelte';
	const polizasStore = getPolizasStore();
	const poliza = polizasStore.onePoliza?.poliza;
</script>

{#if poliza}
	<Drawer.Root>
		<Drawer.Trigger>
			{#snippet child({ props })}
				<button {...props}><WalletCards class="h-6 w-6 " /></button>
			{/snippet}
		</Drawer.Trigger>
		<Drawer.Content>
			<Drawer.Header>
				<Drawer.Title>Endosos</Drawer.Title>
				<Drawer.Description>Póliza {poliza.numeroPoliza}</Drawer.Description>
			</Drawer.Header>
			<ScrollArea class=" mx-2 h-[50vh]">Lista de endosos</ScrollArea>
			<Drawer.Footer>
				<Drawer.Close class={buttonVariants({ variant: 'outline', size: 'sm' })}>
					Cerrar
				</Drawer.Close>
			</Drawer.Footer>
		</Drawer.Content>
	</Drawer.Root>
{/if}
