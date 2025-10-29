import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { authClient } from '@/auth-client';
import { isJwtExpiringSoon } from '@/helpers';

export const load: LayoutServerLoad = async ({ cookies, url }) => {
	if (!cookies.get('better-auth.session_token') && !url.pathname.startsWith('/sign-in')) {
		redirect(303, '/sign-in');
		return;
	} else if (url.pathname.startsWith('/sign-in')) {
		return;
	}

	const sessionToken = cookies.get('estructy-auth.session_token');
	const dataUser = cookies.get('estructy-data.user');

	if (sessionToken && !isJwtExpiringSoon(sessionToken) && dataUser) {
		return {
			user: JSON.parse(dataUser),
			token: sessionToken
		};
	}

	const fetchOptions = {
		headers: {
			Cookie: `better-auth.session_token=${cookies.get('better-auth.session_token') || ''}`
		}
	};

	const [session, token] = await Promise.all([
		authClient.getSession({
			fetchOptions
		}),
		authClient.token({
			fetchOptions
		})
	]);

	if (session.error || !session.data?.session || token.error || !token.data?.token) {
		redirect(303, '/sign-in');
	}

	cookies.set('estructy-auth.session_token', token.data.token, { path: '/' });
	cookies.set('estructy-data.user', JSON.stringify(session.data.user), { path: '/' });

	return {
		user: session.data.user,
		token: token.data?.token
	};
};
