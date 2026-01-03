import { DeleteIcon, PauseIcon, PlayIcon } from '@/components/Icons';
import { BorderRadius, Colors, FontSizes, Spacing } from '@/constants/styles';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export interface Timer {
  id: string;
  name: string;
  emoji: string;
  totalSeconds: number;
  remainingSeconds: number;
  isRunning: boolean;
  isCompleted: boolean;
  presetId?: string; // 어떤 프리셋에서 왔는지
  startTime?: number; // 타이머가 시작된 시간 (timestamp)
  lastUpdateTime?: number; // 마지막으로 업데이트된 시간
  originalTotalSeconds?: number; // 원래 총 시간 (progressBar 계산용)
}

interface TimerListProps {
  timers: Timer[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onClick?: (id: string) => void;
}

export function TimerList({ timers, onToggle, onDelete, onClick }: TimerListProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (timers.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      {timers.map((timer) => {
        const total = timer.originalTotalSeconds || timer.totalSeconds;
        const progress = ((total - timer.remainingSeconds) / total) * 100;

        return (
          <Pressable 
            key={timer.id} 
            style={styles.timerCard}
            onPress={() => !timer.isCompleted && onClick?.(timer.id)}
            disabled={timer.isCompleted}
          >
            {/* Progress Bar Background */}
            <View style={styles.progressBarContainer}>
              <View
                style={[
                  styles.progressBar,
                  { width: `${progress}%` },
                ]}
              />
            </View>

            {/* Content */}
            <View style={styles.content}>
              {/* Left: Emoji + Time */}
              <View style={styles.leftSection}>
                <Text style={styles.emoji}>{timer.emoji}</Text>
                <Text style={styles.time}>{formatTime(timer.remainingSeconds)}</Text>
              </View>

              {/* Right: Buttons */}
              <View style={styles.rightSection}>
                <Pressable
                  onPress={(e) => {
                    e.stopPropagation();
                    onToggle(timer.id);
                  }}
                  style={({ pressed }) => [
                    styles.toggleButton,
                    pressed && styles.buttonPressed,
                    timer.isCompleted && styles.buttonHidden,
                  ]}
                  disabled={timer.isCompleted}
                >
                  {timer.isRunning ? <PauseIcon size={24} /> : <PlayIcon size={24} />}
                </Pressable>
                
                <Pressable
                  onPress={(e) => {
                    e.stopPropagation();
                    onDelete(timer.id);
                  }}
                  style={({ pressed }) => [
                    styles.deleteButton,
                    pressed && styles.buttonPressed,
                  ]}
                >
                  <DeleteIcon size={20} color={Colors.textSecondary} />
                </Pressable>
              </View>
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.lg,
  },
  timerCard: {
    position: 'relative',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.xxl,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    shadowColor: Colors.backgroundDark,
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
  },
  progressBarContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    opacity: 0.3,
    borderRadius: BorderRadius.xxl,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: Colors.primary,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  emoji: {
    fontSize: FontSizes.xxxl,
  },
  time: {
    fontSize: FontSizes.xxxl,
    color: Colors.text,
    fontWeight: '700',
    fontVariant: ['tabular-nums'],
    marginRight: Spacing.sm,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flexShrink: 0,
  },
  toggleButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary
  },
  buttonHidden: {
    opacity: 0,
  },
  deleteButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.backgroundLight,
  },
  buttonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.95 }],
  },
  toggleButtonText: {
    fontSize: FontSizes.xl,
    color: Colors.primary,
  },
  deleteButtonText: {
    fontSize: FontSizes.md,
  },
});
