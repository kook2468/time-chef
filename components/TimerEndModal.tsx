import { BorderRadius, Colors, FontSizes, Spacing } from '@/constants/styles';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

interface TimerEndModalProps {
  timerName: string;
  isOpen: boolean;
  onClose: () => void;
}

export function TimerEndModal({ timerName, isOpen, onClose }: TimerEndModalProps) {
  const { t } = useTranslation();
  
  useEffect(() => {
    if (isOpen) {
      // TODO: 알림음 재생 (React Native에서는 expo-av 사용)
      console.log('Timer completed!');
    }
  }, [isOpen]);

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.bellContainer}>
            <Text style={styles.bell}>🔔</Text>
          </View>

          <Text style={styles.title}>{t('timerComplete')}</Text>
          <Text style={styles.name}>{timerName}</Text>

          <Pressable
            onPress={onClose}
            style={({ pressed }) => [
              styles.confirmButton,
              pressed && styles.confirmButtonPressed,
            ]}
          >
            <Text style={styles.confirmButtonText}>{t('confirm')}</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xxl,
  },
  card: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: Colors.background,
    padding: Spacing.xxxl,
    borderRadius: BorderRadius.xxl,
    alignItems: 'center',
    gap: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 20,
  },
  bellContainer: {
    marginBottom: Spacing.lg,
  },
  bell: {
    fontSize: 80,
  },
  title: {
    fontSize: FontSizes.xxxl * 1.5,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  name: {
    fontSize: FontSizes.xxl,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
  },
  confirmButton: {
    width: '100%',
    backgroundColor: Colors.primary,
    paddingVertical: Spacing.xl,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  },
  confirmButtonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  confirmButtonText: {
    color: Colors.background,
    fontSize: FontSizes.lg,
    fontWeight: '600',
  },
});
