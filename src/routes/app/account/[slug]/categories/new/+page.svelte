<script lang="ts">
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Separator } from '$lib/components/ui/separator';
	import * as Select from '$lib/components/ui/select';
	import { onMount } from 'svelte';
	import { superForm } from 'sveltekit-superforms';
	import { zod4Client as zodClient } from 'sveltekit-superforms/adapters';
	import { createCategorySchema } from './schema.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import { browser } from '$app/environment';
	import { replaceParams, routes } from '@/routes.js';

	let { data } = $props();

	let submitText = $state('Create Category');

	const form = superForm(data.form, {
		validators: zodClient(createCategorySchema),
		validationMethod: 'onsubmit',
		onSubmit: () => {
			submitText = 'Creating...';
		},
		onResult: async (event) => {
			switch (event.result.type) {
				case 'success':
					if (redirectValue) {
						await goto(
							replaceParams(routes.base, { accountId: data.account.currentAccountId }) +
								`/${redirectValue}`
						);
					}
					submitText = 'Created!';
					setTimeout(() => {
						submitText = 'Create Category';
					}, 2000);
					break;
				case 'failure':
					submitText = 'Try Again';
					break;
			}
		}
	});
	const { form: formData, enhance, submitting, message } = form;

	let redirectValue = $state('');
	let filterdCategories = $derived(data.categories.filter((c) => c.type === $formData.type));
	let triggerContent = $derived(
		data.categories.find((c) => c.category_code === $formData.parent_code)?.name ||
			'Select a parent category'
	);
	let typeTriggerContent = $derived($formData.type === 'expense' ? 'Expense' : 'Income');

	function handleGoBack() {
		if (redirectValue) {
			goto(
				replaceParams(routes.base, { accountId: data.account.currentAccountId }) +
					`/${redirectValue}`
			);
		} else if (browser) {
			window.history.back();
		} else {
			goto('/app');
		}
	}

	onMount(() => {
		let params = new URLSearchParams(window.location.search);
		if (
			params.get('redirect') &&
			!(params.get('redirect')?.startsWith('http') || params.get('redirect')?.startsWith('//'))
		) {
			redirectValue = params.get('redirect') || '';
		}
		if (params.get('type') === 'income' || params.get('type') === 'expense') {
			$formData.type = params.get('type') as 'income' | 'expense';
		}
	});
</script>

<div class="flex w-full flex-row justify-center p-4">
	<div class="w-full max-w-2xl rounded-lg">
		<h1 class="mb-6 text-2xl font-semibold text-gray-900">New Category</h1>

		<form method="POST" class="grid gap-4" use:enhance>
			<Form.Field {form} name="name">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Name <span class="text-red-500">*</span></Form.Label>
						<Input {...props} bind:value={$formData.name} placeholder="Food" />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="color">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Color <span class="text-red-500">*</span></Form.Label>
						<Input {...props} bind:value={$formData.color} type="color" />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="type">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Type <span class="text-red-500">*</span></Form.Label>
						<Select.Root {...props} type="single" name="type" bind:value={$formData.type}>
							<Select.Trigger class="w-full">
								{typeTriggerContent}
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="expense">Expense</Select.Item>
								<Select.Item value="income">Income</Select.Item>
							</Select.Content>
						</Select.Root>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<Form.Field {form} name="parent_code">
				<Form.Control>
					{#snippet children({ props })}
						<Form.Label>Parent Category</Form.Label>
						<Select.Root
							{...props}
							type="single"
							name="parent_code"
							bind:value={$formData.parent_code}
						>
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
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			</Form.Field>

			<div class="mt-8 flex flex-wrap items-center justify-end gap-4">
				{#if message}
					<p class="text-sm text-red-600">{$message}</p>
				{/if}

				<Button
					onclick={handleGoBack}
					type="button"
					class="bg-gray-200 text-gray-800 hover:bg-gray-300 focus-visible:outline-gray-400"
					>Go Back</Button
				>
				<Form.Button
					type="submit"
					class="bg-indigo-600 hover:bg-indigo-500 focus-visible:outline-indigo-600"
					disabled={$submitting}
				>
					{submitText}
				</Form.Button>
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
