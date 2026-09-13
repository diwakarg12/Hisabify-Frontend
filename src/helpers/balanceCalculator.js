/**
 * HisabiFY Balance Calculator
 * Calculates month-wise member spending and net positions for the selected month/year.
 * ("Your Position = Total Paid This Month - Fair Share This Month")
 */

export const calculateUserBalances = (
  groups = [],
  groupExpensesMap = {},
  personalExpenses = [],
  userId = null,
  targetMonth = new Date().getMonth(),
  targetYear = new Date().getFullYear()
) => {
  if (!userId) {
    return {
      youAreOwedTotal: 0,
      youOweTotal: 0,
      monthlySpent: 0,
      groupBalancesMap: {},
    };
  }

  let youAreOwedTotal = 0;
  let youOweTotal = 0;
  let monthlySpent = 0;

  // 1. Calculate Personal Spending in Target Month
  personalExpenses.forEach((exp) => {
    if (!exp.date || exp.isDeleted) return;
    const d = new Date(exp.date);
    if (d.getMonth() === targetMonth && d.getFullYear() === targetYear) {
      monthlySpent += Number(exp.amount || 0);
    }
  });

  const groupBalancesMap = {};

  // 2. Process each group for target month
  groups.forEach((group) => {
    // Filter expenses to target month & year only (Month-wise calculation)
    const expenses = (groupExpensesMap[group._id] || []).filter((e) => {
      if (e.isDeleted) return false;
      const d = e.date ? new Date(e.date) : new Date();
      return d.getMonth() === targetMonth && d.getFullYear() === targetYear;
    });

    // Combine all members (real + dummy guests)
    const allMembers = [
      ...(group.members || []),
      ...(group.dummyMembers || []).map((d) => ({
        _id: d._id,
        firstName: d.name,
        lastName: '(Guest)',
        isDummy: true,
      })),
    ];

    const totalMemberCount = allMembers.length || 1;

    // Track total spent (paid) and fair share consumed per member for this month
    const memberStats = {}; // memberId -> { member, totalSpent, shareConsumed, netBalance }

    allMembers.forEach((m) => {
      const id = String(m._id);
      memberStats[id] = {
        member: m,
        totalSpent: 0,
        shareConsumed: 0,
        netBalance: 0,
      };
    });

    let totalGroupSpend = 0;

    expenses.forEach((exp) => {
      const amount = Number(exp.amount || 0);
      totalGroupSpend += amount;

      const payerId = String(exp.createdBy?._id || exp.createdBy || exp.createdFor?._id || exp.createdFor);

      // Add to payer's total spent for this month
      if (memberStats[payerId]) {
        memberStats[payerId].totalSpent += amount;
      }

      const splits = exp.splitInfo?.splits || [];

      if (splits.length > 0) {
        splits.forEach((split) => {
          const participantId = String(split.user?._id || split.user || split.dummyId);
          const splitAmount = Number(split.splittedAmount || 0);

          if (memberStats[participantId]) {
            memberStats[participantId].shareConsumed += splitAmount;
          }

          if (participantId === String(userId)) {
            monthlySpent += splitAmount;
          }
        });
      } else {
        // Equal split among all group members for this month
        const perPerson = amount / totalMemberCount;
        allMembers.forEach((m) => {
          const mId = String(m._id);
          if (memberStats[mId]) {
            memberStats[mId].shareConsumed += perPerson;
          }
        });

        monthlySpent += perPerson;
      }
    });

    // Compute net month-wise balance for each member: Net = Total Spent This Month - Share Consumed This Month
    Object.values(memberStats).forEach((stat) => {
      stat.netBalance = stat.totalSpent - stat.shareConsumed;
    });

    // Logged-in user's position for this month
    const userStat = memberStats[String(userId)] || { totalSpent: 0, shareConsumed: 0, netBalance: 0 };
    const userNetPosition = userStat.netBalance;

    if (userNetPosition > 0) {
      youAreOwedTotal += userNetPosition;
    } else if (userNetPosition < 0) {
      youOweTotal += Math.abs(userNetPosition);
    }

    // Prepare member balances array (excluding logged-in user)
    const otherMemberBalances = Object.values(memberStats)
      .filter((s) => String(s.member._id) !== String(userId))
      .map((s) => ({
        member: s.member,
        totalSpent: s.totalSpent,
        shareConsumed: s.shareConsumed,
        amount: s.netBalance,
      }));

    groupBalancesMap[group._id] = {
      totalGroupSpend,
      userTotalSpent: userStat.totalSpent,
      userShareConsumed: userStat.shareConsumed,
      netBalance: userNetPosition,
      memberBalances: otherMemberBalances,
    };
  });

  return {
    youAreOwedTotal,
    youOweTotal,
    monthlySpent,
    groupBalancesMap,
  };
};

export default calculateUserBalances;
