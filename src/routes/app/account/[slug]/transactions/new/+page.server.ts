import { fail, setMessage, superValidate } from 'sveltekit-superforms';
import { zod4 as zod } from 'sveltekit-superforms/adapters';
import { createTransactionSchema } from './schema';
import * as categoriesApi from '$lib/api/categories';
import type { Actions } from '@sveltejs/kit';
import * as transactionsApi from '$lib/api/transactions';
import type { PageServerLoadEvent } from '../$types';

export async function load({ locals }: PageServerLoadEvent) {
	return {
		form: await superValidate(zod(createTransactionSchema)),
		categories: await categoriesApi.list({
			token: locals.token as string,
			accountId: locals.accountId as string
		})
	};
}

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(createTransactionSchema));

		if (!form.valid) {
			return fail(400, {
				form
			});
		}

		try {
			const amount = Math.round(parseFloat(form.data.amount.replace(/[^0-9.-]+/g, '')) * 100);

			const response = await transactionsApi.create({
				...form.data,
				amount,
				token: event.locals.token as string,
				accountId: event.locals.accountId as string
			});
			if (response.status !== 201) {
				setMessage(form, 'There are some conflicts, please review the form');
				return fail(409, { form });
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
