import { useState, useEffect, useRef, useCallback } from 'react';
import { FilesetResolver, FaceDetector } from '@mediapipe/tasks-vision';
import type { DetectionState, EventType, ProctoringEvent, RiskLevel } from '../types';
import { proctoringService } from '../services/proctoringService';
import { examService } from '../services/examService';
import { calculateRisk } from '../utils/riskScorer';

interface UseProctoringOptions {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  isStreaming: boolean;
  attemptId: string;
  studentName: string;
  examId: string;
  enabled?: boolean;
  consentGiven?: boolean;
  captureSnapshot?: () => string | undefined;
}

export function useProctoring({
  videoRef,
  isStreaming,
  attemptId,
  studentName,
  examId,
  enabled = true,
  consentGiven = true,
  captureSnapshot
}: UseProctoringOptions) {
  const [detectionState, setDetectionState] = useState<DetectionState>({
    faceCount: 1,
    faceDetected: true,
    multipleFaces: false,
    headPose: 'center',
    tabActive: true,
    cameraActive: isStreaming
  });

  const [events, setEvents] = useState<ProctoringEvent[]>(() => {
    const attempt = examService.getAttemptById(attemptId);
    return attempt ? attempt.events : [];
  });

  const [isModelReady, setIsModelReady] = useState(false);
  const [tabSwitchCount, setTabSwitchCount] = useState(0);

  const rules = proctoringService.getRules();
  const faceDetectorRef = useRef<FaceDetector | null>(null);

  // Persistence tracking timestamps
  const noFaceStartTimeRef = useRef<number | null>(null);
  const multipleFacesStartTimeRef = useRef<number | null>(null);
  const headTurnedStartTimeRef = useRef<number | null>(null);
  const tabHiddenStartTimeRef = useRef<number | null>(null);

  // Cooldown timestamps to avoid spamming duplicate events
  const lastEventCooldownRef = useRef<Record<string, number>>({});

  // 1. Initialize MediaPipe FaceDetector
  useEffect(() => {
    let isCancelled = false;

    async function initMediaPipe() {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        );

        if (isCancelled) return;

        const detector = await FaceDetector.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite',
            delegate: 'GPU'
          },
          runningMode: 'VIDEO'
        });

        if (isCancelled) return;
        faceDetectorRef.current = detector;
        setIsModelReady(true);
      } catch (err) {
        console.warn('GPU MediaPipe initialization failed, trying CPU fallback:', err);
        try {
          const vision = await FilesetResolver.forVisionTasks(
            'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
          );
          if (isCancelled) return;
          const cpuDetector = await FaceDetector.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath:
                'https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite',
              delegate: 'CPU'
            },
            runningMode: 'VIDEO'
          });
          if (isCancelled) return;
          faceDetectorRef.current = cpuDetector;
          setIsModelReady(true);
        } catch (fallbackErr) {
          console.warn('MediaPipe offline or unavailable, fallback active:', fallbackErr);
          // Still ready with simulator and native page visibility hooks
          setIsModelReady(true);
        }
      }
    }

    initMediaPipe();

    return () => {
      isCancelled = true;
      if (faceDetectorRef.current) {
        faceDetectorRef.current.close();
      }
    };
  }, []);

  // 2. Dispatch a proctoring event with debounce and optional snapshot
  const triggerEvent = useCallback(
    (
      type: EventType,
      severity: RiskLevel,
      description: string,
      durationSeconds?: number
    ) => {
      const now = Date.now();
      const lastRecorded = lastEventCooldownRef.current[type] || 0;
      const cooldownMs = 8000; // 8 seconds cooldown per type

      if (now - lastRecorded < cooldownMs) {
        return;
      }
      lastEventCooldownRef.current[type] = now;

      // Capture small thumbnail snapshot if consented
      let snapshotUrl: string | undefined = undefined;
      if (consentGiven && rules.enableEventSnapshots && captureSnapshot) {
        snapshotUrl = captureSnapshot();
      }

      const recorded = examService.recordAttemptEvent(attemptId, {
        attemptId,
        studentName,
        examId,
        type,
        severity,
        timestamp: new Date().toISOString(),
        durationSeconds,
        description,
        snapshotUrl
      });

      if (recorded) {
        setEvents(prev => [recorded, ...prev]);
      }
    },
    [attemptId, studentName, examId, consentGiven, rules.enableEventSnapshots, captureSnapshot]
  );

  // 3. Page Visibility API and Window Blur listeners
  useEffect(() => {
    if (!enabled) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        tabHiddenStartTimeRef.current = Date.now();
        setDetectionState(prev => ({ ...prev, tabActive: false }));
      } else {
        setDetectionState(prev => ({ ...prev, tabActive: true }));
        if (tabHiddenStartTimeRef.current) {
          const durationSec = Math.round((Date.now() - tabHiddenStartTimeRef.current) / 1000);
          tabHiddenStartTimeRef.current = null;
          setTabSwitchCount(c => c + 1);

          triggerEvent(
            'TAB_SWITCH',
            'HIGH',
            `Student navigated away or minimized exam window (${durationSec}s)`,
            durationSec
          );
        }
      }
    };

    const handleWindowBlur = () => {
      if (document.visibilityState === 'visible') {
        // Window lost focus to an external app/window
        triggerEvent(
          'TAB_SWITCH',
          'MEDIUM',
          'Exam window lost focus (potential multi-tasking or external app interaction)'
        );
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [enabled, triggerEvent]);

  // 4. Video Face Detection Interval Loop
  useEffect(() => {
    if (!enabled || !isStreaming) {
      return;
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const video = videoRef.current;
      const detector = faceDetectorRef.current;

      if (!video || video.readyState < 2) {
        return;
      }

      if (detector) {
        try {
          const result = detector.detectForVideo(video, performance.now());
          const detections = result.detections || [];
          const count = detections.length;

          // Compute head pose from bounding box center & keypoints
          let headPose: 'center' | 'left' | 'right' | 'down' | 'up' = 'center';

          if (count === 1) {
            const bbox = detections[0].boundingBox;
            if (bbox && video.videoWidth > 0) {
              const centerX = (bbox.originX + bbox.width / 2) / video.videoWidth;
              if (centerX < 0.28) {
                headPose = 'left';
              } else if (centerX > 0.72) {
                headPose = 'right';
              }
            }

            // Keypoint evaluation (nose vs eyes)
            const keypoints = detections[0].keypoints;
            if (keypoints && keypoints.length >= 3) {
              const rightEye = keypoints[0]; // right eye
              const leftEye = keypoints[1];  // left eye
              const noseTip = keypoints[2];  // nose tip
              if (rightEye && leftEye && noseTip) {
                const distRight = Math.abs(noseTip.x - rightEye.x);
                const distLeft = Math.abs(noseTip.x - leftEye.x);
                if (distRight > 0.01 && distLeft > 0.01) {
                  const ratio = distRight / distLeft;
                  if (ratio > 2.8) headPose = 'left';
                  else if (ratio < 0.35) headPose = 'right';
                }
              }
            }
          }

          setDetectionState(prev => ({
            ...prev,
            faceCount: count,
            faceDetected: count > 0,
            multipleFaces: count > 1,
            headPose
          }));

          // Rule 1: No Face Persistence
          if (count === 0) {
            if (!noFaceStartTimeRef.current) {
              noFaceStartTimeRef.current = now;
            } else {
              const elapsedSec = (now - noFaceStartTimeRef.current) / 1000;
              if (elapsedSec >= rules.noFaceThresholdSeconds) {
                triggerEvent(
                  'NO_FACE',
                  'MEDIUM',
                  `No face detected in camera frame for ${Math.round(elapsedSec)}s`,
                  Math.round(elapsedSec)
                );
              }
            }
          } else {
            noFaceStartTimeRef.current = null;
          }

          // Rule 2: Multiple Faces Persistence
          if (count > 1) {
            if (!multipleFacesStartTimeRef.current) {
              multipleFacesStartTimeRef.current = now;
            } else {
              const elapsedSec = (now - multipleFacesStartTimeRef.current) / 1000;
              if (elapsedSec >= rules.multipleFacesThresholdSeconds) {
                triggerEvent(
                  'MULTIPLE_FACES',
                  'HIGH',
                  `Multiple individuals (${count}) detected in camera view`,
                  Math.round(elapsedSec)
                );
              }
            }
          } else {
            multipleFacesStartTimeRef.current = null;
          }

          // Rule 3: Head Turned Away Persistence
          if (headPose !== 'center') {
            if (!headTurnedStartTimeRef.current) {
              headTurnedStartTimeRef.current = now;
            } else {
              const elapsedSec = (now - headTurnedStartTimeRef.current) / 1000;
              if (elapsedSec >= rules.headTurnedThresholdSeconds) {
                triggerEvent(
                  'HEAD_TURNED',
                  'LOW',
                  `Gaze diverted towards ${headPose} for sustained duration (${Math.round(elapsedSec)}s)`,
                  Math.round(elapsedSec)
                );
              }
            }
          } else {
            headTurnedStartTimeRef.current = null;
          }
        } catch (detErr) {
          console.warn('Face detection pass failed:', detErr);
        }
      }
    }, 450); // Evaluate every 450ms for low CPU overhead

    return () => clearInterval(interval);
  }, [enabled, isStreaming, videoRef, rules, triggerEvent]);

  // Compute live aggregated risk score
  const { score: riskScore, level: riskLevel } = calculateRisk(events, rules);

  // Manual event simulator (for judges and testing)
  const simulateEvent = useCallback(
    (type: EventType, description: string) => {
      let severity: RiskLevel = 'MEDIUM';
      if (type === 'MULTIPLE_FACES' || type === 'TAB_SWITCH') severity = 'HIGH';
      if (type === 'HEAD_TURNED') severity = 'LOW';
      triggerEvent(type, severity, description, 5);
    },
    [triggerEvent]
  );

  return {
    detectionState: {
      ...detectionState,
      cameraActive: isStreaming && enabled
    },
    events,
    riskScore,
    riskLevel,
    isModelReady,
    tabSwitchCount,
    simulateEvent
  };
}
