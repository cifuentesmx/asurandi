<script lang="ts">
	import { getToastState } from '$lib/toast-state.svelte';
	import { Upload, X } from 'lucide-svelte';

	interface FileInfo {
		file: File;
		name: string;
		size: number;
		type: string;
	}
	let {
		icon = true,
		id = 'files',
		name = 'files',
		accept = '*.*',
		multiple = true,
		maxSize = 5 * 1024 * 1024,
		files = $bindable<FileInfo[]>([]),
		maxDisplayFiles = 6
	} = $props();

	const toast = getToastState();
	let dragOver = $state(false);
	let errors: string[] = $state([]);

	function validateFile(file: File): boolean {
		if (file.size > maxSize) {
			errors.push(`El archivo ${file.name} excede el tamaño máximo permitido.`);
			return false;
		}
		const acceptedExtensions = accept.split(',').map((ext) => ext.trim().toLowerCase());
		const fileExtension = file.name.split('.').pop()?.toLowerCase();

		if (accept !== '*.*' && fileExtension && !acceptedExtensions.includes(`.${fileExtension}`)) {
			errors.push(`El archivo ${file.name} no tiene una extensión permitida.`);
			return false;
		}
		return true;
	}

	function handleFilesSelect(event: Event) {
		let fileList: FileList | null = null;
		errors = [];

		if (event.type === 'drop') {
			fileList = (event as DragEvent).dataTransfer?.files ?? null;
		} else if (event.target instanceof HTMLInputElement) {
			fileList = event.target.files;
		}

		if (fileList) {
			const validFiles = Array.from(fileList)
				.filter(validateFile)
				.map((file) => ({
					file,
					name: file.name,
					size: file.size,
					type: file.type
				}));

			files = multiple ? [...files, ...validFiles] : validFiles.slice(0, 1);
		}
		if (errors.length > 0) {
			toast.add('Error de archivos', {
				type: 'error',
				description: errors.join('\n ')
			});
		}
	}

	function handleDragOver(event: DragEvent) {
		event.preventDefault();
		dragOver = true;
	}

	function handleDragLeave() {
		dragOver = false;
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();
		dragOver = false;
		handleFilesSelect(event);
	}

	function removeFile(index: number) {
		files = files.filter((_, i) => i !== index);
	}
</script>

<div
	class="mx-auto w-full max-w-md"
	ondragover={handleDragOver}
	ondragleave={handleDragLeave}
	ondrop={handleDrop}
	role="button"
	tabindex="0"
	{id}
>
	<label
		class="flex w-full flex-col items-center justify-center rounded border-2 border-dashed px-2 py-3
      {dragOver ? 'border-blue-400' : 'border-muted'}
      cursor-pointer transition-colors duration-300 ease-in-out"
	>
		<input
			id="file_input"
			{name}
			type="file"
			{multiple}
			{accept}
			onchange={handleFilesSelect}
			class="hidden"
		/>
		{#if icon}
			<Upload size={24} class="text-muted-foreground my-2" />
		{/if}
		{#if dragOver}
			<p class="text-center text-blue-500">Suelta los archivos aquí ...</p>
		{:else}
			<p class="text-muted-foreground text-center text-sm">
				Arrastra y suelta algunos archivos aquí, <br />o haz clic para seleccionar archivos
			</p>
			{#if accept !== '*.*'}
				<p class="text-muted-foreground text-xs">
					(Se aceptarán archivos {accept})
				</p>
			{/if}
		{/if}
	</label>

	{#if files.length > 0}
		<div class="mt-4">
			{#if files.length > 0}
				{@const totalSize = files.reduce((acc, file) => acc + file.size, 0)}
				<h5 class="text-muted-foreground mb-2 text-sm font-semibold">
					{files.length} Archivo(s) seleccionado(s) - Total: {totalSize >= 1024 * 1024
						? `${(totalSize / (1024 * 1024)).toFixed(2)} MB`
						: totalSize >= 1024
							? `${(totalSize / 1024).toFixed(2)} KB`
							: `${totalSize} bytes`}
				</h5>
				<div class="file-container">
					{#each files.slice(0, maxDisplayFiles) as file, i}
						<div
							class="bg-muted space-between flex items-center rounded-md px-2 py-1"
							title={file.name}
						>
							<div class="flex-1 truncate text-xs">
								{file.name}
							</div>
							<button onclick={() => removeFile(i)} class="pl-1"
								><X size="16" color="#dc2626" /></button
							>
						</div>
					{/each}
				</div>
				{#if files.length > maxDisplayFiles}
					<div class="text-muted-foreground text-sm">
						y {files.length - maxDisplayFiles} archivo{files.length - maxDisplayFiles === 1
							? ''
							: 's'} más
					</div>
				{/if}
			{/if}
		</div>
	{/if}
</div>

<style>
	.file-container {
		display: grid;
		grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
		gap: 5px;
	}
</style>
