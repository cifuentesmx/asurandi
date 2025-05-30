<script lang="ts">
	import { page } from '$app/state';
	import type { AnasegurosAccountCredential, QualitasAccountCredential } from '@asurandi/types';
	import AddAccount from './add-account.svelte';
	import ViewQualitasAccount from './view-account.svelte';
	let qualitasAccounts: QualitasAccountCredential[] = $derived(page.data?.qualitasAccounts ?? []);
	let anasegurosAccounts: AnasegurosAccountCredential[] = $derived(
		page.data?.anasegurosAccounts ?? []
	);
</script>

{#if page.data?.status === 'success'}
	<h3 class="mt-6 text-xl">Cuentas de Qualitas</h3>
	<AddAccount bind:accounts={qualitasAccounts} company="qualitas" companyName="Quálitas" />
	<div class="layout gap-4 py-4">
		{#each qualitasAccounts as account}
			<ViewQualitasAccount
				bind:accounts={qualitasAccounts}
				{account}
				company="qualitas"
				companyName="Quálitas"
			/>
		{/each}
	</div>
	<h3 class="mt-6 text-xl">Cuentas de Ana Seguros</h3>
	<AddAccount bind:accounts={anasegurosAccounts} company="anaseguros" companyName="Ana Seguros" />
	<div class="layout gap-4 py-4">
		{#each anasegurosAccounts as account}
			<ViewQualitasAccount
				bind:accounts={anasegurosAccounts}
				{account}
				company="anaseguros"
				companyName="Ana Seguros"
			/>
		{/each}
	</div>
{/if}

<style>
	.layout {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
	}
</style>
