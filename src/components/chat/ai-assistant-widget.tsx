'use client';

import * as React from 'react';
import { Button } from '../ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet';
import AIAssistant from './ai-assistant';
import { BotMessageSquare } from 'lucide-react';

export default function AIAssistantWidget() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <Button
        size="icon"
        onClick={() => setIsOpen(true)}
        className="h-16 w-16 rounded-full shadow-lg"
        aria-label="Open AI Assistant"
      >
        <BotMessageSquare className="h-8 w-8" />
      </Button>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent className="w-full sm:max-w-md p-0 flex flex-col">
            <SheetHeader className='p-4 border-b'>
                 <SheetTitle className='flex items-center gap-2'>
                    <BotMessageSquare className="h-6 w-6 text-primary" />
                    <span>BizSmart AI Assistant</span>
                </SheetTitle>
            </SheetHeader>
            <AIAssistant />
        </SheetContent>
      </Sheet>
    </>
  );
}
