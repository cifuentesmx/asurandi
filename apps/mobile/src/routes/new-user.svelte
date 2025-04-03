<script lang="ts">
	import { apiRequest } from '$lib/ApiRequest.svelte';
	import Button from '$lib/components/ui/button/button.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import Label from '$lib/components/ui/label/label.svelte';
	import { cn } from '$lib/utils.js';
	import X from 'lucide-svelte/icons/x';
	import { getSession } from '$lib/session.svelte';
	import { fly } from 'svelte/transition';
	import CardFormsHeading from './card-forms-heading.svelte';
	import { Checkbox } from '$lib/components/ui/checkbox/index.js';
	import { enhance } from '$app/forms';
	import { signInWithEmailAndPassword } from 'firebase/auth';
	import { auth } from '$lib/firebase';

	let password = $state('');
	let passwordConfirm = $state('');
	let name = $state('');
	let accept = $state(false);
	const session = getSession();

	let isLoading = $state(false);
	const submit = async () => {};
</script>

<div
	class="m-auto max-w-[350px]"
	in:fly={{ x: 200, duration: 300, delay: 300 }}
	out:fly={{ x: -200, duration: 300 }}
>
	<CardFormsHeading />
	<div>
		<form
			method="post"
			use:enhance={async ({ cancel }) => {
				isLoading = true;

				await apiRequest('/auth/provider', {
					method: 'post',
					body: JSON.stringify({ password, name, email: session.email })
				})
					.then(async (r) => {
						try {
							const response = (await r.json()) as {
								ok?: boolean;
							};
							if (r.status === 400) {
								console.warn(response);
							}
							if (r.status === 200) {
								if (session.email) signInWithEmailAndPassword(auth, session.email, password);
							}
						} catch (error) {
							console.error(error);
						}
					})
					.catch((e) => console.error(e))
					.finally(() => {
						isLoading = false;
					});
				cancel();
			}}
		>
			<p class="text-sm">Bienvenido, sólo falta crear las credenciales para tu usuario.</p>
			<p class="text-sm">email: {session.email}.</p>

			<div class={cn('my-6 grid gap-2')}>
				<div class="grid gap-2">
					<div class="grid gap-1">
						<Label for="name" class="text-muted-foreground text-xs">Nombre</Label>
						<Input
							id="text"
							placeholder="Escribe tu nombre"
							type="text"
							required
							autocomplete="name"
							disabled={isLoading}
							bind:value={name}
						/>
					</div>

					<div class="grid gap-1">
						<Label for="email" class="text-muted-foreground text-xs">Contraseña</Label>
						<Input
							id="password"
							placeholder="Escribe tu contraseña"
							type="password"
							required
							disabled={isLoading}
							bind:value={password}
						/>
					</div>

					<div class="grid gap-1">
						<Label for="email" class="text-muted-foreground text-xs">Confirmar contraseña</Label>
						<Input
							id="passwordConfirm"
							name="passwordConfirm"
							placeholder="Confirma tu contraseña"
							required
							type="password"
							disabled={isLoading}
							bind:value={passwordConfirm}
						/>
					</div>
					<div class="items-top mt-2 flex space-x-2">
						<Checkbox id="terms1" bind:checked={accept} required />
						<div class="grid gap-1.5 leading-none">
							<Label
								for="terms1"
								class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
							>
								Aceptar términos.
							</Label>
							<p class="text-muted-foreground text-sm">
								Cuando creas tu cuenta como agente de seguros aceptas nuestros términos y
								condiciones de uso así como la política de privacidad de Asurandi.
							</p>
						</div>
					</div>

					<Button disabled={isLoading || !accept} type="submit" class="mt-4">
						{#if isLoading}
							<X class="mr-2 h-4 w-4 animate-spin" />
						{/if}
						Crear cuenta.
					</Button>
					<Button
						disabled={isLoading}
						type="reset"
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
</div>
