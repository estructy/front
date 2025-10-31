const routes = {
	base: '/app/account/:accountId',
	newTransaction: '/app/account/:accountId/transactions/new',
	newCategory: '/app/account/:accountId/categories/new',
	dashboard: '/app/account/:accountId/dashboard',
	transactions: '/app/account/:accountId/transactions',
	categories: '/app/account/:accountId/categories'
} as const;

const replaceParams = (route: string, params: Record<string, string>) => {
	let result = route;
	for (const [key, value] of Object.entries(params)) {
		result = result.replace(`:${key}`, value);
	}
	return result;
};

const withQuery = (route: string, query: Record<string, string>) => {
	const queryString = new URLSearchParams(query).toString();
	return queryString ? `${route}?${queryString}` : route;
};

export { routes, replaceParams, withQuery };
