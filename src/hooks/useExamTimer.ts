import { useState, useEffect, useRef, useCallback } from 'react';
import { formatDuration } from '../utils/formatters';

interface UseExamTimerOptions {
  durationMinutes: number;
  autoStart?: boolean;
  onTimeUp?: () => void;
  warningThresholdMinutes?: number;
}

export function useExamTimer({
  durationMinutes,
  autoStart = true,
  onTimeUp,
  warningThresholdMinutes = 5
}: UseExamTimerOptions) {
  const totalSeconds = durationMinutes * 60;
  const [secondsRemaining, setSecondsRemaining] = useState(totalSeconds);
  const [isActive, setIsActive] = useState(autoStart);
  const [isExpired, setIsExpired] = useState(false);

  const onTimeUpRef = useRef(onTimeUp);
  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  const [prevDuration, setPrevDuration] = useState(durationMinutes);
  if (prevDuration !== durationMinutes) {
    setPrevDuration(durationMinutes);
    setSecondsRemaining(durationMinutes * 60);
    setIsExpired(false);
  }

  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isActive) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = window.setInterval(() => {
      setSecondsRemaining(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setIsActive(false);
          setIsExpired(true);
          if (onTimeUpRef.current) {
            onTimeUpRef.current();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive]);

  const startTimer = useCallback(() => setIsActive(true), []);
  const pauseTimer = useCallback(() => setIsActive(false), []);
  const resetTimer = useCallback(() => {
    setIsActive(false);
    setSecondsRemaining(durationMinutes * 60);
    setIsExpired(false);
  }, [durationMinutes]);

  const timeElapsedSeconds = totalSeconds - secondsRemaining;
  const isLowTime = secondsRemaining <= warningThresholdMinutes * 60 && secondsRemaining > 0;
  const progressPercentage = Math.round(((totalSeconds - secondsRemaining) / totalSeconds) * 100);

  return {
    secondsRemaining,
    timeElapsedSeconds,
    formattedTime: formatDuration(secondsRemaining),
    formattedElapsed: formatDuration(timeElapsedSeconds),
    isLowTime,
    isExpired,
    isActive,
    progressPercentage,
    startTimer,
    pauseTimer,
    resetTimer
  };
}
