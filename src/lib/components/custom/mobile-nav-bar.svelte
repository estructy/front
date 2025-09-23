<script lang="ts">
	import Button from '../ui/button/button.svelte';
	import House from '@lucide/svelte/icons/house';
	import Coins from '@lucide/svelte/icons/coins';
	import Plus from '@lucide/svelte/icons/plus';
	import Settings from '@lucide/svelte/icons/settings';
	import NotebookText from '@lucide/svelte/icons/notebook-text';
	import { goto } from '$app/navigation';
	import { notificationsCount } from '@/stores/notifications.svelte';

	interface Props {
		newTransaction: () => void;
		notifications?: {
			home?: number;
			transactions?: number;
			categories?: number;
			settings?: number;
		};
	}

	const { newTransaction }: Props = $props();
</script>

<div class="fixed right-0 bottom-0 left-0 border-t border-gray-200 bg-white shadow-lg md:hidden">
	<div class="flex items-center justify-around px-4 py-2">
		<div class="relative">
			<Button
				variant="ghost"
				size="sm"
				class="flex h-auto flex-col items-center gap-1 px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
				onclick={() => goto('/app')}
			>
				<House size={20} />
				<span class="text-xs font-medium">Home</span>
			</Button>
			<!--{#if notifications?.home}-->
			<!--<span-->
			<!--class="absolute top-1 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white"-->
			<!-->-->
			<!--{notifications.home}-->
			<!--</span>-->
			<!--{/if}-->
		</div>

		<div class="relative">
			<Button
				variant="ghost"
				size="sm"
				class="flex h-auto flex-col items-center gap-1 px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
				onclick={() => goto('/app/transactions')}
			>
				<Coins size={20} />
				<span class="text-xs font-medium">Transactions</span>
			</Button>
			{#if notificationsCount.transactions > 0}
				<span
					class="absolute top-1 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white"
				>
					{notificationsCount.transactions}
				</span>
			{/if}
		</div>

		<Button
			class="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-indigo-700"
			onclick={newTransaction}
		>
			<Plus size={24} strokeWidth={2.5} />
		</Button>

		<div class="relative">
			<Button
				variant="ghost"
				size="sm"
				class="flex h-auto flex-col items-center gap-1 px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
				onclick={() => goto('/app/categories')}
			>
				<NotebookText size={20} />
				<span class="text-xs font-medium">Categories</span>
			</Button>
			{#if notificationsCount.categories > 0}
				<span
					class="absolute top-1 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white"
				>
					{notificationsCount.categories}
				</span>
			{/if}
		</div>

		<div class="relative">
			<Button
				variant="ghost"
				size="sm"
				class="flex h-auto flex-col items-center gap-1 px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
				onclick={() => goto('/app/settings')}
			>
				<Settings size={20} />
				<span class="text-xs font-medium">Settings</span>
			</Button>
			<!--{#if notifications?.settings}-->
			<!--<span-->
			<!--class="absolute top-1 right-2 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white"-->
			<!-->-->
			<!--{notifications.settings}-->
			<!--</span>-->
			<!--{/if}-->
		</div>
	</div>
</div>
