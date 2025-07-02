'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  Plus,
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
import { Skeleton } from '../ui/skeleton';
import AddEntryDialog from '../transactions/add-entry-dialog';
import AIAssistantWidget from '../chat/ai-assistant-widget';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/transactions', label: 'Transactions', icon: Wallet },
  { href: '/insights', label: 'AI Insights', icon: BrainCircuit },
  { href: '/settings', label: 'Settings', icon: Settings },
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

const MobileSidebarHeader = () => {
  const { setOpenMobile } = useSidebar();
  return (
    <div className="p-4 border-b border-sidebar-border md:hidden">
        <button onClick={() => setOpenMobile(false)} className="flex items-center w-full gap-2 text-left">
            <BotMessageSquare className="h-8 w-8 text-primary shrink-0" />
            <h1 className="text-xl font-bold font-headline text-foreground">
                BizSmart
            </h1>
        </button>
    </div>
  );
};


function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { toggleSidebar } = useSidebar();
  const { user, logout } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);

  const currentNavItem = navItems
    .slice()
    .sort((a, b) => b.href.length - a.href.length)
    .find((item) => pathname.startsWith(item.href));

  const showAddButton = pathname === '/dashboard';

  return (
    <>
      <Sidebar className="flex flex-col group" collapsible="icon">
        <MobileSidebarHeader />
        <AppSidebarHeader />
        <SidebarContent className="flex-1 p-4">
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton
                  asChild
                  isActive={
                    item.href === '/dashboard'
                      ? pathname === item.href
                      : pathname.startsWith(item.href)
                  }
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
        <SidebarFooter className="p-4 mt-auto group-data-[state=collapsed]:p-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full justify-start group-data-[state=collapsed]:justify-center gap-2 p-2 h-auto flex items-center rounded-md hover:bg-sidebar-accent">
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={user?.photoURL ?? 'https://placehold.co/40x40.png'}
                    alt={user?.displayName ?? 'User'}
                    data-ai-hint="person avatar"
                  />
                  <AvatarFallback>
                    {user?.email?.[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left group-data-[state=collapsed]:hidden">
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
            <Link href="/dashboard" className="flex items-center gap-2">
              <BotMessageSquare className="h-8 w-8 text-primary shrink-0" />
              <h1 className="text-xl font-bold font-headline text-foreground">
                BizSmart
              </h1>
            </Link>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
        <div className="fixed bottom-4 right-4 z-50 flex flex-col-reverse items-center gap-4">
          {showAddButton && (
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="h-16 w-16 rounded-full shadow-lg"
              size="icon"
              aria-label="Add Quick Entry"
            >
              <Plus className="h-8 w-8" />
            </Button>
          )}
          <AIAssistantWidget />
        </div>
        <AddEntryDialog isOpen={isDialogOpen} setIsOpen={setIsDialogOpen} />
      </SidebarInset>
    </>
  );
}

function MainLayoutLoader() {
    return (
        <div className="flex min-h-screen">
            <div className="hidden md:flex flex-col gap-4 border-r bg-muted/40 p-2">
                <div className="flex h-16 items-center justify-center">
                    <BotMessageSquare className="h-8 w-8 text-primary" />
                </div>
                <div className="flex flex-col gap-2">
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-8 w-8 rounded-lg" />
                    <Skeleton className="h-8 w-8 rounded-lg" />
                </div>
                <div className="mt-auto flex justify-center p-2">
                     <Skeleton className="h-8 w-8 rounded-full" />
                </div>
            </div>
            <div className="flex-1 flex flex-col">
                <header className="sticky top-0 z-10 flex h-16 items-center border-b px-6">
                    <Skeleton className="h-8 w-40" />
                </header>
                <main className="flex-1 p-6">
                    <div className="space-y-4">
                        <Skeleton className="h-10 w-1/2" />
                        <Skeleton className="h-32 w-full" />
                        <Skeleton className="h-64 w-full" />
                    </div>
                </main>
            </div>
        </div>
    )
}

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return <MainLayoutLoader />;
  }

  return (
    <SidebarProvider>
      <AppShell>{children}</AppShell>
    </SidebarProvider>
  );
}
