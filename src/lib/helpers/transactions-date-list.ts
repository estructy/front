export function getDateRange() {
	const endDate = new Date();
	const startDate = new Date();
	startDate.setDate(endDate.getDate() - 40);

	const startDateStr = startDate.toISOString().split('T')[0];
	const endDateStr = endDate.toISOString().split('T')[0];

	const startYear = startDate.getFullYear();
	const startMonth = startDate.getMonth() + 1;
	const startDay = startDate.getDate();

	const endYear = endDate.getFullYear();
	const endMonth = endDate.getMonth() + 1;
	const endDay = endDate.getDate();

	return {
		startDate,
		endDate,
		startDateStr,
		endDateStr,
		startYear,
		startMonth,
		startDay,
		endYear,
		endMonth,
		endDay
	};
}
