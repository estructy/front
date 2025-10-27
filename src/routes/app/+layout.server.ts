import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { authClient } from '@/auth-client';

export const load: LayoutServerLoad = async ({ cookies }) => {
	if (!cookies.get('better-auth.session_token')) {
		redirect(303, '/sign-in');
	}

	const { data, error } = await authClient.getSession({
		fetchOptions: {
			headers: {
				Cookie: `better-auth.session_token=${cookies.get('better-auth.session_token') || ''}`
			}
		}
	});

	if (error || !data?.session) {
		redirect(303, '/sign-in');
	}

	return {
		user: data.user
	};
};
