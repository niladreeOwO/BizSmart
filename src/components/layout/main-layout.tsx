'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  LayoutDashboard,
  Wallet,
  BrainCircuit,
  BotMessageSquare,
  PanelLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/transactions', label: 'Transactions', icon: Wallet },
  { href: '/dashboard/insights', label: 'AI Insights', icon: BrainCircuit },
];

const AppSidebarHeader = () => {
  const { toggleSidebar } = useSidebar();
  return (
    <SidebarHeader className="hidden p-4 group-data-[state=collapsed]:p-2 md:flex">
      <button
        onClick={toggleSidebar}
        className="flex items-center w-full justify-start group-data-[state=collapsed]:justify-center gap-2"
      >
        <BotMessageSquare className="h-8 w-8 text-primary shrink-0" />
        <h1 className="text-xl font-bold font-headline text-foreground group-data-[state=collapsed]:hidden">
          BizSmart
        </h1>
      </button>
    </SidebarHeader>
  );
};

function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();
  
  // Mock user data
  const user = { 
    email: 'sme-owner@bizsmart.com', 
    displayName: 'SME Owner', 
    photoURL: 'https://placehold.co/40x40.png' 
  };

  const currentNavItem = navItems
      .slice()
      .sort((a, b) => b.href.length - a.href.length)
      .find((item) => pathname.startsWith(item.href));

  return (
    <div className="flex min-h-screen">
      <Sidebar className="flex flex-col group" collapsible="icon">
        <AppSidebarHeader />
        <SidebarContent className="flex-1 p-4">
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4 group-data-[state=collapsed]:p-2">
            <div
              className="w-full justify-start group-data-[state=collapsed]:justify-center gap-2 p-2 h-auto flex items-center"
            >
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={user.photoURL ?? 'https://placehold.co/40x40.png'}
                  alt={user.displayName ?? 'User'}
                  data-ai-hint="person avatar"
                />
                <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="text-left hidden group-data-[state=expanded]:block">
                <p className="text-base font-medium truncate">
                  {user.displayName}
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  {user.email}
                </p>
              </div>
            </div>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="flex-1 bg-background">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 backdrop-blur-sm px-6">
          <div className="md:hidden">
            <Link
              href="/dashboard"
              className="flex items-center gap-2"
            >
              <BotMessageSquare className="h-8 w-8 text-primary shrink-0" />
              <h1 className="text-xl font-bold font-headline text-foreground">
                BizSmart
              </h1>
            </Link>
          </div>
           <h2 className="hidden text-2xl font-bold text-foreground md:block">
              {currentNavItem?.label || 'Dashboard'}
            </h2>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleSidebar}
          >
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>
    </div>
  );
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppShell>{children}</AppShell>
    </SidebarProvider>
  );
}
