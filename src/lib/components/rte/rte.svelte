<script lang="ts">
	import { onMount } from 'svelte';
	import 'quill/dist/quill.snow.css';
	import './rte.css';
	import type Quill from 'quill';
	import { Skeleton } from '$lib/components/ui/skeleton/index.js';

	interface Props {
		content?: string;
		placeholder?: string;
		clearContent?: boolean;
	}

	let {
		content = $bindable(),
		placeholder = 'Start typing...',
		clearContent = $bindable()
	}: Props = $props();

	let editorElement = $state<HTMLDivElement | string>('');
	let quill = $state<Quill>();

	$effect(() => {
		if (clearContent && quill) {
			quill.root.innerHTML = '';
			clearContent = false;
		}
	});

	onMount(async () => {
		const Quill = (await import('quill')).default;

		quill = new Quill(editorElement, {
			theme: 'snow',
			placeholder,
			modules: {
				toolbar: [
					[{ header: [1, 2, false] }],
					['bold', 'italic', 'underline'],
					['link', 'blockquote', 'code-block'],
					[{ list: 'ordered' }, { list: 'bullet' }]
				]
			}
		});

		// Set initial content
		if (quill && content) {
			quill.root.innerHTML = content;
		}

		// Listen for changes
		quill.on('text-change', () => {
			content = quill?.root.innerHTML;
		});
	});
</script>

<Skeleton class="h-36 w-full" hidden={!!quill} />
<div bind:this={editorElement}></div>
