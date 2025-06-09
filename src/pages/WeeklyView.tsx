
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { formatCurrency } from '../utils/currency';
import { useExpenses } from '../contexts/ExpenseContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import AddExpenseDialog from '../components/AddExpenseDialog';

const WeeklyView = () => {
  const [currentWeek, setCurrentWeek] = useState(0);
  const { expenses } = useExpenses();

  const getWeekData = (weekOffset: number) => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() - (weekOffset * 7));
    
    const weekDays = Array.from({ length: 7 }, (_, i) => {
      const day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
      return day;
    });

    return weekDays.map(day => {
      const dayExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate.toDateString() === day.toDateString();
      });

      return {
        day: day.toLocaleDateString('en-US', { weekday: 'short' }),
        date: day.getDate(),
        amount: dayExpenses.reduce((sum, expense) => sum + expense.amount, 0),
        count: dayExpenses.length
      };
    });
  };

  const weekData = getWeekData(currentWeek);
  const totalWeekExpense = weekData.reduce((sum, day) => sum + day.amount, 0);
  const avgDailyExpense = totalWeekExpense / 7;

  const getWeekRange = () => {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay() - (currentWeek * 7));
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    
    return `${startOfWeek.toLocaleDateString()} - ${endOfWeek.toLocaleDateString()}`;
  };

  const last8WeeksData = Array.from({ length: 8 }, (_, i) => {
    const weekData = getWeekData(i);
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() - (i * 7));
    
    return {
      week: `Week ${i + 1}`,
      amount: weekData.reduce((sum, day) => sum + day.amount, 0)
    };
  }).reverse();

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Weekly View</h1>
          <p className="text-gray-600">Track your daily expenses throughout the week</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" onClick={() => setCurrentWeek(currentWeek + 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium px-4">{getWeekRange()}</span>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setCurrentWeek(Math.max(0, currentWeek - 1))}
              disabled={currentWeek === 0}
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
            <CardTitle>Week Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{formatCurrency(totalWeekExpense)}</div>
            <p className="text-sm text-gray-500 mt-2">Total expenses this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Daily Average</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{formatCurrency(avgDailyExpense)}</div>
            <p className="text-sm text-gray-500 mt-2">Average per day</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Highest Day</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">
              {weekData.reduce((max, day) => day.amount > max.amount ? day : max).day}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {formatCurrency(weekData.reduce((max, day) => day.amount > max.amount ? day : max).amount)}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daily Expenses</CardTitle>
          <CardDescription>Your spending pattern for {getWeekRange()}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weekData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis tickFormatter={(value) => `₹${value}`} />
              <Tooltip 
                formatter={(value) => formatCurrency(Number(value))}
                labelFormatter={(label) => `${label}`}
              />
              <Bar dataKey="amount" fill="#3B82F6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Weekly Trends</CardTitle>
          <CardDescription>Last 8 weeks comparison</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={last8WeeksData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="week" />
              <YAxis tickFormatter={(value) => `₹${value}`} />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Area type="monotone" dataKey="amount" stroke="#10B981" fill="#10B981" fillOpacity={0.3} />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daily Details</CardTitle>
          <CardDescription>Breakdown for each day of the week</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {weekData.map((day, index) => (
              <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="font-semibold text-gray-900">{day.day}</div>
                <div className="text-sm text-gray-500 mb-2">{day.date}</div>
                <div className="text-lg font-bold text-blue-600">{formatCurrency(day.amount)}</div>
                <div className="text-xs text-gray-500">{day.count} transactions</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeeklyView;
