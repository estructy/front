import { superValidate } from 'sveltekit-superforms';
import { zod4 as zod } from 'sveltekit-superforms/adapters';
import { createAccountSchema } from './schema';

export async function load() {
	return {
		form: await superValidate(zod(createAccountSchema))
	};
}
