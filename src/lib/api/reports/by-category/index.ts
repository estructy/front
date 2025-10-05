import { PUBLIC_API_URL } from '$env/static/public';
import type { ByCategory } from '@/api/@types/reports';

interface Request {
	type?: string;
	from: string;
	to: string;
	withSubCategories?: boolean;
	withTransactions?: boolean;
}

interface ApiResponse {
	from: string;
	to: string;
	type: string;
	categories: ByCategory[];
}

export async function byCategory(request: Request) {
	const url = new URL(`${PUBLIC_API_URL}/reports/by-category`);
	setParams(url, request);

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
		throw new Error('Unable to fetch report: ' + (data as any).message);
	}

	return data;
}

function setParams(url: URL, request: Request) {
	if (request.type) {
		url.searchParams.append('type', request.type);
	}
	if (request.from) {
		url.searchParams.append('from', request.from);
	}
	if (request.to) {
		url.searchParams.append('to', request.to);
	}
	if (request.withSubCategories) {
		url.searchParams.append('withSubCategories', String(request.withSubCategories));
	}
	if (request.withTransactions) {
		url.searchParams.append('withTransactions', String(request.withTransactions));
	}
}
