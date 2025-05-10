import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock } from 'lucide-react';

interface FeaturedNewsProps {
  title: string;
  summary: string;
  imageUrl: string;
  publishedAt: string;
  source: string;
  status: 'verified' | 'unverified' | 'disputed' | 'neutral';
  url?: string;
}

const FeaturedNews = ({
  title,
  summary,
  imageUrl,
  publishedAt,
  source,
  status,
  url
}: FeaturedNewsProps) => {
  // Calculate relative time for "x time ago" display
  const getRelativeTime = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffMs = now.getTime() - past.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 60) return `${diffMins} min ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} d ago`;
  };

  const handleReadFullAnalysis = () => {
    if (url) {
      window.open(url, '_blank');
    }
  };

  // Function to get the appropriate status badge color
  const getStatusColor = (status: 'verified' | 'unverified' | 'disputed' | 'neutral'): string => {
    switch (status) {
      case 'verified':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'unverified':
        return 'bg-orange-100 text-orange-800 border border-orange-200';
      case 'disputed':
        return 'bg-red-100 text-red-800 border border-red-200';
      case 'neutral':
        return 'bg-blue-100 text-blue-800 border border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
    }
  };

  return (
    <div className="relative overflow-hidden rounded-lg">
      <Card className="border-0">
        <div className="relative h-[400px]">
          {/* Featured image with overlay */}
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{ backgroundImage: `url('${imageUrl}')` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10"></div>
          </div>
          
          {/* Content on top of the image */}
          <CardContent className="relative h-full flex flex-col justify-end p-6 text-white">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(status)}`}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </div>
                <span className="text-sm font-medium flex items-center">
                  <Clock className="h-4 w-4 mr-1" />
                  {getRelativeTime(publishedAt)}
                </span>
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold leading-tight">
                {title}
              </h2>
              
              <p className="text-sm md:text-base text-gray-200 max-w-2xl">
                {summary}
              </p>

              <p className="text-sm text-gray-300">
                Source: {source}
              </p>
              
              <div className="flex flex-wrap gap-3 pt-2">
                <Button 
                  className="bg-white/90 hover:bg-white text-blue-900"
                  onClick={handleReadFullAnalysis}
                >
                  Read Full Analysis
                </Button>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
};

export default FeaturedNews;
