import type { EventType, RiskLevel } from '../types';

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  } catch {
    return isoString;
  }
}

export function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return isoString;
  }
}

export function formatDateTime(isoString: string): string {
  try {
    return `${formatDate(isoString)} at ${formatTime(isoString)}`;
  } catch {
    return isoString;
  }
}

export function getEventTypeLabel(type: EventType): string {
  switch (type) {
    case 'NO_FACE':
      return 'No Face Detected';
    case 'MULTIPLE_FACES':
      return 'Multiple Faces Detected';
    case 'TAB_SWITCH':
      return 'Tab Switch / Backgrounded';
    case 'HEAD_TURNED':
      return 'Head Turned Away';
    case 'CAMERA_DISCONNECTED':
      return 'Camera Disconnected';
    default:
      return type;
  }
}

export function getRiskLevelColor(level: RiskLevel): {
  bg: string;
  text: string;
  border: string;
  badge: string;
} {
  switch (level) {
    case 'LOW':
      return {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
        badge: 'bg-emerald-100 text-emerald-800 border-emerald-300'
      };
    case 'MEDIUM':
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        badge: 'bg-amber-100 text-amber-800 border-amber-300'
      };
    case 'HIGH':
      return {
        bg: 'bg-orange-50',
        text: 'text-orange-700',
        border: 'border-orange-200',
        badge: 'bg-orange-100 text-orange-800 border-orange-300'
      };
    case 'CRITICAL':
      return {
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-200',
        badge: 'bg-rose-100 text-rose-800 border-rose-300'
      };
  }
}
