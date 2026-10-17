import type { Exam, StudentAttempt, ProctoringEvent } from '../types';
import { calculateRisk } from '../utils/riskScorer';

const EXAMS_STORAGE_KEY = 'proctorvision_exams';
const ATTEMPTS_STORAGE_KEY = 'proctorvision_attempts';

const SEED_EXAMS: Exam[] = [
  {
    id: 'exam-1',
    title: 'CS 402: Web Security & Cryptography',
    description: 'Midterm assessment on web vulnerabilities, asymmetric cryptography, TLS protocols, and secure session management.',
    durationMinutes: 45,
    totalMarks: 30,
    passingScore: 18,
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    createdBy: 'Prof. Sarah Jenkins',
    status: 'active',
    enableSnapshots: true,
    showResultsImmediately: false,
    questions: [
      {
        id: 'q1',
        questionText: 'Which HTTP header prevents cross-site scripting (XSS) by restricting where scripts can be loaded from?',
        options: [
          'Content-Security-Policy',
          'Access-Control-Allow-Origin',
          'Strict-Transport-Security',
          'X-Frame-Options'
        ],
        correctOptionIndex: 0,
        marks: 10
      },
      {
        id: 'q2',
        questionText: 'In asymmetric public-key cryptography, which key is used to decrypt a message encrypted with Alice\'s public key?',
        options: [
          'Bob\'s private key',
          'Alice\'s private key',
          'Alice\'s public key',
          'A pre-shared session key'
        ],
        correctOptionIndex: 1,
        marks: 10
      },
      {
        id: 'q3',
        questionText: 'What is the primary advantage of client-side privacy-preserving AI proctoring over cloud video streaming?',
        options: [
          'It requires 100x more server bandwidth',
          'Raw biometric video never leaves the student device, preventing unauthorized surveillance storage',
          'It completely eliminates the need for student webcam hardware',
          'It automatically retrains server neural models without consent'
        ],
        correctOptionIndex: 1,
        marks: 10
      }
    ]
  },
  {
    id: 'exam-2',
    title: 'AI 305: Computer Vision & Edge Intelligence',
    description: 'Final quiz evaluating edge neural architectures, bounding box regression, and face landmark tracking fundamentals.',
    durationMinutes: 30,
    totalMarks: 20,
    passingScore: 12,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    createdBy: 'Dr. Rahul Mehta',
    status: 'active',
    enableSnapshots: true,
    showResultsImmediately: true,
    questions: [
      {
        id: 'q2-1',
        questionText: 'What lightweight single-shot detector framework does MediaPipe utilize for rapid on-device face bounding estimation?',
        options: [
          'BlazeFace',
          'ResNet-152',
          'VGG-19',
          'Mask R-CNN Heavy'
        ],
        correctOptionIndex: 0,
        marks: 10
      },
      {
        id: 'q2-2',
        questionText: 'Which browser Web API is used to detect when a student minimizes the exam browser or navigates to another desktop application?',
        options: [
          'Page Visibility API (document.visibilityState)',
          'Battery Status API',
          'Gamepad API',
          'Web Speech Synthesis API'
        ],
        correctOptionIndex: 0,
        marks: 10
      }
    ]
  }
];

const SEED_ATTEMPTS: StudentAttempt[] = [
  {
    id: 'att-101',
    examId: 'exam-1',
    examTitle: 'CS 402: Web Security & Cryptography',
    studentId: 'std-8041',
    studentName: 'Alex Chen',
    studentEmail: 'alex.chen@university.edu',
    status: 'flagged',
    startedAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    submittedAt: new Date(Date.now() - 3600000 * 2.3).toISOString(),
    durationSeconds: 2520,
    answers: { q1: 0, q2: 1, q3: 1 },
    score: 30,
    riskScore: 65,
    riskLevel: 'HIGH',
    consentGiven: true,
    reviewed: false,
    reviewDecision: 'pending',
    events: [
      {
        id: 'ev-1',
        attemptId: 'att-101',
        studentName: 'Alex Chen',
        examId: 'exam-1',
        type: 'TAB_SWITCH',
        severity: 'HIGH',
        timestamp: new Date(Date.now() - 3600000 * 2.8).toISOString(),
        durationSeconds: 8,
        description: 'Exam tab switched to background for 8 seconds',
        status: 'flagged'
      },
      {
        id: 'ev-2',
        attemptId: 'att-101',
        studentName: 'Alex Chen',
        examId: 'exam-1',
        type: 'HEAD_TURNED',
        severity: 'MEDIUM',
        timestamp: new Date(Date.now() - 3600000 * 2.6).toISOString(),
        durationSeconds: 6,
        description: 'Head turned towards secondary display / angle',
        status: 'flagged'
      },
      {
        id: 'ev-3',
        attemptId: 'att-101',
        studentName: 'Alex Chen',
        examId: 'exam-1',
        type: 'MULTIPLE_FACES',
        severity: 'HIGH',
        timestamp: new Date(Date.now() - 3600000 * 2.5).toISOString(),
        durationSeconds: 4,
        description: 'Second face appeared in webcam perimeter',
        status: 'flagged'
      }
    ]
  },
  {
    id: 'att-102',
    examId: 'exam-1',
    examTitle: 'CS 402: Web Security & Cryptography',
    studentId: 'std-8042',
    studentName: 'Priya Sharma',
    studentEmail: 'priya.sharma@university.edu',
    status: 'completed',
    startedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    submittedAt: new Date(Date.now() - 3600000 * 1.4).toISOString(),
    durationSeconds: 2160,
    answers: { q1: 0, q2: 1, q3: 1 },
    score: 30,
    riskScore: 10,
    riskLevel: 'LOW',
    consentGiven: true,
    reviewed: true,
    reviewDecision: 'valid',
    reviewNotes: 'One brief gaze away during thinking, natural posture verified.',
    reviewedAt: new Date(Date.now() - 3600000 * 1.2).toISOString(),
    events: [
      {
        id: 'ev-4',
        attemptId: 'att-102',
        studentName: 'Priya Sharma',
        examId: 'exam-1',
        type: 'HEAD_TURNED',
        severity: 'LOW',
        timestamp: new Date(Date.now() - 3600000 * 1.8).toISOString(),
        durationSeconds: 3,
        description: 'Brief downward gaze away from primary display',
        status: 'reviewed_valid'
      }
    ]
  },
  {
    id: 'att-103',
    examId: 'exam-2',
    examTitle: 'AI 305: Computer Vision & Edge Intelligence',
    studentId: 'std-8043',
    studentName: 'Marcus Vance',
    studentEmail: 'marcus.v@university.edu',
    status: 'in-progress',
    startedAt: new Date(Date.now() - 900000).toISOString(),
    durationSeconds: 900,
    answers: { 'q2-1': 0 },
    riskScore: 40,
    riskLevel: 'HIGH',
    consentGiven: true,
    reviewed: false,
    reviewDecision: 'pending',
    events: [
      {
        id: 'ev-5',
        attemptId: 'att-103',
        studentName: 'Marcus Vance',
        examId: 'exam-2',
        type: 'NO_FACE',
        severity: 'MEDIUM',
        timestamp: new Date(Date.now() - 600000).toISOString(),
        durationSeconds: 7,
        description: 'No face detected in video frame for 7 seconds',
        status: 'flagged'
      },
      {
        id: 'ev-6',
        attemptId: 'att-103',
        studentName: 'Marcus Vance',
        examId: 'exam-2',
        type: 'TAB_SWITCH',
        severity: 'HIGH',
        timestamp: new Date(Date.now() - 300000).toISOString(),
        durationSeconds: 5,
        description: 'Exam window lost focus / tab switched',
        status: 'flagged'
      }
    ]
  }
];

export const examService = {
  getExams(): Exam[] {
    try {
      const stored = localStorage.getItem(EXAMS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed reading exams from localStorage', e);
    }
    // Default seed
    localStorage.setItem(EXAMS_STORAGE_KEY, JSON.stringify(SEED_EXAMS));
    return SEED_EXAMS;
  },

  getExamById(id: string): Exam | undefined {
    return this.getExams().find(e => e.id === id);
  },

  saveExam(exam: Exam): Exam {
    const exams = this.getExams();
    const existingIndex = exams.findIndex(e => e.id === exam.id);
    if (existingIndex >= 0) {
      exams[existingIndex] = exam;
    } else {
      exams.unshift(exam);
    }
    localStorage.setItem(EXAMS_STORAGE_KEY, JSON.stringify(exams));
    return exam;
  },

  deleteExam(id: string): void {
    const exams = this.getExams().filter(e => e.id !== id);
    localStorage.setItem(EXAMS_STORAGE_KEY, JSON.stringify(exams));
  },

  getAttempts(): StudentAttempt[] {
    try {
      const stored = localStorage.getItem(ATTEMPTS_STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn('Failed reading attempts from localStorage', e);
    }
    localStorage.setItem(ATTEMPTS_STORAGE_KEY, JSON.stringify(SEED_ATTEMPTS));
    return SEED_ATTEMPTS;
  },

  getAttemptById(id: string): StudentAttempt | undefined {
    return this.getAttempts().find(a => a.id === id);
  },

  saveAttempt(attempt: StudentAttempt): StudentAttempt {
    const attempts = this.getAttempts();
    const index = attempts.findIndex(a => a.id === attempt.id);
    if (index >= 0) {
      attempts[index] = attempt;
    } else {
      attempts.unshift(attempt);
    }
    localStorage.setItem(ATTEMPTS_STORAGE_KEY, JSON.stringify(attempts));
    return attempt;
  },

  updateAttemptReview(
    attemptId: string,
    decision: 'valid' | 'false_alarm',
    notes?: string
  ): StudentAttempt | undefined {
    const attempts = this.getAttempts();
    const attempt = attempts.find(a => a.id === attemptId);
    if (!attempt) return undefined;

    attempt.reviewed = true;
    attempt.reviewDecision = decision;
    attempt.reviewNotes = notes;
    attempt.reviewedAt = new Date().toISOString();

    // Mark corresponding events
    attempt.events = attempt.events.map(ev => ({
      ...ev,
      status: decision === 'false_alarm' ? 'reviewed_false_alarm' : 'reviewed_valid'
    }));

    // Recalculate risk score after review
    const { score, level } = calculateRisk(attempt.events);
    attempt.riskScore = score;
    attempt.riskLevel = level;

    localStorage.setItem(ATTEMPTS_STORAGE_KEY, JSON.stringify(attempts));
    return attempt;
  },

  recordAttemptEvent(
    attemptId: string,
    eventData: Omit<ProctoringEvent, 'id' | 'status'>
  ): ProctoringEvent | undefined {
    const attempts = this.getAttempts();
    const attempt = attempts.find(a => a.id === attemptId);
    if (!attempt) return undefined;

    const newEvent: ProctoringEvent = {
      ...eventData,
      id: `ev-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      status: 'flagged'
    };

    attempt.events.push(newEvent);
    const { score, level } = calculateRisk(attempt.events);
    attempt.riskScore = score;
    attempt.riskLevel = level;
    if (attempt.riskScore >= 40 && attempt.status !== 'completed') {
      attempt.status = 'flagged';
    }

    localStorage.setItem(ATTEMPTS_STORAGE_KEY, JSON.stringify(attempts));
    return newEvent;
  }
};
