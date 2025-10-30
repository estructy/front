import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ cookies }) => {
	cookies.delete('estructy-auth.session_token', { path: '/' });
	cookies.delete('estructy-data.user', { path: '/' });
	cookies.delete('estructy-data.account', { path: '/' });

	return;
};
