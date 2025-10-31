import { API_URL } from '$env/static/private';
import type { Categories } from '@/api/@types/categories';

interface ListRequest {
	token: string;
	accountId: string;
	type?: 'expense' | 'income';
	withoutParent?: boolean;
}

export async function list(request: ListRequest): Promise<Categories[]> {
	try {
		const url = new URL(`${API_URL}/categories`);

		if (request) {
			setParams(url, request);
		}

		const response = await fetch(url.toString(), {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${request?.token}`,
				'X-Account-ID': request?.accountId
			},
			method: 'GET'
		});

		const data = (await response.json()) as Categories[];

		if (!response.ok) {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			throw new Error('Unable to fetch categories: ' + (data as any).message);
		}

		return data;
	} catch (err) {
		throw new Error('Unable to fetch categories: ' + (err as Error).message);
	}
}

function setParams(url: URL, request: ListRequest) {
	if (request.type) {
		url.searchParams.append('type', request.type);
	}
	if (request.withoutParent) {
		url.searchParams.append('without-parent', 'true');
	}
}
