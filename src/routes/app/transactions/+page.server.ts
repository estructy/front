import * as transactionsApi from '@/api/transactions';

export async function load() {
	return {
		transactions: await transactionsApi.list({
			from: '2023-01-01',
			to: '2025-12-31'
		})
	};
}
