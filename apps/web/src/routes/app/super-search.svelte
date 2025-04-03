<script lang="ts">
	import Input from '$lib/components/ui/input/input.svelte';
	import { Search } from 'lucide-svelte';
</script>

<div class="bg-background/95 supports-[backdrop-filter]:bg-background/60 p-2 backdrop-blur">
	<form>
		<div class="relative">
			<Search class="text-muted-foreground absolute left-2 top-[50%] h-4 w-4 translate-y-[-50%]" />
			<Input placeholder="Buscar..." class="pl-8" />
		</div>
	</form>
</div>
