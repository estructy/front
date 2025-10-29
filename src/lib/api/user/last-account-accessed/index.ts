import { API_URL } from '$env/static/private';

interface Request {
	token: string;
}

export async function lastAccountAccessed(request: Request) {
	try {
		const url = new URL(`${API_URL}/user/account/last-accessed`);

		const response = await fetch(url.toString(), {
			headers: {
				Authorization: `Bearer ${request.token}`
			},
			method: 'GET'
		});

		if (!response.ok) {
			return {
				status: response.status
			};
		}


		const accountId = await response.json() as string;

		return {
			status: response.status,
			accountId
		};
	} catch {
		throw new Error('Failed to fetch last accessed account');
	}
}
