import React from "react";
import NewsCard from "@/components/NewsCard";
import { NewsArticle } from "@/services/newsApi";

interface NewsGridProps {
  articles: NewsArticle[];
}

export function NewsGrid({ articles }: NewsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {articles.map((article) => (
        <NewsCard
          key={article.id}
          title={article.title}
          source={article.source.name}
          publishedAt={article.publishedAt}
          status={article.status}
          summary={article.description}
          imageUrl={article.image}
          url={article.url}
        />
      ))}
    </div>
  );
}
