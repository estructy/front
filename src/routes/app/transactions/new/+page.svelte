<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';

	let { data } = $props();

	let value = $state('');

	const triggerContent = $derived(data.categories.find((c) => c.id === value));
</script>

<div class="flex w-full flex-row justify-center p-4">
	<div class="w-full max-w-2xl rounded-lg">
		<h1 class="mb-6 text-2xl font-semibold text-gray-900">New Transaction</h1>
		<form method="POST" class="grid gap-4">
			<div class="grid gap-2">
				<Label for="date">Date</Label>
				<Input id="date" name="date" type="date" required />
			</div>
			<div class="grid gap-2">
				<Label for="amount">Amount</Label>
				<Input id="amount" name="amount" type="number" placeholder="$0.00" required step="0.01" />
			</div>
			<div class="grid gap-2">
				<Label for="categoryId">Category</Label>
				<Select.Root type="single" name="categoryId" bind:value>
					<Select.Trigger class="w-full">
						{#if triggerContent}
							<div class="flex items-center gap-2">
								<span class="h-4 w-4 rounded-full" style="background-color: {triggerContent.color}"
								></span>
								{triggerContent.name}
							</div>
						{:else}
							Select a category
						{/if}
					</Select.Trigger>
					<Select.Content>
						{#each data.categories as category}
							<Select.Item value={category.id}>
								<div class="flex items-center gap-2">
									<span class="h-4 w-4 rounded-full" style="background-color: {category.color}"
									></span>
									{category.name}
								</div>
							</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
				<div class="text-right text-sm">
					<a
						href="/app/categories/new?redirect=transactions/new"
						class="text-indigo-600 hover:underline">Create new category</a
					>
				</div>
			</div>
			<div class="grid gap-2">
				<Label for="description">Description</Label>
				<Input id="description" name="description" placeholder="e.g. Groceries" />
			</div>
			<div class="mt-8 flex justify-end">
				<Button
					type="submit"
					class="bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-indigo-600"
					>Create Transaction</Button
				>
			</div>
		</form>
	</div>
</div>
