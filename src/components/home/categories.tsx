"use client";

import { MoveRight } from "lucide-react";
import Image from "next/image";
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

interface Category {
  image: string;
  _id: string;
  name: string;
  description?: string;
  findCareUser: string[];
  findJobUser: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface ApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  image: string;
  meta: {
    total: number;
    page: number;
    limit: number;
  };
  data: Category[];
}

const fetchCategories = async (): Promise<Category[]> => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/category`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
  });
  if (!response.ok) throw new Error(`Failed to fetch categories: ${response.status}`);
  const json: ApiResponse = await response.json();
  if (!json.success || !Array.isArray(json.data)) throw new Error(json.message || "Invalid API response format");
  return json.data;
};

const CategorySkeleton = () => (
  <div className="rounded-xl bg-card border border-border animate-pulse overflow-hidden">
    <div className="relative w-full aspect-[4/3] bg-muted" />
    <div className="p-4">
      <div className="flex items-center justify-between">
        <div className="h-5 w-24 bg-muted rounded" />
        <div className="h-4 w-4 bg-muted rounded-full" />
      </div>
    </div>
  </div>
);

export default function Categories() {
  const router = useRouter();

  const {
    data: categories = [],
    isLoading,
    error,
  } = useQuery<Category[], Error>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 1000 * 60 * 5,
  });

  const displayCategories = categories.slice(0, 5);

  const handleCategoryClick = (categoryId: string) => {
    router.push(`/all-find-care?id=${categoryId}`);
  };

  return (
    <section id="categories" className="py-16">
      <div className="container mx-auto space-y-10 px-4 md:px-6 lg:px-8">
        <div>
          <h2 className="text-center text-3xl md:text-4xl font-bold tracking-tight lg:max-w-3xl mx-auto text-foreground">
            Care for every moment.
          </h2>
          <p className="lg:max-w-2xl mx-auto text-base text-muted-foreground text-center mt-3">
            Browse trusted partners by category and find the right care for your
            family, wherever you are in Asia.
          </p>
        </div>

        {error && (
          <div className="text-center text-destructive py-8">
            Failed to load categories: {error.message}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-5 lg:gap-6 max-w-5xl mx-auto">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => <CategorySkeleton key={i} />)
          ) : displayCategories.length === 0 ? (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              No categories available at the moment.
            </div>
          ) : (
            displayCategories.map((cat) => (
              <button
                key={cat._id}
                type="button"
                onClick={() => handleCategoryClick(cat._id)}
                className="group text-left shadow-sm rounded-xl transition-all duration-200 bg-card border border-border hover:scale-[1.03] hover:shadow-lg hover:border-primary/30 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary relative overflow-hidden flex flex-col"
              >
                <div className="relative w-full aspect-[4/3] bg-muted overflow-hidden">
                  <Image
                    src={cat?.image}
                    alt={`${cat.name} category`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                  />
                </div>
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold transition-colors line-clamp-1 text-foreground group-hover:text-primary">
                      {cat.name}
                    </span>
                    <MoveRight className="w-4 h-4 transition-all flex-shrink-0 text-muted-foreground group-hover:text-primary group-hover:translate-x-1" />
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
