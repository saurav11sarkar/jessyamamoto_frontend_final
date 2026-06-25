"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt?: string;
  image?: string;
  author?: { firstName: string; lastName: string; profileImage?: string };
  tags?: string[];
  createdAt: string;
}

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const { data, isLoading } = useQuery<{ success: boolean; data: Blog }>({
    queryKey: ["blog", slug],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/blog/slug/${slug}`
      );
      return res.json();
    },
    enabled: !!slug,
  });

  const blog = data?.data;

  if (isLoading) {
    return (
      <div className="pt-28 pb-16">
        <div className="container px-4 sm:px-6 max-w-4xl mx-auto">
          <Skeleton className="h-8 w-2/3 mb-4" />
          <Skeleton className="h-4 w-1/3 mb-8" />
          <Skeleton className="h-80 w-full rounded-2xl mb-8" />
          <div className="space-y-3">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="pt-28 pb-16 text-center">
        <h1 className="text-2xl font-bold text-gray-900">Blog post not found</h1>
        <Link href="/blog" className="text-primary mt-4 inline-block hover:underline">
          Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-16">
      <div className="container px-4 sm:px-6 max-w-4xl mx-auto">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-primary mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Blog
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl leading-tight">
          {blog.title}
        </h1>

        <div className="flex items-center gap-4 mt-6 text-sm text-gray-500">
          {blog.author && (
            <span className="flex items-center gap-1.5">
              <User className="h-4 w-4" />
              {blog.author.firstName} {blog.author.lastName}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {new Date(blog.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        </div>

        {blog.tags && blog.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-primary/10 text-primary px-3 py-1 rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {blog.image && (
          <div className="relative w-full h-64 sm:h-80 lg:h-96 mt-8 rounded-2xl overflow-hidden">
            <Image
              src={blog.image}
              alt={blog.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        <div
          className="mt-10 prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-primary"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>
    </div>
  );
}
