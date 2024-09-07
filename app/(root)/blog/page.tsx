import React from "react";
import { Metadata } from "next";
import BlogCards from "@/components/cards/BlogCards";
import { Rss } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Blog - SVR.JS",
  description:
    "Welcome to the SVR.JS Blog! Explore our latest blog posts featuring web development, web application security, and web server administration tips. Stay tuned for the latest SVR.JS updates.",
  openGraph: {
    title: "Blog - SVR.JS",
    description:
      "Welcome to the SVR.JS Blog! Explore our latest blog posts featuring web development, web application security, and web server administration tips. Stay tuned for the latest SVR.JS updates.",
    url: "https://svrjs.org/blog",
    type: "website",
    images: [
      {
        url: "https://svrjs.vercel.app/metadata/svrjs-cover.png",
        width: 800,
        height: 600,
        alt: "Blog - SVR.JS"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    site: "@SVR_JS",
    title: "Blog - SVR.JS",
    description:
      "Welcome to the SVR.JS Blog! Explore our latest blog posts featuring web development, web application security, and web server administration tips. Stay tuned for the latest SVR.JS updates.",
    images: ["https://svrjs.vercel.app/metadata/svrjs-cover.png"],
    creator: "@SVR_JS"
  }
};

const BlogPage = async () => {
  return (
    <section
      id="blog"
      className="wrapper container py-24 md:py-28 gap-2 flex-center flex-col"
    >
      <h1 className="text-3xl md:text-5xl mb-3 pb-1 md:pb-2 font-bold text-black dark:bg-clip-text dark:text-transparent dark:bg-gradient-to-b dark:from-white dark:to-neutral-400">
        SVR.JS Blog Post
      </h1>
      <p className="text-muted-foreground flex-center mb-2">
        Stay updated with our latest blog posts by subscribing to our
        <Link href="/rss.xml" rel="alternate" type="application/rss+xml">
          <Button variant={"link"} className="mx-0 px-2">
            <Rss className="w-5 h-5 mr-1" /> RSS feed
          </Button>
        </Link>
      </p>
      <BlogCards page={1} />
    </section>
  );
};

export default BlogPage;
