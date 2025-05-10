import React from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";

// Define the props interface for NewsCard to match how it's used in Feed.tsx
export interface NewsCardProps {
  title: string;
  source: string;
  publishedAt: string;
  status: 'verified' | 'unverified' | 'disputed' | 'neutral';
  summary: string;
  imageUrl: string;
  url?: string; // Making this optional as it might not be used in all places
}

export default function NewsCard({ 
  title, 
  source, 
  publishedAt, 
  status, 
  summary, 
  imageUrl,
  url 
}: NewsCardProps) {
  const publishedDate = new Date(publishedAt);
  const timeAgo = formatDistanceToNow(publishedDate, { addSuffix: true });

  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative h-48 w-full">
        <img
          src={imageUrl}
          alt={title}
          className="object-cover w-full h-full"
        />
      </div>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex flex-col space-y-1.5">
          <h3 className="font-semibold text-lg line-clamp-2">{title}</h3>
        </div>
        <div className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(status)}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {summary}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between items-center text-xs text-muted-foreground">
        <span>{source}</span>
        <span>{timeAgo}</span>
      </CardFooter>
    </Card>
  );
}

function getStatusColor(status: 'verified' | 'unverified' | 'disputed' | 'neutral'): string {
  switch (status) {
    case 'verified':
      return 'bg-green-100 text-green-800';
    case 'unverified':
      return 'bg-orange-100 text-orange-800';
    case 'disputed':
      return 'bg-red-100 text-red-800';
    case 'neutral':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
}
