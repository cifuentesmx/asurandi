<script lang="ts">
	import { page } from '$app/stores';
	import Card from '$lib/components/ui/card/card.svelte';
	import UserAuthForm from './user-auth-form.svelte';
</script>

<div class="flex min-h-screen flex-col lg:flex-row">
	<div class="brand-gradient flex flex-1 items-center justify-center bg-black p-4 sm:p-6 lg:p-8">
		<div class="max-w-[600px]">
			<Card class="max-w-[450px] p-6">
				<div class="flex flex-col justify-center space-y-6">
					<div class="flex flex-col space-y-2 text-center">
						<h1 class="text-primary text-2xl font-semibold tracking-tight">Iniciar sesión</h1>
						<p class="text-muted-foreground text-sm">
							Estás a un click de ser parte de una nueva era en la administración de tu empresa.
						</p>
					</div>
					{#if $page.data.sessionClosed || $page.data.expired}
						<div
							class="max-w-[300px] place-self-center rounded-sm border-2 border-red-200 bg-red-50 px-2 py-1 text-center text-sm text-red-400"
						>
							Se ha cerrado la sesión, por favor vuelve a introducir tus credenciales.
						</div>
					{/if}
					<UserAuthForm />
					<p class="text-muted-foreground px-4 text-center text-xs sm:px-6 sm:text-sm">
						Al hacer click, aceptas nuestros
						<a href="/terms" class="hover:text-primary underline underline-offset-4">
							Términos y condiciones
						</a>
						y nuestra
						<a href="/privacy" class="hover:text-primary underline underline-offset-4">
							política de privacidad
						</a>.
					</p>
				</div>
			</Card>
		</div>
	</div>
	<div class="bg-primary text-primary-foreground relative hidden lg:flex lg:flex-1">
		<div class="input-cover absolute inset-0 bg-cover bg-center"></div>
		<div class="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60"></div>
		<div class="relative z-20 flex w-full flex-col justify-between p-6 sm:p-8 lg:p-10">
			<div class="text-2xl font-medium sm:text-3xl">Asurandi</div>
			<blockquote class="space-y-2">
				<p class="text-base sm:text-lg">
					&ldquo;Hacemos soluciones inteligentes que funcionan para que tú puedas vender más&rdquo;
				</p>
			</blockquote>
		</div>
	</div>
</div>

<style>
	.input-cover {
		background-image: url(./login.webp);
		background-position: center;
		background-size: cover;
	}
	.brand-gradient {
		background: rgb(20, 9, 117);
		background: radial-gradient(rgb(43, 4, 105) 35%, rgb(5, 5, 49) 100%);
	}
</style>
