<script lang="ts">
	import Button from '$lib/components/ui/button/button.svelte';
	import Card from '$lib/components/ui/card/card.svelte';
	import { getSession } from '$lib/session.svelte';
	import { Menu } from 'lucide-svelte';

	let isMenuOpen = false;

	function toggleMenu() {
		isMenuOpen = !isMenuOpen;
	}

	const session = getSession();
</script>

<svelte:head>
	<title>Asurandi - Automatiza tus tareas de seguros</title>
</svelte:head>

<main class="bg-background text-foreground">
	<header class="container mx-auto px-4 py-6">
		<div class="flex items-center justify-between">
			<div class="text-2xl font-bold">Asurandi</div>
			<nav class="hidden md:block">
				<ul class="flex space-x-4">
					<li><a href="#features" class="hover:underline">Características</a></li>
					<li><a href="#testimonials" class="hover:underline">Testimonios</a></li>
					<li><a href="#pricing" class="hover:underline">Precios</a></li>
				</ul>
			</nav>
			{#if !session.authedUser}
				<Button href="/login">iniciar sesión</Button>
			{:else}
				<Button href="/app">Ir al dashboard</Button>
			{/if}

			<button on:click={toggleMenu} class="md:hidden">
				<Menu size={24} />
			</button>
		</div>
		{#if isMenuOpen}
			<nav class="mt-4 md:hidden">
				<ul class="flex flex-col space-y-2">
					<li><a href="#features" class="hover:underline">Características</a></li>
					<li><a href="#testimonials" class="hover:underline">Testimonios</a></li>
					<li><a href="#pricing" class="hover:underline">Precios</a></li>
					<li><Button class="w-full">Iniciar sesión</Button></li>
				</ul>
			</nav>
		{/if}
	</header>

	<section class="hero container mx-auto px-4 py-12 text-center md:py-20">
		<h1 class="mb-6 text-4xl font-bold md:text-5xl">Automatiza tus tareas de seguros</h1>
		<p class="mb-8 text-lg md:text-xl">
			Simplifica tu trabajo, aumenta tus ventas y mejora la satisfacción de tus clientes con nuestro
			CRM especializado para agentes de seguros.
		</p>
		<Button size="lg">Prueba gratis por 14 días</Button>
	</section>

	<section id="features" class="container mx-auto px-4 py-12 md:py-20">
		<h2 class="mb-8 text-center text-2xl font-bold md:mb-12 md:text-3xl">
			Características principales
		</h2>
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
			<Card>
				<h3 class="mb-2 text-xl font-semibold">Automatización de tareas</h3>
				<p>
					Automatiza tareas repetitivas y ahorra tiempo para enfocarte en lo que realmente importa.
				</p>
			</Card>
			<Card>
				<h3 class="mb-2 text-xl font-semibold">Seguimiento de clientes</h3>
				<p>Mantén un registro detallado de tus clientes y sus pólizas en un solo lugar.</p>
			</Card>
			<Card>
				<h3 class="mb-2 text-xl font-semibold">Análisis y reportes</h3>
				<p>
					Obtén insights valiosos con nuestros reportes detallados y paneles de control
					personalizables.
				</p>
			</Card>
		</div>
	</section>

	<section id="testimonials" class="bg-muted py-12 md:py-20">
		<div class="container mx-auto px-4">
			<h2 class="mb-8 text-center text-2xl font-bold md:mb-12 md:text-3xl">
				Lo que dicen nuestros clientes
			</h2>
			<div class="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8">
				<Card>
					<p class="mb-4">
						"Asurandi ha revolucionado la forma en que manejo mi negocio de seguros. ¡No puedo
						imaginar trabajar sin él!"
					</p>
					<p class="font-semibold">- María Rodríguez, Agente independiente</p>
				</Card>
				<Card>
					<p class="mb-4">
						"Desde que empezamos a usar Asurandi, nuestras ventas han aumentado un 30% y nuestros
						clientes están más satisfechos que nunca."
					</p>
					<p class="font-semibold">- Juan Pérez, Gerente de agencia</p>
				</Card>
			</div>
		</div>
	</section>

	<section id="pricing" class="container mx-auto px-4 py-12 text-center md:py-20">
		<h2 class="mb-8 text-2xl font-bold md:mb-12 md:text-3xl">Planes simples y transparentes</h2>
		<div class="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
			<Card>
				<h3 class="mb-2 text-xl font-semibold">Básico</h3>
				<p class="mb-4 text-3xl font-bold">$29/mes</p>
				<ul class="mb-6 space-y-2">
					<li>Hasta 100 clientes</li>
					<li>Automatización básica</li>
					<li>Soporte por email</li>
				</ul>
				<Button variant="outline" class="w-full">Elegir plan</Button>
			</Card>
			<Card>
				<h3 class="mb-2 text-xl font-semibold">Pro</h3>
				<p class="mb-4 text-3xl font-bold">$79/mes</p>
				<ul class="mb-6 space-y-2">
					<li>Hasta 1000 clientes</li>
					<li>Automatización avanzada</li>
					<li>Soporte prioritario</li>
				</ul>
				<Button class="w-full">Elegir plan</Button>
			</Card>
			<Card>
				<h3 class="mb-2 text-xl font-semibold">Empresarial</h3>
				<p class="mb-4 text-3xl font-bold">Personalizado</p>
				<ul class="mb-6 space-y-2">
					<li>Clientes ilimitados</li>
					<li>Características personalizadas</li>
					<li>Gerente de cuenta dedicado</li>
				</ul>
				<Button variant="outline" class="w-full">Contactar ventas</Button>
			</Card>
		</div>
	</section>

	<footer class="bg-muted py-8 md:py-12">
		<div class="container mx-auto px-4 text-center">
			<p>&copy; 2023 Asurandi. Todos los derechos reservados.</p>
		</div>
	</footer>
</main>
