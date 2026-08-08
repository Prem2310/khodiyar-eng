import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, BookOpen, Clock } from "lucide-react";
import { PageHero } from "@/components/site/Section";
import { BLOG_POSTS } from "@/data/site";

export const Route = createFileRoute("/blog/")({
  head: () => ({
    meta: [
      { title: "Valve Engineering Guides & Technical Articles | Khodiyar" },
      {
        name: "description",
        content:
          "Practical valve selection frameworks, ball vs butterfly valve comparisons, chemical compatibility guides, and sanitary dairy valve selection rules for plant engineers.",
      },
      { property: "og:title", content: "Valve Engineering Insights | Khodiyar Engineering" },
      {
        property: "og:description",
        content: "Practical engineering guides and selection frameworks for plant engineers.",
      },
    ],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  return (
    <>
      <PageHero
        eyebrow="Engineering Knowledge Base"
        title="Industrial Valve Technical Guides"
        description="Practical, plant-tested engineering frameworks written for piping designers, plant maintenance heads, and purchase managers across chemical, dairy, pharma, and power facilities."
      />

      <section className="py-16 sm:py-20">
        <div className="container-x grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {BLOG_POSTS.map((post) => (
            <Link
              key={post.slug}
              to="/blog/$slug"
              params={{ slug: post.slug }}
              className="surface-panel group rounded-sm p-6 transition-all hover:-translate-y-1 hover:border-accent flex flex-col justify-between bg-card"
            >
              <div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <time className="uppercase tracking-[0.16em]">
                    {new Date(post.date).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </time>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> 4 min read
                  </span>
                </div>
                <h2 className="mt-3 font-display text-lg font-semibold uppercase tracking-wide group-hover:text-accent transition-colors">
                  {post.title}
                </h2>
                <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                  {post.excerpt}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-border/60">
                <span className="inline-flex items-center text-xs font-semibold text-primary group-hover:translate-x-0.5 transition-transform">
                  Read Technical Article <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
