import { BackIcon, CloseIcon } from '@/components/Icons';
import { ThemedView } from '@/components/themed-view';
import { BorderRadius, Colors, FontSizes, Spacing } from '@/constants/styles';
import { useTimers } from '@/contexts/TimerContext';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

const emojiOptions = [
  '🥚', '🍳', '🍠', '🥔', '🥕', '🥖', '🍗', '🍖', '🥩', '🦐', '🍝', '🍜', '🍲', '🥘', '🍛', '🍕', '🍔', '🌭', '🥙', '🌮', '🍱', '🥟', '🍙', '🥗', '🥪', '🌯', '🥞', '🧇', '🥓', '🍤', '🥨', '🍿', '🥐', '🥯', '🧀', '🥬', '🫑', '🍆', '🧄', '🧅', '🍅', '🌶️', '🥦', '🥒', '🌽', '🍄', '🫘', '🍞', '🥖', '🧈'
];

export default function AddTimerScreen() {
  const router = useRouter();
  const { addPreset } = useTimers();
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [emoji, setEmoji] = useState('🥚');
  const [mode, setMode] = useState<'minutes' | 'seconds'>('minutes');
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleSubmit = () => {
    if (minutes === 0 && seconds === 0) {
      return;
    }
    
    // 프리셋 추가
    addPreset({
      emoji,
      name: name || t('timerName'),
      minutes,
      seconds,
    });
    
    router.back();
  };

  const handleIncrement = () => {
    if (mode === 'minutes') {
      setMinutes((prev) => Math.min(prev + 1, 99));
    } else {
      setSeconds((prev) => (prev >= 59 ? 0 : prev + 1));
    }
  };

  const handleDecrement = () => {
    if (mode === 'minutes') {
      setMinutes((prev) => Math.max(prev - 1, 0));
    } else {
      setSeconds((prev) => (prev <= 0 ? 59 : prev - 1));
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.closeButton}>
            <BackIcon size={28} />
          </Pressable>
          <Text style={styles.headerTitle}>{t('createNewTimer')}</Text>
          <View style={styles.spacer} />
        </View>

        {/* Emoji Selector */}
        <View style={styles.emojiSection}>
          <Pressable
            onPress={() => setShowEmojiPicker(true)}
            style={styles.emojiButton}
          >
            <Text style={styles.emojiText}>{emoji}</Text>
          </Pressable>

          <TextInput
            placeholder={t('cookingNamePlaceholder')}
            value={name}
            onChangeText={setName}
            style={styles.nameInput}
            placeholderTextColor="#666"
          />
        </View>

        {/* Time Display */}
        <View style={styles.timeDisplay}>
          <Pressable onPress={() => setMode('minutes')} style={styles.timeSegment}>
            <Text style={[styles.timeText, mode === 'minutes' && styles.timeTextActive]}>
              {minutes.toString().padStart(2, '0')}
            </Text>
          </Pressable>
          <Text style={styles.timeSeparator}>:</Text>
          <Pressable onPress={() => setMode('seconds')} style={styles.timeSegment}>
            <Text style={[styles.timeText, mode === 'seconds' && styles.timeTextActive]}>
              {seconds.toString().padStart(2, '0')}
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      {/* Bottom Sheet */}
      <View style={styles.bottomSheet}>
        {/* Mode Toggle */}
        <View style={styles.modeToggle}>
          <Pressable
            onPress={() => setMode('minutes')}
            style={[styles.modeButton, mode === 'minutes' && styles.modeButtonActive]}
          >
            <Text style={[styles.modeButtonText, mode === 'minutes' && styles.modeButtonTextActive]}>
              {t('minutes')}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setMode('seconds')}
            style={[styles.modeButton, mode === 'seconds' && styles.modeButtonActive]}
          >
            <Text style={[styles.modeButtonText, mode === 'seconds' && styles.modeButtonTextActive]}>
              {t('seconds')}
            </Text>
          </Pressable>
        </View>

        {/* Picker Wheel */}
        <View style={styles.pickerWheel}>
          <Pressable onPress={handleDecrement} style={styles.pickerButton}>
            <Text style={styles.pickerButtonText}>−</Text>
          </Pressable>
          <View style={styles.pickerValue}>
            <Text style={styles.pickerValueText}>
              {mode === 'minutes' ? minutes.toString().padStart(2, '0') : seconds.toString().padStart(2, '0')}
            </Text>
            <Text style={styles.pickerLabel}>{mode === 'minutes' ? t('minutes') : t('seconds')}</Text>
          </View>
          <Pressable onPress={handleIncrement} style={styles.pickerButton}>
            <Text style={styles.pickerButtonText}>+</Text>
          </Pressable>
        </View>

        {/* Confirm Button */}
        <Pressable onPress={handleSubmit} style={styles.confirmButton}>
          <Text style={styles.confirmButtonText}>{t('confirm')}</Text>
        </Pressable>
      </View>
      
      {/* Emoji Picker Modal */}
      <Modal
        visible={showEmojiPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowEmojiPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{t('selectIcon')}</Text>
              <Pressable onPress={() => setShowEmojiPicker(false)} style={styles.modalCloseButton}>
                <CloseIcon size={24} />
              </Pressable>
            </View>
            
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.emojiScrollContainer}
            >
              <View style={styles.emojiGrid}>
                {emojiOptions.map((e, index) => (
                  <Pressable
                    key={`${e}-${index}`}
                    onPress={() => {
                      setEmoji(e);
                      setShowEmojiPicker(false);
                    }}
                    style={({ pressed }) => [
                      styles.emojiOptionButton,
                      emoji === e && styles.emojiOptionSelected,
                      pressed && styles.emojiOptionPressed,
                    ]}
                  >
                    <Text style={styles.emojiOptionText}>{e}</Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
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
    paddingTop: 60,
  },
  closeButton: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
  },
  closeButtonText: {
    fontSize: FontSizes.xxl,
    color: Colors.textSecondary,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: FontSizes.xl,
    color: Colors.primary,
  },
  spacer: {
    width: 48,
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
  nameInput: {
    backgroundColor: 'transparent',
    borderWidth: 0,
    textAlign: 'center',
    fontSize: FontSizes.xl,
    color: Colors.textSecondary,
    width: '100%',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xl,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  modalTitle: {
    fontSize: FontSizes.xl,
    fontWeight: '600',
    color: Colors.primary,
  },
  modalCloseButton: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCloseText: {
    fontSize: FontSizes.xl,
    color: Colors.textSecondary,
  },
  emojiScrollContainer: {
    maxHeight: 280,
  },
  emojiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 420, // 5개 x (60 + 마진)
    paddingVertical: Spacing.md,
  },
  emojiOptionButton: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundLight,
    borderRadius: BorderRadius.lg,
    margin: Spacing.xs,
  },
  emojiOptionSelected: {
    backgroundColor: Colors.primary,
  },
  emojiOptionPressed: {
    opacity: 0.7,
  },
  emojiOptionText: {
    fontSize: 36,
  },
  timeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xxxl,
  },
  timeSegment: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: BorderRadius.md,
  },
  timeText: {
    fontSize: FontSizes.massive,
    color: Colors.textSecondary,
    fontVariant: ['tabular-nums'],
    fontWeight: '700',
  },
  timeTextActive: {
    color: Colors.primary,
  },
  timeSeparator: {
    fontSize: FontSizes.massive,
    color: Colors.textSecondary,
    fontVariant: ['tabular-nums'],
    marginHorizontal: Spacing.xs,
  },
  bottomSheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: BorderRadius.xxl,
    borderTopRightRadius: BorderRadius.xxl,
    padding: Spacing.xxxl,
    paddingBottom: 40,
  },
  modeToggle: {
    flexDirection: 'row',
    gap: Spacing.lg,
    justifyContent: 'center',
    marginBottom: Spacing.xxxl,
  },
  modeButton: {
    paddingHorizontal: Spacing.xxxl,
    paddingVertical: Spacing.md,
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.backgroundLight,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  modeButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  modeButtonText: {
    fontSize: FontSizes.lg,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  modeButtonTextActive: {
    color: Colors.background,
    fontWeight: '700',
  },
  pickerWheel: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xxxl,
    marginBottom: Spacing.xxxl,
  },
  pickerButton: {
    width: 64,
    height: 64,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pickerButtonText: {
    fontSize: FontSizes.huge,
    color: Colors.primary,
  },
  pickerValue: {
    alignItems: 'center',
  },
  pickerValueText: {
    fontSize: FontSizes.giant,
    color: Colors.text,
    fontVariant: ['tabular-nums'],
  },
  pickerLabel: {
    fontSize: FontSizes.md,
    color: Colors.textMuted,
    marginTop: Spacing.sm,
  },
  confirmButton: {
    width: '100%',
    backgroundColor: Colors.background,
    paddingVertical: Spacing.xl,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  confirmButtonText: {
    color: Colors.primary,
    fontSize: FontSizes.lg,
  },
});
