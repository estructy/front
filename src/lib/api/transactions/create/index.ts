import { API_URL } from '$env/static/private';

interface CreateTransactionRequest {
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
				'X-Account-ID': 'b8773d3e-f81d-49a9-ae49-1c8bba3e939d',
				'X-User-ID': '529f607c-572f-4fca-98c4-587f6c3cf196'
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
