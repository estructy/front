import { API_URL } from '$env/static/private';

interface CreateTransactionRequest {
	token: string;
	accountId: string;
	category_code: string;
	amount: number;
	description: string;
	date: string;
}

export async function create(request: CreateTransactionRequest) {
	try {
		const url = new URL(`${API_URL}/transactions`);

		const response = await fetch(url.toString(), {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${request.token}`,
				'X-Account-ID': request.accountId
			},
			method: 'POST',
			body: JSON.stringify(request)
		});

		return {
			status: response.status
		};
	} catch (err) {
		throw new Error('Unable to create category: ' + (err as Error).message);
	}
}
