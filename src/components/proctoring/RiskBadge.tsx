import React from 'react';
import type { RiskLevel } from '../../types';
import { ShieldCheck, AlertTriangle, AlertOctagon, ShieldAlert } from 'lucide-react';

interface RiskBadgeProps {
  score: number;
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
  showScore?: boolean;
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  score,
  level,
  size = 'md',
  showScore = true
}) => {
  const getBadgeConfig = () => {
    switch (level) {
      case 'LOW':
        return {
          icon: ShieldCheck,
          text: 'Low Risk',
          bg: 'bg-emerald-50',
          border: 'border-emerald-200',
          textColor: 'text-emerald-700',
          iconColor: 'text-emerald-600',
          dotColor: 'bg-emerald-500'
        };
      case 'MEDIUM':
        return {
          icon: AlertTriangle,
          text: 'Medium Risk',
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          textColor: 'text-amber-700',
          iconColor: 'text-amber-600',
          dotColor: 'bg-amber-500'
        };
      case 'HIGH':
        return {
          icon: ShieldAlert,
          text: 'High Risk',
          bg: 'bg-orange-50',
          border: 'border-orange-200',
          textColor: 'text-orange-700',
          iconColor: 'text-orange-600',
          dotColor: 'bg-orange-500'
        };
      case 'CRITICAL':
        return {
          icon: AlertOctagon,
          text: 'Critical Flag',
          bg: 'bg-rose-50',
          border: 'border-rose-200',
          textColor: 'text-rose-700',
          iconColor: 'text-rose-600',
          dotColor: 'bg-rose-500'
        };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'px-2 py-0.5 text-[11px] gap-1',
    md: 'px-2.5 py-1 text-xs gap-1.5',
    lg: 'px-3.5 py-1.5 text-sm gap-2 font-medium'
  };

  const iconSizes = {
    sm: 'w-3 h-3',
    md: 'w-3.5 h-3.5',
    lg: 'w-4 h-4'
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${config.bg} ${config.border} ${config.textColor} ${sizeClasses[size]} font-semibold shadow-2xs tracking-tight`}
    >
      <Icon className={`${iconSizes[size]} ${config.iconColor}`} />
      <span>{config.text}</span>
      {showScore && (
        <span className="opacity-80 font-mono font-medium">({score}%)</span>
      )}
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotColor} ${level === 'HIGH' || level === 'CRITICAL' ? 'animate-ping' : ''}`} />
    </span>
  );
};

export default RiskBadge;
