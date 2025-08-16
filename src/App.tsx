import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import Index from "./pages/Index";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import InterviewRoleplay from "./pages/InterviewRoleplay";
import InterviewPreparation from "./pages/InterviewPreparation";
import InterviewSession from "./pages/InterviewSession";
import Signin from "./pages/Signin";
import ProfileSetup from "./pages/ProfileSetup";
import NotFound from "./pages/NotFound";
import { DashboardLayout } from "./layouts/DashboardLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signin" element={<Signin />} />
            <Route path="/profile-setup" element={<ProfileSetup />} />
            <Route path="/dashboard" element={
              <DashboardLayout>
                <Dashboard />
              </DashboardLayout>
            } />
            <Route path="/dashboard/interview-roleplay" element={
              <DashboardLayout>
                <InterviewRoleplay />
              </DashboardLayout>
            } />
            <Route path="/dashboard/interview-preparation" element={
              <DashboardLayout>
                <InterviewPreparation />
              </DashboardLayout>
            } />
            <Route path="/dashboard/interview-session" element={<InterviewSession />} />
            <Route path="/dashboard/careers" element={
              <DashboardLayout>
                <div className="p-6">
                  <h1 className="text-3xl font-bold">Careers</h1>
                  <p className="text-muted-foreground mt-2">Coming soon...</p>
                </div>
              </DashboardLayout>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
