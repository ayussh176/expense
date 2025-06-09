import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../utils/currency';
import { categories } from '../utils/sampleData';
import { useExpenses } from '../contexts/ExpenseContext';
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import AddExpenseDialog from '../components/AddExpenseDialog';
import { useToast } from '@/hooks/use-toast';

const DailyView = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const { expenses, deleteExpense } = useExpenses();
  const { toast } = useToast();
  
  const getDayExpenses = (date: string) => {
    return expenses.filter(expense => expense.date === date);
  };

  const dayExpenses = getDayExpenses(selectedDate);
  const totalDayExpense = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const last7DaysData = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dateString = date.toISOString().split('T')[0];
    const dayExpenses = getDayExpenses(dateString);
    
    return {
      date: date.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' }),
      amount: dayExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    };
  }).reverse();

  const navigateDate = (direction: 'prev' | 'next') => {
    const date = new Date(selectedDate);
    if (direction === 'prev') {
      date.setDate(date.getDate() - 1);
    } else {
      date.setDate(date.getDate() + 1);
    }
    setSelectedDate(date.toISOString().split('T')[0]);
  };

  const categoryBreakdown = categories.map(category => {
    const categoryExpenses = dayExpenses.filter(expense => expense.category === category);
    const amount = categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    return { category, amount, count: categoryExpenses.length };
  }).filter(item => item.amount > 0);

  const handleDeleteExpense = (id: string, description: string) => {
    deleteExpense(id);
    toast({
      title: "Expense Deleted",
      description: `"${description}" has been removed`,
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Daily View</h1>
          <p className="text-gray-600">Track your expenses day by day</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => navigateDate('prev')}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-40"
            />
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => navigateDate('next')}
              disabled={selectedDate >= new Date().toISOString().split('T')[0]}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          <AddExpenseDialog />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Today's Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{formatCurrency(totalDayExpense)}</div>
            <p className="text-sm text-gray-500 mt-2">{dayExpenses.length} transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Transaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {formatCurrency(dayExpenses.length > 0 ? totalDayExpense / dayExpenses.length : 0)}
            </div>
            <p className="text-sm text-gray-500 mt-2">Per transaction</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Categories Used</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">{categoryBreakdown.length}</div>
            <p className="text-sm text-gray-500 mt-2">Different categories</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Last 7 Days Trend</CardTitle>
          <CardDescription>Daily spending comparison</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={last7DaysData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis tickFormatter={(value) => `₹${value}`} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Bar dataKey="amount" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
            <CardDescription>Spending by category for {new Date(selectedDate).toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {categoryBreakdown.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Badge variant="secondary">{item.count}</Badge>
                    <span>{item.category}</span>
                  </div>
                  <span className="font-semibold">{formatCurrency(item.amount)}</span>
                </div>
              ))}
              {categoryBreakdown.length === 0 && (
                <p className="text-center text-gray-500 py-8">No expenses recorded for this day</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
            <CardDescription>All expenses for {new Date(selectedDate).toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {dayExpenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{expense.description}</p>
                    <Badge variant="outline" className="text-xs mt-1">{expense.category}</Badge>
                  </div>
                  <div className="flex items-center space-x-2">
                    <p className="font-semibold">{formatCurrency(expense.amount)}</p>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteExpense(expense.id, expense.description)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {dayExpenses.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <p>No expenses recorded for this day</p>
                  <p className="text-sm mt-2">Add your first expense to get started!</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DailyView;
