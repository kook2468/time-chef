# Time Chef - 요리 타이머 앱 🍳⏰

React Native + Expo로 만든 요리 전용 타이머 앱입니다.

## 📁 프로젝트 구조

```
time-chef/
├── app/                          # Expo Router 페이지
│   ├── _layout.tsx              # 루트 레이아웃
│   ├── index.tsx                # 메인 페이지 (타이머 목록)
│   ├── add-timer.tsx            # 타이머 추가 페이지
│   └── timer-end.tsx            # 타이머 실행 페이지
│
├── components/                   # 재사용 가능한 컴포넌트
│   ├── TimerPresets.tsx         # 프리셋 타이머 그리드
│   ├── TimerList.tsx            # 활성 타이머 목록
│   ├── TimerEndModal.tsx        # 타이머 완료 모달
│   ├── themed-text.tsx          # 테마 적용 텍스트
│   └── themed-view.tsx          # 테마 적용 뷰
│
├── constants/                    # 상수 및 스타일 시스템
│   ├── styles.ts                # 색상, 간격, 폰트 크기 등
│   ├── styleUtils.ts            # 스타일 유틸리티 함수
│   └── theme.ts                 # 테마 설정
│
└── assets/                       # 이미지, 폰트 등
```

## 🎨 스타일 시스템

### React Native에서 스타일 관리 방법

React Native는 CSS 파일을 직접 사용할 수 없습니다. 대신 몇 가지 방법이 있어요:

#### 1. **StyleSheet.create** (기본 방식) ✅
```tsx
import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1625',
  },
});
```

**장점:**
- 성능 최적화 (스타일을 한 번만 생성)
- 타입 체크
- React Native 공식 방법

**단점:**
- 파일마다 스타일 정의 필요
- 중복 코드 가능성

#### 2. **중앙 집중식 스타일 상수** (우리가 사용하는 방식) ⭐
```tsx
// constants/styles.ts
export const Colors = {
  background: '#1a1625',
  primary: '#c084fc',
  text: '#ffffff',
};

export const Spacing = {
  sm: 8,
  md: 12,
  lg: 16,
};

// 사용할 때
import { Colors, Spacing } from '@/constants/styles';

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    backgroundColor: Colors.background,
  },
});
```

**장점:**
- 일관된 디자인 시스템
- 중복 제거
- 쉬운 테마 변경

#### 3. **Styled Components** (라이브러리 필요)
```tsx
import styled from 'styled-components/native';

const Container = styled.View`
  flex: 1;
  background-color: #1a1625;
`;
```

#### 4. **NativeWind** (Tailwind for React Native)
```tsx
<View className="flex-1 bg-[#1a1625]" />
```

## 📦 만든 재사용 컴포넌트

### 1. `TimerPresets` - 빠른 시작 프리셋
```tsx
import { TimerPresets } from '@/components/TimerPresets';

<TimerPresets 
  presets={timerPresets} 
  onPresetClick={handlePresetClick} 
/>
```

### 2. `TimerList` - 활성 타이머 목록
```tsx
import { TimerList } from '@/components/TimerList';

<TimerList 
  timers={timers}
  onToggle={handleToggle}
  onDelete={handleDelete}
/>
```

### 3. `TimerEndModal` - 완료 알림
```tsx
import { TimerEndModal } from '@/components/TimerEndModal';

<TimerEndModal 
  timerName="파스타"
  isOpen={isCompleted}
  onClose={handleClose}
/>
```

## 🎯 스타일 상수 활용법

### 색상 (Colors)
```tsx
import { Colors } from '@/constants/styles';

backgroundColor: Colors.background,    // #1a1625
color: Colors.primary,                 // #c084fc (보라색)
color: Colors.text,                    // #ffffff (흰색)
color: Colors.textMuted,               // #999999 (회색)
```

### 간격 (Spacing)
```tsx
import { Spacing } from '@/constants/styles';

padding: Spacing.lg,        // 16
gap: Spacing.md,            // 12
marginBottom: Spacing.xl,   // 20
```

### 폰트 크기 (FontSizes)
```tsx
import { FontSizes } from '@/constants/styles';

fontSize: FontSizes.md,      // 16
fontSize: FontSizes.xxxl,    // 32
fontSize: FontSizes.massive, // 80
```

### 둥근 모서리 (BorderRadius)
```tsx
import { BorderRadius } from '@/constants/styles';

borderRadius: BorderRadius.lg,    // 16
borderRadius: BorderRadius.xxl,   // 24
```

## 🚀 실행 방법

```bash
# 개발 서버 시작
npm start

# iOS에서 실행
npm run ios

# Android에서 실행
npm run android

# 웹에서 실행
npm run web
```

## 💡 다음 할 일

- [ ] 타이머 상태 관리 (Context API 또는 Zustand)
- [ ] 타이머 데이터 저장 (AsyncStorage)
- [ ] 알림음 추가 (expo-av)
- [ ] 푸시 알림 (expo-notifications)
- [ ] 햅틱 피드백 강화
- [ ] 다크/라이트 모드 토글

## 📚 참고 자료

- [React Native Styling](https://reactnative.dev/docs/style)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [React Native 공식 문서](https://reactnative.dev/)
