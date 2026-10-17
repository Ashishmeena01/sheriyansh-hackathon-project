import React from 'react';
import { 
  Camera, 
  CameraOff, 
  ShieldCheck, 
  AlertTriangle, 
  Sparkles, 
  RefreshCw,
  Eye
} from 'lucide-react';
import type { DetectionState } from '../../types';

interface CameraFeedProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isStreaming: boolean;
  error: string | null;
  permissionDenied: boolean;
  isSimulated?: boolean;
  detectionState?: DetectionState;
  onStartCamera: () => void;
  onEnableSimulation?: () => void;
  compact?: boolean;
}

export const CameraFeed: React.FC<CameraFeedProps> = ({
  videoRef,
  isStreaming,
  error,
  permissionDenied,
  isSimulated = false,
  detectionState,
  onStartCamera,
  onEnableSimulation,
  compact = false
}) => {
  const getDetectionStatusPill = () => {
    if (!detectionState) return null;

    if (!detectionState.faceDetected) {
      return (
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-rose-950/80 border border-rose-500/50 text-rose-300 text-[11px] font-medium backdrop-blur-xs">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-pulse" />
          <span>No Face Detected</span>
        </div>
      );
    }

    if (detectionState.multipleFaces) {
      return (
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-rose-950/80 border border-rose-500/50 text-rose-300 text-[11px] font-medium backdrop-blur-xs">
          <AlertTriangle className="w-3.5 h-3.5 text-rose-400 animate-bounce" />
          <span>Multiple Faces ({detectionState.faceCount})</span>
        </div>
      );
    }

    if (detectionState.headPose !== 'center') {
      return (
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-950/80 border border-amber-500/50 text-amber-300 text-[11px] font-medium backdrop-blur-xs">
          <Eye className="w-3.5 h-3.5 text-amber-400" />
          <span>Head Turned ({detectionState.headPose})</span>
        </div>
      );
    }

    return (
      <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-900/80 border border-emerald-500/40 text-emerald-300 text-[11px] font-medium backdrop-blur-xs">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>Face Centered & Verified</span>
      </div>
    );
  };

  return (
    <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 shadow-md">
      {/* Aspect Ratio Box */}
      <div className={`relative ${compact ? 'aspect-4/3' : 'aspect-16/10'} w-full flex items-center justify-center`}>
        {/* Real Video Element */}
        <video
          ref={videoRef}
          playsInline
          muted
          autoPlay
          className={`w-full h-full object-cover ${!isStreaming || isSimulated ? 'hidden' : 'block'}`}
        />

        {/* Simulated Video Placeholder Canvas if simulated */}
        {isStreaming && isSimulated && (
          <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center p-4 text-center">
            <div className="relative w-28 h-28 rounded-full border-2 border-dashed border-teal-400/50 flex items-center justify-center mb-3">
              <div className="w-20 h-20 rounded-full bg-slate-800 border border-teal-400/80 flex items-center justify-center">
                <span className="text-2xl">👤</span>
              </div>
              <div className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-teal-400 animate-ping" />
            </div>
            <span className="text-xs font-semibold text-teal-400">
              Interactive Proctoring Simulator
            </span>
            <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
              Live on-device face evaluation emulation active.
            </p>
          </div>
        )}

        {/* Overlay Guide Target when streaming */}
        {isStreaming && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            {/* Minimal Face Oval Guide */}
            <div className="w-44 h-56 rounded-full border border-teal-500/30 border-dashed pointer-events-none" />
          </div>
        )}

        {/* When Camera is Off or Error */}
        {!isStreaming && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-5 text-center bg-slate-950 text-slate-300">
            <div className="w-12 h-12 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-3 text-slate-400">
              <CameraOff className="w-6 h-6" />
            </div>

            <h3 className="text-sm font-semibold text-white mb-1">
              {permissionDenied ? 'Camera Permission Blocked' : 'Webcam Standby'}
            </h3>

            <p className="text-xs text-slate-400 max-w-xs mb-4">
              {error || 'Webcam feed is required for local proctoring analysis.'}
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={onStartCamera}
                className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium transition-colors flex items-center gap-1.5 shadow-sm"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{permissionDenied ? 'Retry Access' : 'Enable Camera'}</span>
              </button>

              {onEnableSimulation && (
                <button
                  type="button"
                  onClick={onEnableSimulation}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-teal-300 border border-teal-500/30 text-xs font-medium transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                  <span>Simulation Mode</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Top Floating Status Badges */}
        {isStreaming && (
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
            {/* Face State */}
            {getDetectionStatusPill()}

            {/* Zero Streaming Assurance Badge */}
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-900/80 border border-slate-700/60 text-[10px] text-slate-300 font-medium backdrop-blur-xs">
              <ShieldCheck className="w-3 h-3 text-teal-400" />
              <span>Local WASM</span>
            </div>
          </div>
        )}

        {/* Bottom Bar Controls */}
        {isStreaming && (
          <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-[11px] text-slate-400 bg-slate-950/70 backdrop-blur-xs px-2.5 py-1.5 rounded-lg border border-slate-800">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-400 animate-pulse" />
              <span className="font-mono text-slate-300">
                {isSimulated ? 'Simulated Feed' : '640x480 • 30fps'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {onEnableSimulation && !isSimulated && (
                <button
                  onClick={onEnableSimulation}
                  className="text-slate-400 hover:text-white transition-colors"
                  title="Switch to Simulated Feed"
                >
                  <RefreshCw className="w-3 h-3" />
                </button>
              )}
              <span className="text-[10px] text-slate-400">Zero Cloud Upload</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CameraFeed;
