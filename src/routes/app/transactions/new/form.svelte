<script lang="ts">
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { zod4Client as zodClient } from 'sveltekit-superforms/adapters';
	import CircleAlert from '@lucide/svelte/icons/circle-alert';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import {
		CalendarDate,
		DateFormatter,
		getLocalTimeZone,
		parseDate,
		today
	} from '@internationalized/date';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	import type { Infer, SuperValidated } from 'sveltekit-superforms';
	import type { CreateTransactionSchema } from './schema';
	import type { Categories } from '@/api/@types/categories';
	import type { DateValue } from '@internationalized/date';

	import { Button, buttonVariants } from '$lib/components/ui/button';
	import Editor from '$lib/components/rte/rte.svelte';
	import { Input } from '$lib/components/ui/input';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import { cn } from '$lib/utils.js';
	import { createTransactionSchema } from './schema';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as Select from '$lib/components/ui/select';

	interface Props {
		form: SuperValidated<Infer<CreateTransactionSchema>>;
		type: 'expense' | 'income';
		categories: Categories[];
	}

	let { form, type, categories }: Props = $props();

	let submitText = $state('Create Transaction');
	let clearFormContent = $state(false);
	const formSettings = superForm(form, {
		validators: zodClient(createTransactionSchema),
		validationMethod: 'onsubmit',
		onSubmit: () => {
			submitText = 'Creating...';
		},
		onResult: async (event) => {
			switch (event.result.type) {
				case 'success':
					clearFormContent = true;
					submitText = 'Created!';
					setTimeout(() => {
						submitText = 'Create Transaction';
					}, 2000);
					break;
				case 'failure':
					submitText = 'Try Again';
					break;
			}
		}
	});

	const { form: formData, enhance, submitting, message } = formSettings;

	let triggerContent = $derived(
		categories.find((c) => c.category_code === $formData.category_code)
	);
	let filterdCategories = $derived(categories.filter((c) => c.type === type));

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});
	let dateOpen = $state(false);
	let dateValue = $derived($formData.date ? parseDate($formData.date) : undefined);
	let datePlaceholder = $state<DateValue>(today(getLocalTimeZone()));

	onMount(() => {
		$formData.amount = '$0.00';
	});

	function handleGoBack() {
		goto('/app');
	}
</script>

<!--<SuperDebug data={formData} />-->

<form method="POST" class="flex flex-col gap-4" use:enhance>
	<Form.Field form={formSettings} name="date" class="flex flex-col">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Transaction Date <span class="text-red-500">*</span></Form.Label>
				<Popover.Root bind:open={dateOpen}>
					<Popover.Trigger
						{...props}
						class={cn(
							buttonVariants({ variant: 'outline' }),
							'justify-start pl-4 text-left font-normal md:w-1/2',
							!dateValue && 'text-muted-foreground'
						)}
					>
						{dateValue ? df.format(dateValue.toDate(getLocalTimeZone())) : 'Pick a date'}
						<CalendarIcon class="ml-auto size-4 opacity-50" />
					</Popover.Trigger>
					<Popover.Content class="w-auto p-0" side="top">
						<Calendar
							type="single"
							value={dateValue as DateValue}
							bind:placeholder={datePlaceholder}
							captionLayout="dropdown"
							minValue={new CalendarDate(2024, 1, 1)}
							maxValue={today(getLocalTimeZone())}
							calendarLabel="Transaction date"
							onValueChange={(v) => {
								if (v) {
									$formData.date = v.toString();
								} else {
									$formData.date = '';
								}

								dateOpen = false;
							}}
						/>
					</Popover.Content>
				</Popover.Root>
				<Form.Description
					>{type === 'expense'
						? 'The date you made the purchase or payment.'
						: 'The date you received the income.'}</Form.Description
				>
				<Form.FieldErrors />
				<input hidden value={$formData.date} name={props.name} />
			{/snippet}
		</Form.Control>
	</Form.Field>

	{#if !filterdCategories.length}
		<div class="rounded-md bg-yellow-50 p-4">
			<div class="flex">
				<div class="flex-shrink-0">
					<CircleAlert size="20" color="yellow" />
				</div>
				<div class="ml-3">
					<h3 class="text-sm font-medium text-yellow-800">No categories found</h3>
					<div class="mt-2 text-sm text-yellow-700">
						<p>
							You need to create a {type} category before creating a transaction.
							<a
								href="/app/categories/new?redirect=transactions/new&type={type}"
								class="font-medium text-indigo-600 underline hover:text-indigo-500"
								>Create a category</a
							>.
						</p>
					</div>
				</div>
			</div>
		</div>
	{:else}
		<Form.Field form={formSettings} name="category_code">
			<Form.Control>
				{#snippet children({ props })}
					<div class="grid gap-2">
						<Form.Label>Category <span class="text-red-500">*</span></Form.Label>
						<Select.Root
							{...props}
							type="single"
							name="category_code"
							bind:value={$formData.category_code}
						>
							<Select.Trigger class="w-full">
								{#if triggerContent?.name}
									<div class="flex items-center gap-2">
										<span
											class="h-4 w-4 rounded-full"
											style="background-color: {triggerContent.color}"
										></span>
										{triggerContent.name}
									</div>
								{:else}
									Select a category
								{/if}
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
				{/snippet}
			</Form.Control>
			<Form.Description class="flex flex-wrap items-center justify-between">
				{type === 'expense'
					? 'The category that best describes this expense.'
					: 'The category that best describes this income.'}
				<a
					href="/app/categories/new?redirect=transactions/new&type={type}"
					class="text-indigo-600 hover:underline">Create new category</a
				>
			</Form.Description>
			<Form.FieldErrors />
		</Form.Field>
	{/if}

	<Form.Field form={formSettings} name="amount">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Amount <span class="text-red-500">*</span></Form.Label>
				<Input
					{...props}
					placeholder="$0.00"
					bind:value={$formData.amount}
					required
					oninput={() => {
						let value = $formData.amount.replace(/[^0-9]/g, '');
						if (value.length === 0) {
							$formData.amount = '$0.00';
							return;
						}
						value = (parseInt(value) / 100).toFixed(2);
						$formData.amount = `$${value}`;
					}}
				/>
			{/snippet}
		</Form.Control>
		<Form.Description
			>{type === 'expense'
				? 'The total amount of the expense, including tax and fees.'
				: 'The total amount of income received.'}</Form.Description
		>
		<Form.FieldErrors />
	</Form.Field>

	<Form.Field form={formSettings} name="description">
		<Form.Control>
			{#snippet children({ props })}
				<Form.Label>Description</Form.Label>
				<Editor
					{...props}
					bind:content={$formData.description}
					bind:clearContent={clearFormContent}
					placeholder={type === 'expense'
						? 'Add any additional details about this expense...'
						: 'Add any additional details about this income...'}
				/>
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
