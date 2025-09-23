<script lang="ts">
	import { clearNotifications } from '@/stores/notifications.svelte';
	import { onMount } from 'svelte';

	onMount(() => {
		clearNotifications('transactions');
	});
</script>

<p>transactions list page</p>
