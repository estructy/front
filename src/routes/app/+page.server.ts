import type { PageServerLoad } from './$types';
import * as reportApi from '$lib/api/reports';

export const load: PageServerLoad = async () => {
	const byCategories = await reportApi.byCategory({
		from: '2025-01-01',
		to: '2025-12-31'
	});

	return {
		type: byCategories.type,
		categories: byCategories.categories
	};
};
