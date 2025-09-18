<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { Separator } from '$lib/components/ui/separator';
	import * as Select from '$lib/components/ui/select';
	import { onMount } from 'svelte';

	let { data } = $props();

	let value = $state('');
	let color = $state('#000000');
	let redirectValue = $state('');
	let typeValue = $state('expense');
	let filterdCategories = $derived(data.categories.filter((c) => c.type === typeValue));

	const triggerContent = $derived(
		data.categories.find((c) => c.category_code === value)?.name || 'Select a parent category'
	);

	const typeTriggerContent = $derived(typeValue === 'income' ? 'Income' : 'Expense');

	function handleGoBack() {
		if (redirectValue) {
			goto(`/app/${redirectValue}`);
		} else {
			goto('/app');
		}
	}

	onMount(() => {
		let params = new URLSearchParams(window.location.search);
		if (params.get('redirect')) {
			redirectValue = params.get('redirect') || '';
		}
	});
</script>

<div class="flex w-full flex-row justify-center p-4">
	<div class="w-full max-w-2xl rounded-lg">
		<h1 class="mb-6 text-2xl font-semibold text-gray-900">New Category</h1>
		<form method="POST" class="grid gap-4">
			<div class="grid gap-2">
				<Label for="name">Name <span class="text-red-500">*</span></Label>
				<Input id="name" name="name" placeholder="e.g. Groceries" required />
			</div>
			<div class="grid gap-2">
				<Label for="color">Color <span class="text-red-500">*</span></Label>
				<Input id="color" name="color" type="color" required bind:value={color} />
			</div>
			<div class="grid gap-2">
				<Label for="type">Type <span class="text-red-500">*</span></Label>
				<Select.Root type="single" name="type" bind:value={typeValue}>
					<Select.Trigger class="w-full">
						{typeTriggerContent}
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="income">Income</Select.Item>
						<Select.Item value="expense">Expense</Select.Item>
					</Select.Content>
				</Select.Root>
			</div>
			<div class="grid gap-2">
				<Label for="parentCategoryId">Parent Category</Label>
				<Select.Root type="single" name="parentCategoryId" bind:value>
					<Select.Trigger class="w-full">
						{triggerContent}
					</Select.Trigger>
					<Select.Content>
						<Select.Item value="null">None</Select.Item>
						{#each filterdCategories as category}
							<div class="flex items-center gap-2">
								<span class="h-4 w-4 rounded-full" style="background-color: {category.color}"
								></span>
								<Select.Item value={category.category_code}>{category.name}</Select.Item>
							</div>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>
			<div class="mt-8 flex justify-end gap-4">
				<Button
					onclick={handleGoBack}
					type="button"
					class="bg-gray-200 text-gray-800 hover:bg-gray-300 focus-visible:outline-gray-400"
					>Go Back</Button
				>
				<Button
					type="submit"
					class="bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-indigo-600"
					>Create Category</Button
				>
			</div>
		</form>
		{#if redirectValue}
			<Separator class="my-8" />
			<p class="text-center text-sm text-muted-foreground">
				After creating the category, you will be redirected to the new transaction page.
			</p>
		{/if}
	</div>
</div>
