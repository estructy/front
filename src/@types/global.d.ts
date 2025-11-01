export type AppAccount = {
	currentAccountId: string;
	accounts: Array<{
		accountId: string;
		accountName: string;
	}>;
};

export type AppUser = {
	id: string;
	createdAt: Date;
	updatedAt: Date;
	email: string;
	emailVerified: boolean;
	name: string;
	image?: string | null | undefined;
};
