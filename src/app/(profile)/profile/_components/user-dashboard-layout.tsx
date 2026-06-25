"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  User,
  Settings,
  Briefcase,
  Menu,
  LogOut,
  ChevronRight,
  MessageSquare,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const UserDashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const menuItems = [
    {
      label: "Edit Profile",
      icon: User,
      href: "/profile",
      show: true,
    },
    {
      label: "My Bookings",
      icon: Calendar,
      href: "/profile/bookings",
      show: true,
    },
    {
      label: "My Services",
      icon: Briefcase,
      href: "/profile/services",
      show: true,
    },
    {
      label: "Messages",
      icon: MessageSquare,
      href: "/profile/messages",
      show: true,
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/profile/settings",
      show: true,
    },
  ];

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOut({ callbackUrl: "/" });
    setIsLoggingOut(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* --- Mobile Sidebar Overlay --- */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* --- Sidebar --- */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 bg-[#00D1C1] text-slate-900 transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="flex justify-center items-center py-8 px-6 border-b border-white/20">
            <Link
              href="/"
              onClick={() => setIsSidebarOpen(false)}
              className="w-full"
            >
              <div className="relative w-full h-24 bg-white rounded-xl p-3 shadow-md flex items-center justify-center">
                <Image
                  src="/jetset-logo.webp"
                  alt="JetSet Cares"
                  width={220}
                  height={80}
                  className="object-contain w-auto h-full"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Navigation Items */}
          <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
            {menuItems.map(
              (item) =>
                item.show && (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsSidebarOpen(false)}
                    className={cn(
                      "flex items-center justify-between px-4 py-3 rounded-lg transition-all duration-200 group",
                      pathname === item.href
                        ? "bg-white/30 text-slate-900 font-semibold shadow-md backdrop-blur-sm"
                        : "hover:bg-white/20 text-slate-800 hover:text-slate-900",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={20} />
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                    {pathname === item.href && <ChevronRight size={16} />}
                  </Link>
                ),
            )}
          </nav>

          {/* Logout Section */}
          <div className="p-4 border-t border-white/20">
            <button
              onClick={() => setIsLogoutDialogOpen(true)}
              className="flex items-center gap-3 px-4 py-3 w-full text-slate-800 hover:text-red-600 transition-colors rounded-lg hover:bg-white/20"
            >
              <LogOut size={20} />
              <span className="text-sm font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header (Mobile Toggle) */}
        <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-gray-200 lg:hidden sticky top-0 z-30 shadow-sm">
          <Link href="/">
            <div className="relative w-40 h-12">
              <Image
                src="/jetset-logo.webp"
                alt="JetSet Cares"
                fill
                className="object-contain"
                priority
              />
            </div>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            <Menu size={24} />
          </button>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 lg:p-6">
          <div className="mx-auto">{children}</div>
        </main>
      </div>

      {/* Logout Confirmation Dialog */}
      <Dialog open={isLogoutDialogOpen} onOpenChange={setIsLogoutDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Logout</DialogTitle>
            <DialogDescription>
              Are you sure you want to logout? You&apos;ll need to login again
              to access your account.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-3 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsLogoutDialogOpen(false)}
              disabled={isLoggingOut}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Logging out..." : "Logout"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserDashboardLayout;
