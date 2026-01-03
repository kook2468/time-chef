# Time Chef 🍳⏰

요리 타이머 앱입니다. 프리셋 타이머로 빠르게 시작하고, 백그라운드에서도 정확하게 시간을 측정합니다.

## ✨ 주요 기능

- **프리셋 타이머**: 달걀 삶기, 고구마 찌기, 파스타 삶기, 라면 끓이기 등 자주 사용하는 요리 시간 프리셋
- **커스텀 타이머**: 원하는 요리 이름, 이모지, 시간으로 나만의 타이머 생성
- **백그라운드 실행**: 앱을 백그라운드로 보내도 정확하게 시간 측정
- **다중 타이머**: 여러 요리를 동시에 타이머 실행 가능
- **진행 상황 표시**: 각 타이머의 진행률을 시각적으로 확인
- **완료 알림**: 타이머 완료 시 진동 알림
- **다국어 지원**: 한국어/영어 자동 전환 (i18next)

## 🚀 시작하기

### 필수 요구사항

- Node.js 18 이상
- npm 또는 yarn
- iOS 시뮬레이터 (macOS) 또는 Android 에뮬레이터
- [Expo Go 앱](https://expo.dev/go) (실제 기기 테스트용)

### 설치

1. 의존성 설치

   ```bash
   npm install
   # 또는
   yarn install
   ```

2. 앱 실행

   ```bash
   npm start
   # 또는
   yarn start
   ```

3. 실행 옵션
   - `i` - iOS 시뮬레이터에서 열기
   - `a` - Android 에뮬레이터에서 열기
   - QR 코드 스캔 - Expo Go 앱으로 실제 기기에서 실행

## 📱 사용 방법

1. **프리셋 타이머 사용**
   - 메인 화면에서 원하는 프리셋 카드 선택 (예: 🥚 달걀 삶기)
   - 재생 버튼(▶️) 눌러 타이머 시작
   - 타이머가 자동으로 목록에 추가되고 카운트다운 시작

2. **커스텀 타이머 생성**
   - 오른쪽 상단 + 버튼 클릭
   - 이모지, 요리 이름, 시간 설정
   - 저장하면 프리셋으로 추가됨

3. **타이머 관리**
   - 일시정지/재개: ⏸️/▶️ 버튼
   - 리셋: 🔄 버튼
   - 삭제: 🗑️ 버튼 (커스텀 타이머만)

## 프로젝트 구조

```
time-chef/
├── app/                          # 화면 (Expo Router)
│   ├── index.tsx                # 메인 화면 - 타이머 목록
│   ├── add-timer.tsx            # 타이머 추가 화면
│   ├── timer-end.tsx            # 타이머 실행 화면
│   └── _layout.tsx              # 루트 레이아웃
│
├── components/                   # 재사용 컴포넌트
│   ├── TimerList.tsx            # 타이머 목록 컴포넌트
│   ├── TimerPresets.tsx         # 프리셋 그리드
│   └── Icons.tsx                # SVG 아이콘 (Ionicons)
│
├── contexts/                     # 상태 관리
│   └── TimerContext.tsx         # 타이머 & 프리셋 Context
│
├── constants/                    # 디자인 시스템
│   ├── styles.ts                # 색상, 간격, 폰트 크기
│
└── i18n/                         # 다국어
    ├── index.ts                 # i18next 설정
    └── resources.ts             # 번역 리소스
```

## 🛠️ 기술 스택

- **프레임워크**: React Native (Expo SDK 54)
- **라우팅**: Expo Router v6 (파일 기반 라우팅)
- **상태 관리**: React Context API + AsyncStorage
- **다국어**: i18next + react-i18next
- **아이콘**: @expo/vector-icons (Ionicons)
- **알림**: Expo AV + Vibration API
- **언어**: TypeScript

## 📦 주요 의존성

```json
{
  "expo": "~54.0.30",
  "expo-router": "~6.0.21",
  "react-native": "0.81.5",
  "@react-native-async-storage/async-storage": "^2.2.0",
  "expo-av": "^16.0.8",
  "i18next": "^25.7.3",
  "react-i18next": "^16.5.1"
}
```

## 🔧 개발 팁

### 백그라운드 타이머 구현

타이머는 `startTime` 기반으로 경과 시간을 계산하여 백그라운드에서도 정확하게 작동합니다:

```typescript
// 시작 시간 기준 계산
const elapsedSeconds = Math.floor((Date.now() - timer.startTime) / 1000);
const remaining = timer.totalSeconds - elapsedSeconds;
```

### 프리셋 vs 타이머

- **프리셋**: 재사용 가능한 타이머 템플릿 (`@timer_presets`)
- **타이머**: 실제 실행 중인 타이머 인스턴스 (`@timers`)
- 각 타이머는 `presetId`로 원본 프리셋을 참조
