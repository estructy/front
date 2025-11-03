import { lastAccountAccessed } from '@/api/user';
import { authClient } from '@/auth-client';
import { isJwtExpiringSoon } from '@/helpers';
import { replaceParams, routes } from '@/routes';
import type { Cookies, Handle } from '@sveltejs/kit';
import type { AppAccount } from './@types/global';
import { paraglideMiddleware } from '@/paraglide/server';

const forbiddenWithAuthRoutes = ['/sign-in'];

const paraglideHandle: Handle = ({ event, resolve }) =>
	paraglideMiddleware(event.request, ({ request: localizedRequest, locale }) => {
		event.request = localizedRequest;
		return resolve(event, {
			transformPageChunk: ({ html }) => {
				return html.replace('%lang%', locale);
			}
		});
	});

export const handle: Handle = async ({ event, resolve }) => {
	const route = event.url.pathname;
	const cookies = event.cookies;
	const hasAuthCookie = cookies.get('better-auth.session_token');

	if (!hasAuthCookie) {
		if (route.startsWith('/app')) {
			return Response.redirect(new URL('/sign-in', event.url), 303);
		}

		const response = await paraglideHandle({ event, resolve });
		return response;
	}

	let sessionToken = cookies.get('estructy-auth.session_token');
	let dataUser = cookies.get('estructy-data.user');

	const dataAccountCookie = cookies.get('estructy-data.account');
	let dataAccount: AppAccount = dataAccountCookie ? JSON.parse(dataAccountCookie) : null;

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

	event.locals.user = JSON.parse(dataUser);
	event.locals.token = sessionToken;

	if (!dataAccount) {
		dataAccount = await fetchUserAccount(sessionToken);

		if (
			forbiddenWithAuthRoutes.some((r) => route.startsWith(r)) ||
			(dataAccount.currentAccountId === '' &&
				route.startsWith('/app') &&
				!route.startsWith('/app/account/setup'))
		) {
			return Response.redirect(new URL('/app/account/setup', event.url), 303);
		}

		if (dataAccount.currentAccountId === '') {
			return paraglideHandle({ event, resolve });
		} else {
			setCookies(cookies, null, null, dataAccount || null);
		}
	}

	event.locals.account = dataAccount;

	if (forbiddenWithAuthRoutes.some((r) => route.startsWith(r))) {
		return Response.redirect(
			new URL(
				replaceParams(routes.dashboard, { accountId: dataAccount.currentAccountId }),
				event.url
			),
			303
		);
	}

	if (route.startsWith('/app/account/setup') && dataAccount) {
		return Response.redirect(
			new URL(
				replaceParams(routes.dashboard, { accountId: dataAccount.currentAccountId }),
				event.url
			),
			303
		);
	}

	if (route === '/app' && dataAccount) {
		return Response.redirect(
			new URL(
				replaceParams(routes.dashboard, { accountId: dataAccount.currentAccountId }),
				event.url
			),
			303
		);
	}

	return await paraglideHandle({ event, resolve });
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

const fetchUserAccount = async (token: string): Promise<AppAccount> => {
	const account = await lastAccountAccessed({
		token: token
	});

	return {
		currentAccountId: account.accountId || '',
		accounts: [
			{
				accountId: account.accountId || '',
				accountName: 'Account'
			}
		]
	};
};

const setCookies = (
	cookies: Cookies,
	token: string | null,
	user: unknown | null,
	account: AppAccount | null
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
