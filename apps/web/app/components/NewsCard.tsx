import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import VerificationBadge from './VerificationBadge';
import { Button } from '@/components/ui/button';
import { cn } from '@/components/lib/utils';

interface NewsCardProps {
  title: string;
  source: string;
  publishedAt: string;
  status: 'verified' | 'unverified' | 'disputed' | 'neutral';
  summary: string;
  imageUrl?: string;
  className?: string;
}

const NewsCard = ({
  title,
  source,
  publishedAt,
  status,
  summary,
  imageUrl,
  className,
}: NewsCardProps) => {
  // Calculate relative time for "x time ago" display
  const getRelativeTime = (dateString: string) => {
    try {
      const now = new Date();
      const past = new Date(dateString);
      const diffMs = now.getTime() - past.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      
      if (diffMins < 60) return `${diffMins} min ago`;
      
      const diffHours = Math.floor(diffMins / 60);
      if (diffHours < 24) return `${diffHours} h ago`;
      
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays} d ago`;
    } catch (error) {
      console.error("Date parsing error:", error);
      return "recent";
    }
  };

  return (
    <Card className={cn('overflow-hidden hover:shadow-md transition-shadow animate-fade-in', className)}>
      {imageUrl && (
        <div className="w-full h-48 overflow-hidden">
          <img 
            src={imageUrl} 
            alt={title} 
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback image if the provided URL fails to load
              (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1504711434969-e33886168f5c?q=80&w=600";
            }}
          />
        </div>
      )}
      
      <CardHeader className="space-y-1 p-4">
        <div className="flex justify-between items-start">
          <VerificationBadge status={status} />
          <span className="text-xs text-gray-500 flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            {getRelativeTime(publishedAt)}
          </span>
        </div>
        <CardTitle className="text-xl line-clamp-2">{title}</CardTitle>
        <CardDescription className="text-sm text-gray-500">
          Source: {source}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-gray-700 line-clamp-3">
          {summary}
        </p>
      </CardContent>
      
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button variant="outline" size="sm">Read more</Button>
        <Button variant="ghost" size="sm">Community Notes</Button>
      </CardFooter>
    </Card>
  );
};

export default NewsCard;