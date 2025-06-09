import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { formatCurrency } from '../utils/currency';
import { useExpenses } from '../contexts/ExpenseContext';
import { categories } from '../utils/sampleData';
import AddExpenseDialog from '../components/AddExpenseDialog';

const MonthlyView = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const { expenses } = useExpenses();
  
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const monthlyData = months.map((month, index) => {
    const monthExpenses = expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === index && expenseDate.getFullYear() === parseInt(selectedYear);
    });
    
    return {
      month,
      amount: monthExpenses.reduce((sum, expense) => sum + expense.amount, 0),
      count: monthExpenses.length
    };
  });

  const categoryMonthlyData = categories.map(category => {
    const categoryExpenses = expenses.filter(expense => 
      expense.category === category && 
      new Date(expense.date).getFullYear() === parseInt(selectedYear)
    );
    
    return {
      category,
      amount: categoryExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    };
  }).filter(item => item.amount > 0);

  const totalYearExpense = monthlyData.reduce((sum, month) => sum + month.amount, 0);
  const avgMonthlyExpense = totalYearExpense / 12;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Monthly View</h1>
          <p className="text-gray-600">Track your expenses month by month</p>
        </div>
        <div className="flex items-center space-x-4">
          <Select value={selectedYear} onValueChange={setSelectedYear}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
              <SelectItem value="2022">2022</SelectItem>
            </SelectContent>
          </Select>
          <AddExpenseDialog />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Total {selectedYear}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{formatCurrency(totalYearExpense)}</div>
            <p className="text-sm text-gray-500 mt-2">Total expenses this year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monthly Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{formatCurrency(avgMonthlyExpense)}</div>
            <p className="text-sm text-gray-500 mt-2">Average per month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Highest Month</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {monthlyData.reduce((max, month) => month.amount > max.amount ? month : max).month}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {formatCurrency(monthlyData.reduce((max, month) => month.amount > max.amount ? month : max).amount)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Spending Trend</CardTitle>
          <CardDescription>Your spending pattern throughout {selectedYear}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" angle={-45} textAnchor="end" height={80} />
              <YAxis tickFormatter={(value) => `₹${value}`} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Line type="monotone" dataKey="amount" stroke="#3B82F6" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Breakdown</CardTitle>
            <CardDescription>Expenses by month in {selectedYear}</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" angle={-45} textAnchor="end" height={80} />
                <YAxis tickFormatter={(value) => `₹${value}`} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="amount" fill="#10B981" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Category Totals</CardTitle>
            <CardDescription>Annual spending by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={categoryMonthlyData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" tickFormatter={(value) => `₹${value}`} />
                <YAxis type="category" dataKey="category" width={100} />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Bar dataKey="amount" fill="#8B5CF6" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MonthlyView;
