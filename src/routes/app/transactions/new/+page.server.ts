import { superValidate } from 'sveltekit-superforms';
import { zod4 as zod } from 'sveltekit-superforms/adapters';
import { createTransactionSchema } from './schema';
import * as categoriesApi from '$lib/api/categories';

export async function load() {
	return {
		form: await superValidate(zod(createTransactionSchema)),
		categories: await categoriesApi.list()
		//categories: [
		//	{
		//		type: 'income',
		//		category_code: 'food',
		//		name: 'Food & Dining',
		//		color: '#FF5733'
		//	}
		//] as Categories[]
	};
}
