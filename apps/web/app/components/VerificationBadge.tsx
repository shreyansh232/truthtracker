import React from 'react';
import { Check, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/components/lib/utils';

type VerificationStatus = 'verified' | 'unverified' | 'disputed' | 'neutral';

interface VerificationBadgeProps {
  status: VerificationStatus;
  className?: string;
}

const VerificationBadge = ({ status, className }: VerificationBadgeProps) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'verified':
        return {
          icon: <Check className="w-4 h-4" />,
          text: 'Verified',
          bgColor: 'bg-verified/10',
          textColor: 'text-verified',
          borderColor: 'border-verified/30'
        };
      case 'unverified':
        return {
          icon: <AlertCircle className="w-4 h-4" />,
          text: 'Unverified',
          bgColor: 'bg-unverified/10',
          textColor: 'text-unverified',
          borderColor: 'border-unverified/30'
        };
      case 'disputed':
        return {
          icon: <AlertCircle className="w-4 h-4" />,
          text: 'Disputed',
          bgColor: 'bg-disputed/10',
          textColor: 'text-disputed',
          borderColor: 'border-disputed/30'
        };
      case 'neutral':
        return {
          icon: <Info className="w-4 h-4" />,
          text: 'Neutral',
          bgColor: 'bg-neutral/10',
          textColor: 'text-neutral',
          borderColor: 'border-neutral/30'
        };
      default:
        return {
          icon: <Info className="w-4 h-4" />,
          text: 'Unknown',
          bgColor: 'bg-gray-100',
          textColor: 'text-gray-600',
          borderColor: 'border-gray-300'
        };
    }
  };

  const { icon, text, bgColor, textColor, borderColor } = getStatusConfig();

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border',
        bgColor,
        textColor,
        borderColor,
        className
      )}
    >
      {icon}
      <span className="ml-1">{text}</span>
    </span>
  );
};

export default VerificationBadge;