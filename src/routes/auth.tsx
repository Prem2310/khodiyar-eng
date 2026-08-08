import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Admin Sign In | Khodiyar Engineering" },
      {
        name: "description",
        content:
          "Secure sign in for the Khodiyar Engineering marketing admin panel and AI social post studio.",
      },
      { property: "og:title", content: "Admin Sign In | Khodiyar Engineering" },
      {
        property: "og:description",
        content: "Secure sign in for the Khodiyar Engineering admin panel.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) navigate({ to: "/admin", replace: true });
    });
  }, [navigate]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        if (!data.session) {
          toast.success("Check your email to confirm your account, then sign in.");
          setMode("signin");
          return;
        }
        navigate({ to: "/admin", replace: true });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        navigate({ to: "/admin", replace: true });
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    const result = await lovable.auth.signInWithOAuth("google", {
      redirect_uri: window.location.origin,
    });
    if (result.error) {
      toast.error("Google sign-in failed. Please try again.");
      return;
    }
    if (result.redirected) return;
    navigate({ to: "/admin", replace: true });
  }

  return (
    <div className="bg-navy-gradient">
      <div className="container-x flex min-h-[80vh] items-center justify-center py-20">
        <div className="w-full max-w-md rounded-xl border border-white/10 bg-white/5 p-8 backdrop-blur">
          <h1 className="font-display text-2xl font-bold uppercase tracking-wide text-navy-foreground">
            Admin Access
          </h1>
          <p className="mt-2 text-sm text-navy-foreground/70">
            Sign in to open the AI social post studio.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-navy-foreground/80">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 text-navy-foreground placeholder:text-navy-foreground/40"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-navy-foreground/80">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/10 text-navy-foreground placeholder:text-navy-foreground/40"
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Please wait…" : mode === "signin" ? "Sign in" : "Create account"}
            </Button>
          </form>

          <Button
            type="button"
            variant="outline"
            onClick={handleGoogle}
            className="mt-3 w-full border-white/20 bg-transparent text-navy-foreground hover:bg-white/10"
          >
            Continue with Google
          </Button>

          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="mt-6 w-full text-center text-xs uppercase tracking-[0.2em] text-navy-foreground/60 hover:text-navy-foreground"
          >
            {mode === "signin" ? "Need an account? Sign up" : "Already registered? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
