<script lang="ts">
	import { formatDate } from '$lib/formatters/formatDate';
	import type { QrConnection } from '@asurandi/types';

	const { whatsapp }: { whatsapp: QrConnection } = $props();
</script>

{#if whatsapp}
	<div class="text-sm">Estatus de conexión con Whatsapp:</div>
	<div class="text-muted-foreground text-sm">
		Última actualización: {formatDate(whatsapp.timestamp, {
			hour: '2-digit',
			minute: '2-digit'
		})}
	</div>
	{#if whatsapp.status === 'waiting-qr'}
		<div class="bg-muted my-6 max-w-md rounded p-4">
			<h3 class="text-muted-foreground text-lg">
				Escanea el código QR en tu aplicación de whatsapp en el teléfono que quieras conectar.
			</h3>
		</div>
		<div class="max-w-xs">
			<img src={whatsapp.base64} alt="Qr de conexión a Whatsapp" width="100%" />
		</div>
	{:else if whatsapp.status === 'closed'}
		<div class="bg-muted my-6 max-w-md rounded p-4">
			<div class="text-muted-foreground text-sm"></div>
			<h3 class="text-muted-foreground text-lg">Se ha cerrado la conexión a Whatsapp.</h3>
		</div>
	{:else if whatsapp.status === 'error'}
		<div class="bg-muted my-6 max-w-md rounded p-4">
			<div class="text-muted-foreground text-sm"></div>
			<h3 class="text-muted-foreground text-lg">Ha ocurrido un error en la conexión a whatsapp.</h3>
		</div>
	{:else if whatsapp.status === 'initializing'}
		<div class="bg-muted my-6 max-w-md rounded p-4">
			<div class="text-muted-foreground text-sm"></div>
			<h3 class="text-muted-foreground text-lg">Inicializando la conexión con Whatsapp.</h3>
		</div>
	{:else if whatsapp.status === 'preinit'}
		<div class="bg-muted my-6 max-w-md rounded p-4">
			<div class="text-muted-foreground text-sm"></div>
			<h3 class="text-muted-foreground text-lg">
				Preparando la conexión con el servidor de Whatsapp.
			</h3>
		</div>
	{:else if whatsapp.status === 'ready'}
		<div class="bg-muted my-6 max-w-md rounded p-4">
			<div class="text-muted-foreground text-sm"></div>
			<h3 class="text-muted-foreground text-lg">
				Conexión establecida correctamente con el servidor de Whatsapp.
			</h3>
		</div>
	{:else if whatsapp.status === 'preinit'}
		<div class="bg-muted my-6 max-w-md rounded p-4">
			<div class="text-muted-foreground text-sm"></div>
			<h3 class="text-muted-foreground text-lg">
				Preparando la conexión con el servidor de Whatsapp.
			</h3>
		</div>
	{:else}
		<div class="bg-muted my-6 max-w-md rounded p-4">
			<div class="text-muted-foreground text-sm"></div>
			<h3 class="text-muted-foreground text-lg">
				Error desconocido en la conexión con el servidor de Whatsapp.
			</h3>
		</div>
	{/if}
{/if}
