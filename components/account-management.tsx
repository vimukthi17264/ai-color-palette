"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertCircle, DollarSign, Download, Loader2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { getUserProfile, getUserTokens } from "@/lib/supabaseActions";
import AuthNavbar from "./auth-navbar";
import { useToast } from "@/hooks/use-toast";

interface CreditPurchase {
  id: number;
  date: string;
  amount: number;
  price: number;
  status: string;
}

export default function AccountManagement() {
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [credits, setCredits] = useState(0);
  const [monthlyLimit, setMonthlyLimit] = useState(2000);
  const [creditPurchases, setCreditPurchases] = useState<CreditPurchase[]>([]);
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error("Authentication error:", authError);
      router.push("/signin");
      return;
    }

    setUser(user);
    setEmail(user.email || "");

    const userData = await getUserProfile(user.id);
    setName(userData?.username || "");
    
    const tokenData = await getUserTokens(user.id);
    setCredits(tokenData?.balance || 0);
    
    setIsLoading(false);
  };

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) {
      toast({
        title: "Error",
        description: "New passwords do not match.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const { error } = await supabase.auth.updateUser({ 
      password: newPassword 
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to change password. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Password changed",
        description: "Your password has been updated successfully.",
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
    setIsLoading(false);
  };

  const handlePurchaseCredits = async (amount: number) => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("credit_purchases")
      .insert({
        user_id: user.id,
        amount: amount,
        price: amount * 0.1,
        status: "Completed",
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to purchase credits. Please try again.",
        variant: "destructive",
      });
    } else {
      setCredits((prevCredits) => prevCredits + amount);
      toast({
        title: "Credits purchased",
        description: `Successfully purchased ${amount} credits.`,
      });
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <>
      <AuthNavbar />
      <div className="container mx-auto p-4 space-y-8">
        <h1 className="text-3xl font-bold">Account Management</h1>

        <div className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user?.user_metadata?.avatar_url || "https://github.com/shadcn.png"} alt="User avatar" />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-semibold">{name}</h2>
            <p className="text-gray-500">{email}</p>
          </div>
        </div>

        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Heads up!</AlertTitle>
          <AlertDescription>
            Your subscription will renew on July 1st, 2023. Ensure your payment method is up to date.
          </AlertDescription>
        </Alert>

        <Card>
          <CardHeader>
            <CardTitle>Credit Management</CardTitle>
            <CardDescription>View and manage your credits.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <Label>Current Credits</Label>
                <span className="text-2xl font-bold">{credits}</span>
              </div>
              <Progress value={(credits / monthlyLimit) * 100} className="w-full" />
              <p className="text-sm text-gray-500">{((credits / monthlyLimit) * 100).toFixed(0)}% of your monthly limit used</p>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {creditPurchases.map((purchase) => (
                  <TableRow key={purchase.id}>
                    <TableCell>{new Date(purchase.date).toLocaleDateString()}</TableCell>
                    <TableCell>{purchase.amount} credits</TableCell>
                    <TableCell>${purchase.price.toFixed(2)}</TableCell>
                    <TableCell>{purchase.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Download History
            </Button>
            <Button onClick={() => handlePurchaseCredits(100)} disabled={isLoading}>
              <DollarSign className="mr-2 h-4 w-4" />
              Purchase 100 Credits
            </Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Update your account password here.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="current-password">Current Password</Label>
              <Input
                id="current-password"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleChangePassword} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Changing Password...
                </>
              ) : (
                'Change Password'
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}