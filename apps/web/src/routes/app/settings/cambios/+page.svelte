<script lang="ts">
	const cambios = [
		{
			version: '0.7',
			fecha: 'Mayo 2025',
			cambios: [
				[
					'add',
					'Se puede editar el contacto de una póliza desde la aplicación móvil cuando se muestra la póliza individual.'
				],
				[
					'fix',
					'Se corrigieron errores en los datos de contactos provenientes de Qualitas, se agrega el cumpleaños cuando se pueda obtener.'
				],
				[
					'fix',
					'Se corrigió el error en el tiempo de espera del servidor cuando se sincronizan muchas pólizas en Qualitas.'
				]
			]
		},
		{
			version: '0.6',
			fecha: 'Abril 2025',
			cambios: [
				[
					'add',
					'Los agentes ahora reciben un reporte semanal o mensual de las renovaciones y cobranza de pólizas, dependiendo de la frecuencia configurada en el sistema.'
				],
				[
					'fix',
					'El usuario de siniestros ahora puede ver los siniestros y las pólizas correctamente, usando únicamente el rol de siniestros.'
				],
				[
					'fix',
					'Se corrigió el error en la sincronización de pólizas de flotilla cuando la póliza no está vigente o no existe.'
				],
				['add', 'Se implementó el registro de errores en la sincronización de pólizas.'],
				['add', 'Se agrega la funcionalidad del origen de las pólizas.'],
				[
					'upgrade',
					'Se implementó la sincronización de pólizas en paralelo, mejorando la velocidad de sincronización.'
				],
				['add', 'Se implementa el este control de cambios en la aplicación.']
			]
		},
		{
			version: '0.5',
			fecha: 'Marzo 2025',
			cambios: [
				['add', 'Separación de siniestros en seguimiento y consultas globales.'],
				[
					'fix',
					'Corrección de límite en la subida de archivos para el control de siniestros a 10MB por el total de archivos.'
				],
				['fix', 'Corrección de errores en filtrado de pólizas en emisiones y siniestros.'],
				['add', 'Se implementaron los módulos de renovaciones y cobranza.'],
				['fix', 'Reescritura del módulo de comisiones de agentes.']
			]
		},
		{
			version: '0.3',
			fecha: 'Enero 2025',
			cambios: [
				['add', 'Integración con portal de Qualitas.'],
				['fix', 'Corrección de errores en la sincronización.'],
				['fix', 'Corrección de errores en filtrado de pólizas.'],
				['add', 'Lanzamiento inicial de la aplicación 🚀.']
			]
		}
	] as const;
</script>

<div class="mx-auto max-w-4xl p-6">
	<h2 class="mb-6 text-2xl font-bold">Control de Cambios</h2>

	{#each cambios as release}
		<div class="my-6">
			<div class="rounded-lg">
				<h3 class="mb-4 text-lg font-semibold">Versión {release.version} - {release.fecha}</h3>
				<div class="text-muted-foreground layout my-2">
					{#each release.cambios as cambio}
						<div class="w-90 bg-muted mt-1 place-self-end self-start rounded p-1 text-xs font-bold">
							{cambio[0]}
						</div>
						<div class="flex items-center">{cambio[1]}</div>
					{/each}
				</div>
			</div>
		</div>
	{/each}
</div>

<style>
	.layout {
		display: grid;
		grid-template-columns: 50px 1fr;
		row-gap: 0.6rem;
		column-gap: 0.5rem;
	}
</style>
