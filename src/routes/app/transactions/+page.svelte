<script lang="ts">
	import { clearNotifications } from '@/stores/notifications.svelte';
	import { onMount } from 'svelte';
	import DataTable from './data-table.svelte';
	import { columns } from './columns.js';

	let { data } = $props();

	onMount(() => {
		clearNotifications('transactions');
	});
</script>

<DataTable data={data.transactions} {columns} />
