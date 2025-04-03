<script lang="ts">
	import { getSession } from '$lib/session.svelte';

	const session = getSession();
</script>

<div>Bienvenido de nuevo, {session.user?.displayName ?? session.user?.email}</div>
<pre>{JSON.stringify(session.accounts, undefined, 2)}</pre>
