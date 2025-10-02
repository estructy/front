import * as transactionsApi from '@/api/transactions';
import { getDateRange } from '$lib/helpers';
import type { PageServerLoadEvent } from './$types';

export async function load({ url }: PageServerLoadEvent) {
	let from: string | null = url.searchParams.get('from');
	let to: string | null = url.searchParams.get('to');

	if (!from || !to) {
		({ startDateStr: from, endDateStr: to } = getDateRange());
	}

	return {
		transactions: await transactionsApi.list({
			from,
			to
		}),
		date: {
			from,
			to
		}
	};
}
