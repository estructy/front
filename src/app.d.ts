// See https://svelte.dev/docs/kit/types#app.d.ts

import type { AppAccount, AppUser } from './@types/global';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			token: string;
			user: AppUser;
			account: AppAccount;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export { };
