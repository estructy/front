// See https://svelte.dev/docs/kit/types#app.d.ts

import type { AppAccount } from './@types/global';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			token: string;
			user: {
				id: string;
				createdAt: Date;
				updatedAt: Date;
				email: string;
				emailVerified: boolean;
				name: string;
				image?: string | null | undefined;
			};
			account: AppAccount;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export { };
