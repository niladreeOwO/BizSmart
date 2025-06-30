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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  LayoutDashboard,
  Wallet,
  BrainCircuit,
  Settings,
  LogOut,
  BotMessageSquare,
  ChevronDown,
  PanelLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/transactions', label: 'Transactions', icon: Wallet },
  { href: '/insights', label: 'AI Insights', icon: BrainCircuit },
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
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="w-full justify-start group-data-[state=collapsed]:justify-center gap-2 p-2 h-auto"
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src="https://placehold.co/40x40.png"
                    alt="User"
                    data-ai-hint="person avatar"
                  />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <div className="text-left hidden group-data-[state=expanded]:block">
                  <p className="text-base font-medium">SME Owner</p>
                  <p className="text-sm text-muted-foreground">
                    admin@bizsmart.co
                  </p>
                </div>
                <ChevronDown className="ml-auto h-4 w-4 hidden group-data-[state=expanded]:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 mb-2"
              align="end"
              forceMount
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-base font-medium leading-none">
                    SME Owner
                  </p>
                  <p className="text-sm leading-none text-muted-foreground">
                    admin@bizsmart.co
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset className="flex-1 bg-background">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background/80 backdrop-blur-sm px-6">
          <div>
            <Link
              href="/dashboard"
              className="flex items-center gap-2 md:hidden"
            >
              <BotMessageSquare className="h-8 w-8 text-primary shrink-0" />
              <h1 className="text-xl font-bold font-headline text-foreground">
                BizSmart
              </h1>
            </Link>
            <h2 className="hidden text-2xl font-bold text-foreground md:block">
              {navItems.find((item) => item.href === pathname)?.label ||
                'Dashboard'}
            </h2>
          </div>

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
