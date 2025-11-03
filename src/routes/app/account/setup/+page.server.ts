import { setMessage, superValidate } from 'sveltekit-superforms';
import { zod4 as zod } from 'sveltekit-superforms/adapters';
import { createAccountSchema } from './schema';
import { redirect, type Actions } from '@sveltejs/kit';
import { fail } from 'assert';
import * as accountsApi from '@/api/accounts';
import { authClient } from '@/auth-client';
import type { AppAccount } from '../../../../@types/global';

export async function load() {
	return {
		form: await superValidate(zod(createAccountSchema))
	};
}

export const actions: Actions = {
	default: async (event) => {
		const form = await superValidate(event, zod(createAccountSchema));

		if (!form.valid || !event.locals.token) {
			return fail(400, {
				form
			});
		}

		let accountId: string;
		try {
			const [accountResponse, userResponse] = await Promise.all([
				accountsApi.create({
					token: event.locals.token,
					account_name: form.data.accountName,
					user_name: form.data.userName,
					currency_code: form.data.currency
				}),
				authClient.updateUser({
					fetchOptions: {
						headers: {
							Cookie: `better-auth.session_token=${event.cookies.get('better-auth.session_token') || ''}`
						}
					},
					name: form.data.userName
				})
			]);

			if (accountResponse.status === 409 || userResponse.error) {
				setMessage(form, 'There are some conflicts, please review the form');
				return fail(409, {
					form
				});
			}

			const account: AppAccount = {
				currentAccountId: accountResponse.account_id,
				accounts: [
					{
						accountId: accountResponse.account_id,
						accountName: form.data.accountName
					}
				]
			};

			event.cookies.set('estructy-data.account', JSON.stringify(account), {
				path: '/'
			});
			event.locals.account = account;
			accountId = accountResponse.account_id;
		} catch {
			return fail(500, {
				form,
				error: 'Unable to create account'
			});
		}

		event.cookies.delete('estructy-auth.session_token', { path: '/' });
		event.cookies.delete('estructy-data.user', { path: '/' });

		redirect(303, `/app/account/${accountId}/dashboard`);

		return {
			form,
			error: null
		};
	}
};
