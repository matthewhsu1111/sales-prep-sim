import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/components/AuthProvider";
import { AuthRedirectHandler } from "@/components/AuthRedirectHandler";
import ScrollToTop from "@/components/ScrollToTop";
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
import Leaderboards from "./pages/Leaderboards";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import CompareYoodli from "./pages/CompareYoodli";
import CompareCluely from "./pages/CompareCluely";
import CompareFinalRoundAI from "./pages/CompareFinalRoundAI";
import { DashboardLayout } from "./layouts/DashboardLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <AuthRedirectHandler />
        <TooltipProvider>
          <Toaster />
          <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/compare/cadenceai-vs-yoodli" element={<CompareYoodli />} />
          <Route path="/compare/yoodli" element={<Navigate to="/compare/cadenceai-vs-yoodli" replace />} />
          <Route path="/compare/cadenceai-vs-cluely" element={<CompareCluely />} />
          <Route path="/compare/cadenceai-vs-final-round-ai" element={<CompareFinalRoundAI />} />
          <Route path="/compare/final-round-ai" element={<Navigate to="/compare/cadenceai-vs-final-round-ai" replace />} />
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
            <Route path="/interview-session/:jobId" element={<InterviewSession />} />
            <Route path="/interview-results" element={<InterviewResults />} />
            <Route path="/dashboard/interview-history" element={
              <DashboardLayout>
                <InterviewHistory />
              </DashboardLayout>
            } />
            <Route path="/dashboard/careerrss" element={
              <DashboardLayout>
                <Careers />
              </DashboardLayout>
            } />
            <Route path="/dashboard/leaderboards" element={
              <DashboardLayout>
                <Leaderboards />
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
