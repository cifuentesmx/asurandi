<script lang="ts">
	import Loader from '$lib/components/ui/loader.svelte';
	import { getSession } from '$lib/session.svelte';
	import SendPassword from './login.svelte';
	import NewUser from './new-user.svelte';
	import SetEmail from './set-email.svelte';
	import { goto } from '$app/navigation';
	const session = getSession();
	$effect(() => {
		if (session.user) goto('/app');
	});
</script>

{#if session && session.state}
	<div class="layout mx-12 min-h-screen">
		{#if session.state === 'unknown-user'}
			<SetEmail />
		{:else if session.state === 'email-known'}
			<SendPassword />
		{:else if session.state === 'new-user'}
			<NewUser />
		{/if}
	</div>
{:else}
	<Loader />
{/if}

<style>
	.layout {
		grid-template-rows: 5rem 1fr;
		place-content: center;
	}
</style>
