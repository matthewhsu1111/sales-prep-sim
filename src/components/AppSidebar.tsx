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
  { title: "Interview Roleplay", url: "/dashboard/roleplay", icon: Mic },
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

  return (
    <Sidebar
      className={isCollapsed ? "w-12" : "w-56"}
      collapsible="icon"
    >
      <SidebarContent className="p-3 flex flex-col h-full pt-20">
        {/* Main Navigation */}
        <SidebarGroup className="flex-1">
          <SidebarGroupContent>
            <SidebarMenu className="space-y-3">
              {dashboardItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="h-12 px-4">
                    <NavLink to={item.url} end className={getNavCls}>
                      <item.icon className="mr-3 h-5 w-5" />
                      {!isCollapsed && <span className="text-base">{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Credits Section at Bottom */}
        <div className="mt-auto">
          {!isCollapsed ? (
            <div className="p-3 bg-muted/50 rounded-lg border">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Credits</span>
                <Badge variant="secondary" className="bg-primary/10 text-primary">
                  999
                </Badge>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <Badge variant="secondary" className="bg-primary/10 text-primary text-xs">
                999
              </Badge>
            </div>
          )}
        </div>
      </SidebarContent>
    </Sidebar>
  );
}