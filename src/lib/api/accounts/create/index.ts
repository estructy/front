import { API_URL } from '$env/static/private';

interface Request {
	token: string;
	account_name: string;
	user_name?: string;
	description?: string;
	currency_code: string;
}

interface ApiResponse {
	account_id: string;
}

interface Response extends ApiResponse {
	status: number;
}

export async function create(request: Request): Promise<Response> {
	try {
		const url = new URL(`${API_URL}/accounts`);

		const response = await fetch(url.toString(), {
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${request.token}`
			},
			method: 'POST',
			body: JSON.stringify(request)
		});

		const data: ApiResponse = await response.json();

		if (!response.ok) {
			return {
				status: response.status,
				account_id: ''
			};
		}

		return {
			status: response.status,
			account_id: data.account_id
		};
	} catch (err) {
		throw new Error('Unable to create category: ' + (err as Error).message);
	}
}
