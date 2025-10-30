import { z } from 'zod/v4';

export const createAccountSchema = z.object({
	userName: z.string().min(2).max(50),
	accountName: z.string().min(2).max(50),
	currency: z.string().length(3),
	invites: z.array(z.string()).optional()
});

export type CreateAccountSchema = typeof createAccountSchema;
