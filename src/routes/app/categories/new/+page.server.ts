import * as categoriesApi from '$lib/api/categories';
import { fail, superValidate } from 'sveltekit-superforms';
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
		// add wait
		await new Promise((resolve) => setTimeout(resolve, 3000));
		const form = await superValidate(event, zod(createCategorySchema));

		// @todo: api create route

		if (!form.valid) {
			return fail(400, {
				form
			});
		}
		return fail(400, {
			form,
			error: 'We are facing some issues. Please try again later.'
		});

		return {
			form,
			error: null
		};
	}
};
