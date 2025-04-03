<script lang="ts">
	import { page } from '$app/stores';
	import type { QualitasAccountCredential } from '$types/qualitas/account-credential';
	import AddQualitasAccount from './add-qualitas-account.svelte';
	import ViewQualitasAccount from './view-qualitas-account.svelte';
	let qualitasAccounts = $state<QualitasAccountCredential[]>($page.data.qualitasAccounts ?? []);
</script>

<h3 class="mt-3 text-xl">Cuentas de Quálitas</h3>
<AddQualitasAccount bind:accounts={qualitasAccounts} />
<div class="grid-qualitas gap-4 pt-4">
	{#each qualitasAccounts as account}
		<ViewQualitasAccount bind:accounts={qualitasAccounts} {account} />
	{/each}
</div>

<style>
	.grid-qualitas {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
	}
</style>
