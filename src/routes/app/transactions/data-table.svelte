<script lang="ts" generics="TData, TValue">
	import { createSvelteTable, FlexRender } from '$lib/components/ui/data-table/index.js';
	import * as Table from '$lib/components/ui/table/index.js';
	import Button, { buttonVariants } from '@/components/ui/button/button.svelte';
	import Input from '@/components/ui/input/input.svelte';
	import {
		type ColumnDef,
		type ColumnFiltersState,
		type PaginationState,
		type RowSelectionState,
		type SortingState,
		type VisibilityState,
		getCoreRowModel,
		getFilteredRowModel,
		getPaginationRowModel,
		getSortedRowModel
	} from '@tanstack/table-core';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import Settings2 from '@lucide/svelte/icons/settings-2';
	import ArrowUpRight from '@lucide/svelte/icons/arrow-up-right';
	import ArrowDownLeft from '@lucide/svelte/icons/arrow-down-left';
	import Separator from '@/components/ui/separator/separator.svelte';
	import CirclePlus from '@lucide/svelte/icons/circle-plus';
	import Badge from '@/components/ui/badge/badge.svelte';
	import X from '@lucide/svelte/icons/x';
	import type { Category } from '@/api/@types/transaction';
	import {
		CalendarDate,
		DateFormatter,
		getLocalTimeZone,
		type DateValue
	} from '@internationalized/date';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import { cn } from '@/utils';
	import { RangeCalendar } from '$lib/components/ui/range-calendar/index.js';
	import type { DateRange } from 'bits-ui';
	import { onMount } from 'svelte';
	import Card from '@/components/ui/card/card.svelte';
	import { list } from '@/api/transactions/list';
	import { pushState } from '$app/navigation';

	type DataTableProps<TData, TValue> = {
		columns: ColumnDef<TData, TValue>[];
		data: TData[];
		categories: Category[];
		date: {
			from: string;
			to: string;
		};
	};

	let { columns, data, categories, date }: DataTableProps<TData, TValue> = $props();

	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });
	let sorting = $state<SortingState>([]);
	let columnFilters = $state<ColumnFiltersState>([]);
	let columnVisibility = $state<VisibilityState>({});
	let rowSelection = $state<RowSelectionState>({});
	let columnTypeSelection = $state<string>('');
	let categorySelection = $state<Category[]>([]);
	let isMobile = $state<boolean>(false);

	let columnTypes = ['expense', 'income'];

	const table = createSvelteTable({
		get data() {
			return data;
		},
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onPaginationChange: (updater) => {
			if (typeof updater === 'function') {
				pagination = updater(pagination);
			} else {
				pagination = updater;
			}
		},
		onSortingChange: (updater) => {
			if (typeof updater === 'function') {
				sorting = updater(sorting);
			} else {
				sorting = updater;
			}
		},
		onColumnFiltersChange: (updater) => {
			if (typeof updater === 'function') {
				columnFilters = updater(columnFilters);
			} else {
				columnFilters = updater;
			}
		},
		onColumnVisibilityChange: (updater) => {
			if (typeof updater === 'function') {
				columnVisibility = updater(columnVisibility);
			} else {
				columnVisibility = updater;
			}
		},
		onRowSelectionChange: (updater) => {
			if (typeof updater === 'function') {
				rowSelection = updater(rowSelection);
			} else {
				rowSelection = updater;
			}
		},
		state: {
			get pagination() {
				return pagination;
			},
			get sorting() {
				return sorting;
			},
			get columnFilters() {
				return columnFilters;
			},
			get columnVisibility() {
				return columnVisibility;
			},
			get rowSelection() {
				return rowSelection;
			}
		}
	});

	const df = new DateFormatter('en-US', {
		dateStyle: 'medium'
	});

	function getInitialDate() {
		const { from, to } = date;
		const [fromYear, fromMonth, fromDay] = from.split('-').map(Number);
		const [toYear, toMonth, toDay] = to.split('-').map(Number);

		return {
			start: new CalendarDate(fromYear, fromMonth, fromDay),
			end: new CalendarDate(toYear, toMonth, toDay)
		};
	}

	let value: DateRange = $state(getInitialDate());

	let startValue: DateValue | undefined = $state(undefined);

	function checkMobile() {
		isMobile = window.matchMedia('(max-width: 768px)').matches; // md breakpoint from Tailwind
	}

	function setMaxCategorySelection() {
		if (isMobile) return 2;
		return 3;
	}

	function formatAmount(amount: number) {
		return new Intl.NumberFormat('pt-BR', {
			style: 'currency',
			currency: 'BRL'
		}).format(amount);
	}

	let hasError = $state(false);
	let loading = $state(false);
	async function loadTransactions() {
		try {
			loading = true;
			const response = await list({
				from: value.start?.toDate(getLocalTimeZone()).toISOString().split('T')[0],
				to: value.end?.toDate(getLocalTimeZone()).toISOString().split('T')[0]
			});
			data = response as TData[];
		} catch (error) {
			hasError = true;
		} finally {
			loading = false;
		}
	}

	function updateURLSearchParams() {
		const params = new URLSearchParams(window.location.search);
		params.delete('from');
		params.delete('to');

		if (value.start) {
			params.set('from', value.start.toString());
		}
		if (value.end) {
			params.set('to', value.end.toString());
		}

		const newRelativePathQuery = `${window.location.pathname}?${params.toString()}`;

		pushState(newRelativePathQuery, {});
	}

	onMount(() => {
		checkMobile();
		window.addEventListener('resize', checkMobile);
		value = getInitialDate();

		return () => window.removeEventListener('resize', checkMobile);
	});

	let prevCalendarStartDate = $state('');
	let prevCalendarEndDate = $state('');
</script>

<div>
	<div class="flex flex-col justify-between gap-4 py-4 md:flex-row md:flex-wrap">
		<Popover.Root
			onOpenChange={(isOpen) => {
				if (isOpen) {
					prevCalendarStartDate = value.start
						? value.start.toString()
						: startValue
							? startValue.toString()
							: '';
					prevCalendarEndDate = value.end ? value.end.toString() : '';
					return;
				}

				// If the popover is being closed and no date is selected, revert to previous date
				if (!value.start) {
					if (prevCalendarStartDate) {
						const [y, m, d] = prevCalendarStartDate.split('-').map(Number);
						value.start = new CalendarDate(y, m, d);
					} else if (startValue) {
						value.start = startValue as CalendarDate;
					}
				}
				if (!value.end && prevCalendarEndDate) {
					const [y, m, d] = prevCalendarEndDate.split('-').map(Number);
					value.end = new CalendarDate(y, m, d);
				}

				if (
					(!prevCalendarStartDate && value.start) ||
					(prevCalendarStartDate && value.start?.toString() !== prevCalendarStartDate) ||
					(!prevCalendarEndDate && value.end) ||
					(prevCalendarEndDate && value.end?.toString() !== prevCalendarEndDate)
				) {
					loadTransactions();
					updateURLSearchParams();
				}
			}}
		>
			<Popover.Trigger
				class={cn(buttonVariants({ variant: 'outline' }), !value && 'text-muted-foreground')}
			>
				<CalendarIcon class="mr-2 size-4" />
				{#if value && value.start}
					{#if value.end}
						{df.format(value.start.toDate(getLocalTimeZone()))} - {df.format(
							value.end.toDate(getLocalTimeZone())
						)}
					{:else}
						{df.format(value.start.toDate(getLocalTimeZone()))}
					{/if}
				{:else if startValue}
					{df.format(startValue.toDate(getLocalTimeZone()))}
				{:else}
					Pick a date
				{/if}
			</Popover.Trigger>
			<Popover.Content class="w-auto p-0" align="start">
				<RangeCalendar
					bind:value
					onStartValueChange={(v) => {
						startValue = v;
					}}
					numberOfMonths={2}
				/>
			</Popover.Content>
		</Popover.Root>

		<Input
			placeholder="Search by description..."
			value={(table.getColumn('description')?.getFilterValue() as string) ?? ''}
			onchange={(e) => {
				table.getColumn('description')?.setFilterValue(e.currentTarget.value);
			}}
			oninput={(e) => {
				table.getColumn('description')?.setFilterValue(e.currentTarget.value);
			}}
			class="md:max-w-sm"
		/>
	</div>

	<Separator class="bg-boder border border-dashed" />

	<div class="flex flex-col py-4 md:flex-row md:justify-between">
		<div class="flex flex-col gap-2 justify-self-start md:flex-row md:items-center">
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					{#snippet child({ props })}
						<Button {...props} variant="outline" class="md:ml-auto"
							><CirclePlus />Type
							{#if columnTypeSelection}
								<Separator orientation="vertical" />
								<Badge variant="outline">{columnTypeSelection}</Badge>
							{/if}
						</Button>
					{/snippet}
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="start">
					{#each columnTypes as type (type)}
						<DropdownMenu.CheckboxItem
							class="capitalize"
							bind:checked={
								() => {
									return columnTypeSelection === type;
								},
								(v) => {
									if (v) {
										columnTypeSelection = type;
										table.getColumn('type')?.setFilterValue(type);
									} else {
										columnTypeSelection = '';
										table.getColumn('type')?.setFilterValue(undefined);
									}
								}
							}
						>
							{type}
						</DropdownMenu.CheckboxItem>
					{/each}
					{#if columnTypeSelection}
						<Separator />
						<DropdownMenu.Item
							class="flex cursor-pointer  justify-center"
							onclick={() => {
								columnTypeSelection = '';
								table.getColumn('type')?.setFilterValue(undefined);
							}}
						>
							Clear Filter
						</DropdownMenu.Item>
					{/if}
				</DropdownMenu.Content>
			</DropdownMenu.Root>

			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					{#snippet child({ props })}
						<Button {...props} variant="outline" class="md:ml-auto"
							><CirclePlus />Categories

							{#if categorySelection.length && categorySelection.length <= setMaxCategorySelection()}
								<Separator orientation="vertical" />
								{#each categorySelection as category (category.category_code)}
									<Badge
										variant="outline"
										class="capitalize"
										style="background-color: blue; color: white">{category.name}</Badge
									>
								{/each}
							{:else if categorySelection.length > setMaxCategorySelection()}
								<Separator orientation="vertical" />
								<Badge variant="outline">{categorySelection.length} selected</Badge>
							{/if}
						</Button>
					{/snippet}
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="start">
					{#each categories as category (category.category_code)}
						<DropdownMenu.CheckboxItem
							class="capitalize"
							bind:checked={
								() => categorySelection?.some((c) => c.name === category.name),
								(v) => {
									if (v) {
										categorySelection = [...categorySelection, category];
									} else {
										categorySelection = categorySelection.filter((c) => c.name !== category.name);
									}
									const codes = categorySelection.map((c) => c.name);

									if (codes.length) {
										table.getColumn('category')?.setFilterValue(codes);
									} else {
										table.getColumn('category')?.setFilterValue(undefined);
									}
								}
							}
						>
							<span class="h-4 w-4 rounded-full" style="background-color: blue"></span>
							{category.name}
						</DropdownMenu.CheckboxItem>
					{/each}
					{#if categorySelection.length}
						<Separator />
						<DropdownMenu.Item
							class="flex cursor-pointer  justify-center"
							onclick={() => {
								categorySelection = [];
								table.getColumn('category')?.setFilterValue(undefined);
							}}
						>
							Clear Filter
						</DropdownMenu.Item>
					{/if}
				</DropdownMenu.Content>
			</DropdownMenu.Root>

			{#if columnTypeSelection || categorySelection.length}
				<Button
					class="self-end"
					variant="ghost"
					onclick={() => {
						columnTypeSelection = '';
						table.getColumn('type')?.setFilterValue(undefined);
						categorySelection = [];
						table.getColumn('category')?.setFilterValue(undefined);
					}}
				>
					Clear
					<X />
				</Button>
			{/if}
		</div>

		<div class="hidden flex-row gap-2 md:flex">
			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					{#snippet child({ props })}
						<Button {...props} variant="outline" class="ml-auto"><Settings2 /> Columns</Button>
					{/snippet}
				</DropdownMenu.Trigger>
				<DropdownMenu.Content align="end">
					<p class="px-2 py-1 text-center text-sm font-medium">Toggle Columns</p>
					<Separator />
					{#each table.getAllColumns().filter((col) => col.getCanHide()) as column (column.id)}
						<DropdownMenu.CheckboxItem
							class="capitalize"
							bind:checked={() => column.getIsVisible(), (v) => column.toggleVisibility(!!v)}
						>
							{column.id}
						</DropdownMenu.CheckboxItem>
					{/each}
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	</div>

	{#if hasError}
		<div class="my-4 rounded-md border bg-red-50 p-4">
			<p class="text-sm text-red-700">Error loading transactions. Please try again later.</p>
		</div>
	{:else if loading}
		<!-- Skeleton for Mobile View -->
		<div class="grid grid-cols-1 gap-4 md:hidden">
			{#each Array(5) as _}
				<Card class="border border-border bg-card p-4">
					<div class="flex items-center gap-4">
						<div class="h-10 w-10 rounded-full bg-gray-200"></div>
						<div class="flex-1">
							<div class="h-4 w-3/4 rounded bg-gray-200"></div>
							<div class="mt-2 h-3 w-1/2 rounded bg-gray-200"></div>
						</div>
						<div class="h-6 w-1/4 rounded bg-gray-200"></div>
					</div>
				</Card>
			{/each}
		</div>

		<!-- Skeleton for Web View -->
		<div class="hidden rounded-md border md:block">
			<Table.Root>
				<Table.Header>
					<Table.Row class="text-blue">
						{#each Array(5) as _}
							<Table.Head><div class="h-6 w-full rounded bg-gray-200"></div></Table.Head>
						{/each}
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each Array(10) as _}
						<Table.Row>
							{#each Array(5) as _}
								<Table.Cell><div class="h-6 w-full rounded bg-gray-200"></div></Table.Cell>
							{/each}
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>
	{:else}
		<!--Mobile View-->
		<div class="grid grid-cols-1 gap-4 md:hidden">
			{#each table.getRowModel().rows as row (row.id)}
				{@const selectCell = row.getVisibleCells().find((c) => c.column.id === 'select')}
				{@const descriptionCell = row.getVisibleCells().find((c) => c.column.id === 'description')}
				{@const categoryCell = row.getVisibleCells().find((c) => c.column.id === 'category')}
				{@const dateCell = row.getVisibleCells().find((c) => c.column.id === 'created_at')}
				{@const amountCell = row.getVisibleCells().find((c) => c.column.id === 'amount')}
				{@const typeCell = row.getVisibleCells().find((c) => c.column.id === 'type')}
				{@const actionsCell = row.getVisibleCells().find((c) => c.column.id === 'actions')}
				{@const transaction = row.original as {
					category: { name: string; color: string; type: string };
					transaction_code: string;
					date: string;
					amount: number;
				}}

				<Card
					class="group relative overflow-hidden border border-border bg-card transition-all hover:shadow-sm"
				>
					<div class="flex items-center gap-4 p-4 md:p-5">
						<div class="flex-shrink-0">
							{#if selectCell}
								<FlexRender
									content={selectCell.column.columnDef.cell}
									context={selectCell.getContext()}
								/>
							{/if}
						</div>

						<!--Main Content -->
						<div class="flex min-w-0 flex-1 items-center justify-between gap-4">
							<div class="min-w-0 flex-1">
								<div class="flex items-center gap-2">
									<div
										class="h-2 w-2 flex-shrink-0 rounded-full sm:hidden"
										style="background-color: red"
									></div>
									<h3 class="text-sm font-medium text-card-foreground">
										{transaction.category.name}
									</h3>
									<span
										class="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium"
										style="background-color: {transaction.category?.type === 'income'
											? 'oklch(0.95 0.05 145)'
											: 'oklch(0.95 0.05 25)'}; color: {transaction.category?.type === 'income'
											? 'oklch(0.40 0.15 145)'
											: 'oklch(0.45 0.20 25)'}"
									>
										{#if transaction.category?.type === 'income'}
											<ArrowDownLeft size={15} />
										{:else}
											<ArrowUpRight size={15} />
										{/if}
										{transaction.category?.type === 'income' ? 'Income' : 'Expense'}
									</span>
								</div>
								<div class="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
									<span>{transaction.date}</span>
									<span class="font-mono">{transaction.transaction_code}</span>
								</div>
							</div>
						</div>

						<!--Amount-->
						<div class="flex-shrink-0 text-right">
							<div
								class="text-lg font-semibold tabular-nums"
								style="color: {transaction.category?.type === 'income'
									? 'oklch(0.50 0.15 145)'
									: 'oklch(0.50 0.20 25)'}"
							>
								{#if transaction.category?.type === 'income'}
									+
								{:else}
									-
								{/if}
								{formatAmount(transaction.amount)}
							</div>
						</div>
					</div>
				</Card>
			{:else}
				<Card class="border border-border bg-card p-4 text-center text-sm text-muted-foreground">
					No results.
				</Card>
			{/each}
		</div>

		<!--Web View-->
		<div class="hidden rounded-md border md:block">
			<Table.Root>
				<Table.Header>
					{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
						<Table.Row class="text-blue">
							{#each headerGroup.headers as header (header.id)}
								<Table.Head colspan={header.colSpan}>
									{#if !header.isPlaceholder}
										<FlexRender
											content={header.column.columnDef.header}
											context={header.getContext()}
										/>
									{/if}
								</Table.Head>
							{/each}
						</Table.Row>
					{/each}
				</Table.Header>
				<Table.Body>
					{#each table.getRowModel().rows as row (row.id)}
						<Table.Row data-state={row.getIsSelected() && 'selected'}>
							{#each row.getVisibleCells() as cell (cell.id)}
								<Table.Cell>
									<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
								</Table.Cell>
							{/each}
						</Table.Row>
					{:else}
						<Table.Row>
							<Table.Cell colspan={columns.length} class="h-24 text-center">No results.</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</div>
		<div class="flex items-center justify-end space-x-2 py-4">
			<div
				class="flex flex-1 flex-col gap-2 text-sm text-muted-foreground md:flex-row md:items-center"
			>
				<div>
					{table.getFilteredSelectedRowModel().rows.length} of{' '}
					{table.getFilteredRowModel().rows.length} row(s) selected.
				</div>

				<!--@todo: implement delete functionality-->
				<!--       {#if table.getFilteredSelectedRowModel().rows.length}-->
				<!--<Button variant="outline" size="sm" class="w-1/3 md:w-1/12">Delete</Button>-->
				<!--{/if}-->
			</div>
			<Button
				variant="outline"
				size="sm"
				onclick={() => table.previousPage()}
				disabled={!table.getCanPreviousPage()}
			>
				Previous
			</Button>
			<Button
				variant="outline"
				size="sm"
				onclick={() => table.nextPage()}
				disabled={!table.getCanNextPage()}
			>
				Next
			</Button>
		</div>
	{/if}
</div>
