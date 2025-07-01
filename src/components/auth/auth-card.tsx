import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface AuthCardProps {
  title: string;
  description: string;
  footerText: string;
  footerLinkHref: string;
  footerLinkText: string;
  children: React.ReactNode;
}

export function AuthCard({
  title,
  description,
  footerText,
  footerLinkHref,
  footerLinkText,
  children,
}: AuthCardProps) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter>
        <p className="text-sm text-muted-foreground w-full text-center">
          {footerText}{' '}
          <Link href={footerLinkHref} className="font-semibold text-primary hover:underline">
            {footerLinkText}
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}
