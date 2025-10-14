import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import { AuthRedirectHandler } from "@/components/AuthRedirectHandler";
import Index from "./pages/Index";
import Register from "./pages/Register";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import InterviewRoleplay from "./pages/InterviewRoleplay";
import InterviewPreparation from "./pages/InterviewPreparation";
import InterviewSession from "./pages/InterviewSession";
import InterviewResults from "./pages/InterviewResults";
import InterviewHistory from "./pages/InterviewHistory";
import Signin from "./pages/Signin";
import ProfileSetup from "./pages/ProfileSetup";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import Careers from "./pages/Careers";
import { DashboardLayout } from "./layouts/DashboardLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <AuthRedirectHandler />
        <TooltipProvider>
          <Toaster />
          <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/register" element={<Register />} />
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
            <Route path="/dashboard/interview-results" element={<InterviewResults />} />
            <Route path="/dashboard/interview-history" element={
              <DashboardLayout>
                <InterviewHistory />
              </DashboardLayout>
            } />
            <Route path="/dashboard/careers" element={
              <DashboardLayout>
                <Careers />
              </DashboardLayout>
            } />
            <Route path="/dashboard/profile" element={
              <DashboardLayout>
                <Profile />
              </DashboardLayout>
            } />
            <Route path="/dashboard/settings" element={
              <DashboardLayout>
                <Settings />
              </DashboardLayout>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
