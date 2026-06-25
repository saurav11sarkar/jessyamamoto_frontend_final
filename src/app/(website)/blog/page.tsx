"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  image?: string;
  author?: { firstName: string; lastName: string; profileImage?: string };
  tags?: string[];
  createdAt: string;
}

interface BlogResponse {
  success: boolean;
  data: Blog[];
  meta?: { total: number; page: number; limit: number };
}

export default function BlogPage() {
  const { data, isLoading } = useQuery<BlogResponse>({
    queryKey: ["published-blogs"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/blog/published?limit=20&sortBy=createdAt&sortOrder=desc`
      );
      return res.json();
    },
  });

  const blogs = data?.data || [];

  return (
    <div className="pt-28 pb-16">
      <div className="container px-4 sm:px-6">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            JetSet Cares Blog
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Stories, tips, and insights for families traveling and living abroad
            across Asia.
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl border border-gray-200 overflow-hidden">
                <Skeleton className="h-48 w-full" />
                <div className="p-5 space-y-3">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : blogs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">
              No blog posts yet. Check back soon for updates!
            </p>
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <Link
                key={blog._id}
                href={`/blog/${blog.slug}`}
                className="group rounded-2xl border border-gray-200 overflow-hidden transition-all hover:shadow-lg hover:border-primary/30"
              >
                <div className="relative h-48 bg-gray-100">
                  {blog.image ? (
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full bg-primary/5">
                      <span className="text-primary/40 text-4xl font-bold">
                        JC
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {blog.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <h2 className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                    {blog.title}
                  </h2>

                  {blog.excerpt && (
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                      {blog.excerpt}
                    </p>
                  )}

                  <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center gap-3">
                      {blog.author && (
                        <span className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {blog.author.firstName} {blog.author.lastName}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(blog.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <ArrowRight className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
