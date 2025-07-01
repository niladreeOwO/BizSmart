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
  Settings,
  LogOut,
  MessageCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import AIAssistant from '../chat/ai-assistant';


const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/transactions', label: 'Transactions', icon: Wallet },
  { href: '/dashboard/insights', label: 'AI Insights', icon: BrainCircuit },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
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
  const { user, logout } = useAuth();
  const [isAssistantOpen, setAssistantOpen] = React.useState(false);

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
                  isActive={item.href === '/' ? pathname === item.href : pathname.startsWith(item.href)}
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
             <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => setAssistantOpen(true)}
                  tooltip="AI Assistant"
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>AI Assistant</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4 mt-auto group-data-[state=collapsed]:p-2">
           <div className="group-data-[state=expanded]:block hidden mb-4">
            <Button className="w-full">
              Add Transaction
            </Button>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className="w-full justify-start group-data-[state=collapsed]:justify-center gap-2 p-2 h-auto flex items-center rounded-md hover:bg-sidebar-accent"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user?.photoURL ?? 'https://placehold.co/40x40.png'}
                    alt={user?.displayName ?? 'User'}
                    data-ai-hint="person avatar"
                  />
                  <AvatarFallback>{user?.email?.[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="text-left hidden group-data-[expanded]:block">
                  <p className="text-base font-medium truncate">
                    {user?.displayName || 'SME Owner'}
                  </p>
                  <p className="text-sm text-muted-foreground truncate">
                    {user?.email}
                  </p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent side="right" align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="flex-1 bg-background">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 backdrop-blur-sm px-6">
           <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleSidebar}
            >
              <PanelLeft className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
            <h2 className="hidden text-2xl font-bold text-foreground md:block">
              {currentNavItem?.label || 'Dashboard'}
            </h2>
          </div>
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
        </header>
        <main className="flex-1 p-6">{children}</main>
      </SidebarInset>

      <Sheet open={isAssistantOpen} onOpenChange={setAssistantOpen}>
        <SheetContent className="w-full max-w-lg p-0">
           <SheetHeader className="p-4 border-b">
            <SheetTitle className="flex items-center gap-2">
                <BotMessageSquare className="h-6 w-6 text-primary" />
                <span>AI Assistant</span>
            </SheetTitle>
          </SheetHeader>
          <AIAssistant />
        </SheetContent>
      </Sheet>
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
