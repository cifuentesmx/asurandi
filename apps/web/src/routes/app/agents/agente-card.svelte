<script lang="ts">
	import type { ListAgentes } from '$api/agentes/listAgentes';
	import * as Card from '$lib/components/ui/card/index';

	let { agente = $bindable() } = $props<{
		agente: ListAgentes['agentes'][number];
	}>();
</script>

<a href="/app/agents/{agente.id}">
	<Card.Root class="h-[8rem]">
		<Card.Content>
			<div class="text-sm">
				<div>
					{agente.nombre}
				</div>
				<div class="text-muted-foreground">
					{agente.email}
				</div>
				<div class="text-muted-foreground mt-2 text-xs">
					{agente.alias}
				</div>
			</div>
		</Card.Content>
	</Card.Root>
</a>
