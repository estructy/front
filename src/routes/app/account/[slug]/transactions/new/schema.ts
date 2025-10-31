import { z } from 'zod/v4';

export const createTransactionSchema = z.object({
	date: z.string(),
	category_code: z.string().min(1, 'Category code is required'),
	amount: z.string(),
	description: z.string().optional().default("")
});

export type CreateTransactionSchema = typeof createTransactionSchema;
