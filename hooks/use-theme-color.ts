/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import { Colors } from '@/constants/styles';
import { useColorScheme } from '@/hooks/use-color-scheme';

// 라이트/다크 모드 색상 매핑 (현재는 다크 모드만 사용)
const ThemeColors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: '#0a7ea4',
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: '#0a7ea4',
  },
  dark: {
    text: Colors.text,
    background: Colors.background,
    tint: Colors.primary,
    icon: Colors.textMuted,
    tabIconDefault: Colors.textMuted,
    tabIconSelected: Colors.primary,
  },
};

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof ThemeColors.light & keyof typeof ThemeColors.dark
) {
  const theme = useColorScheme() ?? 'dark'; // 기본값을 dark로 변경
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return ThemeColors[theme][colorName];
  }
}
