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
  { title: "Overview", url: "/dashboard", icon: LayoutDashboard },
  { title: "Sales Training", url: "/dashboard/training", icon: Target },
  { title: "History", url: "/dashboard/history", icon: History },
];

const manageItems = [
  { title: "Teams", url: "/dashboard/teams", icon: Users },
  { title: "Billing", url: "/dashboard/billing", icon: DollarSign },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted/50";

  const isCollapsed = state === "collapsed";

  return (
    <Sidebar
      className={isCollapsed ? "w-14" : "w-64"}
      collapsible="icon"
    >
      <SidebarContent className="p-4">
        {/* Credits */}
        <div className="mb-6 p-3 bg-purple-50 rounded-lg border border-purple-200">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-purple-600" />
            <span className="text-sm font-medium text-purple-900">Credits</span>
            <Badge variant="secondary" className="ml-auto bg-purple-100 text-purple-800">
              8 min
            </Badge>
          </div>
        </div>

        {/* Dashboard Section */}
        <SidebarGroup className="mb-6">
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">
            Dashboard
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {dashboardItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="mr-3 h-4 w-4" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Manage Section */}
        <SidebarGroup className="mb-6">
          <SidebarGroupLabel className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">
            Manage
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {manageItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                  <NavLink to={item.url} className={getNavCls}>
                    <item.icon className="mr-3 h-4 w-4" />
                    {!isCollapsed && <span>{item.title}</span>}
                  </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Support */}
        <SidebarGroup className="mb-auto">
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                <NavLink to="/dashboard/support" className={getNavCls}>
                  <HelpCircle className="mr-3 h-4 w-4" />
                  {!isCollapsed && <span>Support</span>}
                </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Profile */}
        {!isCollapsed && (
          <div className="mt-auto pt-4 border-t">
            <div className="flex items-center gap-3 p-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                  M
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground truncate">
                  Matthew
                </div>
                <div className="text-xs text-muted-foreground truncate">
                  matthew@example.com
                </div>
              </div>
            </div>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}