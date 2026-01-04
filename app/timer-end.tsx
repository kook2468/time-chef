import { BackIcon, DeleteIcon, PauseIcon, PlayIcon, ResetIcon } from '@/components/Icons';
import { ThemedView } from '@/components/themed-view';
import { BorderRadius, Colors, FontSizes, Spacing } from '@/constants/styles';
import { useTimers } from '@/contexts/TimerContext';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function TimerEndScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { t } = useTranslation();
  const { addTimer, timers, presets, toggleTimer, updateTimer, deleteTimer, deletePreset } = useTimers();
  
  const presetId = params.presetId as string;
  const presetName = decodeURIComponent((params.name as string) || '');
  const emoji = params.emoji as string;
  const minutes = parseInt(params.minutes as string || '0');
  const seconds = parseInt(params.seconds as string || '0');
  const totalSeconds = minutes * 60 + seconds;

  // URL에서 timerId가 전달되면 기존 타이머, 없으면 null
  const initialTimerId = params.timerId as string | undefined;
  const [timerId, setTimerId] = useState<string | null>(initialTimerId || null);
  
  // timerId가 있으면 해당 타이머 가져오기
  const timer = timerId ? timers.find(t => t.id === timerId) : null;

  // 표시할 이름: 타이머가 있으면 해당 프리셋 이름, 없으면 URL 파라미터의 이름
  const displayName = timer?.presetId 
    ? presets.find(p => p.id === timer.presetId)?.name || presetName
    : presetName;

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const s = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleToggle = () => {
    if (!timerId) {
      // 첫 재생: 타이머를 리스트에 추가
      const now = Date.now();
      const newTimer = addTimer({
        emoji,
        name: `${emoji} Timer`,
        totalSeconds,
        remainingSeconds: totalSeconds,
        isRunning: true, // 바로 시작
        isCompleted: false,
        presetId,
        startTime: now,
        lastUpdateTime: now,
        originalTotalSeconds: totalSeconds, // 원래 총 시간 저장
      });
      setTimerId(newTimer.id);
    } else {
      // 이미 추가된 타이머: 토글
      toggleTimer(timerId);
    }
  };

  const handleReset = () => {
    if (timerId) {
      updateTimer(timerId, {
        remainingSeconds: totalSeconds,
        isRunning: false,
        isCompleted: false,
      });
    }
  };

  const handleDelete = () => {
    // 타이머 삭제
    if (timerId) {
      deleteTimer(timerId);
    }
    // 프리셋 삭제 (기본 프리셋이 아닌 경우에만)
    if (presetId && !presetId.startsWith('default-')) {
      deletePreset(presetId);
    }
    router.back();
  };

  const remainingSeconds = timer?.remainingSeconds ?? totalSeconds;
  const isRunning = timer?.isRunning ?? false;
  const originalTotal = timer?.originalTotalSeconds || totalSeconds;
  const progress = ((originalTotal - remainingSeconds) / originalTotal) * 100;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.closeButton}>
              <BackIcon size={28} />
            </Pressable>
            {displayName && (
              <Text style={styles.headerTitle} numberOfLines={1} ellipsizeMode="tail">
                {displayName.replace(/\n/g, ' ')}
              </Text>
            )}
            <View style={styles.spacer} />
          </View>

          {/* Emoji */}
          <View style={styles.emojiSection}>
            <View style={styles.emojiButton}>
              <Text style={styles.emojiText}>{emoji}</Text>
            </View>
          </View>

          {/* Time Display */}
          <View style={styles.timeDisplay}>
            <Text style={styles.timeText}>{formatTime(remainingSeconds)}</Text>
          </View>
        </ScrollView>

        {/* Bottom Sheet */}
        <View style={styles.bottomSheet}>
          {/* Progress Bar */}
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: `${progress}%` }]} />
          </View>

          {/* Control Buttons */}
          <View style={styles.controlButtons}>
            <Pressable
              onPress={handleToggle}
              style={[styles.controlButton, styles.toggleButton]}
              disabled={remainingSeconds === 0}
            >
              {isRunning ? <PauseIcon size={40} /> : <PlayIcon size={40} />}
            </Pressable>
            <Pressable onPress={handleReset} style={[styles.controlButton, styles.resetButton]}>
              <ResetIcon size={40} />
            </Pressable>
          </View>

          {/* Delete Button - 기본 프리셋이 아니고 TimerList에서 온 게 아닐 때만 표시 */}
          {presetId && !presetId.startsWith('default-') && !initialTimerId && (
            <Pressable onPress={handleDelete} style={styles.deleteButton}>
              <DeleteIcon size={20} />
              <Text style={styles.deleteButtonText}>{t('delete')}</Text>
            </Pressable>
          )}
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.xl,
    paddingTop: Spacing.xxxl,
  },
  closeButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: FontSizes.xxl,
    color: Colors.textSecondary,
  },
  headerTitle: {
    flex: 1,
    fontSize: FontSizes.lg,
    color: Colors.text,
    fontWeight: '600',
    textAlign: 'center',
  },
  spacer: {
    width: 40,
  },
  emojiSection: {
    alignItems: 'center',
    gap: Spacing.xl,
    marginBottom: Spacing.xxxl,
    paddingHorizontal: Spacing.xl,
  },
  emojiButton: {
    width: 128,
    height: 128,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.xxl,
  },
  emojiText: {
    fontSize: 72,
  },
  presetName: {
    fontSize: FontSizes.xl,
    color: Colors.text,
    fontWeight: '600',
    textAlign: 'center',
  },
  timeDisplay: {
    alignItems: 'center',
    marginBottom: Spacing.xxxl,
  },
  timeText: {
    fontSize: FontSizes.massive,
    color: Colors.text,
    fontVariant: ['tabular-nums'],
    fontWeight: '700',
  },
  bottomSheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: BorderRadius.xxl,
    borderTopRightRadius: BorderRadius.xxl,
    padding: Spacing.xxxl,
    paddingBottom: 60,
    gap: Spacing.xl,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.sm,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  controlButtons: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  controlButton: {
    flex: 1,
    height: 80,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.xl,
  },
  toggleButton: {
    backgroundColor: Colors.primary,
  },
  resetButton: {
    backgroundColor: Colors.backgroundLight,
  },
  controlButtonText: {
    fontSize: FontSizes.huge,
    color: Colors.text,
  },
  deleteButton: {
    flexDirection: 'row',
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.lg,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.sm,
  },
  deleteButtonText: {
    fontSize: FontSizes.lg,
    color: Colors.danger,
    fontWeight: '600',
  },
});
