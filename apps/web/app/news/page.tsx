"use client";

import React, { useEffect, useState } from "react";
import { fetchIndoPakNews, NewsArticle } from "@/services/newsApi";
import { NewsGrid } from "@/components/NewsGrid";
import { NewsFilter } from "@/components/NewsFilter";
import { Skeleton } from "@/components/ui/skeleton";

type StatusType = 'verified' | 'unverified' | 'disputed' | 'neutral';

export default function NewsPage() {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState<StatusType | 'all'>('all');

  useEffect(() => {
    async function loadNews() {
      try {
        const news = await fetchIndoPakNews();
        setArticles(news);
      } catch (error) {
        console.error("Failed to load news:", error);
      } finally {
        setLoading(false);
      }
    }

    loadNews();
  }, []);

  const filteredArticles = selectedStatus === 'all'
    ? articles
    : articles.filter(article => article.status === selectedStatus);

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">TruthTracker: India-Pakistan News</h1>
      
      <p className="text-muted-foreground mb-8">
        Stay informed with verified news about India-Pakistan relations. 
        Our AI-powered system checks multiple sources to verify the accuracy of each article.
      </p>
      
      <NewsFilter 
        selectedStatus={selectedStatus} 
        onStatusChange={setSelectedStatus} 
      />
      
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col space-y-3">
              <Skeleton className="h-48 w-full rounded-md" />
              <Skeleton className="h-4 w-3/4 rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
              <Skeleton className="h-4 w-full rounded-md" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {filteredArticles.length > 0 ? (
            <NewsGrid articles={filteredArticles} />
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">
                No news articles found with the selected filter.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
}