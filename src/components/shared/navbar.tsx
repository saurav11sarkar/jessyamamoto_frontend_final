/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import {
  ChevronDown,
  Menu,
  X,
  User,
  LogOut,
  Settings,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 8);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (token) {
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/user/profile`,
            { headers: { Authorization: `Bearer ${token}` } },
          );
          const data = await response.json();
          if (data.success) setUserData(data.data);
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      }
    };
    fetchUserProfile();
  }, [token]);

  const getUserInitials = () => {
    if (userData?.firstName && userData?.lastName) {
      return `${userData.firstName[0]}${userData.lastName[0]}`.toUpperCase();
    }
    return session?.user?.email?.[0].toUpperCase() || "U";
  };

  const navLinks = [
    { label: "Find Trusted Care", href: "/#categories" },
    { label: "Cities", href: "/#cities" },
    { label: "Membership", href: "/membership" },
  ];

  if (!session) {
    navLinks.push({ label: "Become a Partner", href: "/signup" });
  }

  return (
    <>
      <nav
        className={`w-full fixed z-50 top-0 border-b border-border bg-background/95 backdrop-blur transition-all duration-300 ${scrolled ? "shadow-sm" : "shadow-none"}`}
      >
        <div className="container flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center">
              <Image
                src="/jetset-logo.webp"
                alt="JetSet Cares"
                width={1000}
                height={1000}
                className="object-cover h-[100px] w-[100px]"
                priority
              />
            </div>
          </Link>

          <div className="hidden items-center gap-6 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-foreground/70 transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}

            <div className="flex items-center gap-2 ml-2">
              {session ? (
                <DropdownMenu modal={false}>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 focus:outline-none">
                      <Avatar className="h-9 w-9 border-2 border-primary/20">
                        <AvatarImage
                          src={userData?.profileImage || ""}
                          alt={userData?.firstName || "User"}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary text-sm">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown className="h-4 w-4 text-slate-500" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5 text-black">
                      <p className="text-sm font-medium">
                        {userData?.firstName
                          ? `${userData.firstName} ${userData.lastName || ""}`
                          : session.user?.email}
                      </p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {userData?.role || "User"}
                      </p>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" /> Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/profile/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" /> Settings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="cursor-pointer text-red-600 focus:text-red-600"
                    >
                      <LogOut className="mr-2 h-4 w-4" /> Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <>
                  <Link href="/login">
                    <Button
                      variant="ghost"
                      className="text-sm font-medium text-slate-700 hover:text-slate-900"
                    >
                      Log In
                    </Button>
                  </Link>
                  <Link href="/signup">
                    <Button className="rounded-full bg-[#2ed3c7] px-6 text-sm font-semibold text-slate-950 hover:bg-[#22c1b5]">
                      Join JetSet
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center lg:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="h-10 w-10 p-0">
                  {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:max-w-sm">
                <SheetHeader>
                  <SheetTitle className="text-left">
                    <Image
                      src="/jetset-logo.webp"
                      alt="JetSet Cares"
                      width={80}
                      height={80}
                      className="h-[80px] w-[80px] object-cover"
                    />
                  </SheetTitle>
                </SheetHeader>

                <div className="mt-6 flex flex-col space-y-1">
                  {session && (
                    <div className="flex items-center gap-3 pb-4 mb-4 border-b">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={userData?.profileImage} />
                        <AvatarFallback>{getUserInitials()}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-sm">
                          {userData?.firstName || "User"}
                        </p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {userData?.role}
                        </p>
                      </div>
                    </div>
                  )}

                  {navLinks.map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className="block rounded-lg px-3 py-3 text-base font-medium text-slate-700 transition-colors hover:bg-slate-50"
                    >
                      {link.label}
                    </Link>
                  ))}

                  {session && (
                    <>
                      <Link
                        href="/profile"
                        onClick={() => setIsOpen(false)}
                        className="block rounded-lg px-3 py-3 text-base font-medium text-slate-700 transition-colors hover:bg-slate-50"
                      >
                        Profile
                      </Link>
                      <Link
                        href="/profile/settings"
                        onClick={() => setIsOpen(false)}
                        className="block rounded-lg px-3 py-3 text-base font-medium text-slate-700 transition-colors hover:bg-slate-50"
                      >
                        Settings
                      </Link>
                    </>
                  )}

                  <div className="pt-4 mt-4 border-t space-y-3">
                    {!session ? (
                      <>
                        <Link href="/login" onClick={() => setIsOpen(false)}>
                          <Button variant="outline" className="w-full">
                            Log In
                          </Button>
                        </Link>
                        <Link href="/signup" onClick={() => setIsOpen(false)}>
                          <Button className="w-full rounded-full bg-[#2ed3c7] text-slate-950 hover:bg-[#22c1b5]">
                            Join JetSet
                          </Button>
                        </Link>
                      </>
                    ) : (
                      <Button
                        variant="destructive"
                        className="w-full"
                        onClick={() => signOut({ callbackUrl: "/" })}
                      >
                        Log out
                      </Button>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
