"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSocket } from "@/components/provider/SocketContext";

interface NotificationItem {
  _id: string;
  type: string;
  title: string;
  message: string;
  bookingId?: string;
  conversationId?: string;
  messageId?: string;
  read: boolean;
  createdAt: string;
}

const timeAgo = (dateString: string) => {
  const seconds = Math.floor(
    (Date.now() - new Date(dateString).getTime()) / 1000,
  );
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

export function NotificationBell({ mobile = false }: { mobile?: boolean }) {
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const { socket } = useSocket();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: unreadData } = useQuery<{ data: { count: number } }>({
    queryKey: ["notificationUnreadCount"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/notification/unread-count`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (!res.ok) throw new Error("Failed to fetch unread count");
      return res.json();
    },
    enabled: !!token,
    refetchInterval: 60000,
  });

  const { data: listData } = useQuery<{ data: NotificationItem[] }>({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/notification?limit=10`,
        { headers: { Authorization: `Bearer ${token}` } },
      );
      if (!res.ok) throw new Error("Failed to fetch notifications");
      return res.json();
    },
    enabled: !!token && open,
  });

  useEffect(() => {
    if (!socket) return;
    const handler = () => {
      queryClient.invalidateQueries({ queryKey: ["notificationUnreadCount"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    };
    socket.on("notification", handler);
    return () => {
      socket.off("notification", handler);
    };
  }, [socket, queryClient]);

  const unreadCount = unreadData?.data?.count || 0;
  const notifications = listData?.data || [];

  const handleNotificationClick = async (item: NotificationItem) => {
    setOpen(false);
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/notification/${item._id}/read`,
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      queryClient.invalidateQueries({ queryKey: ["notificationUnreadCount"] });
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    } catch {
      // non-blocking — still navigate even if marking read fails
    }
    if (item.conversationId) {
      router.push(`/profile/messages/${item.conversationId}`);
    } else if (item.bookingId) {
      router.push(`/profile/bookings?bookingId=${item.bookingId}`);
    }
  };

  if (!session) return null;

  if (mobile) {
    return (
      <button
        onClick={() => router.push("/profile/messages")}
        className="relative flex items-center gap-2 rounded-lg px-3 py-3 text-base font-medium text-slate-700 transition-colors hover:bg-slate-50"
      >
        <Bell className="h-5 w-5" />
        Notifications
        {unreadCount > 0 && (
          <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-semibold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>
    );
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <button className="relative rounded-full p-2 text-slate-600 hover:bg-slate-100 focus:outline-none">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0">
        <div className="border-b px-4 py-3">
          <p className="text-sm font-semibold text-slate-800">Notifications</p>
        </div>
        <div className="max-h-96 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="px-4 py-6 text-center text-sm text-slate-400">
              No notifications yet
            </p>
          ) : (
            notifications.map((item) => (
              <button
                key={item._id}
                onClick={() => handleNotificationClick(item)}
                className={`block w-full border-b border-slate-50 px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-slate-50 ${
                  item.read ? "" : "bg-primary/5"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-slate-800">
                    {item.title}
                  </p>
                  {!item.read && (
                    <span className="mt-1 h-2 w-2 flex-shrink-0 rounded-full bg-primary" />
                  )}
                </div>
                <p className="mt-0.5 text-xs text-slate-500">{item.message}</p>
                <p className="mt-1 text-[11px] text-slate-400">
                  {timeAgo(item.createdAt)}
                </p>
              </button>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
