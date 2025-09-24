export interface Transaction {
	transaction_code: string;
	category: Category;
	date: string;
	amount: number;
	description: string;
	added_by: AddedBy;
}

export interface Category {
	category_code: string;
	name: string;
	type: string;
}

export interface AddedBy {
	name: string;
}
