import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const route = event.url.pathname;
	const cookies = event.cookies;
	const hasAuthCookie = cookies.get('better-auth.session_token');

	if (!route.startsWith('/app') && hasAuthCookie) {
		return Response.redirect(new URL('/app', event.url), 303);
	}
	if (route.startsWith('/app') && !hasAuthCookie) {
		return Response.redirect(new URL('/sign-in', event.url), 303);
	}

	const token = cookies.get('estructy-auth.session_token');

	event.locals.token = token;

	const response = await resolve(event);
	return response;
};
