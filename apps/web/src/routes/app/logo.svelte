<script>
	import { goto } from '$app/navigation';

	export let isCollapsed = false;
</script>

<div
	data-collapsed={isCollapsed}
	class="group flex flex-col gap-4 py-3 data-[collapsed=true]:mx-auto"
>
	<nav
		class="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2"
	>
		<button
			class="flex self-center"
			onclick={() => {
				goto('/');
			}}
			tabindex="0"
		>
			<div class={`${isCollapsed ? 'ml-2' : ''}`}>
				<svg
					preserveAspectRatio="xMidYMid meet"
					data-bbox="0.023 0.003 55.955 54.997"
					viewBox="0.023 0.003 55.955 54.997"
					xmlns="http://www.w3.org/2000/svg"
					data-type="color"
					role="presentation"
					aria-hidden="true"
					height="30px"
				>
					<g>
						<defs>
							<clipPath id="69347ac0-e89e-4510-a20f-f5a27b0cdcc3_comp-ljor2s8a">
								<path d="M56 0v55H0V0h56z"></path>
							</clipPath>
						</defs>
						<g clip-path="url(#69347ac0-e89e-4510-a20f-f5a27b0cdcc3_comp-ljor2s8a)">
							<path
								d="M26.8.04c-3.33.15-6.77.92-9.87 2.23-1.01.44-1.99.94-2.95 1.47-3.23 1.88-6.2 4.5-8.42 7.44C1.4 16.68-.55 23.74.17 30.66c.15 1.42.5 3.38.62 3.47.17.13 2.06.58 3.15.74 1.06.17 1.55.21 2.57.24 2.81.08 5.37-.28 7.97-1.14 4.3-1.41 7.28-3.68 8.75-6.65.29-.6.61-1.51.75-2.11l.07-.34.42.41c1.84 1.81 3.44 3.86 4.75 6.08 1.71 2.95 3.13 6.82 3.92 10.68.8 3.88.99 7.54.63 11.94-.05.53-.07.98-.05 1.01.04.04.43-.05.49-.11.02-.03.1-.55.18-1.16.86-6.87.07-13.35-2.39-19.75-1.2-3.13-2.92-6.29-4.64-8.53a21.008 21.008 0 0 0-4.47-4.26c-1.15-.76-2.31-1.5-3.48-2.23l-2.92-1.85v-.18c0-.1-.03-1.24-.07-2.54-.03-.79-.05-1.58-.06-2.36.01 0 2.43-.17 5.37-.38 2.94-.2 5.37-.37 5.39-.39.01-.02-.05-.25-.16-.52-.48-1.16-.72-2.4-.71-3.66 0-1.01.14-1.96.41-2.88.15-.5.2-.44.43.45.34 1.42.94 2.76 1.75 3.97.34.52 1.04 1.38 1.44 1.79l.28.29.53.1c1.1.21 2.15.64 3.09 1.27.33.22.5.31.52.28.2-.32.74-1.63.99-2.44.65-2.07.96-4.63.84-6.96-.03-.53-.03-.98-.03-.99.05-.05.7.77 1.17 1.47 2.19 3.29 2.51 7.37.86 11.02l-.21.48.12.11c.07.05.23.19.36.31.6.55 1.18 1.12 1.73 1.72 2.41 2.78 3.84 6.45 4.24 10.86.1 1.07.14 3.53.07 4.77-.17 3.25-.88 7.56-1.74 10.54-1.15 4-2.92 7.44-5.29 10.34-.15.18-.25.34-.25.36.04.09 2.26-.87 3.59-1.57 3.53-1.85 6.78-4.6 9.23-7.85 2.07-2.74 3.69-6.01 4.58-9.24a27.702 27.702 0 0 0-.72-17.1C52.05 12.25 47.62 7 42.17 3.85 38.16 1.52 33.75.24 29.07.04c-1.08-.05-1.12-.05-2.27 0Z"
								fill="#825EB7"
								data-color="1"
							></path>
						</g>
					</g>
				</svg>
			</div>
			{#if !isCollapsed}
				<h1 class="pl-3 text-xl">Asurandi</h1>
			{/if}
		</button>
	</nav>
</div>
