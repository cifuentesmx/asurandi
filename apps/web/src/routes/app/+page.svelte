<script lang="ts">
	import { getSession } from '$lib/session.svelte';
	const session = getSession();
</script>

<div class="text-muted-foreground mt-6 text-sm">
	Bienvenido de nuevo, <strong>
		{session.authedUser?.displayName ?? session.authedUser?.email}!
	</strong>
</div>
