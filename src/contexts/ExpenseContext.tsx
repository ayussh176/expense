
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Expense } from '../utils/sampleData';

export interface Income {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

interface ExpenseContextType {
  expenses: Expense[];
  income: Income[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  addIncome: (income: Omit<Income, 'id'>) => void;
  deleteExpense: (id: string) => void;
  deleteIncome: (id: string) => void;
  updateExpense: (id: string, expense: Partial<Expense>) => void;
  updateIncome: (id: string, income: Partial<Income>) => void;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (!context) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};

export const ExpenseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [income, setIncome] = useState<Income[]>([]);

  useEffect(() => {
    // Load expenses from localStorage or use sample data
    const savedExpenses = localStorage.getItem('expenses');
    const savedIncome = localStorage.getItem('income');
    
    if (savedExpenses) {
      setExpenses(JSON.parse(savedExpenses));
    } else {
      // Import sample data for initial load
      import('../utils/sampleData').then(({ sampleExpenses }) => {
        setExpenses(sampleExpenses);
        localStorage.setItem('expenses', JSON.stringify(sampleExpenses));
      });
    }

    if (savedIncome) {
      setIncome(JSON.parse(savedIncome));
    }
  }, []);

  useEffect(() => {
    // Save expenses to localStorage whenever expenses change
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    // Save income to localStorage whenever income changes
    localStorage.setItem('income', JSON.stringify(income));
  }, [income]);

  const addExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    setExpenses(prev => [newExpense, ...prev]);
  };

  const addIncome = (incomeData: Omit<Income, 'id'>) => {
    const newIncome: Income = {
      ...incomeData,
      id: `inc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    setIncome(prev => [newIncome, ...prev]);
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  const deleteIncome = (id: string) => {
    setIncome(prev => prev.filter(item => item.id !== id));
  };

  const updateExpense = (id: string, updates: Partial<Expense>) => {
    setExpenses(prev => 
      prev.map(expense => 
        expense.id === id ? { ...expense, ...updates } : expense
      )
    );
  };

  const updateIncome = (id: string, updates: Partial<Income>) => {
    setIncome(prev => 
      prev.map(item => 
        item.id === id ? { ...item, ...updates } : item
      )
    );
  };

  const value = {
    expenses,
    income,
    addExpense,
    addIncome,
    deleteExpense,
    deleteIncome,
    updateExpense,
    updateIncome,
  };

  return (
    <ExpenseContext.Provider value={value}>
      {children}
    </ExpenseContext.Provider>
  );
};
