import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Clock, MessageCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BLOG_POSTS, whatsappLink } from "@/data/site";

type Post = (typeof BLOG_POSTS)[number];

export const Route = createFileRoute("/blog/$slug")({
  loader: ({ params }) => {
    const post = BLOG_POSTS.find((p) => p.slug === params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Article not found" }, { name: "robots", content: "noindex" }] };
    }
    const { post } = loaderData;
    return {
      meta: [
        { title: `${post.title} | Khodiyar Engineering Technical Guides` },
        { name: "description", content: post.excerpt },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.excerpt },
        { property: "og:type", content: "article" },
      ],
    };
  },
  component: BlogPost,
});

function BlogPost() {
  const { post } = Route.useLoaderData() as { post: Post };

  return (
    <>
      <section className="bg-navy-gradient py-16 text-navy-foreground">
        <div className="container-x max-w-3xl">
          <Link
            to="/blog"
            className="inline-flex items-center gap-1.5 text-xs text-accent hover:underline mb-4 font-semibold uppercase tracking-wider"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Knowledge Base
          </Link>
          <div className="eyebrow text-accent">Technical Article</div>
          <h1 className="mt-2 text-3xl font-bold uppercase tracking-tight sm:text-4xl text-navy-foreground">
            {post.title}
          </h1>
          <div className="mt-4 flex items-center gap-4 text-xs opacity-80">
            <time>
              {new Date(post.date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </time>
            <span>·</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" /> 4 min read
            </span>
            <span>·</span>
            <span>Khodiyar Engineering Technical Desk</span>
          </div>
        </div>
      </section>

      <article className="py-16">
        <div className="container-x max-w-3xl space-y-6 text-sm sm:text-base leading-relaxed text-muted-foreground">
          {post.body.map((para: string, i: number) => (
            <p key={i} className="leading-relaxed">
              {para}
            </p>
          ))}
        </div>

        {/* Action Callout Box */}
        <div className="container-x mt-12 max-w-3xl">
          <div className="surface-panel rounded-sm p-6 sm:p-8 bg-card border-l-4 border-l-accent flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div>
              <h3 className="font-display text-base font-bold uppercase">
                Need specific valve sizing or material advice?
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Our application engineers help you calculate pressure drop, select metallurgy, and
                provide competitive quotes.
              </p>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              <Button asChild size="sm">
                <Link to="/contact">Request Quotation</Link>
              </Button>
              <Button asChild variant="outline" size="sm">
                <a
                  href={whatsappLink(`Hello Khodiyar Engineering, I read your article "${post.title}" and need valve advice.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="mr-1.5 h-3.5 w-3.5 text-accent" /> WhatsApp Desk
                </a>
              </Button>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
