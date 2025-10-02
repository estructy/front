export const notificationsCount = $state({
	transactions: 0,
	categories: 0
});

export const saveNotificationsToLocalStore = () => {
	localStorage.setItem('notificationsCount', JSON.stringify(notificationsCount));
};

export const loadNotificationsFromLocalStore = () => {
	const storedNotifications = localStorage.getItem('notificationsCount');
	if (storedNotifications) {
		const parsed = JSON.parse(storedNotifications);
		notificationsCount.transactions = parsed.transactions || 0;
		notificationsCount.categories = parsed.categories || 0;
	}
};

export const clearNotifications = (slug: 'transactions' | 'categories') => {
	notificationsCount[slug] = 0;
	saveNotificationsToLocalStore();
};
