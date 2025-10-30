import { lastAccountAccessed } from '@/api/user';
import { authClient } from '@/auth-client';
import { isJwtExpiringSoon } from '@/helpers';
import type { Cookies, Handle } from '@sveltejs/kit';

const forbiddenWithAuthRoutes = ['/sign-in'];

export const handle: Handle = async ({ event, resolve }) => {
	const route = event.url.pathname;
	const cookies = event.cookies;
	const hasAuthCookie = cookies.get('better-auth.session_token');

	if (hasAuthCookie && forbiddenWithAuthRoutes.some((r) => route.startsWith(r))) {
		return Response.redirect(new URL('/app', event.url), 303);
	}
	if (route.startsWith('/app') && !hasAuthCookie) {
		return Response.redirect(new URL('/sign-in', event.url), 303);
	}

	if (!hasAuthCookie) {
		const response = await resolve(event);
		return response;
	}

	let sessionToken = cookies.get('estructy-auth.session_token');
	let dataUser = cookies.get('estructy-data.user');
	let dataAccount = cookies.get('estructy-data.account');

	if (route.startsWith('/app/account/setup') && dataAccount) {
		return Response.redirect(new URL('/app', event.url), 303);
	}

	if (!sessionToken || !dataUser || isJwtExpiringSoon(sessionToken)) {
		const { data, error } = await fetchUserData(
			`better-auth.session_token=${cookies.get('better-auth.session_token') || ''}`
		);
		if (error || !data) {
			return Response.redirect(new URL('/sign-in', event.url), 303);
		}

		setCookies(cookies, data.token.data.token, data.session.data?.user, null);

		sessionToken = data.token.data.token;
		dataUser = JSON.stringify(data.session.data?.user);
	}

	if (!dataAccount) {
		dataAccount = await fetchUserAccount(sessionToken);

		if (!dataAccount && route.startsWith('/app') && !route.startsWith('/app/account/setup')) {
			return Response.redirect(new URL('/app/account/setup', event.url), 303);
		}

		setCookies(cookies, null, null, dataAccount);
	}

	event.locals.user = JSON.parse(dataUser);
	event.locals.token = sessionToken;
	event.locals.accountId = dataAccount;

	const response = await resolve(event);
	return response;
};

const fetchUserData = async (cookie: string) => {
	const fetchOptions = {
		headers: {
			Cookie: cookie
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
		return {
			data: null,
			error: 'Not authenticated'
		};
	}

	return {
		data: {
			session,
			token
		},
		error: null
	};
};

const fetchUserAccount = async (token: string) => {
	const account = await lastAccountAccessed({
		token: token
	});

	return account.accountId || undefined;
};

const setCookies = (
	cookies: Cookies,
	token: string | null,
	user: unknown | null,
	account: unknown | null
) => {
	if (token) {
		cookies.set('estructy-auth.session_token', token, { path: '/' });
	}

	if (user) {
		cookies.set('estructy-data.user', JSON.stringify(user), { path: '/' });
	}

	if (account) {
		cookies.set('estructy-data.account', JSON.stringify(account), { path: '/' });
	}
};
