import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { PlusCircle } from 'lucide-react';

export default function LinkBankCard() {
  return (
    <Card className="flex flex-col items-center justify-center text-center transition-all hover:shadow-md h-full">
      <CardHeader>
        <div className="mx-auto bg-secondary p-3 rounded-full">
          <PlusCircle className="h-6 w-6 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-2 pt-0">
        <CardTitle className="text-lg">Link Bank Account</CardTitle>
        <CardDescription>
          Add an account to track transactions automatically.
        </CardDescription>
        <Button className="mt-2">Link Account</Button>
      </CardContent>
    </Card>
  );
}
