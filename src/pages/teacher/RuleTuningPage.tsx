import React, { useState } from 'react';
import { 
  Sliders, 
  RotateCcw, 
  Save, 
  CheckCircle2, 
  Info,
  Clock,
  Eye,
  Users,
  ExternalLink,
  BarChart3
} from 'lucide-react';
import { proctoringService } from '../../services/proctoringService';
import type { RuleTuning } from '../../types';

export const RuleTuningPage: React.FC = () => {
  const [rules, setRules] = useState<RuleTuning>(() => proctoringService.getRules());
  const [stats] = useState(() => proctoringService.getRuleEventStats());
  const [savedNotification, setSavedNotification] = useState(false);

  const handleSave = () => {
    proctoringService.saveRules(rules);
    setSavedNotification(true);
    setTimeout(() => {
      setSavedNotification(false);
    }, 3000);
  };

  const handleReset = () => {
    if (confirm('Reset all detection thresholds and penalties to default values?')) {
      const def = proctoringService.resetRules();
      setRules(def);
      setSavedNotification(true);
      setTimeout(() => setSavedNotification(false), 3000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded border border-purple-200">
            Heuristic Sensitivity Configuration
          </span>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mt-1">
            Rule Tuning & Risk Thresholds
          </h2>
          <p className="text-xs text-slate-500">
            Configure anomaly persistence durations and risk point penalties to calibrate false positive rates.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save Rules</span>
          </button>
        </div>
      </div>

      {/* Save Alert */}
      {savedNotification && (
        <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>Rules updated successfully! New thresholds apply to live proctoring evaluations immediately.</span>
        </div>
      )}

      {/* Explanatory Scientific Note */}
      <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-1">
        <div className="font-semibold text-slate-800 flex items-center gap-1.5 text-indigo-700">
          <Info className="w-4 h-4 text-indigo-600" />
          System Behavior & Neural Calibration
        </div>
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Tuning rules adjust on-device temporal filters, persistence thresholds, and weighted composite score calculations. Note: Adjusting these sliders modifies deterministic detection heuristics; neural weights are fixed within the client WebAssembly bundle and are not retrained automatically.
        </p>
      </div>

      {/* Incident Frequency by Rule Breakdown */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5">
        <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3 flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-indigo-600" /> Historical Incidents by Rule
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-[11px] text-slate-400 block flex items-center gap-1">
              <Users className="w-3 h-3 text-rose-500" /> Multiple Faces
            </span>
            <span className="text-lg font-bold text-slate-900 mt-0.5 block">
              {stats.MULTIPLE_FACES?.total || 0}
            </span>
            <span className="text-[10px] text-slate-400">
              {stats.MULTIPLE_FACES?.falseAlarms || 0} false alarms
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-[11px] text-slate-400 block flex items-center gap-1">
              <Clock className="w-3 h-3 text-amber-500" /> No Face Detected
            </span>
            <span className="text-lg font-bold text-slate-900 mt-0.5 block">
              {stats.NO_FACE?.total || 0}
            </span>
            <span className="text-[10px] text-slate-400">
              {stats.NO_FACE?.falseAlarms || 0} false alarms
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-[11px] text-slate-400 block flex items-center gap-1">
              <ExternalLink className="w-3 h-3 text-indigo-500" /> Tab Switches
            </span>
            <span className="text-lg font-bold text-slate-900 mt-0.5 block">
              {stats.TAB_SWITCH?.total || 0}
            </span>
            <span className="text-[10px] text-slate-400">
              {stats.TAB_SWITCH?.falseAlarms || 0} false alarms
            </span>
          </div>

          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
            <span className="text-[11px] text-slate-400 block flex items-center gap-1">
              <Eye className="w-3 h-3 text-orange-500" /> Head Turned
            </span>
            <span className="text-lg font-bold text-slate-900 mt-0.5 block">
              {stats.HEAD_TURNED?.total || 0}
            </span>
            <span className="text-[10px] text-slate-400">
              {stats.HEAD_TURNED?.falseAlarms || 0} false alarms
            </span>
          </div>
        </div>
      </div>

      {/* Rule Sliders Section */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-6">
        <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
          <Sliders className="w-4 h-4 text-indigo-600" />
          Persistence Duration Thresholds
        </h3>

        <div className="space-y-5 text-xs">
          {/* No Face Duration */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <div>
                <label className="font-semibold text-slate-800 block">
                  No Face Persistence Threshold
                </label>
                <p className="text-[11px] text-slate-500">
                  Time in seconds candidate can momentarily leave frame before an incident is logged.
                </p>
              </div>
              <span className="font-mono font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded border border-indigo-200 text-xs">
                {rules.noFaceThresholdSeconds}s
              </span>
            </div>
            <input
              type="range"
              min="2"
              max="15"
              step="1"
              value={rules.noFaceThresholdSeconds}
              onChange={e => setRules({ ...rules, noFaceThresholdSeconds: Number(e.target.value) })}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>Strict (2s)</span>
              <span>Default (4s)</span>
              <span>Lenient (15s)</span>
            </div>
          </div>

          {/* Multiple Faces Duration */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-1.5">
              <div>
                <label className="font-semibold text-slate-800 block">
                  Multiple Faces Persistence Threshold
                </label>
                <p className="text-[11px] text-slate-500">
                  Continuous seconds second individual must be visible in frame before triggering high-risk flag.
                </p>
              </div>
              <span className="font-mono font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded border border-rose-200 text-xs">
                {rules.multipleFacesThresholdSeconds}s
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={rules.multipleFacesThresholdSeconds}
              onChange={e => setRules({ ...rules, multipleFacesThresholdSeconds: Number(e.target.value) })}
              className="w-full accent-rose-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>Strict (1s)</span>
              <span>Default (2s)</span>
              <span>Lenient (10s)</span>
            </div>
          </div>

          {/* Head Turned Away Duration */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-1.5">
              <div>
                <label className="font-semibold text-slate-800 block">
                  Head Turned / Gaze Diversion Threshold
                </label>
                <p className="text-[11px] text-slate-500">
                  Sustained gaze deviation duration away from primary display before warning logged.
                </p>
              </div>
              <span className="font-mono font-bold text-amber-600 bg-amber-50 px-2.5 py-1 rounded border border-amber-200 text-xs">
                {rules.headTurnedThresholdSeconds}s
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={rules.headTurnedThresholdSeconds}
              onChange={e => setRules({ ...rules, headTurnedThresholdSeconds: Number(e.target.value) })}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
              <span>Strict (1s)</span>
              <span>Default (3s)</span>
              <span>Lenient (10s)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Risk Point Penalties Section */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-5 sm:p-6 space-y-4">
        <h3 className="text-sm font-bold text-slate-900 pb-3 border-b border-slate-100">
          Risk Score Weights (Points Per Incident)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 rounded-lg border border-slate-200 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-700">Tab Switch Penalty</span>
              <span className="font-mono font-bold text-slate-900">+{rules.tabSwitchPenalty} pts</span>
            </div>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={rules.tabSwitchPenalty}
              onChange={e => setRules({ ...rules, tabSwitchPenalty: Number(e.target.value) })}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          <div className="p-3 rounded-lg border border-slate-200 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-700">Multiple Faces Penalty</span>
              <span className="font-mono font-bold text-slate-900">+{rules.multipleFacesPenalty} pts</span>
            </div>
            <input
              type="range"
              min="10"
              max="60"
              step="5"
              value={rules.multipleFacesPenalty}
              onChange={e => setRules({ ...rules, multipleFacesPenalty: Number(e.target.value) })}
              className="w-full accent-rose-600 cursor-pointer"
            />
          </div>

          <div className="p-3 rounded-lg border border-slate-200 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-700">No Face Penalty</span>
              <span className="font-mono font-bold text-slate-900">+{rules.noFacePenalty} pts</span>
            </div>
            <input
              type="range"
              min="5"
              max="40"
              step="5"
              value={rules.noFacePenalty}
              onChange={e => setRules({ ...rules, noFacePenalty: Number(e.target.value) })}
              className="w-full accent-amber-600 cursor-pointer"
            />
          </div>

          <div className="p-3 rounded-lg border border-slate-200 space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-slate-700">Head Pose Diversion Penalty</span>
              <span className="font-mono font-bold text-slate-900">+{rules.headTurnedPenalty} pts</span>
            </div>
            <input
              type="range"
              min="5"
              max="30"
              step="5"
              value={rules.headTurnedPenalty}
              onChange={e => setRules({ ...rules, headTurnedPenalty: Number(e.target.value) })}
              className="w-full accent-orange-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Global Snapshot Toggle */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div>
            <span className="font-semibold text-xs text-slate-800 block">
              Enable Event Snapshot Thumbnails
            </span>
            <p className="text-[11px] text-slate-500">
              Only captures a small snapshot upon flagged event if candidate consented.
            </p>
          </div>
          <input
            type="checkbox"
            checked={rules.enableEventSnapshots}
            onChange={e => setRules({ ...rules, enableEventSnapshots: e.target.checked })}
            className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
          />
        </div>
      </div>
    </div>
  );
};

export default RuleTuningPage;
