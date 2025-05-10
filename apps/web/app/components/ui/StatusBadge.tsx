import React from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/components/lib/utils";

type StatusType = 'verified' | 'unverified' | 'disputed' | 'neutral';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
}

const statusConfig: Record<StatusType, { color: string; label: string }> = {
  verified: {
    color: "bg-green-100 text-green-800 border-green-200",
    label: "Verified"
  },
  unverified: {
    color: "bg-orange-100 text-orange-800 border-orange-200",
    label: "Unverified"
  },
  disputed: {
    color: "bg-red-100 text-red-800 border-red-200",
    label: "Disputed"
  },
  neutral: {
    color: "bg-blue-100 text-blue-800 border-blue-200",
    label: "Neutral"
  }
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  
  return (
    <Badge 
      variant="outline" 
      className={cn(
        "font-medium border px-2 py-1", 
        config.color,
        className
      )}
    >
      {config.label}
    </Badge>
  );
}
