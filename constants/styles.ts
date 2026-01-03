// Time Chef 테마 색상 및 스타일 상수

import { Platform, ViewStyle } from 'react-native';

// ============================================
// Colors
// ============================================
export const Colors = {
  background: '#1a1625',
  backgroundDark: '#0f0b14',
  backgroundLight: '#252036',
  
  // Primary colors
  primary: '#c084fc',
  primaryDark: '#a855f7',
  primaryLight: '#e9d5ff',
  
  // Text colors
  text: '#ffffff',
  textSecondary: '#e5e5e5',
  textMuted: '#999999',
  textDark: '#666666',
  
  // Accent colors
  accent: '#f472b6',
  success: '#34C759',
  warning: '#FF9500',
  danger: '#FF3B30',
  
  // UI colors
  border: 'rgba(255, 255, 255, 0.1)',
  overlay: 'rgba(26, 22, 37, 0.95)',
};

// ============================================
// Spacing
// ============================================
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

// ============================================
// Border Radius
// ============================================
export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  round: 999,
};

// ============================================
// Font Sizes
// ============================================
export const FontSizes = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 48,
  giant: 60,
  massive: 80,
};

// ============================================
// Fonts (Platform specific)
// ============================================
export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// ============================================
// Shadows
// ============================================
export const Shadows = {
  // Neumorphism shadows
  neumorph: {
    shadowColor: Colors.backgroundDark,
    shadowOffset: { width: 8, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 16,
  },
  neumorphLight: {
    shadowColor: Colors.backgroundLight,
    shadowOffset: { width: -8, height: -8 },
    shadowOpacity: 1,
    shadowRadius: 16,
  },
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
};

// ============================================
// Style Utilities (재사용 가능한 스타일)
// ============================================

// Neumorphism 스타일 생성기
export const createNeumorphStyle = (size: number = 48): ViewStyle => ({
  backgroundColor: Colors.background,
  borderRadius: BorderRadius.lg,
  shadowColor: Colors.backgroundDark,
  shadowOffset: { width: 6, height: 6 },
  shadowOpacity: 1,
  shadowRadius: 12,
  elevation: 6, // Android
});

export const createNeumorphInsetStyle = (size: number = 48): ViewStyle => ({
  backgroundColor: Colors.background,
  borderRadius: BorderRadius.lg,
  borderWidth: 1,
  borderColor: 'rgba(15, 11, 20, 0.5)',
});

// 버튼 스타일
export const ButtonStyles = {
  base: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  primary: {
    backgroundColor: Colors.primary,
  },
  secondary: {
    backgroundColor: Colors.backgroundLight,
  },
  success: {
    backgroundColor: Colors.success,
  },
  warning: {
    backgroundColor: Colors.warning,
  },
  danger: {
    backgroundColor: Colors.danger,
  },
};

// 카드 스타일
export const CardStyles = {
  base: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.xxl,
    padding: Spacing.xl,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
};
