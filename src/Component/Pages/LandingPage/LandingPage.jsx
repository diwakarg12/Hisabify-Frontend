import React, { useState } from 'react';
import Header from '../../Common/Header/Header.jsx';
import SideNav from '../../Common/SideNavBar/SideNav.jsx';
import AddExpenseModal from '../ExpenseListPage/AddExpenseModal.jsx';
import { FaPlus } from 'react-icons/fa';

const LandingPage = ({ children }) => {
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

  return (
    <div className="h-screen max-h-screen overflow-hidden flex flex-col bg-[var(--bg-page)] text-[var(--text-primary)] font-sans">
      {/* Fixed Header */}
      <div className="h-16 shrink-0 z-40">
        <Header />
      </div>

      {/* Main Layout Container - Fixed Height */}
      <div className="flex flex-1 h-[calc(100vh-4rem)] overflow-hidden relative">
        {/* Fixed Desktop Sidebar */}
        <div className="hidden md:block h-full shrink-0 border-r border-[var(--border)] bg-[var(--surface-1)]">
          <SideNav onOpenAddExpense={() => setIsAddExpenseOpen(true)} />
        </div>

        {/* Center Content Scroll Area Only */}
        <main className="flex-1 h-full overflow-y-auto p-4 md:p-6 pb-20 md:pb-6 w-full">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>


        {/* Mobile Bottom Navigation */}
        <div className="md:hidden">
          <SideNav isMobile onOpenAddExpense={() => setIsAddExpenseOpen(true)} />
        </div>
      </div>

      {/* Global Add Expense Modal */}
      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
      />
    </div>
  );
};

export default LandingPage;
