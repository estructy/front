import * as transactionsApi from '@/api/transactions';
import { getDateRange } from '$lib/helpers';
import type { PageServerLoadEvent } from './$types';

export async function load({ url }: PageServerLoadEvent) {
	let from: string | null = url.searchParams.get('from');
	let to: string | null = url.searchParams.get('to');

	const type: string | null = url.searchParams.get('type');
	const categories: string | null = url.searchParams.get('categories');

	if (!from || !to) {
		({ startDateStr: from, endDateStr: to } = getDateRange());
	}

	return {
		transactions: await transactionsApi.list({
			from,
			to
		}),
		search: {
			from,
			to,
			type: type === 'expense' || type === 'income' ? type : '',
			categories: categories || ''
		}
	};
}
