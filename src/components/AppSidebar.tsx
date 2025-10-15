import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  BarChart3,
  Target,
  History,
  Users,
  DollarSign,
  HelpCircle,
  LayoutDashboard,
  Mic,
  Clock,
  Flame
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";

const dashboardItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Interview Roleplay", url: "/dashboard/interview-roleplay", icon: Mic },
  { title: "Careers", url: "/dashboard/careers", icon: Target },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const [currentStreak, setCurrentStreak] = useState<number>(0);

  useEffect(() => {
    fetchStreak();
  }, []);

  const fetchStreak = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data } = await supabase
      .from('user_progress')
      .select('current_streak')
      .eq('user_id', user.id)
      .maybeSingle();

    if (data) {
      setCurrentStreak(data.current_streak || 0);
    }
  };

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary/10 text-primary font-medium border-l-4 border-primary" : "hover:bg-muted/50";

  const isCollapsed = state === "collapsed";

  if (isCollapsed) {
    return (
      <Sidebar className="w-0 overflow-hidden" collapsible="icon">
        <SidebarContent className="hidden" />
      </Sidebar>
    );
  }

  return (
    <Sidebar className="w-64" collapsible="icon">
      <SidebarContent className="flex flex-col h-full p-3 pt-20">
        {/* Streak Counter */}
        {currentStreak > 0 && (
          <div className="mb-4 p-3 bg-gradient-to-r from-orange-50 to-red-50 rounded-lg border border-orange-200">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <div className="flex flex-col">
                <span className="text-lg font-bold text-orange-600">{currentStreak}</span>
                <span className="text-xs text-muted-foreground">Day Streak</span>
              </div>
            </div>
          </div>
        )}

        {/* Main Navigation */}
        <SidebarGroup className="flex-1">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-3">
              {dashboardItems.map((item) => {
                const isCurrentPage = isActive(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild className="h-12 px-4">
                      <NavLink 
                        to={item.url} 
                        end 
                        className={isCurrentPage ? "bg-primary/10 text-primary font-medium border-l-4 border-primary" : "hover:bg-muted/50"}
                      >
                        <item.icon className="mr-3 h-5 w-5" />
                        <span className="text-base">{item.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}