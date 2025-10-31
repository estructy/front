<script lang="ts">
	import Button from '@/components/ui/button/button.svelte';
	import * as Card from '$lib/components/ui/card/index.js';
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import { cn } from '@/utils';

	const { data } = $props();
	let filter: 'all' | 'income' | 'expense' = $state('all');
	let filteredCategories = $derived(getFilteredCategories());

	function formatCurrency(amount: number) {
		return new Intl.NumberFormat('pt-BR', {
			style: 'currency',
			currency: 'BRL'
		}).format(amount);
	}

	function getFilteredCategories() {
		if (filter === 'all') {
			return data.categories;
		}
		return data.categories.filter((category) => category.type === filter);
	}
</script>

<div class="my-4 space-y-4">
	<div class="flex items-center justify-between">
		<div>
			<h2 class="text-2xl font-bold tracking-tight">Categories</h2>
			<p class="text-sm text-muted-foreground">Breakdown by category</p>
		</div>
		<div class="flex gap-2">
			<Button
				variant={filter === 'all' ? 'default' : 'outline'}
				size="sm"
				onclick={() => (filter = 'all')}
			>
				All
			</Button>
			<Button
				variant={filter === 'income' ? 'default' : 'outline'}
				size="sm"
				onclick={() => (filter = 'income')}
			>
				Income
			</Button>
			<Button
				variant={filter === 'expense' ? 'default' : 'outline'}
				size="sm"
				onclick={() => (filter = 'expense')}
			>
				Expenses
			</Button>
		</div>
	</div>

	<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
		{#each filteredCategories as category}
			<Card.Root>
				<Card.Header class="flex flex-row items-center justify-between space-y-0 pb-2">
					<Card.Title class="text-sm font-medium">
						{category.name}
					</Card.Title>
					{#if category.type === 'income'}
						<ArrowUpRight class="inline h-4 w-4 text-green-500" />
					{:else if category.type === 'expense'}
						<ArrowUpRight class="inline h-4 w-4 rotate-180 text-red-500" />
					{/if}
				</Card.Header>
				<Card.Content>
					<div class="space-y-1">
						<div class={cn('text-2xl font-bold')} style="color: {category.color}">
							{formatCurrency(category.total_spent / 100)}
						</div>

						<!--Budget-->
						<!--<div class="flex items-center gap-2 text-xs">-->
						<!--<span class="text-muted-foreground">{percentage}% of total</span>-->
						<!--<span class={cn("flex items-center gap-1", isPositiveTrend ? "text-chart-4" : "text-chart-1")}>-->
						<!--{isPositiveTrend ? <TrendingUp class="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}-->
						<!--{trend}-->
						<!--</span>-->
						<!--</div>-->
						<!--</div>-->
						<!--<div class="w-full bg-secondary rounded-full h-2">-->
						<!--<div-->
						<!--class={cn("h-2 rounded-full transition-all", `bg-${color}`)}-->
						<!--style={{ width: `${Math.min(percentage, 100)}%` }}-->
						<!--/>-->
						<!--</div>			-->
					</div></Card.Content
				>
			</Card.Root>
		{/each}
	</div>
</div>
