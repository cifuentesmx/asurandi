<script lang="ts">
	import Input from './ui/input/input.svelte';

	let { value = $bindable() } = $props();
</script>

<Input type="date" bind:value />
