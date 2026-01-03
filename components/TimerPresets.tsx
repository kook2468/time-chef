import { BorderRadius, Colors, FontSizes, Spacing } from '@/constants/styles';
import { useTranslation } from 'react-i18next';
import { Pressable, StyleSheet, Text, View } from 'react-native';

interface TimerPreset {
  id: string;
  emoji: string;
  name: string;
  minutes: number;
  seconds: number;
}

interface TimerPresetsProps {
  presets: TimerPreset[];
  onPresetClick: (preset: TimerPreset) => void;
  onReorder?: (presets: TimerPreset[]) => void;
}

export function TimerPresets({ presets, onPresetClick }: TimerPresetsProps) {
  const { t } = useTranslation();
  
  const formatTime = (minutes: number, seconds: number) => {
    return `${minutes}${t('minutes')} ${seconds > 0 ? `${seconds}${t('seconds')}` : ''}`;
  };

  return (
    <View>
      <View style={styles.grid}>
        {presets.map((preset) => (
          <Pressable
            key={preset.id}
            onPress={() => onPresetClick(preset)}
            style={({ pressed }) => [
              styles.presetCard,
              pressed && styles.presetCardPressed,
            ]}
          >
            <Text style={styles.emoji}>{preset.emoji}</Text>
            <Text style={styles.name}>{preset.name}</Text>
            <Text style={styles.time}>{formatTime(preset.minutes, preset.seconds)}</Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: FontSizes.sm,
    color: Colors.textMuted,
    marginBottom: Spacing.lg,
    paddingLeft: Spacing.xs,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.lg,
  },
  presetCard: {
    width: '47%',
    aspectRatio: 1,
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xl,
    justifyContent: 'space-between',
    shadowColor: Colors.backgroundDark,
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
    elevation: 8,
  },
  presetCardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  emoji: {
    fontSize: FontSizes.huge,
  },
  name: {
    color: Colors.text,
    fontSize: FontSizes.md,
    lineHeight: 22,
  },
  time: {
    color: Colors.textDark,
    fontSize: FontSizes.xs,
    marginTop: Spacing.sm,
  },
});
