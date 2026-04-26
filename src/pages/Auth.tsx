import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Heart, Loader2 } from "lucide-react";

const emailSchema = z.string().email().max(160);
const passSchema = z.string().min(6).max(72);

export default function Auth() {
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) nav("/dashboard");
    });
  }, [nav]);

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSchema.safeParse(email).success) return toast.error("Invalid email");
    if (!passSchema.safeParse(password).success) return toast.error("Password 6–72 chars");
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Welcome back!");
    nav("/dashboard");
  };

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailSchema.safeParse(email).success) return toast.error("Invalid email");
    if (!passSchema.safeParse(password).success) return toast.error("Password 6–72 chars");
    if (fullName.trim().length < 2) return toast.error("Enter your full name");
    setLoading(true);
    const redirectUrl = `${window.location.origin}/dashboard`;
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: redirectUrl, data: { full_name: fullName, mobile } },
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Account created! Check your email to confirm.");
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="hidden bg-hero p-12 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-extrabold">
          <span className="grid h-10 w-10 place-items-center rounded-lg bg-accent text-accent-foreground"><Heart className="h-5 w-5" fill="currentColor" /></span>
          Meri Pahal
        </Link>
        <div>
          <h2 className="font-display text-4xl font-extrabold">Welcome to the Meri Pahal Portal</h2>
          <p className="mt-3 text-primary-foreground/80">Manage your NGO services, coordinator profile and dashboards from one secure place.</p>
        </div>
        <p className="text-sm text-primary-foreground/60">© {new Date().getFullYear()} Meri Pahal Fast Help Group</p>
      </div>

      <div className="flex items-center justify-center bg-soft p-6">
        <Card className="w-full max-w-md p-6 md:p-8">
          <Link to="/" className="mb-4 flex items-center gap-2 font-display text-lg font-extrabold text-primary lg:hidden">
            <Heart className="h-5 w-5 text-accent" fill="currentColor" /> Meri Pahal
          </Link>
          <h1 className="font-display text-2xl font-bold text-primary">Sign in to your account</h1>
          <p className="mt-1 text-sm text-muted-foreground">Or create a new one to get started.</p>

          <Tabs defaultValue="signin" className="mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <form onSubmit={signIn} className="grid gap-3">
                <div><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
                <div><Label>Password</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
                <Button type="submit" variant="hero" size="lg" disabled={loading}>{loading && <Loader2 className="h-4 w-4 animate-spin" />}Sign In</Button>
              </form>
            </TabsContent>

            <TabsContent value="signup">
              <form onSubmit={signUp} className="grid gap-3">
                <div><Label>Full Name</Label><Input value={fullName} onChange={(e) => setFullName(e.target.value)} required maxLength={100} /></div>
                <div><Label>Mobile</Label><Input value={mobile} onChange={(e) => setMobile(e.target.value)} maxLength={20} /></div>
                <div><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
                <div><Label>Password</Label><Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
                <Button type="submit" variant="hero" size="lg" disabled={loading}>{loading && <Loader2 className="h-4 w-4 animate-spin" />}Create Account</Button>
              </form>
            </TabsContent>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
