import * as categoriesApi from '$lib/api/categories';

export async function load() {
	return {
		categories: await categoriesApi.list({ withoutParent: true })
	};
}
