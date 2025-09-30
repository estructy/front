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

	type DataTableProps<TData, TValue> = {
		columns: ColumnDef<TData, TValue>[];
		data: TData[];
		categories: Category[];
	};

	let { columns, data, categories }: DataTableProps<TData, TValue> = $props();

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

	let value: DateRange = $state({
		start: new CalendarDate(2022, 1, 20),
		end: new CalendarDate(2022, 1, 20).add({ days: 20 })
	});

	let startValue: DateValue | undefined = $state(undefined);

	function checkMobile() {
		isMobile = window.matchMedia('(max-width: 768px)').matches; // md breakpoint from Tailwind
	}

	function setMaxCategorySelection() {
		if (isMobile) return 2;
		return 3;
	}

	onMount(() => {
		checkMobile();
		window.addEventListener('resize', checkMobile);
		return () => window.removeEventListener('resize', checkMobile);
	});
</script>

<div>
	<div class="flex flex-col justify-between gap-4 py-4 md:flex-row md:flex-wrap">
		<Popover.Root>
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
			value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
			onchange={(e) => {
				table.getColumn('email')?.setFilterValue(e.currentTarget.value);
			}}
			oninput={(e) => {
				table.getColumn('email')?.setFilterValue(e.currentTarget.value);
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
		<div class="flex-1 text-sm text-muted-foreground">
			{table.getFilteredSelectedRowModel().rows.length} of{' '}
			{table.getFilteredRowModel().rows.length} row(s) selected.
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
</div>
