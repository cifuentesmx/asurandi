<script lang="ts">
	import { enhance } from '$app/forms';
	import { Search } from 'lucide-svelte';
	import { getSearchStore } from '$lib/search-store.svelte';
	import { AppError } from '$lib/AppError';
	let focused = $state(false);
	const search = getSearchStore();
</script>

{#if search.searchFn}
	<form
		id="super-search-form"
		method="post"
		use:enhance={async ({ cancel }) => {
			if (typeof search.searchFn === 'function') {
				search.status = 'loading';
				try {
					await search.searchFn(search.value);
					search.status = 'idle';
					search.value = '';
				} catch (error) {
					const msg =
						error instanceof Error || error instanceof AppError
							? error.message
							: 'Error desconocido al procesar la búsqueda';
					search.status = new Error(msg);
				}
				cancel();
			}
			cancel();
		}}
	>
		<div
			class={`bg-muted flex items-center rounded-lg px-3 py-2 ${focused ? 'outline outline-violet-700' : ''} ${search.disabled ? 'bg-gray-200' : ''}`}
		>
			<input
				type="search"
				placeholder="Buscar..."
				class={`bg-muted w-full flex-1 focus:border-blue-500 focus:outline-none  ${search.disabled ? 'bg-gray-200' : ''}`}
				disabled={search.disabled || search.status === 'loading'}
				bind:value={search.value}
				onfocus={() => (focused = true)}
				onblur={() => (focused = false)}
				onkeyup={(e) => {
					if (e.key === 'Enter') {
						e.preventDefault(); // Prevent the default form submission
						const button = document.getElementById('super-search-form') as
							| HTMLButtonElement
							| undefined;
						if (button) button.click();
					}
				}}
				required
			/>
			<button
				id="button"
				type="submit"
				disabled={search.disabled || search.status === 'loading'}
				class="ml-2"
			>
				<Search class="text-muted-foreground" size="20" />
			</button>
		</div>
	</form>
{/if}
