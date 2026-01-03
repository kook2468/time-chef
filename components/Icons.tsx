import { Colors } from '@/constants/styles';
import { Ionicons } from '@expo/vector-icons';

interface IconProps {
  size?: number;
  color?: string;
}

export function PlayIcon({ size = 24, color = Colors.background }: IconProps) {
  return <Ionicons name="play" size={size} color={color} />;
}

export function PauseIcon({ size = 24, color = Colors.background }: IconProps) {
  return <Ionicons name="pause" size={size} color={color} />;
}

export function ResetIcon({ size = 24, color = Colors.text }: IconProps) {
  return <Ionicons name="reload" size={size} color={color} />;
}

export function DeleteIcon({ size = 20, color = Colors.text }: IconProps) {
  return <Ionicons name="trash-outline" size={size} color={color} />;
}

export function BackIcon({ size = 24, color = Colors.textSecondary }: IconProps) {
  return <Ionicons name="arrow-back" size={size} color={color} />;
}

export function AddIcon({ size = 28, color = Colors.background }: IconProps) {
  return <Ionicons name="add" size={size} color={color} />;
}

export function CloseIcon({ size = 24, color = Colors.textSecondary }: IconProps) {
  return <Ionicons name="close" size={size} color={color} />;
}
