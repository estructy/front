import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const categories = [
		{ id: '1', name: 'Food', color: 'red' },
		{ id: '2', name: 'Bills', color: 'blue' },
		{ id: '3', name: 'Entertainment', color: 'green' }
	];

	return { categories };
};
