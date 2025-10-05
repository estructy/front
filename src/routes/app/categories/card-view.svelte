<script lang="ts">
	import type { Category } from '$lib/api/categories/types';
	import * as Card from '$lib/components/ui/card/index.js';
	import { Button } from '$lib/components/ui/button/index.js';
	import Circle from '@lucide/svelte/icons/circle';

	interface Props {
		type: 'income' | 'expense';
		categories: Category[];
	}

	let { type, categories }: Props = $props();
</script>

<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
	<Card.Root class="place-content-center border-2 border-dashed border-muted hover:border-primary">
		<Card.Content class="flex  items-center justify-center">
			<Button variant="outline" size="sm" href={`/app/categories/new?type=${type}`}>
				New Category
			</Button>
		</Card.Content>
	</Card.Root>
	{#each categories as category}
		<Card.Root>
			<Card.Header>
				<Card.Title class="flex flex-row items-center gap-2">
					<Circle fill={category.color} size={12} />
					{category.name}
				</Card.Title>
			</Card.Header>
			<Card.Content>
				<p class="text-sm text-muted-foreground">{category.category_code}</p>
			</Card.Content>
			<Card.Footer>
				<Button
					variant="outline"
					size="sm"
					href={`/app/transactions?type=${type}&categories=${category.category_code}`}
					class="w-full"
				>
					View transactions
				</Button>
			</Card.Footer>
		</Card.Root>
	{/each}
</div>
