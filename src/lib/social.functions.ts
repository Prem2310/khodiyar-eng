import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export type SocialPost = {
  id: string;
  occasion: string;
  event_date: string | null;
  brief: string | null;
  platform: string;
  caption: string;
  hashtags: string[];
  image_url: string | null;
  signedImageUrl: string | null;
  created_at: string;
};

export const getAdminStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    return { isAdmin: data === true, userId: context.userId };
  });

export const claimFirstAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.rpc("claim_first_admin");
    if (error) throw new Error(error.message);
    return { isAdmin: data === true };
  });

export const listSocialPosts = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<SocialPost[]> => {
    const { data, error } = await context.supabase
      .from("social_posts")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(60);
    if (error) throw new Error(error.message);

    const rows = data ?? [];
    return Promise.all(
      rows.map(async (row) => {
        let signedImageUrl: string | null = null;
        if (row.image_url) {
          const { data: signed } = await context.supabase.storage
            .from("social-posts")
            .createSignedUrl(row.image_url, 60 * 60 * 8);
          signedImageUrl = signed?.signedUrl ?? null;
        }
        return { ...row, signedImageUrl } as SocialPost;
      }),
    );
  });

export const deleteSocialPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((input: { id: string }) => input)
  .handler(async ({ data, context }) => {
    const { data: row } = await context.supabase
      .from("social_posts")
      .select("image_url")
      .eq("id", data.id)
      .maybeSingle();
    if (row?.image_url) {
      await context.supabase.storage.from("social-posts").remove([row.image_url]);
    }
    const { error } = await context.supabase.from("social_posts").delete().eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const createSocialPost = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator(
    (input: {
      occasion: string;
      eventDate?: string | null;
      brief?: string | null;
      platform: string;
    }) => input,
  )
  .handler(async ({ data, context }): Promise<SocialPost> => {
    const { data: isAdmin } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (isAdmin !== true) throw new Error("Admin access required.");

    const { generateCopy, generatePosterBackground, composePoster } = await import(
      "./social-ai.server"
    );

    // 1. Caption, hashtags, on-poster headline, and background art direction.
    const copy = await generateCopy({
      occasion: data.occasion,
      eventDate: data.eventDate ?? null,
      brief: data.brief ?? null,
      platform: data.platform,
    });

    // 2. AI-generated background art (no text/logo — that's added next).
    const background = await generatePosterBackground(copy.imagePrompt);

    // 3. Composite the logo, headline, company name, and contact details
    //    on top with sharp so the branding is always crisp and correct.
    const bytes = await composePoster(background, copy.headline);

    const path = `${context.userId}/${crypto.randomUUID()}.png`;
    const { error: uploadError } = await context.supabase.storage
      .from("social-posts")
      .upload(path, bytes, { contentType: "image/png", upsert: false });
    if (uploadError) throw new Error(uploadError.message);

    const { data: row, error } = await context.supabase
      .from("social_posts")
      .insert({
        created_by: context.userId,
        occasion: data.occasion,
        event_date: data.eventDate || null,
        brief: data.brief || null,
        platform: data.platform,
        caption: copy.caption,
        hashtags: copy.hashtags,
        image_url: path,
      })
      .select("*")
      .single();
    if (error) throw new Error(error.message);

    const { data: signed } = await context.supabase.storage
      .from("social-posts")
      .createSignedUrl(path, 60 * 60 * 8);

    return { ...row, signedImageUrl: signed?.signedUrl ?? null } as SocialPost;
  });
