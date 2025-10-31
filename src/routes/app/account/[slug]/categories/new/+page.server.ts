import * as categoriesApi from '$lib/api/categories';
import { fail, setError, setMessage, superValidate } from 'sveltekit-superforms';
import { zod4 as zod } from 'sveltekit-superforms/adapters';
import { createCategorySchema } from './schema';
import type { Actions } from '@sveltejs/kit';
import type { PageServerLoadEvent } from '../$types';

export async function load({ locals }: PageServerLoadEvent) {
	return {
		form: await superValidate(zod(createCategorySchema)),
		categories: await categoriesApi.list({
			withoutParent: true,
			token: locals.token,
			accountId: locals.account.currentAccountId
		})
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
			const response = await categoriesApi.create({
				...form.data,
				token: event.locals.token,
				accountId: event.locals.account.currentAccountId
			});
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
