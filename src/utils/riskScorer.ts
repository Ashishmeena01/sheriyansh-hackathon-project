import type { ProctoringEvent, RiskLevel, RuleTuning } from '../types';

export const DEFAULT_RULES: RuleTuning = {
  noFaceThresholdSeconds: 4,
  multipleFacesThresholdSeconds: 2,
  headTurnedThresholdSeconds: 3,
  tabSwitchPenalty: 25,
  noFacePenalty: 15,
  multipleFacesPenalty: 35,
  headTurnedPenalty: 10,
  enableEventSnapshots: true,
  riskThresholdWarning: 35,
  riskThresholdCritical: 70
};

export function calculateRisk(
  events: ProctoringEvent[],
  rules: RuleTuning = DEFAULT_RULES
): { score: number; level: RiskLevel } {
  let totalScore = 0;

  for (const event of events) {
    // If flagged or reviewed as valid, it contributes to the risk score
    if (event.status === 'reviewed_false_alarm') {
      continue;
    }

    switch (event.type) {
      case 'TAB_SWITCH':
        totalScore += rules.tabSwitchPenalty;
        break;
      case 'MULTIPLE_FACES':
        totalScore += rules.multipleFacesPenalty;
        break;
      case 'NO_FACE':
        totalScore += rules.noFacePenalty;
        break;
      case 'HEAD_TURNED':
        totalScore += rules.headTurnedPenalty;
        break;
      case 'CAMERA_DISCONNECTED':
        totalScore += 20;
        break;
    }
  }

  // Cap between 0 and 100
  const score = Math.min(100, Math.max(0, totalScore));

  let level: RiskLevel = 'LOW';
  if (score >= rules.riskThresholdCritical) {
    level = 'CRITICAL';
  } else if (score >= rules.riskThresholdWarning) {
    level = 'HIGH';
  } else if (score > 10) {
    level = 'MEDIUM';
  }

  return { score, level };
}
