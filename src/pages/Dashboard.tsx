
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '../utils/currency';
import { categories } from '../utils/sampleData';
import { useExpenses } from '../contexts/ExpenseContext';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Trash2 } from 'lucide-react';
import AddExpenseDialog from '../components/AddExpenseDialog';
import AddIncomeDialog from '../components/AddIncomeDialog';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { expenses, income, deleteExpense, deleteIncome } = useExpenses();
  const { toast } = useToast();
  
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  
  const thisMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
  });

  const thisMonthIncome = income.filter(incomeItem => {
    const incomeDate = new Date(incomeItem.date);
    return incomeDate.getMonth() === currentMonth && incomeDate.getFullYear() === currentYear;
  });

  const totalThisMonthExpenses = thisMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalThisMonthIncome = thisMonthIncome.reduce((sum, incomeItem) => sum + incomeItem.amount, 0);
  const netIncome = totalThisMonthIncome - totalThisMonthExpenses;

  const categoryData = categories.map(category => ({
    name: category,
    value: thisMonthExpenses
      .filter(expense => expense.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0)
  })).filter(item => item.value > 0);

  const incomeCategories = ['Salary', 'Freelance', 'Business', 'Investment', 'Rental', 'Bonus', 'Gift', 'Other'];
  const incomeCategoryData = incomeCategories.map(category => ({
    name: category,
    value: thisMonthIncome
      .filter(incomeItem => incomeItem.category === category)
      .reduce((sum, incomeItem) => sum + incomeItem.amount, 0)
  })).filter(item => item.value > 0);

  const handleDeleteExpense = (id: string, description: string) => {
    deleteExpense(id);
    toast({
      title: "Expense Deleted",
      description: `"${description}" has been removed`,
    });
  };

  const handleDeleteIncome = (id: string, description: string) => {
    deleteIncome(id);
    toast({
      title: "Income Deleted",
      description: `"${description}" has been removed`,
    });
  };

  const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316'];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Overview of your spending patterns and financial insights</p>
        </div>
        <div className="flex space-x-2">
          <AddExpenseDialog />
          <AddIncomeDialog />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(totalThisMonthIncome)}</div>
            <p className="text-xs text-muted-foreground">Total income this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{formatCurrency(totalThisMonthExpenses)}</div>
            <p className="text-xs text-muted-foreground">Total expenses this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Income</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(netIncome)}
            </div>
            <p className="text-xs text-muted-foreground">Income minus expenses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Savings Rate</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {totalThisMonthIncome > 0 ? `${((netIncome / totalThisMonthIncome) * 100).toFixed(1)}%` : '0%'}
            </div>
            <p className="text-xs text-muted-foreground">Percentage saved</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="expenses" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="expenses">Expenses</TabsTrigger>
          <TabsTrigger value="income">Income</TabsTrigger>
        </TabsList>

        <TabsContent value="expenses" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Expenses by Category</CardTitle>
                <CardDescription>This month's expense breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {categoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Expenses</CardTitle>
                <CardDescription>Your latest transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {thisMonthExpenses.slice(0, 10).map((expense) => (
                    <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{expense.description}</p>
                        <p className="text-sm text-gray-500">{expense.category} • {expense.date}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-red-600">-{formatCurrency(expense.amount)}</p>
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
                  {thisMonthExpenses.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      <p>No expenses recorded this month</p>
                      <p className="text-sm">Add your first expense to get started!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="income" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Income by Category</CardTitle>
                <CardDescription>This month's income breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={incomeCategoryData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {incomeCategoryData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent Income</CardTitle>
                <CardDescription>Your latest income entries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {thisMonthIncome.slice(0, 10).map((incomeItem) => (
                    <div key={incomeItem.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{incomeItem.description}</p>
                        <p className="text-sm text-gray-500">{incomeItem.category} • {incomeItem.date}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <p className="font-medium text-green-600">+{formatCurrency(incomeItem.amount)}</p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteIncome(incomeItem.id, incomeItem.description)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {thisMonthIncome.length === 0 && (
                    <div className="text-center text-gray-500 py-8">
                      <p>No income recorded this month</p>
                      <p className="text-sm">Add your first income entry to get started!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;
