<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import Form from './form.svelte';

	let { data } = $props();
	let { form, categories } = data;
</script>

<div class="flex w-full flex-row justify-center p-4">
	<div class="w-full max-w-2xl rounded-lg">
		<Tabs.Root value="expense">
			<Tabs.List class="mb-4 grid w-full grid-cols-2">
				<Tabs.Trigger value="expense">Expense</Tabs.Trigger>
				<Tabs.Trigger value="income">Income</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="expense">
				<Form {form} {categories} type="expense" />
			</Tabs.Content>
			<Tabs.Content value="income">
				<Form {form} {categories} type="income" />
			</Tabs.Content>
		</Tabs.Root>
	</div>
</div>
