import * as categoriesApi from '$lib/api/categories';
import type { PageServerLoadEvent } from './$types';

export async function load({ locals }: PageServerLoadEvent) {
	return {
		categories: await categoriesApi.list({
			token: locals.token,
			accountId: locals.accountId
		})
	};
}
