<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { getSession } from '$lib/session.svelte';
	const session = getSession();

	let verifyTimeOut: string | number | NodeJS.Timeout | undefined;
	verifyTimeOut = setTimeout(() => {
		goto(`/login?expired=1&redirect=${$page.data?.redirect ?? '/app'}`);
	}, 600);
	$effect(() => {
		if (session.authedUser?.uid) {
			if (verifyTimeOut) clearTimeout(verifyTimeOut);
			goto(`${$page.data?.redirect ?? '/app'}`);
		}
	});
</script>

<p>Sólo un momento, estamos verificando tu cuenta...</p>
