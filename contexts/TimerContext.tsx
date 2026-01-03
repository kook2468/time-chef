import { Timer } from '@/components/TimerList';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Audio } from 'expo-av';
import React, { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AppState, AppStateStatus, Vibration } from 'react-native';

export interface TimerPreset {
  id: string;
  emoji: string;
  name: string;
  minutes: number;
  seconds: number;
}

interface TimerContextType {
  timers: Timer[];
  presets: TimerPreset[];
  addTimer: (timer: Omit<Timer, 'id'>) => Timer;
  addPreset: (preset: Omit<TimerPreset, 'id'>) => void;
  deletePreset: (id: string) => void;
  updateTimer: (id: string, updates: Partial<Timer>) => void;
  deleteTimer: (id: string) => void;
  toggleTimer: (id: string) => void;
}

const TimerContext = createContext<TimerContextType | undefined>(undefined);
const STORAGE_KEY = '@timers';
const PRESETS_STORAGE_KEY = '@timer_presets';

export function TimerProvider({ children }: { children: ReactNode }) {
  const [timers, setTimers] = useState<Timer[]>([]);
  const [presets, setPresets] = useState<TimerPreset[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const appState = useRef(AppState.currentState);

  // 백그라운드에서 돌아왔을 때 타이머 업데이트
  const updateTimersAfterBackground = useCallback(() => {
    const now = Date.now();
    setTimers((prev) =>
      prev.map((timer) => {
        if (timer.isRunning && timer.startTime) {
          // 시작 시간부터 현재까지 경과 시간 계산
          const elapsedSeconds = Math.floor((now - timer.startTime) / 1000);
          const newRemaining = Math.max(0, timer.totalSeconds - elapsedSeconds);
          const justCompleted = newRemaining === 0 && timer.remainingSeconds > 0;

          if (justCompleted) {
            playCompletionAlert();
          }

          return {
            ...timer,
            remainingSeconds: newRemaining,
            isCompleted: newRemaining === 0,
            isRunning: newRemaining > 0,
            lastUpdateTime: now,
          };
        }
        return timer;
      })
    );
  }, []);

  const loadTimers = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);
      if (stored) {
        const loadedTimers: Timer[] = JSON.parse(stored);
        const now = Date.now();
        
        // 불러온 타이머들의 lastUpdateTime 업데이트
        const updatedTimers = loadedTimers.map(timer => ({
          ...timer,
          lastUpdateTime: timer.lastUpdateTime || now,
        }));
        
        setTimers(updatedTimers);
        
        // 불러온 직후 백그라운드에서 경과한 시간 계산
        setTimeout(() => {
          updateTimersAfterBackground();
        }, 100);
      }
    } catch (error) {
      console.error('Failed to load timers:', error);
    }
  }, [updateTimersAfterBackground]);

  // 초기 로드: AsyncStorage에서 타이머 & 프리셋 불러오기
  useEffect(() => {
    loadTimers();
    loadPresets();
  }, [loadTimers]);

  // 타이머 변경 시 자동 저장
  useEffect(() => {
    saveTimers(timers);
  }, [timers]);

  // 프리셋 변경 시 자동 저장
  useEffect(() => {
    savePresets(presets);
  }, [presets]);

  // AppState 변경 감지 (백그라운드/포그라운드)
  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        // 앱이 다시 활성화되었을 때 타이머 시간 재계산
        updateTimersAfterBackground();
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [updateTimersAfterBackground]);

  // 실행 중인 타이머 카운트다운
  useEffect(() => {
    const updateTimers = () => {
      const now = Date.now();
      setTimers((prev) =>
        prev.map((timer) => {
          if (timer.isRunning && timer.startTime) {
            // 시작 시간부터 경과 시간 계산
            const elapsedSeconds = Math.floor((now - timer.startTime) / 1000);
            const newRemaining = Math.max(0, timer.totalSeconds - elapsedSeconds);
            const justCompleted = newRemaining === 0 && timer.remainingSeconds > 0;
            
            // 타이머 완료 시 알림
            if (justCompleted) {
              playCompletionAlert();
            }
            
            return {
              ...timer,
              remainingSeconds: newRemaining,
              isCompleted: newRemaining === 0,
              isRunning: newRemaining > 0,
              lastUpdateTime: now,
            };
          }
          return timer;
        })
      );
    };

    // 즉시 한 번 실행
    updateTimers();
    
    // 100ms마다 업데이트 (더 빠른 반응성)
    intervalRef.current = setInterval(updateTimers, 100);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const playCompletionAlert = async () => {
    try {
      // [대기, 진동, 대기, 진동, ...]
      const pattern = [
        0,    // 즉시 시작 (대기)
        500,  // 웅~ (진동 1)
        400,  // 휴식 (대기)
        500,  // 웅~ (진동 2)
        400,  // 휴식 (대기)
        500,  // 웅~ (진동 3)
      ];
      
      // 한 번만 진동
      Vibration.vibrate(pattern, false);
      
      // 알림음 재생 (파일이 있는 경우에만)
      try {
        const { sound } = await Audio.Sound.createAsync(
          require('@/assets/sounds/timer-complete.mp3'),
          { shouldPlay: true }
        );
        
        // 재생 후 메모리 해제
        sound.setOnPlaybackStatusUpdate((status: any) => {
          if (status.isLoaded && status.didJustFinish) {
            sound.unloadAsync();
          }
        });
      } catch {
        // 알림음 파일이 없어도 진동은 작동
        console.log('Audio file not found, using vibration only');
      }
    } catch (error) {
      console.error('Failed to play completion alert:', error);
    }
  };

  const loadPresets = async () => {
    try {
      const stored = await AsyncStorage.getItem(PRESETS_STORAGE_KEY);
      if (stored) {
        setPresets(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load presets:', error);
    }
  };

  const saveTimers = async (timersToSave: Timer[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(timersToSave));
    } catch (error) {
      console.error('Failed to save timers:', error);
    }
  };

  const savePresets = async (presetsToSave: TimerPreset[]) => {
    try {
      await AsyncStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(presetsToSave));
    } catch (error) {
      console.error('Failed to save presets:', error);
    }
  };

  const addTimer = (timer: Omit<Timer, 'id'>) => {
    const newTimer: Timer = {
      ...timer,
      id: Date.now().toString(),
    };
    setTimers((prev) => [...prev, newTimer]);
    return newTimer;
  };

  const updateTimer = (id: string, updates: Partial<Timer>) => {
    setTimers((prev) =>
      prev.map((timer) => (timer.id === id ? { ...timer, ...updates } : timer))
    );
  };

  const deleteTimer = (id: string) => {
    setTimers((prev) => prev.filter((timer) => timer.id !== id));
  };

  const toggleTimer = (id: string) => {
    const now = Date.now();
    setTimers((prev) =>
      prev.map((timer) => {
        if (timer.id === id) {
          if (timer.isRunning) {
            // 일시정지: 현재 남은 시간을 고정
            return {
              ...timer,
              isRunning: false,
              lastUpdateTime: now,
            };
          } else {
            // 재개: startTime 재설정, totalSeconds는 남은 시간으로, originalTotalSeconds 유지
            return {
              ...timer,
              isRunning: true,
              startTime: now,
              totalSeconds: timer.remainingSeconds, // 남은 시간을 새 기준으로
              originalTotalSeconds: timer.originalTotalSeconds || timer.totalSeconds, // 원래 총 시간 보존
              lastUpdateTime: now,
            };
          }
        }
        return timer;
      })
    );
  };

  const addPreset = (preset: Omit<TimerPreset, 'id'>) => {
    const newPreset: TimerPreset = {
      ...preset,
      id: Date.now().toString(),
    };
    setPresets((prev) => [newPreset, ...prev]);
  };

  const deletePreset = (id: string) => {
    setPresets((prev) => prev.filter((preset) => preset.id !== id));
  };

  return (
    <TimerContext.Provider
      value={{ timers, presets, addTimer, addPreset, deletePreset, updateTimer, deleteTimer, toggleTimer }}
    >
      {children}
    </TimerContext.Provider>
  );
}

export function useTimers() {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimers must be used within a TimerProvider');
  }
  return context;
}
