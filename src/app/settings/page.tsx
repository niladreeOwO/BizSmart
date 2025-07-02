'use client';

import * as React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

export default function SettingsPage() {
  const { toast } = useToast();

  const handleSaveChanges = (section: string) => {
    toast({
      title: `${section} Settings Saved`,
      description: `Your ${section.toLowerCase()} information has been updated.`,
    });
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Manage your company and finance settings.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Company Info</CardTitle>
          <CardDescription>
            Update your business details and branding.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="company-name">Company Name</Label>
            <Input id="company-name" placeholder="Your Company LLC" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="business-type">Business Type</Label>
            <Select>
              <SelectTrigger id="business-type">
                <SelectValue placeholder="Select business type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="retail">Retail</SelectItem>
                <SelectItem value="service">Service</SelectItem>
                <SelectItem value="manufacturing">Manufacturing</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="logo-upload">Upload Logo</Label>
            <Input id="logo-upload" type="file" />
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6">
          <Button onClick={() => handleSaveChanges('Company')}>Save Changes</Button>
        </CardFooter>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Finance Settings</CardTitle>
          <CardDescription>
            Configure your default currency and payment methods.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="currency">Currency</Label>
             <Select defaultValue="usd">
              <SelectTrigger id="currency">
                <SelectValue placeholder="Select currency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usd">USD ($)</SelectItem>
                <SelectItem value="bdt">BDT (৳)</SelectItem>
                <SelectItem value="eur">EUR (€)</SelectItem>
              </SelectContent>
            </Select>
          </div>
           <div className="space-y-2">
            <Label htmlFor="default-bank">Default Bank</Label>
            <Input id="default-bank" placeholder="e.g., City Bank" />
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6">
          <Button onClick={() => handleSaveChanges('Finance')}>Save Changes</Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
          <CardDescription>
            Manage how you receive alerts and tips.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <Label htmlFor="email-alerts" className="flex flex-col space-y-1">
              <span>Email Alerts</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Receive alerts for low cash, high burn rate, etc.
              </span>
            </Label>
            <Switch id="email-alerts" />
          </div>
          <Separator />
           <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            <Label htmlFor="ai-tips" className="flex flex-col space-y-1">
              <span>AI Tips</span>
              <span className="font-normal leading-snug text-muted-foreground">
                Get daily AI-powered financial tips via email.
              </span>
            </Label>
            <Switch id="ai-tips" defaultChecked />
          </div>
        </CardContent>
        <CardFooter className="border-t pt-6">
          <Button onClick={() => handleSaveChanges('Notification')}>Save Preferences</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
