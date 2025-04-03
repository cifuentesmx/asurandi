<script lang="ts">
	import { Button } from '$lib/components/ui/button';

	let { id, filters } = $props<{
		id: string;
		filters: string;
	}>();
</script>

<Button href={`/app/comisiones/${id}/detalles?f=${filters}`} size="sm" variant="ghost">
	Ver detalles
</Button>
