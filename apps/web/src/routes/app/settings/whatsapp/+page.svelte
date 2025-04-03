<script lang="ts">
	import { db } from '$lib/firebase/app.client';
	import { getSession } from '$lib/session.svelte';
	import type { QrConnection } from '$types/whats-baileys/providers';
	import { doc, onSnapshot, type Unsubscribe } from 'firebase/firestore';
	import { onDestroy } from 'svelte';
	import WhatsappStatus from './whatsapp-status.svelte';
	const session = getSession();

	let whatsapp: QrConnection | null = $state(null);
	let unsubs: Unsubscribe;
	$effect(() => {
		if (session.saasId) {
			const ref = doc(db, `/accounts/${session.saasId}/services/whatsapp`);
			unsubs = onSnapshot(ref, (docSnap) => {
				whatsapp = docSnap.data() as QrConnection;
			});
		}
	});

	onDestroy(() => {
		if (typeof unsubs === 'function') unsubs();
	});
</script>

<div class="px-4 py-12">
	{#if whatsapp?.status}
		<WhatsappStatus {whatsapp} />
	{/if}
</div>
