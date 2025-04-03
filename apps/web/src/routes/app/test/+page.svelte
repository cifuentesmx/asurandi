<script lang="ts">
	import { enhance } from '$app/forms';
	import Button from '$lib/components/ui/button/button.svelte';
	import FileUploader from '$lib/components/file-uploader.svelte';
</script>

<form method="POST" action="?/test" enctype="multipart/form-data" use:enhance>
	<FileUploader name="files" />

	<Button type="submit">Upload</Button>
</form>
