export const getExpenseAnalytics = (expenses = [], options = {}) => {
    const { userId } = options;
    if (!Array.isArray(expenses) || expenses.length === 0) {
        return {
            totalAmount: 0,
            topCategory: null,
            biggestExpense: null,
            latestExpense: null,
            yourContribution: 0,
        };
    }

    //Total Amount
    const totalAmount = expenses.reduce(
        (sum, e) => sum + Number(e.amount || 0),
        0
    );

    // 2️⃣ Top Category
    const categoryCount = expenses.reduce((acc, e) => {
        if (!e.category) return acc;
        acc[e.category] = (acc[e.category] || 0) + 1;
        return acc;
    }, {});

    const topCategory = Object.entries(categoryCount).reduce(
        (top, [category, count]) =>
            !top || count > top.count ? { category, count } : top,
        null
    );

    // 3️⃣ Biggest Expense
    const biggestExpense = expenses.reduce((max, curr) =>
        Number(curr.amount) > Number(max.amount) ? curr : max
    ).amount;

    // 4️⃣ Latest Expense
    const latestExpense = expenses.reduce((latest, curr) =>
        new Date(curr.updatedAt) > new Date(latest.updatedAt) ? curr : latest
    ).updatedAt;

    const yourContribution = userId
        ? expenses
            .filter((expense) => String(expense.createdBy) === String(userId))
            .reduce((sum, expense) => sum + Number(expense.amount || 0), 0)
        : 0;

    return {
        totalAmount,
        topCategory,
        biggestExpense,
        latestExpense,
        yourContribution,
    };
};
