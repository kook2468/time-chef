import { AddIcon } from '@/components/Icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TimerList } from '@/components/TimerList';
import { TimerPresets } from '@/components/TimerPresets';
import { BorderRadius, Colors, FontSizes, Spacing } from '@/constants/styles';
import { useTimers } from '@/contexts/TimerContext';
import { Link, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Pressable, SafeAreaView, ScrollView, StyleSheet, View } from 'react-native';

export default function TimerListScreen() {
  const { t } = useTranslation();
  const router = useRouter();
  const { timers, presets, toggleTimer, deleteTimer, deletePreset } = useTimers();

  // 완료/진행중 타이머 분리
  const activeTimers = timers.filter((timer) => !timer.isCompleted);
  const completedTimers = timers.filter((timer) => timer.isCompleted);

  // 기본 프리셋 (항상 표시)
  const defaultPresets = [
    { id: 'default-1', emoji: '🥚', name: t('boilEgg'), minutes: 10, seconds: 0 },
    { id: 'default-2', emoji: '🍠', name: t('steamSweetPotato'), minutes: 25, seconds: 0 },
    { id: 'default-3', emoji: '🍝', name: t('boilPasta'), minutes: 8, seconds: 0 },
    { id: 'default-4', emoji: '🍜', name: t('cookRamen'), minutes: 4, seconds: 30 },
    { id: 'default-5', emoji: '🍚', name: t('cookRice'), minutes: 10, seconds: 0 },
    { id: 'default-6', emoji: '🥟', name: t('cookDumplings'), minutes: 12, seconds: 0 },
  ];

  // 사용자 추가 프리셋 + 기본 프리셋 (추가한 것이 위에)
  const timerPresets = [...presets, ...defaultPresets];

  const handlePresetClick = (preset: typeof timerPresets[0]) => {
    // timer-end 페이지로 이동 (프리셋 정보 전달)
    router.push(`/timer-end?presetId=${preset.id}&name=${encodeURIComponent(preset.name)}&emoji=${preset.emoji}&minutes=${preset.minutes}&seconds=${preset.seconds}`);
  };

  const handleToggleTimer = (id: string) => {
    toggleTimer(id);
  };

  const handleDeleteTimer = (id: string) => {
    deleteTimer(id);
  };

  const handleTimerClick = (id: string) => {
    const timer = timers.find(t => t.id === id);
    if (timer && timer.presetId) {
      // 프리셋에서 온 타이머: 프리셋 정보와 함께 timer-end로 이동
      const preset = presets.find(p => p.id === timer.presetId) || 
                     defaultPresets.find(p => p.id === timer.presetId);
      const presetName = preset?.name || timer.name;
      const minutes = Math.floor(timer.totalSeconds / 60);
      const seconds = timer.totalSeconds % 60;
      router.push(`/timer-end?timerId=${id}&presetId=${timer.presetId}&name=${encodeURIComponent(presetName)}&emoji=${timer.emoji}&minutes=${minutes}&seconds=${seconds}`);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <ThemedText style={styles.title}>{t('appName')}</ThemedText>
              <ThemedText style={styles.subtitle}>{t('subtitle')}</ThemedText>
            </View>
            <Link href="/add-timer" asChild>
              <Pressable style={styles.headerAddButton}>
                <AddIcon size={28} />
              </Pressable>
            </Link>
          </View>

          {/* Active Timers */}
          {/* {activeTimers.length === 0 && completedTimers.length === 0 ? (
            <View style={styles.emptyState}>
              <ThemedText style={styles.emptyText}>{t('noActiveTimers')}</ThemedText>
            </View>
          ) : ( */}
            <>
              {/* 진행중 타이머 */}
              {activeTimers.length > 0 && (
                <View style={styles.timersSection}>
                  <TimerList
                    timers={activeTimers}
                    onToggle={handleToggleTimer}
                    onDelete={handleDeleteTimer}
                    onClick={handleTimerClick}
                  />
                </View>
              )}
              
              {/* 완료된 타이머 */}
              {completedTimers.length > 0 && (
                <View style={styles.timersSection}>
                  <ThemedText style={styles.sectionTitle}>{t('completed')}</ThemedText>
                  <TimerList
                    timers={completedTimers}
                    onToggle={handleToggleTimer}
                    onDelete={handleDeleteTimer}
                    onClick={handleTimerClick}
                  />
                </View>
              )}
            </>

          {/* Timer Presets */}
          <View style={styles.presetsSection}>
            <TimerPresets presets={timerPresets} onPresetClick={handlePresetClick} />
          </View>
        </ScrollView>

        {/* Add Timer Button */}
        {/* <View style={styles.footer}>
          <Link href="/add-timer" asChild>
            <Pressable style={styles.addButton}>
              <Text style={styles.addButtonText}>{t('addTimer')}</Text>
            </Pressable>
          </Link>
        </View> */}
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
    paddingBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: Spacing.xl,
    paddingTop: 40,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: Spacing.sm,
  },
  headerAddButton: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerAddButtonText: {
    fontSize: FontSizes.xxxl,
    color: Colors.background,
    fontWeight: '300',
    lineHeight: FontSizes.xxxl,
  },
  title: {
    fontSize: FontSizes.xxxl,
    fontWeight: 'bold',
    color: Colors.primary,
    lineHeight: FontSizes.xxxl * 1.3,
  },
  subtitle: {
    fontSize: FontSizes.md,
    color: Colors.textMuted,
    lineHeight: FontSizes.md * 1.5,
  },
  presetsSection: {
    padding: Spacing.xl,
    paddingBottom: 300
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.sm,
  },
  emptyText: {
    fontSize: FontSizes.md,
    color: Colors.textDark,
  },
  timersSection: {
    padding: Spacing.xl,
    paddingTop: Spacing.md,
  },
  sectionTitle: {
    fontSize: FontSizes.lg,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: Spacing.md,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: Spacing.xl,
    paddingBottom: 40,
    backgroundColor: Colors.background,
  },
  addButton: {
    backgroundColor: Colors.primary,
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  addButtonText: {
    color: Colors.background,
    fontSize: FontSizes.lg,
    fontWeight: '600',
  },
});
