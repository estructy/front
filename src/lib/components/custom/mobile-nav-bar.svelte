<script lang="ts">
	import Button from '../ui/button/button.svelte';
	import House from '@lucide/svelte/icons/house';
	import Coins from '@lucide/svelte/icons/coins';
	import Plus from '@lucide/svelte/icons/plus';
	import Settings from '@lucide/svelte/icons/settings';
	import NotebookText from '@lucide/svelte/icons/notebook-text';

	interface Props {
		newTransaction: () => void;
	}

	const { newTransaction }: Props = $props();
</script>

<div class="fixed right-0 bottom-0 left-0 border-t border-gray-200 bg-white shadow-lg md:hidden">
	<div class="flex items-center justify-around px-4 py-2">
		<Button
			variant="ghost"
			size="sm"
			class="flex h-auto flex-col items-center gap-1 px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
		>
			<House size={20} />
			<span class="text-xs font-medium">Home</span>
		</Button>

		<Button
			variant="ghost"
			size="sm"
			class="flex h-auto flex-col items-center gap-1 px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
		>
			<Coins size={20} />
			<span class="text-xs font-medium">Transactions</span>
		</Button>

		<Button
			class="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg transition-all duration-200 hover:scale-105 hover:bg-indigo-700"
			onclick={newTransaction}
		>
			<Plus size={24} strokeWidth={2.5} />
		</Button>

		<Button
			variant="ghost"
			size="sm"
			class="flex h-auto flex-col items-center gap-1 px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
		>
			<NotebookText size={20} />
			<span class="text-xs font-medium">Categories</span>
		</Button>

		<Button
			variant="ghost"
			size="sm"
			class="flex h-auto flex-col items-center gap-1 px-3 py-2 text-gray-600 hover:bg-gray-50 hover:text-indigo-600"
		>
			<Settings size={20} />
			<span class="text-xs font-medium">Settings</span>
		</Button>
	</div>
</div>
