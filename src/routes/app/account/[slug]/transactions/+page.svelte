<script lang="ts">
	import { clearNotifications } from '@/stores/notifications.svelte';
	import { onMount } from 'svelte';
	import DataTable from './data-table.svelte';
	import { columns } from './columns.js';
	import type { Category } from '@/api/@types/transaction';

	let { data } = $props();

	let categories = $derived.by(() => {
		const categoriesSet = new Map<string, Category>();
		data.transactions.forEach((transaction) => {
			if (transaction.category) {
				categoriesSet.set(transaction.category.category_code, transaction.category);
			}
		});

		return Array.from(categoriesSet.values()).sort((a, b) => a.name.localeCompare(b.name));
	});

	onMount(() => {
		clearNotifications('transactions');
	});
</script>

<DataTable data={data.transactions} search={data.search} {columns} {categories} />
