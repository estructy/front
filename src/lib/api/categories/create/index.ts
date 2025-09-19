import { API_URL } from '$env/static/private';

interface CreateRequest {
	name: string;
	type: 'expense' | 'income';
	color: string;
	parent_code?: string;
}

interface CreateResponse {
	status: number;
}

export async function create(request: CreateRequest): Promise<CreateResponse> {
	try {
		const url = new URL(`${API_URL}/categories`);

		const response = await fetch(url.toString(), {
			headers: {
				'Content-Type': 'application/json',
				'X-Account-ID': 'b8773d3e-f81d-49a9-ae49-1c8bba3e939d'
			},
			method: 'POST',
			body: JSON.stringify(request)
		});

		if (!response.ok) {
			return {
				status: response.status
			};
		}

		return {
			status: response.status
		};
	} catch (err) {
		throw new Error('Unable to create category: ' + (err as Error).message);
	}
}
