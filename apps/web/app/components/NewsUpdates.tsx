import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface NewsUpdate {
  id: number;
  content: string;
  time: string;
  category: 'politics' | 'military' | 'diplomatic' | 'economic' | 'general';
}

const NewsUpdates = () => {
  const updates: NewsUpdate[] = [
    {
      id: 1,
      content: "Pakistan Commerce Minister suggests reopening trade routes with India to stabilize regional prices",
      time: "10:42 AM",
      category: "economic"
    },
    {
      id: 2,
      content: "Indian Foreign Secretary scheduled to address press on bilateral relations at 3 PM",
      time: "10:35 AM",
      category: "diplomatic"
    },
    {
      id: 3,
      content: "Military officials from both countries agree to maintain ceasefire along the Line of Control",
      time: "10:28 AM",
      category: "military"
    },
    {
      id: 4,
      content: "UN spokesperson welcomes renewed dialogue between the nuclear neighbors",
      time: "10:15 AM",
      category: "diplomatic"
    },
    {
      id: 5,
      content: "Stock markets in both countries show positive response to diplomatic developments",
      time: "09:50 AM",
      category: "economic"
    },
    {
      id: 6,
      content: "Cultural exchange program proposed by civil society organizations from both nations",
      time: "09:42 AM",
      category: "general"
    }
  ];

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'politics':
        return 'bg-purple-100 text-purple-800';
      case 'military':
        return 'bg-red-100 text-red-800';
      case 'diplomatic':
        return 'bg-blue-100 text-blue-800';
      case 'economic':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Live Updates</CardTitle>
          <Badge variant="outline" className="text-xs font-normal">
            Auto-refreshing
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 max-h-[400px] overflow-y-auto">
        {updates.map((update) => (
          <div key={update.id} className="flex gap-3 animate-fade-in">
            <div className="min-w-[60px] text-xs text-gray-500">
              {update.time}
            </div>
            <div>
              <Badge className={`mb-1 ${getCategoryColor(update.category)}`}>
                {update.category.charAt(0).toUpperCase() + update.category.slice(1)}
              </Badge>
              <p className="text-sm">{update.content}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default NewsUpdates;