import React from "react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/StatusBadge";

type StatusType = 'verified' | 'unverified' | 'disputed' | 'neutral';

interface NewsFilterProps {
  selectedStatus: StatusType | 'all';
  onStatusChange: (status: StatusType | 'all') => void;
}

export function NewsFilter({ selectedStatus, onStatusChange }: NewsFilterProps) {
  const statuses: Array<StatusType | 'all'> = ['all', 'verified', 'unverified', 'disputed', 'neutral'];
  
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <span className="self-center font-medium mr-2">Filter by:</span>
      {statuses.map((status) => (
        <Button
          key={status}
          variant={selectedStatus === status ? "default" : "outline"}
          size="sm"
          onClick={() => onStatusChange(status)}
          className="flex items-center gap-2"
        >
          {status === 'all' ? (
            'All News'
          ) : (
            <StatusBadge status={status} className="py-0 px-1.5" />
          )}
        </Button>
      ))}
    </div>
  );
}