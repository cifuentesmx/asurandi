<script lang="ts">
	import { loginWithGoogle } from './loginWithGoogle';
</script>

<div class="grid gap-6">
	<div class="relative">
		<div class="absolute inset-0 flex items-center">
			<span class="w-full border-t"></span>
		</div>
		<div class="relative flex justify-center text-xs uppercase">
			<span class="bg-background text-muted-foreground px-2"> Comenzar </span>
		</div>
	</div>
	<div class="flex items-center justify-center">
		<button
			class="flex gap-2 rounded-lg border border-slate-200 px-4 py-2 text-slate-700 transition duration-150 hover:border-slate-400 hover:text-slate-900 hover:shadow dark:border-slate-700 dark:text-slate-200 dark:hover:border-slate-500 dark:hover:text-slate-300"
			on:click={loginWithGoogle}
		>
			<img class="h-6 w-6" src="/img/google-color.svg" loading="lazy" alt="google logo" />
			<span>Inicia sesión con Google</span>
		</button>
	</div>
</div>
