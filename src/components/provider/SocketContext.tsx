"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useSession } from "next-auth/react";

const getSocketUrl = () => {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) return undefined;

  try {
    return new URL(apiUrl).origin;
  } catch {
    return apiUrl.replace(/\/api\/v\d+\/?$/, "");
  }
};

const SocketContext = createContext<{
  socket: Socket | null;
  onlineUsers: string[];
}>({
  socket: null,
  onlineUsers: [],
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const { data: session } = useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    if (session?.user?.accessToken && userId) {
      const newSocket = io(getSocketUrl(), {
        query: { token: session.user.accessToken },
        transports: ["websocket"],
      });

      setSocket(newSocket);

      newSocket.on("connect", () => {
        newSocket.emit("join", { userId });
      });
      newSocket.on("getOnlineUsers", (users) => setOnlineUsers(users));

      return () => {
        newSocket.off("connect");
        newSocket.off("getOnlineUsers");
        newSocket.close();
        setSocket(null);
      };
    }
  }, [session?.user?.accessToken, userId]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
