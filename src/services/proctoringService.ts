import type { RuleTuning, ProctoringEvent } from '../types';
import { DEFAULT_RULES, calculateRisk } from '../utils/riskScorer';
import { examService } from './examService';

const RULES_STORAGE_KEY = 'proctorvision_tuning_rules';

export const proctoringService = {
  getRules(): RuleTuning {
    try {
      const stored = localStorage.getItem(RULES_STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_RULES, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Failed reading rules from localStorage', e);
    }
    return DEFAULT_RULES;
  },

  saveRules(rules: RuleTuning): RuleTuning {
    localStorage.setItem(RULES_STORAGE_KEY, JSON.stringify(rules));
    return rules;
  },

  resetRules(): RuleTuning {
    localStorage.setItem(RULES_STORAGE_KEY, JSON.stringify(DEFAULT_RULES));
    return DEFAULT_RULES;
  },

  getAllEvents(): ProctoringEvent[] {
    const attempts = examService.getAttempts();
    const allEvents: ProctoringEvent[] = [];
    attempts.forEach(att => {
      allEvents.push(...att.events);
    });
    // Sort descending by timestamp
    return allEvents.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  },

  getRuleEventStats() {
    const events = this.getAllEvents();
    const stats: Record<string, { total: number; falseAlarms: number; validViolations: number; pending: number }> = {
      NO_FACE: { total: 0, falseAlarms: 0, validViolations: 0, pending: 0 },
      MULTIPLE_FACES: { total: 0, falseAlarms: 0, validViolations: 0, pending: 0 },
      TAB_SWITCH: { total: 0, falseAlarms: 0, validViolations: 0, pending: 0 },
      HEAD_TURNED: { total: 0, falseAlarms: 0, validViolations: 0, pending: 0 },
      CAMERA_DISCONNECTED: { total: 0, falseAlarms: 0, validViolations: 0, pending: 0 }
    };

    events.forEach(ev => {
      if (!stats[ev.type]) {
        stats[ev.type] = { total: 0, falseAlarms: 0, validViolations: 0, pending: 0 };
      }
      stats[ev.type].total += 1;
      if (ev.status === 'reviewed_false_alarm') {
        stats[ev.type].falseAlarms += 1;
      } else if (ev.status === 'reviewed_valid') {
        stats[ev.type].validViolations += 1;
      } else {
        stats[ev.type].pending += 1;
      }
    });

    return stats;
  },

  markEventStatus(eventId: string, status: 'reviewed_valid' | 'reviewed_false_alarm') {
    const attempts = examService.getAttempts();
    let updated = false;

    attempts.forEach(att => {
      const ev = att.events.find(e => e.id === eventId);
      if (ev) {
        ev.status = status;
        updated = true;
        const { score, level } = calculateRisk(att.events, this.getRules());
        att.riskScore = score;
        att.riskLevel = level;
      }
    });

    if (updated) {
      localStorage.setItem('proctorvision_attempts', JSON.stringify(attempts));
    }
  }
};
