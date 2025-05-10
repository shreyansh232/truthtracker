"use client"
import React, { useEffect, useState } from 'react';
import Header from '@/components/Header';
import FeaturedNews from '@/components/FeaturedNews';
import NewsCard from '@/components/NewsCard';
import NewsUpdates from '@/components/NewsUpdates';
import CommunityNotes from '@/components/CommunityNotes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { NewsArticle, fetchIndoPakNews } from '@/services/newsApi';
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';

const Feed = () => {
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { toast } = useToast();

  useEffect(() => {
    async function loadNews() {
      setLoading(true);
      try {
        const articles = await fetchIndoPakNews();
        console.log("Fetched articles:", articles.length); // Debug log to see if articles are fetched
        setNewsArticles(articles);
      } catch (error) {
        console.error("Error loading news:", error);
        toast({
          title: "Failed to load news",
          description: "We couldn't retrieve the latest news. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    }

    loadNews();
  }, [toast]);

  // If we have at least one article, use it for the featured news
  const featuredArticle = newsArticles.length > 0 ? newsArticles[0] : null;

  // Debug log to check newsArticles state
  console.log("Current newsArticles:", newsArticles.length > 0 ? "Has data" : "Empty");

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Featured News */}
        <section className="mb-10">
          {loading && <div className="h-[400px] flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>}
          
          {!loading && featuredArticle && (
            <FeaturedNews
              title={featuredArticle.title}
              summary={featuredArticle.description}
              imageUrl={featuredArticle.image}
              publishedAt={featuredArticle.publishedAt}
              source={featuredArticle.source.name}
              status={featuredArticle.status}
              url={featuredArticle.url}
            />
          )}
          
          {!loading && !featuredArticle && (
            <div className="h-[400px] flex flex-col items-center justify-center bg-gray-100 rounded-lg">
              <h3 className="text-xl text-gray-600 mb-2">No news articles available</h3>
              <p className="text-gray-500">Please try again later or check your connection</p>
            </div>
          )}
        </section>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="latest" className="mb-8">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">News Articles</h2>
                <TabsList>
                  <TabsTrigger value="latest">Latest</TabsTrigger>
                  <TabsTrigger value="verified">Verified</TabsTrigger>
                  <TabsTrigger value="disputed">Disputed</TabsTrigger>
                </TabsList>
              </div>
              
              {loading && (
                <div className="mt-6 flex justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
              )}
              
              <TabsContent value="latest" className="mt-6">
                {!loading && newsArticles.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {newsArticles.map((article) => (
                      <NewsCard
                        key={article.id}
                        title={article.title}
                        source={article.source.name}
                        publishedAt={article.publishedAt}
                        status={article.status}
                        summary={article.description}
                        imageUrl={article.image}
                      />
                    ))}
                  </div>
                ) : !loading && (
                  <div className="py-12 text-center">
                    <p className="text-gray-500">No news articles available</p>
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="verified" className="mt-6">
                {!loading && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {newsArticles
                      .filter(article => article.status === 'verified')
                      .map((article) => (
                        <NewsCard
                          key={article.id}
                          title={article.title}
                          source={article.source.name}
                          publishedAt={article.publishedAt}
                          status={article.status}
                          summary={article.description}
                          imageUrl={article.image}
                        />
                      ))}
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="disputed" className="mt-6">
                {!loading && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {newsArticles
                      .filter(article => article.status === 'disputed')
                      .map((article) => (
                        <NewsCard
                          key={article.id}
                          title={article.title}
                          source={article.source.name}
                          publishedAt={article.publishedAt}
                          status={article.status}
                          summary={article.description}
                          imageUrl={article.image}
                        />
                      ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
            
            <Separator className="my-8" />
            
            {/* Community Notes Section */}
            <section className="mb-8">
              <h2 className="text-2xl font-bold mb-6">Fact Check & Context</h2>
              <CommunityNotes />
            </section>
          </div>
          
          {/* Sidebar */}
          <div>
            <h2 className="text-2xl font-bold mb-6">Latest Updates</h2>
            <NewsUpdates />
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t border-gray-200 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-bold text-blue-600">TruthTracker</h2>
              <p className="text-sm text-gray-600">Fighting misinformation with facts</p>
            </div>
            <div className="text-sm text-gray-500">
              <p>© 2023 TruthTracker. All rights reserved.</p>
              <p>Last updated: May 10, 2025 at 11:30 AM</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Feed;
