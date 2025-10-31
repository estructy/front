<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs/index.js';
	import CardView from './card-view.svelte';

	let { data } = $props();

	let incomeCategories = data.categories.filter((cat) => cat.type === 'income');
	let expenseCategories = data.categories.filter((cat) => cat.type === 'expense');
</script>

<div class="flex w-full flex-row justify-center p-4">
	<div class="w-full max-w-2xl rounded-lg">
		<Tabs.Root value="expense">
			<Tabs.List class="mb-4 grid w-full grid-cols-2">
				<Tabs.Trigger value="expense">Expense</Tabs.Trigger>
				<Tabs.Trigger value="income">Income</Tabs.Trigger>
			</Tabs.List>
			<Tabs.Content value="expense">
				<CardView categories={expenseCategories} type="expense" accountId={data.accountId} />
			</Tabs.Content>
			<Tabs.Content value="income">
				<CardView categories={incomeCategories} type="income" accountId={data.accountId} />
			</Tabs.Content>
		</Tabs.Root>
	</div>
</div>
