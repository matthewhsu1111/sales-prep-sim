import { useState } from "react";
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
  Clock
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

const dashboardItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Interview Roleplay", url: "/dashboard/interview-roleplay", icon: Mic },
  { title: "Careers", url: "/dashboard/careers", icon: Target },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

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