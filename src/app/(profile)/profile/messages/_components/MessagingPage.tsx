/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { Search, Send } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { useSocket } from "@/components/provider/SocketContext";
import { toast } from "sonner";

const getAvatarUrl = (value?: string | string[]) =>
  Array.isArray(value) ? value[0] || "/default-avatar.jpg" : value || "/default-avatar.jpg";

const getId = (value: any) => String(value?._id || value || "");

const getOtherUser = (chat: any, myId?: string) =>
  chat?.participants?.find((p: any) => p?._id && getId(p) !== String(myId));

const isValidConversation = (chat: any, myId?: string) =>
  Boolean(chat?._id && getOtherUser(chat, myId));

const sortConversations = (items: any[]) =>
  [...items].sort(
    (a, b) =>
      new Date(b.lastMessageAt || b.updatedAt || b.createdAt || 0).getTime() -
      new Date(a.lastMessageAt || a.updatedAt || a.createdAt || 0).getTime(),
  );

interface MessagingPageProps {
  initialConversationId?: string;
}

export default function MessagingPage({ initialConversationId }: MessagingPageProps) {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const myId = (session?.user as any)?.id;
  const { socket } = useSocket();

  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversationId, setSelectedConversationId] = useState<string>(
    initialConversationId || "",
  );
  const [messages, setMessages] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [isSending, setIsSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const selectedChat =
    conversations.find((chat) => String(chat._id) === selectedConversationId) || null;

  const fetchConversations = React.useCallback(async () => {
    if (!token || !baseUrl) return;

    try {
      const res = await fetch(`${baseUrl}/conversation/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (data.success) {
        const sorted = sortConversations(
          data.data.filter((chat: any) => isValidConversation(chat, myId)),
        );
        setConversations(sorted);

        if (initialConversationId) {
          const initialChat = sorted.find(
            (chat: any) => String(chat._id) === String(initialConversationId),
          );
          if (initialChat) {
            setSelectedConversationId(String(initialChat._id));
          } else if (sorted.length > 0) {
            setSelectedConversationId(String(sorted[0]._id));
          }
        }
      }
    } catch (err) {
      console.error("Conversation fetch error", err);
    }
  }, [baseUrl, initialConversationId, myId, token]);

  const addMessage = React.useCallback((newMessage: any) => {
    setMessages((prev) => {
      if (prev.some((msg) => String(msg._id) === String(newMessage._id))) {
        return prev;
      }

      return [...prev, newMessage];
    });
  }, []);

  const updateConversationPreview = React.useCallback((newMessage: any) => {
    const conversationId = getId(newMessage.conversationId);
    const messageTime =
      newMessage.createdAt || newMessage.lastMessageAt || new Date().toISOString();

    setConversations((prev) =>
      sortConversations(
        prev.map((c) =>
          String(c._id) === conversationId
            ? {
                ...c,
                lastMessage: newMessage.message,
                lastMessageAt: messageTime,
                updatedAt: messageTime,
                unreadCount:
                  getId(newMessage.receiverId) === String(myId) &&
                  conversationId !== selectedConversationId
                    ? (c.unreadCount || 0) + 1
                    : c.unreadCount || 0,
              }
            : c,
        ),
      ),
    );
  }, [myId, selectedConversationId]);

  // ১. সব কনভারসেশন ফেচ করা
  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // ২. সিলেক্টেড চ্যাটের মেসেজ ফেচ করা
  useEffect(() => {
    if (!selectedConversationId || !token || !baseUrl) return;
    const fetchMessages = async () => {
      try {
        const res = await fetch(
          `${baseUrl}/message/conversation/${selectedConversationId}/messages`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        const data = await res.json();
        if (data.success) {
          setMessages(data.data);
          setConversations((prev) =>
            prev.map((chat) =>
              String(chat._id) === String(selectedConversationId)
                ? { ...chat, unreadCount: 0 }
                : chat,
            ),
          );
        } else {
          toast.error(data.message || "Failed to load messages.");
        }
      } catch (err) {
        console.error("Message fetch error", err);
        toast.error("Failed to load messages.");
      }
    };
    fetchMessages();
  }, [selectedConversationId, token, baseUrl]);

  useEffect(() => {
    if (!socket || !selectedConversationId) return;

    socket.emit("joinConversation", { conversationId: selectedConversationId });
  }, [socket, selectedConversationId]);

  // ৩. সকেট লিসেনার
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage: any) => {
      const conversationId = getId(newMessage.conversationId);

      if (conversationId === selectedConversationId) {
        addMessage(newMessage);
      }
      updateConversationPreview(newMessage);
    };

    const handleMessageReceived = (newMessage: any) => {
      const conversationId = getId(newMessage.conversationId);

      if (conversationId === selectedConversationId) {
        fetch(`${baseUrl}/message/conversation/${conversationId}/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) setMessages(data.data);
          })
          .catch((err) => console.error("Message refresh error", err));
      }

      updateConversationPreview(newMessage);
      fetchConversations();
    };

    const handleConversationRead = ({ conversationId }: { conversationId: string }) => {
      setConversations((prev) =>
        prev.map((chat) =>
          String(chat._id) === String(conversationId)
            ? { ...chat, unreadCount: 0 }
            : chat,
        ),
      );
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("messageReceived", handleMessageReceived);
    socket.on("conversationRead", handleConversationRead);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("messageReceived", handleMessageReceived);
      socket.off("conversationRead", handleConversationRead);
    };
  }, [
    addMessage,
    baseUrl,
    fetchConversations,
    selectedConversationId,
    socket,
    token,
    updateConversationPreview,
  ]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // ১. বেসিক চেক
    if (!inputValue.trim() || !selectedChat || !token || !baseUrl) {
      return;
    }

    // ২. আপনার এপিআই রেসপন্স অনুযায়ী রিসিভার আইডি বের করা
    // যেহেতু participants এ একজনই থাকছে, আমরা সরাসরি প্রথমজনকে নিচ্ছি
    const otherUser = getOtherUser(selectedChat, myId);
    const receiverId = getId(otherUser);

    if (!receiverId) {
      console.error("Receiver ID not found in participants array");
      toast.error("Receiver not found for this conversation.");
      return;
    }

    const payload = {
      conversationId: selectedChat._id,
      receiverId: receiverId,
      message: inputValue.trim(),
    };

    setIsSending(true);
    try {
      const res = await fetch(`${baseUrl}/message/send`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      
      if (res.ok && result.success) {
        // মেসেজ লিস্ট আপডেট করা
        addMessage(result.data);
        setInputValue("");
        
        // কনভারসেশন লিস্টে লাস্ট মেসেজ আপডেট করা
        updateConversationPreview(result.data);
      } else {
        console.error("API Error Response:", result);
        toast.error(result.message || "Failed to send message.");
      }
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("Failed to send message.");
    } finally {
      setIsSending(false);
    }
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const visibleConversations = conversations.filter((chat) => {
    const otherUser = getOtherUser(chat, myId);
    const searchableText = [
      otherUser?.firstName,
      otherUser?.lastName,
      otherUser?.role,
      chat.lastMessage,
    ]
      .filter(Boolean)
      .join(" ");

    return searchableText.toLowerCase().includes(searchValue.toLowerCase());
  });

  return (
    <div className="flex h-[calc(100vh-100px)] bg-white overflow-hidden font-sans border rounded-lg m-4 shadow-sm">
      {/* Sidebar */}
      <div className="w-1/3 border-r flex flex-col bg-slate-50/50">
        <div className="p-4 border-b bg-white">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-10 bg-gray-100 border-none rounded-lg"
              placeholder="Search Message ......"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {visibleConversations.map((chat) => {
            const otherUser = getOtherUser(chat, myId);
            const previewTime = chat.lastMessageAt || chat.updatedAt || chat.createdAt;
            return (
              <div
                key={chat._id}
                onClick={() => setSelectedConversationId(String(chat._id))}
                className={`flex items-center gap-3 p-4 cursor-pointer border-b transition-colors ${
                  selectedConversationId === String(chat._id)
                    ? "bg-[#BDE3F9]"
                    : "hover:bg-gray-100 bg-white"
                }`}
              >
                <Avatar className="h-12 w-12 border">
                  <AvatarImage
                    src={getAvatarUrl(otherUser?.profileImage)}
                  />
                  <AvatarFallback>
                    {otherUser?.firstName?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 overflow-hidden">
                  <div className="flex justify-between items-center">
                    <h4 className="font-bold text-[#001F3F] truncate">
                      {otherUser?.firstName || "User"}
                    </h4>
                    <span className="text-[10px] text-gray-400 font-medium">
                      {previewTime ? format(new Date(previewTime), "hh:mm a") : ""}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-1">
                    {chat.lastMessage || "Start a conversation"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedChat ? (
          <>
            <div className="p-4 border-b flex items-center gap-3 bg-white">
              <Avatar className="h-10 w-10 border">
                <AvatarImage
                  src={getAvatarUrl(
                    getOtherUser(selectedChat, myId)?.profileImage,
                  )}
                />
              </Avatar>
              <div>
                <h4 className="font-bold text-[#001F3F]">
                  {getOtherUser(selectedChat, myId)?.firstName || "User"}
                </h4>
                  <p className="text-[10px] text-green-600 font-semibold uppercase tracking-wider">
                  Online
                </p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
              {messages.map((msg) => {
                const isMe =
                  getId(msg.senderId) === String(myId);
                return (
                  <div
                    key={msg._id}
                    className={`flex ${isMe ? "justify-end" : "justify-start"} items-end gap-2`}
                  >
                    {!isMe && (
                      <Avatar className="h-8 w-8 border">
                        <AvatarImage src="/default-avatar.jpg" />
                      </Avatar>
                    )}
                    <div
                      className={`max-w-[70%] p-3 px-4 rounded-2xl text-[13px] leading-relaxed shadow-sm ${
                        isMe
                          ? "bg-[#BDE3F9] text-gray-800 rounded-br-none"
                          : "bg-white border text-gray-800 rounded-bl-none"
                      }`}
                    >
                      {msg.message}
                    </div>
                  </div>
                );
              })}
              <div ref={scrollRef} />
            </div>

            <div className="p-4 bg-white border-t">
              <form
                onSubmit={handleSendMessage}
                className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-full px-4 py-1.5 focus-within:border-blue-300 transition-all"
              >
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Write Here"
                  className="border-none focus-visible:ring-0 shadow-none text-sm bg-transparent"
                  disabled={isSending}
                />
                <button
                  type="submit"
                  disabled={isSending || !inputValue.trim()}
                  className="bg-[#007A33] hover:bg-green-700 p-2.5 rounded-full transition-all disabled:opacity-30 flex-shrink-0"
                >
                  <Send
                    className={`h-4 w-4 text-white ${isSending ? "animate-pulse" : ""}`}
                  />
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-slate-50">
            <div className="p-4 bg-white rounded-full shadow-inner mb-2 italic">
              Select a conversation
            </div>
            <p className="text-xs">
              Select a user from the left to start messaging
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
