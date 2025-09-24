import { API_URL } from '$env/static/private';
import type { Transaction } from '@/api/@types/transaction';

interface ListRequest {
	type?: 'expense' | 'income';
	from?: string;
	to?: string;
}

interface ApiResponse {
	from: string;
	to: string;
	type: 'expense' | 'income' | 'all';
	transactions: Transaction[];
}

export async function list(request?: ListRequest): Promise<Transaction[]> {
	try {
		const url = new URL(`${API_URL}/transactions`);

		if (request) {
			setParams(url, request);
		}

		const response = await fetch(url.toString(), {
			headers: {
				'Content-Type': 'application/json',
				'X-Account-ID': 'b8773d3e-f81d-49a9-ae49-1c8bba3e939d'
			},
			method: 'GET'
		});

		const data = (await response.json()) as ApiResponse;

		if (!response.ok) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			throw new Error('Unable to fetch transactions: ' + (data as any).message);
		}

		return data.transactions;
	} catch (err) {
		throw new Error('Unable to fetch transactions: ' + (err as Error).message);
	}
}

function setParams(url: URL, request: ListRequest) {
	if (request.type) {
		url.searchParams.append('type', request.type);
	}
	if (request.from) {
		url.searchParams.append('from', request.from);
	}
	if (request.to) {
		url.searchParams.append('to', request.to);
	}
}
