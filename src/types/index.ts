export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type EventType = 
  | 'NO_FACE' 
  | 'MULTIPLE_FACES' 
  | 'TAB_SWITCH' 
  | 'HEAD_TURNED' 
  | 'CAMERA_DISCONNECTED';

export type EventStatus = 'flagged' | 'reviewed_valid' | 'reviewed_false_alarm';

export interface ProctoringEvent {
  id: string;
  attemptId: string;
  studentName: string;
  examId: string;
  type: EventType;
  severity: RiskLevel;
  timestamp: string;
  durationSeconds?: number;
  description: string;
  snapshotUrl?: string; // Base64 thumbnail when consented
  status: EventStatus;
}

export interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  marks: number;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  durationMinutes: number;
  totalMarks: number;
  passingScore: number;
  questions: Question[];
  createdAt: string;
  createdBy: string;
  status: 'draft' | 'active' | 'archived';
  enableSnapshots: boolean;
  showResultsImmediately: boolean;
}

export interface StudentAttempt {
  id: string;
  examId: string;
  examTitle: string;
  studentId: string;
  studentName: string;
  studentEmail: string;
  status: 'in-progress' | 'completed' | 'flagged' | 'submitted';
  startedAt: string;
  submittedAt?: string;
  durationSeconds: number;
  answers: Record<string, number>; // questionId -> optionIndex
  score?: number;
  riskScore: number; // 0 to 100
  riskLevel: RiskLevel;
  events: ProctoringEvent[];
  consentGiven: boolean;
  reviewed: boolean;
  reviewDecision?: 'valid' | 'false_alarm' | 'pending';
  reviewNotes?: string;
  reviewedAt?: string;
}

export interface RuleTuning {
  noFaceThresholdSeconds: number;
  multipleFacesThresholdSeconds: number;
  headTurnedThresholdSeconds: number;
  tabSwitchPenalty: number;
  noFacePenalty: number;
  multipleFacesPenalty: number;
  headTurnedPenalty: number;
  enableEventSnapshots: boolean;
  riskThresholdWarning: number;
  riskThresholdCritical: number;
}

export interface DetectionState {
  faceCount: number;
  faceDetected: boolean;
  multipleFaces: boolean;
  headPose: 'center' | 'left' | 'right' | 'down' | 'up';
  tabActive: boolean;
  cameraActive: boolean;
  lastEventTime?: number;
}
