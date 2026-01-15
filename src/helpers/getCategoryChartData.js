import { EXPENSE_CATEGORY_COLORS, DEFAULT_EXPENSE_COLOR } from "./expenseCategoryColors";
export const getCategoryChartData = (expenses = []) => {
    if (!Array.isArray(expenses) || expenses.length === 0) return [{
        label: "No Expense",
        value: 1,
        color: DEFAULT_EXPENSE_COLOR.color,
    },];

    const categoryTotals = expenses?.reduce((acc, expense) => {
        const amount = Number(expense.amount || 0);

        acc[expense?.category] = (acc[expense?.category] || 0) + amount;

        return acc;
    }, {})

    return Object.entries(categoryTotals).map(([category, total]) => ({
        label: category,
        value: total,
        color: EXPENSE_CATEGORY_COLORS[category]?.color || DEFAULT_EXPENSE_COLOR?.color
    }));
}

