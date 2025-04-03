<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { cn } from '$lib/utils.js';
	import X from 'lucide-svelte/icons/x';
	import { getSession } from '$lib/session.svelte';
	import { fly } from 'svelte/transition';
	import CardFormsHeading from './card-forms-heading.svelte';
	import { enhance } from '$app/forms';
	import { auth } from '$lib/firebase';
	import { signInWithEmailAndPassword } from 'firebase/auth';
	import { FirebaseError } from 'firebase/app';
	import { getToastState } from '$lib/toast-state.svelte';
	const toast = getToastState();

	let password = $state('');
	const session = getSession();

	let isLoading = $state(false);
</script>

<div
	class="m-auto -mt-12 max-w-[350px]"
	in:fly={{ x: 200, duration: 300, delay: 300 }}
	out:fly={{ x: -200, duration: 300 }}
>
	<CardFormsHeading />
	<form
		method="post"
		use:enhance={async ({ cancel }) => {
			try {
				if (session.email) await signInWithEmailAndPassword(auth, session.email, password);
			} catch (error) {
				let msg = 'Error desconocido al iniciar sesión. Inténtelo nuevamente.';
				if (error instanceof FirebaseError) {
					switch (error.code) {
						case 'auth/wrong-password':
							msg = 'La contraseña es incorrecta, inténtelo nuevamente.';
							break;

						default:
							break;
					}
				}
				toast.add(msg, { type: 'error' });
			}
			cancel();
		}}
	>
		<p class="text-sm">Ya casi estamos ahí, sólo falta confirmar tu identidad.</p>
		<p class="text-sm">email: {session.email}.</p>

		<div class={cn('my-6 grid gap-6')}>
			<div class="grid gap-6">
				<div class="grid gap-1">
					<Label for="email" class="sr-only">Contraseña</Label>
					<Input
						id="password"
						placeholder="Escribe tu contraseña"
						type="password"
						disabled={isLoading}
						bind:value={password}
					/>
				</div>
				<Button disabled={isLoading} type="submit">
					{#if isLoading}
						<X class="mr-2 h-4 w-4 animate-spin" />
					{/if}
					Iniciar sesión.
				</Button>
				<Button
					disabled={isLoading}
					onclick={() => {
						session.setUserEmail(null, false);
					}}
					variant="link"
				>
					Iniciar sesión con otra cuenta.
				</Button>
			</div>
		</div>
	</form>
</div>
