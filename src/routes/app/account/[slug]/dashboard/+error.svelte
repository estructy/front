<script lang="ts">
	import { page } from '$app/state';
	const emojis = {
		// TODO add the rest!
		420: '🫠',
		500: '💥'
	};
</script>

<div
	class="flex min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 text-center md:p-10"
>
	<h1>{page.status} {page.error.message}</h1>
	<span style="font-size: 10em">
		{emojis[page.status] ?? emojis[500]}
	</span>
</div>
