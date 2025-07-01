import { BotMessageSquare } from 'lucide-react';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4">
      <div className="w-full max-w-sm">
        <div className="flex justify-center mb-6">
           <div className="flex items-center gap-2">
              <BotMessageSquare className="h-10 w-10 text-primary shrink-0" />
              <h1 className="text-3xl font-bold font-headline text-foreground">
                BizSmart
              </h1>
            </div>
        </div>
        {children}
      </div>
    </div>
  );
}
