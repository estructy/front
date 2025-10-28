import { createAuthClient } from 'better-auth/svelte';
import { emailOTPClient } from 'better-auth/client/plugins';
import { PUBLIC_AUTH_BASE_URL } from '$env/static/public';
import { jwtClient } from 'better-auth/client/plugins';

export const authClient = createAuthClient({
	baseURL: PUBLIC_AUTH_BASE_URL,
	plugins: [jwtClient(), emailOTPClient()]
});
