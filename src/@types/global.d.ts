export type AppAccount = {
	currentAccountId: string;
	accounts: Array<{
		accountId: string;
		accountName: string;
	}>;
}
