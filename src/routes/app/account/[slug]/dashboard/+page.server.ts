import type { PageServerLoad } from './$types';
import * as reportApi from '$lib/api/reports';

export const load: PageServerLoad = async ({ locals }) => {
	const byCategories = await reportApi.byCategory({
		token: locals.token,
		accountId: locals.account.currentAccountId,
		from: '2025-01-01',
		to: '2025-12-31'
	});

	return {
		type: byCategories.type,
		categories: byCategories.categories
	};
};
