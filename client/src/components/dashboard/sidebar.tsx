import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { SicrediLogo } from "@/components/ui/sicredi-logo";
import { 
  LayoutDashboard, 
  ListChecks, 
  Settings, 
  LogOut 
} from "lucide-react";

interface SidebarProps {
  active: "dashboard" | "submissions" | "settings";
}

export function Sidebar({ active }: SidebarProps) {
  const [location, navigate] = useLocation();
  const { logoutMutation } = useAuth();
  
  const handleLogout = () => {
    logoutMutation.mutate();
    navigate("/auth");
  };

  return (
    <div className="w-64 bg-gray-800 text-white flex flex-col h-full">
      <div className="p-4 bg-[#33820D]">
        <SicrediLogo className="h-8 mx-auto" />
        <h2 className="text-xl font-semibold text-center mt-2">Sicredi Admin</h2>
      </div>
      
      <nav className="mt-6 flex-1">
        <ul>
          <li>
            <Link href="/admin">
              <a className={cn(
                "flex items-center px-6 py-3 hover:bg-gray-700 text-white",
                active === "dashboard" && "bg-gray-700"
              )}>
                <LayoutDashboard className="w-5 h-5 mr-3" />
                <span>Dashboard</span>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/admin/submissions">
              <a className={cn(
                "flex items-center px-6 py-3 hover:bg-gray-700 text-white",
                active === "submissions" && "bg-gray-700"
              )}>
                <ListChecks className="w-5 h-5 mr-3" />
                <span>Submissões</span>
              </a>
            </Link>
          </li>
          <li>
            <Link href="/admin/settings">
              <a className={cn(
                "flex items-center px-6 py-3 hover:bg-gray-700 text-white",
                active === "settings" && "bg-gray-700"
              )}>
                <Settings className="w-5 h-5 mr-3" />
                <span>Configurações</span>
              </a>
            </Link>
          </li>
        </ul>
      </nav>
      
      <div className="p-4 border-t border-gray-700">
        <Button
          variant="ghost"
          className="flex items-center w-full text-white hover:bg-gray-700"
          onClick={handleLogout}
        >
          <LogOut className="w-5 h-5 mr-2" />
          <span>Sair</span>
        </Button>
      </div>
    </div>
  );
}
