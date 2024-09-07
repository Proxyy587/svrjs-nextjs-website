import { client, urlFor } from "@/lib/sanity";
import { PortableText, PortableTextComponents } from "@portabletext/react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Rss } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { format } from "date-fns";
import Prism from "prismjs";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-php";

import CopyButton from "@/components/shared/copyButton";
import "./_styles/prism-twilight.css";
import "./_styles/prism.twilight.min.css";
import PrismLoader from "@/components/loader/prismLoader";
import { Button } from "@/components/ui/button";

async function getData(slug: string) {
  const query = `
    *[_type == "blog" && slug.current == '${slug}'] {
        "currentSlug": slug.current,
        title,
        content,
        titleImage,
        _createdAt
    }[0]`;

  const data = await client.fetch(query);
  return data;
}

interface BlogSlugArticle {
  currentSlug: string;
  title: string;
  content: any;
  titleImage: string;
  _createdAt: string;
}

export async function generateMetadata({
  params
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const data = await getData(params.slug);

  if (!data) {
    return {
      title: "Not Found",
      description: "Blog post not found"
    };
  }

  return {
    title: `${data.title} - SVR.JS`,
    description: data.smallDescription,
    openGraph: {
      title: `${data.title} - SVR.JS`,
      description: data.smallDescription,
      url: `https://svrjs.org/blog/${data.currentSlug}`,
      type: "website",
      images: [
        {
          url: urlFor(data.titleImage).url(),
          width: 800,
          height: 600,
          alt: `${data.title} - SVR.JS`
        }
      ]
    },
    twitter: {
      card: "summary_large_image",
      site: "@SVR_JS",
      title: `${data.title} - SVR.JS`,
      description: data.smallDescription,
      images: [urlFor(data.titleImage).url()],
      creator: "@SVR_JS"
    }
  };
}

const customPortableTextComponents: PortableTextComponents = {
  types: {
    image: ({ value }) => {
      return (
        <div className="my-8">
          <Image
            src={urlFor(value).url()}
            alt={value.alt || "Blog Image"}
            width={1200}
            height={800}
            className="w-full h-auto rounded-lg"
          />
          {value.caption && (
            <p className="mt-2 text-center text-sm text-muted-foreground">
              {value.caption}
            </p>
          )}
        </div>
      );
    },
    code: ({ value }) => {
      const language = value.language || "javascript";
      const grammar = Prism.languages[language];

      if (!grammar) {
        console.error(`No grammar found for language: "${language}"`);
        return (
          <pre className="p-4 rounded-md overflow-x-auto text-sm">
            <code>{value.code}</code>
          </pre>
        );
      }

      return (
        <div className="relative my-8">
          <pre
            className={`language-${language} p-4 rounded-md overflow-x-auto text-sm`}
          >
            <code className={`language-${language}`}>{value.code}</code>
          </pre>
          <PrismLoader />
          <CopyButton code={value.code} />
        </div>
      );
    }
  }
};

export default async function BlogSlugArticle({
  params
}: {
  params: { slug: string };
}) {
  const data: BlogSlugArticle = await getData(params.slug);

  if (!data) {
    notFound();
  }

  const formattedDate = format(new Date(data._createdAt), "MMMM d, yyyy");

  return (
    <>
      <section className="max-w-5xl container mx-auto py-8 md:py-28 flex flex-col items-center px-4">
        <div className="w-full mx-auto flex-center">
          <Link
            href="/blog"
            className="group text-primary transition-all flex items-center"
          >
            <Button variant={"ghost"} size={"lg"} className="mx-0 px-2 ">
              <ArrowLeft className="mr-2 w-5 h-5 group-hover:translate-x-1 transition-all" />
              Back
            </Button>
          </Link>
          <Link
            href="/rss.xml"
            className="ml-auto"
            rel="alternate"
            type="application/rss+xml"
          >
            <Button
              variant={"link"}
              size={"lg"}
              className="mx-0 px-2 text-accent-foreground"
            >
              <Rss className="w-5 h-5 mr-1" /> Subscribe to RSS
            </Button>
          </Link>
        </div>
        <header className="text-start mb-8 w-full">
          {data.titleImage && (
            <div className="mb-2">
              <h1 className="text-3xl md:text-5xl mb-8 py-4 font-bold text-black dark:bg-clip-text dark:text-transparent dark:bg-gradient-to-b dark:from-white dark:to-neutral-400">
                {data.title}
              </h1>
              <Image
                src={urlFor(data.titleImage).url()}
                alt={data.title}
                width={1200}
                height={800}
                priority
                className="w-full h-auto object-cover rounded-md"
              />
              <p className="mt-4 text-lg md:text-xl text-muted-foreground">
                Uploaded at {formattedDate}
              </p>
            </div>
          )}
        </header>
        <Separator className="mb-6" />
        <article className="prose max-w-full md:prose-lg dark:prose-invert">
          <PortableText
            value={data.content}
            components={customPortableTextComponents}
          />
        </article>
      </section>
    </>
  );
}
