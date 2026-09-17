/**
 * HisabiFY Money and Date Formatters
 * Strict adherence to Product Rules (Section 4.1 & 4.2)
 */

export const CATEGORY_COLORS = {
  groceries:     '#1D9E75',
  foodDining:    '#D85A30',
  transport:     '#378ADD',
  utilities:     '#7F77DD',
  health:        '#97C459',
  entertainment: '#EF9F27',
  shopping:      '#D4537E',
  education:     '#185FA5',
  rent:          '#5F5E5A',
  lentMoney:     '#10B981',
  borrowedMoney: '#EF4444',
  custom:        '#0D9488',
  other:         '#B4B2A9',
};

/**
 * Checks if a given category name is a user-created custom category vs standard built-in category
 */
export const isCustomCategory = (categoryName) => {
  if (!categoryName) return false;
  const normalized = String(categoryName).toLowerCase().trim();
  const standardCategories = [
    'groceries',
    'food & dining',
    'fooddining',
    'food',
    'rent & bills',
    'rent',
    'home',
    'travel & fuel',
    'transport',
    'travel',
    'cab',
    'fuel',
    'shopping',
    'entertainment',
    'medical',
    'health',
    'trip & vacation',
    'trip',
    'vacation',
    'utilities',
    'bills',
    'education',
    'other',
  ];
  return !standardCategories.includes(normalized);
};

/**
 * Format raw amounts into locale-aware money strings.
 * - Always shows currency symbol (e.g. ₹78,167)
 * - Locale-aware grouping (e.g. Indian grouping system ₹1,23,456 for en-IN)
 * - Whole rounding for summaries by default, paise shown only if showPaise = true
 * - Never returns unformatted float
 */
export const formatMoney = (
  amount,
  currency = 'INR',
  locale = 'en-IN',
  showPaise = false
) => {
  if (amount === undefined || amount === null || isNaN(Number(amount))) {
    return '₹0';
  }
  const numericAmount = Number(amount);
  const roundedAmount = showPaise ? numericAmount : Math.round(numericAmount);

  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency || 'INR',
      maximumFractionDigits: showPaise ? 2 : 0,
      minimumFractionDigits: showPaise ? 2 : 0,
    }).format(roundedAmount);
  } catch (error) {
    // Fallback if locale/currency fails
    return `${currency === 'INR' ? '₹' : currency + ' '}${roundedAmount.toLocaleString(locale)}`;
  }
};

/**
 * Format dates into relative terms: "Today", "Yesterday", "X days ago"
 * Fallback format: 26 Aug 2026 (Never includes day of the week)
 */
export const formatRelativeDate = (dateInput) => {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return String(dateInput);

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfTarget = new Date(date.getFullYear(), date.getMonth(), date.getDate());

  const diffTime = startOfToday.getTime() - startOfTarget.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays > 1 && diffDays <= 7) return `${diffDays} days ago`;

  // Standard fallback format: "26 Aug 2026"
  const day = date.getDate();
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
};

/**
 * Format added on timestamp with date and time (e.g. 17 Sep 2026 at 2:30 PM)
 */
export const formatAddedOnDate = (dateInput) => {
  if (!dateInput) return '';
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return '';

  const day = date.getDate();
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const ampm = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12;

  return `${day} ${month} ${year}, ${hours}:${minutes} ${ampm}`;
};

/**
 * Normalizes category names to match CATEGORY_COLORS keys
 */
export const getCategoryColor = (categoryName) => {
  if (!categoryName) return CATEGORY_COLORS.other;
  const normalized = String(categoryName)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '');

  if (normalized.includes('grocery') || normalized.includes('groceries')) return CATEGORY_COLORS.groceries;
  if (normalized.includes('food') || normalized.includes('dining') || normalized.includes('restaurant')) return CATEGORY_COLORS.foodDining;
  if (normalized.includes('transport') || normalized.includes('cab') || normalized.includes('fuel')) return CATEGORY_COLORS.transport;
  if (normalized.includes('utilit') || normalized.includes('bill') || normalized.includes('electricity')) return CATEGORY_COLORS.utilities;
  if (normalized.includes('health') || normalized.includes('medical') || normalized.includes('pharma')) return CATEGORY_COLORS.health;
  if (normalized.includes('entertain') || normalized.includes('movie') || normalized.includes('fun')) return CATEGORY_COLORS.entertainment;
  if (normalized.includes('shop') || normalized.includes('cloth')) return CATEGORY_COLORS.shopping;
  if (normalized.includes('edu') || normalized.includes('course') || normalized.includes('book')) return CATEGORY_COLORS.education;
  if (normalized.includes('rent') || normalized.includes('home') || normalized.includes('stay')) return CATEGORY_COLORS.rent;
  if (normalized.includes('lent') || normalized.includes('lend') || normalized.includes('friend')) return CATEGORY_COLORS.lentMoney;
  if (normalized.includes('borrow') || normalized.includes('loan')) return CATEGORY_COLORS.borrowedMoney;

  return CATEGORY_COLORS.other;
};
