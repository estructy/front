import { setLocale } from '@/paraglide/runtime';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	setLocale('pt-BR');

	return {
		user: locals.user,
		token: locals.token,
		account: locals.account
	};
};
