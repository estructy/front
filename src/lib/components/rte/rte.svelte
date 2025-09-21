<script lang="ts">
	import { onMount } from 'svelte';
	import 'quill/dist/quill.snow.css';
	import './rte.css';
	import type Quill from 'quill';

	interface Props {
		content?: string;
		placeholder?: string;
		onChange?: (value: string) => void;
	}

	const {
		content = $bindable(''),
		placeholder = 'Start typing...',
		onChange = $bindable()
	}: Props = $props();

	let editorElement = $state<HTMLDivElement | string>('');
	let quill = $state<Quill>();

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
		quill.root.innerHTML = content;

		// Listen for changes
		quill.on('text-change', () => {
			if (onChange && quill) {
				onChange(quill.root.innerHTML);
			}
		});
	});
</script>

<div bind:this={editorElement}></div>
