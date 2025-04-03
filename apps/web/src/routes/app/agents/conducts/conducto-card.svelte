<script lang="ts">
	import type { ListConductos } from '$api/conducto/listConductos';

	import * as Card from '$lib/components/ui/card/index';

	let { conducto = $bindable() } = $props<{
		conducto: ListConductos['conductos'][number];
	}>();
</script>

<a href="/app/agents/conducts/{conducto.id}">
	<Card.Root class="h-[8rem]">
		<Card.Content>
			<div class="text-sm">
				<div>
					{conducto.nombre}
				</div>
				<div class="text-muted-foreground">
					{conducto.email}
				</div>
				<div class="text-muted-foreground mt-2 text-xs">
					{conducto.alias}
				</div>
			</div>
		</Card.Content>
	</Card.Root>
</a>
