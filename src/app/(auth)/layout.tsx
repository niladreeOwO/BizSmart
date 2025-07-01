import { BotMessageSquare } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="flex items-center gap-2 mb-6">
         <BotMessageSquare className="h-8 w-8 text-primary shrink-0" />
        <h1 className="text-2xl font-bold font-headline text-foreground">
          Welcome to BizSmart
        </h1>
      </div>
      {children}
    </div>
  );
}
