import * as categoriesApi from '$lib/api/categories';
import { fail, setError, setMessage, superValidate } from 'sveltekit-superforms';
import { zod4 as zod } from 'sveltekit-superforms/adapters';
import { createCategorySchema } from './schema';
import type { Actions } from '@sveltejs/kit';

export async function load() {
	return {
		form: await superValidate(zod(createCategorySchema)),
		categories: await categoriesApi.list({ withoutParent: true })
	};
}

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(createCategorySchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			const response = await categoriesApi.create(form.data);
			if (response.status === 409) {
				setMessage(form, 'There are some conflicts, please review the form');
				return setError(form, 'name', 'Category with this name already exists');
			}
		} catch {
			return fail(500, {
				form,
				error: 'Unable to create category'
			});
		}

		return {
			form,
			error: null
		};
	}
};
