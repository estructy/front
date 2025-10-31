<script lang="ts">
	import { Button } from '$lib/components/ui/button/index.js';
	import SquarePen from '@lucide/svelte/icons/square-pen';
	let { id }: { id: string } = $props();
</script>

<Button
	variant="ghost"
	size="icon"
	class="relative size-8 p-0"
	onclick={() => {
		console.log(id);
	}}
>
	<span class="sr-only">Edit</span>
	<SquarePen />
</Button>
