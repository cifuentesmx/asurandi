<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import { getSession } from '$lib/session.svelte';

	const session = getSession();
</script>

<section id="pricing" class="container mx-auto px-4 pt-12 pb-6 text-center md:pt-20 md:pb-6">
	<h2 class="mb-8 text-2xl font-bold md:mb-12 md:text-3xl">Planes simples y transparentes</h2>
	<div class="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3 max-w-[1060px] m-auto">
		<div class="border-gray-100 border-2 px-4 pt-12 pb-6 rounded-xl">
			<h3 class="mb-2 text-xl font-semibold">Básico</h3>
			<p class="mb-4 text-3xl font-bold">$29/mes</p>
			<ul class="mb-6 space-y-2">
				<li>Hasta 100 clientes</li>
				<li>Automatización básica</li>
				<li>Soporte por email</li>
			</ul>
			<Button variant="outline" class="w-full">Elegir plan</Button>
		</div>
		<div class="border-gray-100 border-2 px-4 pt-12 pb-6 rounded-xl">
			<h3 class="mb-2 text-xl font-semibold">Pro</h3>
			<p class="mb-4 text-3xl font-bold">$79/mes</p>
			<ul class="mb-6 space-y-2">
				<li>Hasta 1000 clientes</li>
				<li>Automatización avanzada</li>
				<li>Soporte prioritario</li>
			</ul>
			<Button class="w-full">Elegir plan</Button>
		</div>
		<div class="border-gray-100 border-2 px-4 pt-12 pb-6 rounded-xl">
			<h3 class="mb-2 text-xl font-semibold">Empresarial</h3>
			<p class="mb-4 text-3xl font-bold">Personalizado</p>
			<ul class="mb-6 space-y-2">
				<li>Clientes ilimitados</li>
				<li>Características personalizadas</li>
				<li>Gerente de cuenta dedicado</li>
			</ul>
			<Button variant="outline" class="w-full">Contactar ventas</Button>
		</div>
	</div>
	<div class="m-auto border-gray-100 border-2 px-8 py-8 rounded-xl max-w-[1060px] mt-6">
		<h3 class="text-xl">Unirte a agencia existente:</h3>
		<p class="text-sm py-2">
			Deberás pedirle al administrador de tu agencia que te agrege con el siguiente correo
			electrónico:
		</p>
		<div class="bg-muted p-2 rounded-sm m-auto max-w-[400px]">{session.authedUser?.email}</div>
	</div>
</section>

<style>
</style>
