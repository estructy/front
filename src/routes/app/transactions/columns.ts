import type { ColumnDef } from '@tanstack/table-core';
//import { createRawSnippet } from 'svelte';
//import { renderSnippet } from '$lib/components/ui/data-table/index.js';
import { renderComponent } from '$lib/components/ui/data-table/index.js';
import DataTableActions from './data-table-actions.svelte';
//import DataTableEmailButton from './data-table-email-button.svelte';
import Checkbox from './data-table-checkbox.svelte';
import type { Transaction } from '@/api/@types/transaction';

export const columns: ColumnDef<Transaction>[] = [
	{
		id: 'select',
		header: ({ table }) =>
			renderComponent(Checkbox, {
				checked: table.getIsAllPageRowsSelected(),
				indeterminate: table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected(),
				onCheckedChange: (value: boolean) => table.toggleAllPageRowsSelected(!!value),
				'aria-label': 'Select all'
			}),
		cell: ({ row }) =>
			renderComponent(Checkbox, {
				checked: row.getIsSelected(),
				onCheckedChange: (value: boolean) => row.toggleSelected(!!value),
				'aria-label': 'Select row'
			}),
		enableSorting: false,
		enableHiding: false
	},
	{
		accessorKey: 'transaction_code',
		header: 'Transaction Code',
		id: 'transaction code'
	},
	{
		accessorKey: 'date',
		header: 'Date'
	},
	{
		accessorKey: 'category.type',
		header: 'Type',
		id: 'type'
	},
	{
		accessorKey: 'category.name',
		header: 'Category',
		id: 'category',
		filterFn: (row, id, value: string[]) => {
			return value.includes(row.getValue(id));
		}
	},
	{
		accessorKey: 'amount',
		header: 'Amount'
	},
	//{
	//	accessorKey: 'status',
	//	header: 'Status'
	//},
	//{
	//	accessorKey: 'email',
	//	header: ({ column }) =>
	//		renderComponent(DataTableEmailButton, {
	//			onclick: column.getToggleSortingHandler()
	//		})
	//},
	//{
	//	accessorKey: 'amount',
	//	header: () => {
	//		const amountHeaderSnippet = createRawSnippet(() => ({
	//			render: () => `<div class="text-right">Amount</div>`
	//		}));
	//		return renderSnippet(amountHeaderSnippet, '');
	//	},
	//	cell: ({ row }) => {
	//		const formatter = new Intl.NumberFormat('en-US', {
	//			style: 'currency',
	//			currency: 'USD'
	//		});
	//
	//		const amountCellSnippet = createRawSnippet<[string]>((getAmount) => {
	//			const amount = getAmount();
	//			return {
	//				render: () => `<div class="text-right font-medium">${amount}</div>`
	//			};
	//		});
	//
	//		return renderSnippet(amountCellSnippet, formatter.format(parseFloat(row.getValue('amount'))));
	//	}
	//},
	{
		id: 'actions',
		cell: ({ row }) => {
			// You can pass whatever you need from `row.original` to the component
			return renderComponent(DataTableActions, { id: row.original.transaction_code });
		}
	}
];
