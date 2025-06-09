
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ExpenseProvider } from "./contexts/ExpenseContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import MonthlyView from "./pages/MonthlyView";
import WeeklyView from "./pages/WeeklyView";
import DailyView from "./pages/DailyView";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <ExpenseProvider>
          <BrowserRouter>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <Navbar />
                    <Dashboard />
                  </ProtectedRoute>
                } />
                <Route path="/monthly" element={
                  <ProtectedRoute>
                    <Navbar />
                    <MonthlyView />
                  </ProtectedRoute>
                } />
                <Route path="/weekly" element={
                  <ProtectedRoute>
                    <Navbar />
                    <WeeklyView />
                  </ProtectedRoute>
                } />
                <Route path="/daily" element={
                  <ProtectedRoute>
                    <Navbar />
                    <DailyView />
                  </ProtectedRoute>
                } />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </div>
          </BrowserRouter>
        </ExpenseProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
