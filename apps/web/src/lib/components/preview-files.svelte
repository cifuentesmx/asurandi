<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import Autoplay from 'embla-carousel-autoplay';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { _upsert } from '$lib/helpers/_upsert';
	import * as Carousel from '$lib/components/ui/carousel/index.js';
	import { Download } from 'lucide-svelte';
	import type { PublicFileUrl } from '@asurandi/types';
	let {
		open = $bindable(false),
		files = $bindable([]),
		showTrigger = true
	}: {
		files: PublicFileUrl[];
		open?: boolean;
		showTrigger?: boolean;
	} = $props();
	files = files.filter((f) => !f.error);
	function isImage(mimeType: string): boolean {
		const imageTypes = [
			'image/jpeg',
			'image/png',
			'image/gif',
			'image/bmp',
			'image/tiff',
			'image/webp',
			'image/svg+xml'
		];
		return imageTypes.includes(mimeType);
	}
</script>

{#if files && files.length > 0}
	<Dialog.Root bind:open>
		{#if showTrigger}
			<div class="max-w[80px] max-h[45px] h-[45px] w-[80px]">
				<Dialog.Trigger>
					{#snippet child({ props })}
						<Carousel.Root
							{...props}
							opts={{
								align: 'center',
								loop: true
							}}
							plugins={[
								Autoplay({
									delay: 3500
								})
							]}
							showButtons={false}
							style="cursor: pointer"
						>
							<Carousel.Content>
								{#each files as file}
									<Carousel.Item class="flex items-center justify-center">
										{#if isImage(file.mimeType ?? '')}
											<img src={file.url} alt={file.fileName} class="h-[35px]" />
										{:else}
											<div class="h-[35px] truncate">
												{file.fileName}
											</div>
										{/if}
									</Carousel.Item>
								{/each}
							</Carousel.Content>
							<Carousel.Previous />
							<Carousel.Next />
						</Carousel.Root>
					{/snippet}
				</Dialog.Trigger>
			</div>
		{/if}
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>Archivos</Dialog.Title>
				<Dialog.Description>Ver archivos adjuntos</Dialog.Description>
			</Dialog.Header>
			<div class="mx-8">
				<Carousel.Root
					opts={{
						loop: true,
						align: 'center'
					}}
				>
					<Carousel.Content>
						{#each files as file}
							<Carousel.Item>
								<div class="flex h-[50dvh] h-full items-center justify-center">
									<a href={file.url} title={`descargar ${file.fileName}`} target="_blank">
										{#if isImage(file.mimeType ?? '')}
											<img
												src={file.url}
												alt={file.fileName}
												class="h-auto w-full max-w-[40dvh] object-contain"
												style="max-height: 100%; max-width: 100%;"
											/>
										{:else}
											<div class="flex w-[35dvh] items-center justify-center">
												<div class="w-[30dvh]">
													<div class="my-6 flex justify-center">
														<Download size={72} />
													</div>

													<div class="text-center">{file.fileName}</div>
												</div>
											</div>
										{/if}
									</a>
								</div>
							</Carousel.Item>
						{/each}
					</Carousel.Content>
					<Carousel.Previous />
					<Carousel.Next />
				</Carousel.Root>
			</div>

			<Dialog.Footer>
				<Button variant="outline" size="sm" onclick={() => (open = false)}>Cerrar</Button>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
{/if}
