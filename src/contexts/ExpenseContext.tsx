import React, { createContext, useContext, useState, useEffect } from 'react';
import { Expense } from '../utils/sampleData';
import { useAuth } from './AuthContext';
import { db } from '../config/firebase';
import {
  doc, getDoc, setDoc, updateDoc
} from 'firebase/firestore';

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
  const { currentUser } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [income, setIncome] = useState<Income[]>([]);

  const userDocRef = currentUser ? doc(db, 'users', currentUser.uid) : null;

  useEffect(() => {
    if (!currentUser) return;

    const fetchData = async () => {
      const docSnap = await getDoc(userDocRef!);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setExpenses(data.expenses || []);
        setIncome(data.income || []);
      }
    };

    fetchData();
  }, [currentUser]);

  const saveData = async (updatedExpenses: Expense[], updatedIncome: Income[]) => {
    if (!userDocRef) return;
    await setDoc(userDocRef, { expenses: updatedExpenses, income: updatedIncome });
  };

  const addExpense = (expenseData: Omit<Expense, 'id'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: `exp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    const updated = [newExpense, ...expenses];
    setExpenses(updated);
    saveData(updated, income);
  };

  const addIncome = (incomeData: Omit<Income, 'id'>) => {
    const newIncome: Income = {
      ...incomeData,
      id: `inc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    };
    const updated = [newIncome, ...income];
    setIncome(updated);
    saveData(expenses, updated);
  };

  const deleteExpense = (id: string) => {
    const updated = expenses.filter(exp => exp.id !== id);
    setExpenses(updated);
    saveData(updated, income);
  };

  const deleteIncome = (id: string) => {
    const updated = income.filter(inc => inc.id !== id);
    setIncome(updated);
    saveData(expenses, updated);
  };

  const updateExpense = (id: string, updates: Partial<Expense>) => {
    const updated = expenses.map(exp => exp.id === id ? { ...exp, ...updates } : exp);
    setExpenses(updated);
    saveData(updated, income);
  };

  const updateIncome = (id: string, updates: Partial<Income>) => {
    const updated = income.map(inc => inc.id === id ? { ...inc, ...updates } : inc);
    setIncome(updated);
    saveData(expenses, updated);
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
