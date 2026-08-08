import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Download, Loader2, Sparkles, Trash2, Copy, LogOut } from "lucide-react";
import {
  claimFirstAdmin,
  createSocialPost,
  deleteSocialPost,
  getAdminStatus,
  listSocialPosts,
} from "@/lib/social.functions";
import { supabase } from "@/integrations/supabase/client";
import { COMPANY, whatsappLink } from "@/data/site";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/_authenticated/admin")({
  head: () => ({
    meta: [
      { title: "AI Social Post Studio | Khodiyar Engineering Admin" },
      {
        name: "description",
        content:
          "Generate festival and daily social media posters, captions and hashtags for Khodiyar Engineering with AI.",
      },
      { property: "og:title", content: "AI Social Post Studio | Khodiyar Engineering" },
      {
        property: "og:description",
        content: "Generate branded social posts with AI and share them instantly.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const PLATFORMS = ["all", "whatsapp", "instagram", "linkedin", "facebook"];

function AdminPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const fetchStatus = useServerFn(getAdminStatus);
  const fetchPosts = useServerFn(listSocialPosts);
  const claim = useServerFn(claimFirstAdmin);
  const create = useServerFn(createSocialPost);
  const remove = useServerFn(deleteSocialPost);

  const status = useQuery({ queryKey: ["admin-status"], queryFn: () => fetchStatus() });
  const isAdmin = status.data?.isAdmin === true;

  const posts = useQuery({
    queryKey: ["social-posts"],
    queryFn: () => fetchPosts(),
    enabled: isAdmin,
  });

  const [occasion, setOccasion] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [brief, setBrief] = useState("");
  const [platform, setPlatform] = useState("all");

  const claimMutation = useMutation({
    mutationFn: () => claim(),
    onSuccess: (res) => {
      if (res.isAdmin) {
        toast.success("Admin access granted.");
        queryClient.invalidateQueries({ queryKey: ["admin-status"] });
      } else {
        toast.error("An admin already exists. Ask them to add you.");
      }
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const createMutation = useMutation({
    mutationFn: () =>
      create({
        data: { occasion, eventDate: eventDate || null, brief: brief || null, platform },
      }),
    onSuccess: () => {
      toast.success("Post generated.");
      setOccasion("");
      setEventDate("");
      setBrief("");
      queryClient.invalidateQueries({ queryKey: ["social-posts"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => remove({ data: { id } }),
    onSuccess: () => {
      toast.success("Post deleted.");
      queryClient.invalidateQueries({ queryKey: ["social-posts"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  async function signOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  if (status.isLoading) {
    return (
      <div className="container-x flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container-x flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center">
        <h1 className="font-display text-2xl font-bold uppercase">Admin access required</h1>
        <p className="max-w-md text-sm text-muted-foreground">
          Your account is signed in but not yet an admin. If this is the first setup, claim
          admin access below.
        </p>
        <div className="flex gap-3">
          <Button onClick={() => claimMutation.mutate()} disabled={claimMutation.isPending}>
            {claimMutation.isPending ? "Checking…" : "Claim admin access"}
          </Button>
          <Button variant="outline" onClick={signOut}>
            Sign out
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <div className="container-x py-14">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Marketing Admin
            </p>
            <h1 className="font-display text-3xl font-bold uppercase tracking-wide">
              AI Social Post Studio
            </h1>
            <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
              Type a festival name, a date or a short brief. The AI writes the caption and
              hashtags, generates a branded poster, and you share it straight to WhatsApp or
              download it for Instagram and LinkedIn.
            </p>
          </div>
          <Button variant="outline" onClick={signOut}>
            <LogOut className="mr-2 h-4 w-4" /> Sign out
          </Button>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[380px_1fr]">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!occasion.trim()) return;
              createMutation.mutate();
            }}
            className="h-fit rounded-xl border bg-card p-6 shadow-sm"
          >
            <h2 className="font-display text-lg font-semibold uppercase tracking-wide">
              New post
            </h2>

            <div className="mt-5 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="occasion">Festival / topic</Label>
                <Input
                  id="occasion"
                  required
                  placeholder="Diwali, Engineers Day, new dairy valve launch…"
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="date">Date (optional)</Label>
                <Input
                  id="date"
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brief">Short details (optional)</Label>
                <Textarea
                  id="brief"
                  rows={3}
                  placeholder="Highlight our SS316 sanitary valves, greeting tone…"
                  value={brief}
                  onChange={(e) => setBrief(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Platform</Label>
                <Select value={platform} onValueChange={setPlatform}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {PLATFORMS.map((p) => (
                      <SelectItem key={p} value={p} className="capitalize">
                        {p === "all" ? "All platforms" : p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" disabled={createMutation.isPending} className="w-full">
                {createMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating…
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" /> Generate post
                  </>
                )}
              </Button>
              {createMutation.isPending && (
                <p className="text-center text-xs text-muted-foreground">
                  Writing the caption and rendering the poster — this can take up to a minute.
                </p>
              )}
            </div>
          </form>

          <div>
            <h2 className="font-display text-lg font-semibold uppercase tracking-wide">
              Generated posts
            </h2>
            {posts.isLoading ? (
              <div className="mt-6 flex justify-center">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (posts.data?.length ?? 0) === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">
                No posts yet. Generate your first one on the left.
              </p>
            ) : (
              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                {posts.data?.map((post) => {
                  const fullText = `${post.caption}\n\n${post.hashtags.join(" ")}`;
                  return (
                    <article key={post.id} className="overflow-hidden rounded-xl border bg-card">
                      {post.signedImageUrl && (
                        <img
                          src={post.signedImageUrl}
                          alt={`${post.occasion} social media poster for ${COMPANY.name}`}
                          className="aspect-square w-full object-cover"
                          loading="lazy"
                        />
                      )}
                      <div className="space-y-3 p-5">
                        <div className="flex items-center justify-between gap-2">
                          <h3 className="font-display text-sm font-semibold uppercase tracking-wide">
                            {post.occasion}
                          </h3>
                          <span className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                            {post.platform}
                          </span>
                        </div>
                        <p className="whitespace-pre-line text-sm text-muted-foreground">
                          {post.caption}
                        </p>
                        <p className="text-xs text-primary">{post.hashtags.join(" ")}</p>

                        <div className="flex flex-wrap gap-2 pt-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              navigator.clipboard.writeText(fullText);
                              toast.success("Caption copied.");
                            }}
                          >
                            <Copy className="mr-1.5 h-3.5 w-3.5" /> Copy
                          </Button>
                          {post.signedImageUrl && (
                            <Button size="sm" variant="outline" asChild>
                              <a
                                href={post.signedImageUrl}
                                download={`${post.occasion.replace(/\s+/g, "-").toLowerCase()}.png`}
                                target="_blank"
                                rel="noreferrer"
                              >
                                <Download className="mr-1.5 h-3.5 w-3.5" /> Image
                              </a>
                            </Button>
                          )}
                          <Button size="sm" asChild>
                            <a href={whatsappLink(fullText)} target="_blank" rel="noreferrer">
                              Share on WhatsApp
                            </a>
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => deleteMutation.mutate(post.id)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
