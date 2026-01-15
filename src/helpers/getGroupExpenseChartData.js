import { DEFAULT_EXPENSE_COLOR } from "./expenseCategoryColors";

/**
 * @param {Object} groupExpensesMap - { groupId: [expenses] }
 * @param {Array} groups - groups array (to get groupName)
 * @param {String} userId - logged in user id
 */

export const GROUP_COLORS = [
    "#42A5F5", // Blue
    "#66BB6A", // Green
    "#FFA726", // Orange
    "#AB47BC", // Purple
    "#EC407A", // Pink
    "#26C6DA", // Cyan
];

export const getGroupExpenseChartData = (
    groupExpensesMap = {},
    groups = [],
    userId
) => {
    if (!userId || !groups.length) {
        return [
            {
                label: "No Expense",
                value: 100,
                color: DEFAULT_EXPENSE_COLOR.color,
            },
        ];
    }

    const data = groups.map((group, index) => {
        const expenses = groupExpensesMap[group._id] || [];

        const yourContribution = expenses
            .filter((e) => String(e.createdBy) === String(userId))
            .reduce((sum, e) => sum + Number(e.amount || 0), 0);

        return {
            label: group.groupName,
            value: yourContribution,
            color: GROUP_COLORS[index % GROUP_COLORS.length],
        };
    });

    const total = data.reduce((sum, d) => sum + d.value, 0);

    if (total === 0) {
        return [
            {
                label: "No Expense",
                value: 100,
                color: DEFAULT_EXPENSE_COLOR.color,
            },
        ];
    }

    return data.filter((d) => d.value > 0);
};
