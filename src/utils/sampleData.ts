
export interface Expense {
  id: string;
  amount: number;
  category: string;
  description: string;
  date: string;
}

export const categories = [
  'Food & Dining',
  'Transportation',
  'Shopping',
  'Entertainment',
  'Bills & Utilities',
  'Healthcare',
  'Education',
  'Travel',
  'Groceries',
  'Other'
];

export const generateSampleExpenses = (): Expense[] => {
  const expenses: Expense[] = [];
  const now = new Date();
  
  for (let i = 0; i < 50; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - Math.floor(Math.random() * 90));
    
    expenses.push({
      id: `exp_${i}`,
      amount: Math.floor(Math.random() * 5000) + 100,
      category: categories[Math.floor(Math.random() * categories.length)],
      description: `Sample expense ${i + 1}`,
      date: date.toISOString().split('T')[0],
    });
  }
  
  return expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const sampleExpenses = generateSampleExpenses();
