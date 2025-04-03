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
	import { getToastState } from '$lib/toast-state.svelte';
	import { enhance } from '$app/forms';

	const toast = getToastState();

	let email = $state('');
	const session = getSession();

	let isLoading = $state(false);
</script>

<div
	class="m-auto max-w-[350px]"
	in:fly={{ x: 200, duration: 300, delay: 300 }}
	out:fly={{ x: -200, duration: 300 }}
>
	<CardFormsHeading />
	<form
		method="POST"
		use:enhance={async ({ cancel }) => {
			isLoading = true;

			await apiRequest('/auth/email', {
				method: 'post',
				body: JSON.stringify({ email })
			})
				.then(async (r) => {
					try {
						const response = await r.json();
						if (r.status === 400) {
							toast.add(response.message, { type: 'error' });
						}
						if (r.status === 200) {
							session.setUserEmail(response.email, response.hasPassword);
						}
						if (r.status === 422) {
							toast.add('El correo electrónico ingresado no es válido.', {
								type: 'error'
							});
						}
					} catch {
						toast.add('No se ha podido completar la petición.', {
							type: 'error',
							description: 'No se ha podido procesar la respuesta del servidor'
						});
					}
				})
				.catch((error) => {
					toast.add('Error de comunicación con el servidor', {
						type: 'error',
						description: 'No se completó la petición correctamente.'
					});
				})
				.finally(() => {
					isLoading = false;
				});

			cancel();
		}}
	>
		<div>
			<p class="text-sm">Vamos a iniciar sesión, empecemos con tu correo electrónico</p>
			<div class={cn('my-6 grid gap-6')}>
				<div class="grid gap-6">
					<div class="grid gap-1">
						<Label for="email" class="sr-only">Correo electrónico</Label>
						<Input
							id="email"
							placeholder="e.g. tunombre@ejemplo.com"
							type="email"
							autocapitalize="none"
							required
							autocomplete="email"
							autocorrect="off"
							disabled={isLoading}
							bind:value={email}
						/>
					</div>
					<p class="text-muted-foreground text-xs">
						Si ya tienes una cuenta con tu oficina de emisión, podrás ingresar tu contraseña más
						adelante.
					</p>
					<Button disabled={isLoading} type="submit">
						{#if isLoading}
							<X class="mr-2 h-4 w-4 animate-spin" />
						{/if}
						Iniciar con correo electrónico.
					</Button>
				</div>
			</div>
		</div>
	</form>
</div>
