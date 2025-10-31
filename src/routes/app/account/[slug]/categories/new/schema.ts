import { z } from 'zod/v4';

export const createCategorySchema = z.object({
	name: z.string().min(2).max(50),
	type: z.enum(['expense', 'income']),
	color: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, 'Invalid color code'),
	parent_code: z.string().optional()
});

export type CreateCategorySchema = typeof createCategorySchema;
